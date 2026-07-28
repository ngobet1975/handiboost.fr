'use server'

import { revalidatePath } from 'next/cache'
import nodemailer from 'nodemailer'
import { SignJWT } from 'jose'

// ─── Store OTP en mémoire (même pattern que le login pro) ────────────────────
const partnerOtpStore = new Map<string, { code: string; expiresAt: number }>()

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getSupabaseHeaders() {
  return {
    'Content-Type': 'application/json',
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  await transporter.sendMail({
    from: `"Handiboost" <${process.env.SMTP_USER || 'no-reply@handiboost.fr'}>`,
    to,
    subject,
    html,
  })
}

// ─── Récupérer un partenaire par email ────────────────────────────────────────
export async function getPartnerByEmail(email: string) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/partners?email=eq.${encodeURIComponent(email.toLowerCase())}&limit=1`,
    { headers: getSupabaseHeaders(), cache: 'no-store' }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data?.[0] || null
}

// ─── Récupérer tous les partenaires (admin) ───────────────────────────────────
export async function getAllPartners() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/partners?order=created_at.desc`,
    { headers: getSupabaseHeaders(), cache: 'no-store' }
  )
  if (!res.ok) return []
  return await res.json()
}

// ─── 1. Inscription / Connexion — envoyer un OTP ──────────────────────────────
export async function sendPartnerOtp(email: string) {
  const emailLower = email.toLowerCase().trim()
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  partnerOtpStore.set(emailLower, { code, expiresAt: Date.now() + 15 * 60 * 1000 })

  try {
    await sendEmail(
      emailLower,
      'Votre code d\'accès — Espace Partenaires Handiboost',
      `<div style="font-family:sans-serif;text-align:center;padding:30px;color:#334155;">
        <h2 style="color:#1d4ed8;">Espace Partenaires Handiboost</h2>
        <p>Voici votre code de connexion :</p>
        <div style="font-size:36px;font-weight:900;letter-spacing:8px;padding:20px 40px;background:#f1f5f9;border-radius:12px;display:inline-block;margin:20px 0;color:#1e293b;">
          ${code}
        </div>
        <p style="font-size:13px;color:#64748b;">Ce code expire dans 15 minutes. Ne le partagez avec personne.</p>
      </div>`
    )
  } catch (e) {
    console.error('SMTP error:', e)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] OTP partenaire pour ${emailLower}: ${code}`)
      return { success: true }
    }
    return { error: "Erreur d'envoi de l'email. Vérifiez vos paramètres SMTP." }
  }

  return { success: true }
}

// ─── 2. Vérifier l'OTP et créer une session partenaire ───────────────────────
export async function verifyPartnerOtp(email: string, token: string) {
  const emailLower = email.toLowerCase().trim()

  // Bypass développement
  if (process.env.NODE_ENV === 'development' && token === '000000') {
    return await createPartnerSession(emailLower)
  }

  const record = partnerOtpStore.get(emailLower)
  if (!record || record.code !== token) return { error: 'Code incorrect.' }
  if (Date.now() > record.expiresAt) {
    partnerOtpStore.delete(emailLower)
    return { error: 'Code expiré. Veuillez recommencer.' }
  }
  partnerOtpStore.delete(emailLower)
  return await createPartnerSession(emailLower)
}

async function createPartnerSession(email: string) {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || process.env.ADMIN_TOTP_SECRET || 'handiboost-fallback-secret-2026'
  )
  const jwt = await new SignJWT({ email, role: 'partner' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret)

  cookieStore.set('partner_session', jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  revalidatePath('/partenaires')
  return { success: true, redirect: '/partenaires/dashboard' }
}

// ─── 3. Sauvegarder / mettre à jour la fiche partenaire ──────────────────────
export async function savePartnerProfile(email: string, data: {
  nom_structure: string
  nom_contact: string
  telephone: string
  adresse: string
  ville: string
  code_postal: string
  site_web: string
  description: string
  activites: string
}) {
  const emailLower = email.toLowerCase().trim()
  const existing = await getPartnerByEmail(emailLower)

  let res: Response
  if (existing) {
    // UPDATE
    res = await fetch(
      `${SUPABASE_URL}/rest/v1/partners?email=eq.${encodeURIComponent(emailLower)}`,
      {
        method: 'PATCH',
        headers: { ...getSupabaseHeaders(), Prefer: 'return=minimal' },
        body: JSON.stringify(data),
      }
    )
  } else {
    // INSERT
    res = await fetch(`${SUPABASE_URL}/rest/v1/partners`, {
      method: 'POST',
      headers: { ...getSupabaseHeaders(), Prefer: 'return=minimal' },
      body: JSON.stringify({ email: emailLower, ...data }),
    })
  }

  if (!res.ok) {
    const err = await res.text()
    console.error('Supabase error:', err)
    return { error: 'Erreur lors de la sauvegarde. Réessayez.' }
  }

  // Notification email à l'admin
  const action = existing ? 'mis à jour' : 'créé'
  try {
    await sendEmail(
      'handiboost.contact@gmail.com',
      `🔔 Fiche partenaire ${action} — ${data.nom_structure || emailLower}`,
      `<div style="font-family:sans-serif;padding:30px;color:#334155;">
        <h2 style="color:#1d4ed8;">Nouvelle activité sur l'Espace Partenaires</h2>
        <p>Le partenaire <strong>${data.nom_structure || 'Sans nom'}</strong> vient de ${action} sa fiche.</p>
        <table style="border-collapse:collapse;width:100%;margin-top:16px;">
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:700;">Email</td><td style="padding:8px;border:1px solid #e2e8f0;">${emailLower}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:700;">Contact</td><td style="padding:8px;border:1px solid #e2e8f0;">${data.nom_contact}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:700;">Téléphone</td><td style="padding:8px;border:1px solid #e2e8f0;">${data.telephone}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:700;">Ville</td><td style="padding:8px;border:1px solid #e2e8f0;">${data.ville} ${data.code_postal}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:700;">Activités</td><td style="padding:8px;border:1px solid #e2e8f0;">${data.activites}</td></tr>
        </table>
        <p style="margin-top:20px;"><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://handiboost.fr'}/admin/partenaires" style="background:#1d4ed8;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;">Voir dans l'admin</a></p>
      </div>`
    )
  } catch (e) {
    console.error('Email admin error:', e)
  }

  revalidatePath('/partenaires/dashboard')
  revalidatePath('/admin/partenaires')
  return { success: true }
}

// ─── 4. Signer la charte ──────────────────────────────────────────────────────
export async function signCharter(email: string, signataireName: string) {
  const emailLower = email.toLowerCase().trim()
  const now = new Date().toISOString()

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/partners?email=eq.${encodeURIComponent(emailLower)}`,
    {
      method: 'PATCH',
      headers: { ...getSupabaseHeaders(), Prefer: 'return=minimal' },
      body: JSON.stringify({
        charte_signee: true,
        charte_signee_le: now,
        charte_signee_par: signataireName,
      }),
    }
  )

  if (!res.ok) return { error: 'Erreur lors de la signature.' }

  // Notification admin
  try {
    await sendEmail(
      'handiboost.contact@gmail.com',
      `✅ Charte signée par ${signataireName} (${emailLower})`,
      `<div style="font-family:sans-serif;padding:30px;color:#334155;">
        <h2 style="color:#16a34a;">Charte Handiboost signée !</h2>
        <p><strong>${signataireName}</strong> (${emailLower}) a signé la Charte Handiboost le <strong>${new Date(now).toLocaleDateString('fr-FR', { dateStyle: 'full' })}</strong>.</p>
      </div>`
    )
  } catch (e) {
    console.error('Email admin error:', e)
  }

  // Notification au partenaire
  try {
    await sendEmail(
      emailLower,
      '✅ Votre signature de la Charte Handiboost a bien été enregistrée',
      `<div style="font-family:sans-serif;padding:30px;color:#334155;">
        <h2 style="color:#1d4ed8;">Bienvenue dans le Réseau Handiboost !</h2>
        <p>Bonjour <strong>${signataireName}</strong>,</p>
        <p>Nous avons bien enregistré votre signature de la Charte Handiboost en date du <strong>${new Date(now).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</strong>.</p>
        <p>Vous faites désormais officiellement partie du Réseau Handiboost. Vous pouvez dès maintenant compléter votre fiche partenaire depuis votre espace personnel.</p>
        <p style="margin-top:20px;"><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://handiboost.fr'}/partenaires/dashboard" style="background:#1d4ed8;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;">Accéder à mon espace</a></p>
      </div>`
    )
  } catch (e) {
    console.error('Email partenaire error:', e)
  }

  revalidatePath('/partenaires/dashboard')
  return { success: true }
}

// ─── 5. Admin — modifier la fiche d'un partenaire ────────────────────────────
export async function adminUpdatePartner(id: string, data: Partial<{
  nom_structure: string
  nom_contact: string
  telephone: string
  adresse: string
  ville: string
  code_postal: string
  site_web: string
  description: string
  activites: string
  charte_signee: boolean
}>) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/partners?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: { ...getSupabaseHeaders(), Prefer: 'return=minimal' },
      body: JSON.stringify(data),
    }
  )
  if (!res.ok) return { error: 'Erreur lors de la mise à jour.' }
  revalidatePath('/admin/partenaires')
  return { success: true }
}

// ─── 6. Admin — supprimer un partenaire ──────────────────────────────────────
export async function adminDeletePartner(id: string) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/partners?id=eq.${id}`,
    { method: 'DELETE', headers: getSupabaseHeaders() }
  )
  if (!res.ok) return { error: 'Erreur lors de la suppression.' }
  revalidatePath('/admin/partenaires')
  return { success: true }
}

'use server'

import { revalidatePath } from 'next/cache'
import { Redis } from '@upstash/redis'
import nodemailer from 'nodemailer'
import { SignJWT } from 'jose'

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

const REDIS_KEY = 'handiboost_partners'

// ─── Store OTP en mémoire ────────────────────────────────────────────────────
const partnerOtpStore = new Map<string, { code: string; expiresAt: number }>()

// ─── Email helper ─────────────────────────────────────────────────────────────
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

// ─── CRUD Redis ───────────────────────────────────────────────────────────────
export async function getAllPartners(): Promise<any[]> {
  const data: any[] | null = await redis.get(REDIS_KEY)
  return data || []
}

export async function getPartnerByEmail(email: string): Promise<any | null> {
  const all = await getAllPartners()
  return all.find((p) => p.email === email.toLowerCase().trim()) || null
}

async function saveAllPartners(partners: any[]) {
  await redis.set(REDIS_KEY, partners)
}

// ─── 1. Envoyer OTP ──────────────────────────────────────────────────────────
export async function sendPartnerOtp(email: string) {
  const emailLower = email.toLowerCase().trim()
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  partnerOtpStore.set(emailLower, { code, expiresAt: Date.now() + 15 * 60 * 1000 })

  try {
    await sendEmail(
      emailLower,
      "Votre code d'accès — Espace Partenaires Handiboost",
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

// ─── 2. Vérifier OTP + créer session ─────────────────────────────────────────
export async function verifyPartnerOtp(email: string, token: string) {
  const emailLower = email.toLowerCase().trim()
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

// ─── 3. Sauvegarder / mettre à jour la fiche ─────────────────────────────────
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
  est_itinerant?: boolean
  rayon_intervention?: number | null
}) {
  const emailLower = email.toLowerCase().trim()
  const all = await getAllPartners()
  const index = all.findIndex((p) => p.email === emailLower)
  const isNew = index === -1

  const entry = isNew
    ? { id: crypto.randomUUID(), email: emailLower, charte_signee: false, charte_signee_le: null, charte_signee_par: null, created_at: new Date().toISOString(), ...data }
    : { ...all[index], ...data, updated_at: new Date().toISOString() }

  if (isNew) {
    all.push(entry)
  } else {
    all[index] = entry
  }

  await saveAllPartners(all)

  // Notification admin
  const action = isNew ? 'créé' : 'mis à jour'
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
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:700;">Ville</td><td style="padding:8px;border:1px solid #e2e8f0;">${data.ville} ${data.code_postal}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:700;">Activités</td><td style="padding:8px;border:1px solid #e2e8f0;">${data.activites}</td></tr>
          ${data.est_itinerant ? `<tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:700;">Itinérant</td><td style="padding:8px;border:1px solid #e2e8f0;">🚗 Oui — rayon ${data.rayon_intervention} km</td></tr>` : ''}
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
  const all = await getAllPartners()
  const index = all.findIndex((p) => p.email === emailLower)

  const now = new Date().toISOString()

  if (index !== -1) {
    all[index] = { ...all[index], charte_signee: true, charte_signee_le: now, charte_signee_par: signataireName }
  } else {
    // Créer la fiche minimale si elle n'existe pas encore
    all.push({
      id: crypto.randomUUID(), email: emailLower,
      nom_structure: '', nom_contact: signataireName, telephone: '', adresse: '', ville: '', code_postal: '',
      site_web: '', description: '', activites: '', est_itinerant: false, rayon_intervention: null,
      charte_signee: true, charte_signee_le: now, charte_signee_par: signataireName,
      created_at: now,
    })
  }

  await saveAllPartners(all)

  try {
    await sendEmail(
      'handiboost.contact@gmail.com',
      `✅ Charte signée par ${signataireName} (${emailLower})`,
      `<p><strong>${signataireName}</strong> (${emailLower}) a signé la Charte Handiboost le <strong>${new Date(now).toLocaleDateString('fr-FR', { dateStyle: 'full' })}</strong>.</p>`
    )
    await sendEmail(
      emailLower,
      '✅ Votre signature de la Charte Handiboost a bien été enregistrée',
      `<div style="font-family:sans-serif;padding:30px;color:#334155;">
        <h2 style="color:#1d4ed8;">Bienvenue dans le Réseau Handiboost !</h2>
        <p>Nous avons bien enregistré votre signature de la Charte Handiboost le <strong>${new Date(now).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</strong>.</p>
      </div>`
    )
  } catch (e) {
    console.error('Email error:', e)
  }

  revalidatePath('/partenaires/dashboard')
  return { success: true }
}

// ─── 5. Admin — modifier ─────────────────────────────────────────────────────
export async function adminUpdatePartner(id: string, data: Partial<any>) {
  const all = await getAllPartners()
  const index = all.findIndex((p) => p.id === id)
  if (index === -1) return { error: 'Partenaire non trouvé.' }
  all[index] = { ...all[index], ...data, updated_at: new Date().toISOString() }
  await saveAllPartners(all)
  revalidatePath('/admin/partenaires')
  return { success: true }
}

// ─── 6. Admin — supprimer ────────────────────────────────────────────────────
export async function adminDeletePartner(id: string) {
  const all = await getAllPartners()
  const filtered = all.filter((p) => p.id !== id)
  await saveAllPartners(filtered)
  revalidatePath('/admin/partenaires')
  return { success: true }
}

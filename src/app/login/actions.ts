'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { authenticator } from 'otplib'

import fs from 'fs'
import path from 'path'

import nodemailer from 'nodemailer'

export async function sendOtp(email: string) {
  const emailLower = email.toLowerCase().trim();
  
  // Check whitelist in adherents.json
  const filePath = path.join(process.cwd(), 'src/data/adherents.json')
  let adherents = []
  try {
    adherents = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (e) {}

  const isAdherent = adherents.some((a: any) => a.email?.toLowerCase() === emailLower)

  if (!isAdherent) {
    return { error: "Votre email n'est pas autorisé. Veuillez contacter l'administrateur." }
  }

  // Generate a 6-digit code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Save OTP in otps.json
  const otpsPath = path.join(process.cwd(), 'src/data/otps.json');
  let otps: any[] = [];
  try {
    otps = JSON.parse(fs.readFileSync(otpsPath, 'utf8'));
  } catch (e) {}

  // Remove old otps for this email
  otps = otps.filter(o => o.email !== emailLower);
  otps.push({
    email: emailLower,
    code: otpCode,
    expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins
  });
  fs.writeFileSync(otpsPath, JSON.stringify(otps, null, 2));

  // Send Email with Nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"HandiBoost" <${process.env.SMTP_USER || 'no-reply@handiboost.fr'}>`,
      to: emailLower,
      subject: "Votre code d'accès professionnel HandiBoost",
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px; color: #334155;">
          <h2 style="color: #1e40af;">Connexion HandiBoost</h2>
          <p style="font-size: 16px;">Voici votre code de sécurité unique :</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 20px; background: #f1f5f9; border-radius: 10px; display: inline-block; margin: 20px 0;">
            ${otpCode}
          </div>
          <p style="font-size: 14px; color: #64748b;">Ce code expirera dans 15 minutes. Ne le partagez avec personne.</p>
        </div>
      `
    });
  } catch(e: any) {
    console.error("Nodemailer error:", e);
    // If in development mode, we still return success but log the code so we can test without an email provider
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV MODE] OTP pour ${emailLower} est: ${otpCode}`);
      return { success: true }
    }
    return { error: "Erreur d'envoi de l'email. Vérifiez que vos identifiants SMTP (.env.local) sont corrects." }
  }

  return { success: true }
}

export async function verifyOtp(email: string, token: string) {
  // Developer bypass for local testing
  if (process.env.NODE_ENV === 'development' && token === '000000') {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const emailLower = email.toLowerCase().trim();
    cookieStore.set('pro_session', emailLower, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    revalidatePath('/', 'layout')
    redirect('/guide-booster')
    return { success: true }
  }

  const emailLower = email.toLowerCase().trim();
  const otpsPath = path.join(process.cwd(), 'src/data/otps.json');
  let otps: any[] = [];
  try {
    otps = JSON.parse(fs.readFileSync(otpsPath, 'utf8'));
  } catch (e) {}

  const record = otps.find(o => o.email === emailLower && o.code === token);

  if (!record) {
    return { error: 'Code incorrect.' }
  }

  if (Date.now() > record.expiresAt) {
    return { error: 'Code expiré. Veuillez recommencer.' }
  }

  // Remove the used OTP
  otps = otps.filter(o => o.email !== emailLower);
  fs.writeFileSync(otpsPath, JSON.stringify(otps, null, 2));

  // Create session cookie (bypassing Supabase Auth)
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.set('pro_session', emailLower, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });

  revalidatePath('/', 'layout')
  redirect('/guide-booster')
}

export async function verifyAdminTotp(code: string) {
  // 1. Verify TOTP code against secret in .env
  const secret = process.env.ADMIN_TOTP_SECRET;
  
  if (!secret) {
    console.error("ADMIN_TOTP_SECRET is not defined in environment variables");
    return { error: "Configuration serveur manquante." };
  }

  const isValid = authenticator.check(code, secret);

  if (!isValid) {
    return { error: "Code d'accès invalide." };
  }

  // 2. If valid, set a secure cookie (no Supabase needed)
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.set('admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });

  // 3. Success -> redirect
  revalidatePath('/', 'layout');
  redirect('/admin');
}

export async function registerPro(data: { nom: string, prenom: string, profession: string, email: string }) {
  const filePath = path.join(process.cwd(), 'src/data/adherents.json')
  let adherents = []
  try {
    adherents = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (e) {}

  const emailLower = data.email.trim().toLowerCase();
  const exists = adherents.some((a: any) => a.email?.toLowerCase() === emailLower)
  
  if (!exists) {
    const capitalize = (str: string) => str ? str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase() : ''
    
    adherents.push({
      id: crypto.randomUUID(),
      nom: capitalize(data.nom),
      prenom: capitalize(data.prenom),
      profession: capitalize(data.profession),
      email: emailLower,
      telephone: '',
      dateAdhesion: new Date().toISOString().split('T')[0],
      typeAdhesion: "En cours d'adhésion"
    })
    fs.writeFileSync(filePath, JSON.stringify(adherents, null, 2))
  }

  return await sendOtp(emailLower)
}

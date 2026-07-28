'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { authenticator } from 'otplib'
import { SignJWT } from 'jose'

import fs from 'fs'
import path from 'path'

import nodemailer from 'nodemailer'

const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function sendOtp(email: string) {
  const emailLower = email.toLowerCase().trim();
  
  const { getAdherents } = await import('@/app/admin/users/actions')
  const adherents = await getAdherents()

  const isAdherent = adherents.some((a: any) => a.email?.toLowerCase() === emailLower)

  if (!isAdherent) {
    return { error: "Votre email n'est pas autorisé. Veuillez contacter l'administrateur." }
  }

  // Generate a 6-digit code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP in memory
  otpStore.set(emailLower, { code: otpCode, expiresAt: Date.now() + 15 * 60 * 1000 });

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
  const cleanToken = token.replace(/\s+/g, '').trim();
  // Developer bypass for local testing
  if (process.env.NODE_ENV === 'development' && cleanToken === '000000') {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const emailLower = email.toLowerCase().trim();
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.ADMIN_TOTP_SECRET || 'handiboost-fallback-secret-2026')
    const jwt = await new SignJWT({ email: emailLower, role: 'pro' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    cookieStore.set('pro_session', jwt, {
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
  const record = otpStore.get(emailLower);

  if (!record || record.code !== cleanToken) {
    return { error: 'Code incorrect.' }
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(emailLower);
    return { error: 'Code expiré. Veuillez recommencer.' }
  }

  // Remove the used OTP
  otpStore.delete(emailLower);

  // Create session cookie with JWT
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.ADMIN_TOTP_SECRET || 'handiboost-fallback-secret-2026')
  const jwt = await new SignJWT({ email: emailLower, role: 'pro' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  cookieStore.set('pro_session', jwt, {
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

  // 2. If valid, set a secure cookie with JWT
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  
  const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.ADMIN_TOTP_SECRET || 'handiboost-fallback-secret-2026')
  const jwt = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(jwtSecret)

  cookieStore.set('admin_session', jwt, {
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
  const { getAdherents } = await import('@/app/admin/users/actions')
  const adherents = await getAdherents()

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
    const { Redis } = await import('@upstash/redis')
    const redis = new Redis({
      url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
      token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
    })
    await redis.set('handiboost_adherents', adherents)
  }

  return await sendOtp(emailLower)
}

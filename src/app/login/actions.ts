'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { authenticator } from 'otplib'

export async function sendOtp(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Prevent public signups if that's the policy
    }
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  })

  if (error) {
    return { error: 'Code incorrect ou expiré.' }
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
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

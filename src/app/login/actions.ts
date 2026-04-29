'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

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

export async function loginWithGoogle() {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') || headersList.get('x-forwarded-host') || 'https://handiboost.fr'
  
  // Build the redirect URL — use origin if available, otherwise fallback
  const redirectTo = origin.startsWith('http') 
    ? `${origin}/auth/callback`
    : `https://${origin}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    redirect('/login?message=Erreur lors de la connexion Google')
  }

  if (data.url) {
    redirect(data.url)
  }
}

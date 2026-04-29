'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Identifiants incorrects')
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

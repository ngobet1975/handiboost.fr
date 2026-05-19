import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    await supabase.auth.signOut()
  }

  // Also clear custom session cookies
  const res = NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
  res.cookies.delete('admin_session')
  res.cookies.delete('pro_session')

  revalidatePath('/', 'layout')
  return res
}

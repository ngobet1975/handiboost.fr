import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    // @ts-ignore - The types for Supabase SSR cookies might sometimes clash loosely
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy',
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    let user = null
    try {
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch (error) {
      console.error('Supabase middleware error:', error)
    }

    // Check for custom admin cookie
    const hasAdminCookie = request.cookies.has('admin_session')
    const isAdmin = hasAdminCookie || !!user

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Protect /professionnels/guide-booster routes
    if (request.nextUrl.pathname.startsWith('/professionnels/guide-booster') && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Redirect to admin if already logged in as admin
    if (request.nextUrl.pathname === '/login' && isAdmin) {
       const url = request.nextUrl.clone()
       url.pathname = '/admin'
       return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (globalError) {
    console.error('CRITICAL MIDDLEWARE ERROR:', globalError)
    // Toujours renvoyer une réponse normale pour ne jamais crasher l'application
    return NextResponse.next({ request })
  }
}

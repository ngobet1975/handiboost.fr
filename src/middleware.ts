import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const adminCookie = request.cookies.get('admin_session')?.value
  const proCookie = request.cookies.get('pro_session')?.value
  
  let isAdmin = false
  let isPro = false

  const secret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.ADMIN_TOTP_SECRET || 'handiboost-fallback-secret-2026')

  if (adminCookie) {
    try {
      await jwtVerify(adminCookie, secret)
      isAdmin = true
    } catch (e) {
      // Invalid JWT
    }
  }

  if (proCookie) {
    try {
      await jwtVerify(proCookie, secret)
      isPro = true
    } catch (e) {
      // Invalid JWT
    }
  }

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!isAdmin && !isPro) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    if (isPro && !isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/guide-booster'
      return NextResponse.redirect(url)
    }
  }

  // Protect /profil and /guide-booster routes
  if (request.nextUrl.pathname.startsWith('/profil') || request.nextUrl.pathname.startsWith('/guide-booster')) {
    if (!isAdmin && !isPro) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Redirect if already logged in
  if (request.nextUrl.pathname === '/login') {
    if (isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    } else if (isPro) {
      const url = request.nextUrl.clone()
      url.pathname = '/guide-booster'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

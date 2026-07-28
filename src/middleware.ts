import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Déconnexion partenaire ────────────────────────────────────────────────
  if (pathname === '/auth/partner-signout') {
    const response = NextResponse.redirect(new URL('/partenaires', request.url))
    response.cookies.delete('partner_session')
    return response
  }

  const adminCookie = request.cookies.get('admin_session')?.value
  const proCookie = request.cookies.get('pro_session')?.value
  const partnerCookie = request.cookies.get('partner_session')?.value

  let isAdmin = false
  let isPro = false
  let isPartner = false

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

  if (partnerCookie) {
    try {
      await jwtVerify(partnerCookie, secret)
      isPartner = true
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
  if (pathname.startsWith('/profil') || pathname.startsWith('/guide-booster')) {
    if (!isAdmin && !isPro) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Protect /partenaires/dashboard
  if (pathname.startsWith('/partenaires/dashboard')) {
    if (!isPartner && !isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/partenaires/connexion'
      return NextResponse.redirect(url)
    }
  }

  // Redirect if already logged in
  if (pathname === '/login') {
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

  // Redirect partenaire déjà connecté
  if (pathname === '/partenaires/connexion' && (isPartner || isAdmin)) {
    const url = request.nextUrl.clone()
    url.pathname = '/partenaires/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

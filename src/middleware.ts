import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hasAdminCookie = request.cookies.has('admin_session')
  const hasProCookie = request.cookies.has('pro_session')
  const isAdmin = hasAdminCookie
  const isPro = hasProCookie

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

  // Protect /profil route
  if (request.nextUrl.pathname.startsWith('/profil')) {
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

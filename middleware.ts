import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Temporarily disabled site access check to fix authentication issues
  return NextResponse.next()
  
  /* 
  // Allow access to the password entry page and API
  if (request.nextUrl.pathname === '/site-access' || 
      request.nextUrl.pathname === '/api/verify-password' ||
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  // Check if user has valid access cookie
  const accessCookie = request.cookies.get('site-access')
  
  if (accessCookie?.value === 'granted') {
    return NextResponse.next()
  }

  // Redirect to password entry page
  return NextResponse.redirect(new URL('/site-access', request.url))
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes that are specifically allowed)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
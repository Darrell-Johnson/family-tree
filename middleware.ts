import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE = 'bpj_access'
const AUTH_VALUE = 'granted'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicPath =
    pathname === '/login' ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'

  if (isPublicPath) {
    return NextResponse.next()
  }

  const cookie = request.cookies.get(AUTH_COOKIE)

  if (cookie?.value !== AUTH_VALUE) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

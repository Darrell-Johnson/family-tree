import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE = 'bpj_access'
const AUTH_VALUE = 'granted'
const SITE_PASSWORD = 'bpj'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const password = String(formData.get('password') ?? '')
  const from = String(formData.get('from') ?? '/')

  if (password.trim().toLowerCase() !== SITE_PASSWORD) {
    const url = new URL('/login', request.url)
    url.searchParams.set('error', '1')
    url.searchParams.set('from', from)
    return NextResponse.redirect(url, { status: 303 })
  }

  const redirectUrl = new URL(from.startsWith('/') ? from : '/', request.url)
  const response = NextResponse.redirect(redirectUrl, { status: 303 })

  response.cookies.set(AUTH_COOKIE, AUTH_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })

  return response
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAdminLoginRoute = request.nextUrl.pathname === '/admin/login'
  const isAdminMfaRoute = request.nextUrl.pathname === '/admin/mfa'

  const adminSessionCookie = request.cookies.get('lr_admin_session')?.value
  const isPendingMfa = !!request.cookies.get('lr_admin_pending_email')?.value
  const isSessionLocked = request.cookies.get('lr-admin-locked')?.value === 'true'

  // Validate adminSessionCookie payload if present
  let hasValidAdminSession = false
  if (adminSessionCookie && adminSessionCookie.includes('.')) {
    try {
      const [b64Payload] = adminSessionCookie.split('.')
      const base64 = b64Payload.replace(/-/g, '+').replace(/_/g, '/')
      const json = atob(base64)
      const payload = JSON.parse(json)
      if (
        payload.exp && 
        payload.exp > Date.now() && 
        payload.email && 
        payload.email.toLowerCase() === 'jothishgandham2@gmail.com'
      ) {
        hasValidAdminSession = true
      }
    } catch {
      hasValidAdminSession = false
    }
  }

  // 1. Never redirect away from /admin/login automatically without explicit user action
  if (isAdminLoginRoute) {
    return supabaseResponse
  }

  // 2. /admin/mfa MUST NOT be accessible without prior password authentication
  if (isAdminMfaRoute) {
    if (!isPendingMfa && !isSessionLocked) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // 3. All other /admin routes require verified admin session
  if (isAdminRoute) {
    if (isSessionLocked) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/mfa'
      return NextResponse.redirect(url)
    }

    if (hasValidAdminSession) {
      return supabaseResponse
    }

    // Not authenticated -> redirect to admin login
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (!user && (request.nextUrl.pathname.startsWith('/contributor') || request.nextUrl.pathname === '/contribute/new')) {
    const url = request.nextUrl.clone()
    url.pathname = '/contribute/login'
    url.searchParams.set('next', request.nextUrl.pathname === '/contribute/new' ? '/contributor/contribute' : request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (user && request.nextUrl.pathname === '/contribute/new') {
    const url = request.nextUrl.clone()
    url.pathname = '/contributor/contribute'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}


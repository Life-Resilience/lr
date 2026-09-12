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


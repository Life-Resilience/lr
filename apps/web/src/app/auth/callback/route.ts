import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/contributor'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle errors sent by Supabase Auth (e.g. expired link)
  if (error) {
    if (next.includes('reset-password')) {
      return NextResponse.redirect(
        `${origin}/contribute/forgot-password?error=${encodeURIComponent(errorDescription || 'The password reset link is invalid or has expired.')}`
      )
    }
    return NextResponse.redirect(`${origin}/contribute/login?error=confirmation_failed`)
  }

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
            }
          },
        },
      }
    )
    
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError) {
      const isInternal = next.startsWith('/') && !next.startsWith('//')
      const target = isInternal && next !== '/contribute' && next !== '/contribute/' && !next.startsWith('/contribute/login') && !next.startsWith('/contribute/signup')
        ? next
        : '/contributor'
      return NextResponse.redirect(`${origin}${target}`)
    } else {
      if (next.includes('reset-password')) {
        return NextResponse.redirect(`${origin}/contribute/forgot-password?error=expired`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/contribute/login?error=confirmation_failed`)
}

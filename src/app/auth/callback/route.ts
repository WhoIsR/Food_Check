import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server' // Updated to match actual utility path

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      // Forward the error to the error page
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error_description=${encodeURIComponent(error.message)}`)
    }
  }

  // If there's an error in the searchParams directly
  const errorDesc = searchParams.get('error_description')
  if (errorDesc) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error_description=${encodeURIComponent(errorDesc)}`)
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

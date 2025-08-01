import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Auth callback error:', error)
        return NextResponse.redirect(new URL('/auth/signin?error=auth_callback_failed', requestUrl.origin))
      }
      
      // Successful authentication - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    } catch (error) {
      console.error('❌ Unexpected error in auth callback:', error)
      return NextResponse.redirect(new URL('/auth/signin?error=unexpected_error', requestUrl.origin))
    }
  }

  // No code provided - redirect to signin
  return NextResponse.redirect(new URL('/auth/signin?error=no_code', requestUrl.origin))
} 
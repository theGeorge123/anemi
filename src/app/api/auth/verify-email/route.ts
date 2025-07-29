import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json()
    
    console.log('🔧 Email verification API: Starting verification')
    console.log('🔧 Email verification API: Token provided:', !!token)
    console.log('🔧 Email verification API: Email provided:', !!email)

    if (!token || !email) {
      console.log('❌ Email verification API: Missing token or email')
      return NextResponse.json({ 
        error: 'Verificatie token en email zijn verplicht' 
      }, { status: 400 })
    }

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      console.error('❌ Email verification API: Supabase admin client not configured')
      return NextResponse.json(
        { error: 'Server configuratie fout. Probeer het later opnieuw.' },
        { status: 500 }
      )
    }

    console.log('🔧 Email verification API: Verifying token...')

    // Verify the token with Supabase
    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      token_hash: token,
      type: 'signup'
    })

    if (error) {
      console.error('❌ Email verification API: Verification error:', error)
      return NextResponse.json({ 
        error: 'Ongeldige of verlopen verificatie link. Probeer opnieuw.' 
      }, { status: 400 })
    }

    if (!data.user) {
      console.error('❌ Email verification API: No user data returned')
      return NextResponse.json({ 
        error: 'Verificatie mislukt. Probeer opnieuw.' 
      }, { status: 400 })
    }

    console.log('✅ Email verification API: User verified successfully:', data.user.email)

    // Manually confirm email in database
    try {
      const { error: rpcError } = await supabaseAdmin.rpc('confirm_user_email', { 
        user_id: data.user.id 
      })
      
      if (rpcError) {
        console.error('❌ RPC error:', rpcError)
        // Continue anyway, user can still log in
      } else {
        console.log('✅ Email confirmed via RPC for user:', data.user.id)
      }
    } catch (error) {
      console.error('❌ Failed to confirm email:', error)
      // Continue anyway, user can still log in
    }

    return NextResponse.json({ 
      success: true,
      user: data.user,
      message: 'Email succesvol geverifieerd! Je kunt nu inloggen.'
    })

  } catch (error) {
    console.error('❌ Email verification API error:', error)
    return NextResponse.json({ 
      error: 'Er ging iets mis bij de email verificatie. Probeer het later opnieuw.' 
    }, { status: 500 })
  }
} 
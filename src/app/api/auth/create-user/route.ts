import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { generateNicknameFromEmail } from '@/lib/nickname-generator'
import { sendEmailVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Create user API: Starting request')
    
    const { email, password } = await request.json()
    console.log('🔧 Create user API: Email provided:', !!email)

    if (!email || !password) {
      console.log('❌ Create user API: Missing email or password')
      return NextResponse.json({ 
        error: 'Email en wachtwoord zijn verplicht' 
      }, { status: 400 })
    }

    // Validate password length
    if (password.length < 8) {
      console.log('❌ Create user API: Password too short')
      return NextResponse.json({ 
        error: 'Wachtwoord moet minimaal 8 karakters lang zijn.' 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Create user API: Invalid email format')
      return NextResponse.json({ 
        error: 'Voer een geldig email adres in.' 
      }, { status: 400 })
    }

    // Generate nickname for the user
    const nickname = generateNicknameFromEmail(email)

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      console.error('❌ Create user API: Supabase admin client not configured')
      return NextResponse.json(
        { error: 'Server configuratie fout. Probeer het later opnieuw.' },
        { status: 500 }
      )
    }

    // Create user directly without email verification
    console.log('🔧 Creating user without email verification...')
    
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email verification
      user_metadata: { 
        name: email.split('@')[0],
        nickname: nickname
      }
    })
    
    if (!adminError && adminData.user) {
      // Manually confirm email in database to bypass Supabase email verification
      console.log('🔧 Manually confirming email in database...')
      try {
        const { error: rpcError } = await supabaseAdmin.rpc('confirm_user_email', { 
          user_id: adminData.user.id 
        })
        
        if (rpcError) {
          console.error('❌ RPC error:', rpcError)
          throw rpcError
        }
        
        console.log('✅ Email confirmed via RPC for user:', adminData.user.id)
      } catch (error) {
        console.error('❌ Failed to confirm email:', error)
        // Continue anyway, user can still log in
      }
    }
    
    if (adminError) {
      console.error('❌ Admin user creation error:', adminError)
      
      // Provide specific Dutch error messages
      let errorMessage = 'Er ging iets mis bij het aanmaken van je account. Probeer het opnieuw.'
      
      if (adminError.message.includes('already registered') || adminError.message.includes('already exists') || adminError.message.includes('has already been registered')) {
        errorMessage = 'Dit email adres is al geregistreerd. Probeer in te loggen of gebruik een ander email adres.'
      } else if (adminError.message.includes('Invalid email') || adminError.message.includes('invalid format')) {
        errorMessage = 'Voer een geldig email adres in.'
      } else if (adminError.message.includes('password') || adminError.message.includes('Password')) {
        errorMessage = 'Wachtwoord moet minimaal 8 karakters lang zijn.'
      } else if (adminError.message.includes('network') || adminError.message.includes('connection')) {
        errorMessage = 'Netwerk probleem. Controleer je internet verbinding en probeer opnieuw.'
      } else if (adminError.message.includes('rate limit') || adminError.message.includes('too many')) {
        errorMessage = 'Te veel pogingen. Wacht even en probeer opnieuw.'
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        details: adminError.message 
      }, { status: 400 })
    }

    console.log('✅ User created successfully:', adminData.user?.email)

    // Save user to database with nickname
    try {
      await prisma.user.upsert({
        where: { id: adminData.user!.id },
        update: { nickname },
        create: {
          id: adminData.user!.id,
          email: adminData.user!.email!,
          nickname,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log('✅ User saved to database with nickname:', nickname)
    } catch (dbError) {
      console.error('❌ Database error saving user with nickname:', dbError)
      // Continue even if database save fails
    }
    
    return NextResponse.json({ 
      success: true,
      user: adminData.user,
      nickname,
      message: 'Account created successfully! You can now log in.',
      userCreated: true,
      emailSkipped: true
    })

  } catch (error) {
    console.error('❌ Create user error:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    return NextResponse.json({ 
      error: 'Er ging iets mis bij het aanmaken van je account. Probeer het later opnieuw.' 
    }, { status: 500 })
  }
} 
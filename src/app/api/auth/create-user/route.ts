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
    
    if (adminError) {
      console.error('❌ Admin user creation error:', adminError)
      
      // Provide specific Dutch error messages
      let errorMessage = 'Er ging iets mis bij het aanmaken van je account. Probeer het opnieuw.'
      
      if (adminError.message.includes('already registered') || adminError.message.includes('already exists')) {
        errorMessage = 'Dit email adres is al geregistreerd. Probeer in te loggen of gebruik een ander email adres.'
      } else if (adminError.message.includes('Invalid email')) {
        errorMessage = 'Voer een geldig email adres in.'
      } else if (adminError.message.includes('password')) {
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
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { sendEmailVerificationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Create user API: Starting request')
    
    const { email, password } = await request.json()

    console.log('🔧 Create user API: Email provided:', !!email)
    
    // Server-side validation
    if (!email || !password) {
      console.log('❌ Create user API: Missing email or password')
      return NextResponse.json({ 
        error: 'Email en wachtwoord zijn verplicht' 
      }, { status: 400 })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Create user API: Invalid email format')
      return NextResponse.json({ 
        error: 'Voer een geldig email adres in.' 
      }, { status: 400 })
    }

    // Password length validation
    if (password.length < 8) {
      console.log('❌ Create user API: Password too short')
      return NextResponse.json({ 
        error: 'Wachtwoord moet minimaal 8 karakters lang zijn.' 
      }, { status: 400 })
    }

    // Generate nickname
    const nickname = email.split('@')[0] + Math.floor(Math.random() * 1000)

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      console.error('❌ Create user API: Supabase admin client not configured')
      return NextResponse.json(
        { error: 'Server configuratie fout. Probeer het later opnieuw.' },
        { status: 500 }
      )
    }

    // Create user with email verification enabled
    console.log('🔧 Creating user with email verification...')
    
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Enable email verification
      user_metadata: { 
        name: email.split('@')[0],
        nickname: nickname
      }
    })

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
        
    // Send verification email using Resend
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const verificationLink = `${siteUrl}/auth/verify-email?token=${adminData.user!.id}`
      
      await sendEmailVerificationEmail({
        to: email,
        verificationLink,
        userName: email.split('@')[0]
      })
      
      console.log('✅ Verification email sent successfully to:', email)
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError)
      // Continue even if email fails - user can request verification later
    }

    return NextResponse.json({ 
      success: true, 
      user: adminData.user,
      nickname,
      message: 'Account aangemaakt! Controleer je email voor verificatie.',
      userCreated: true,
      emailSent: true
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
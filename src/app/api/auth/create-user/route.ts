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
      email_confirm: true // Let Supabase handle email verification
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
    console.log('✅ User ID from Supabase:', adminData.user?.id)

        // Save user to database
        try {
          console.log('🔧 Attempting to save user to database...')
          console.log('   User ID:', adminData.user!.id)
          console.log('   User Email:', adminData.user!.email)
          
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { id: adminData.user!.id }
          })
          
          console.log('🔍 Existing user check:', existingUser ? 'Found' : 'Not found')
          
          const result = await prisma.user.upsert({
            where: { id: adminData.user!.id },
            update: { 
              updatedAt: new Date()
            },
            create: {
              id: adminData.user!.id,
              email: adminData.user!.email!,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
          
          console.log('✅ User saved to database successfully:', result)
          
          // Verify the user was actually saved
          const savedUser = await prisma.user.findUnique({
            where: { id: adminData.user!.id }
          })
          
          console.log('🔍 Verification - User in database:', savedUser ? 'Found' : 'Not found')
          
        } catch (dbError) {
          console.error('❌ Database error saving user:', dbError)
          console.error('❌ Error details:', {
            message: dbError instanceof Error ? dbError.message : 'Unknown error',
            stack: dbError instanceof Error ? dbError.stack : undefined,
            name: dbError instanceof Error ? dbError.name : 'Unknown'
          })
          // Continue even if database save fails
        }
        
            // Supabase will automatically send verification email
        console.log('✅ User created successfully. Supabase will send verification email.')
        
        return NextResponse.json({ 
          success: true, 
          user: adminData.user,
          message: 'Account aangemaakt! Controleer je email voor verificatie.',
          userCreated: true,
          emailSent: false // Supabase handles email sending
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
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { generateNicknameFromEmail } from '@/lib/nickname-generator'
import { sendEmailVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Generate nickname for the user
    const nickname = generateNicknameFromEmail(email)

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      console.error('❌ Create user API: Supabase admin client not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Generate email verification link using admin API
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: email,
      password: password,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email?type=signup`
      }
    })

    if (linkError) {
      console.error('Email verification link generation error:', linkError)
      
      // If it's an email/SMTP error, try creating user without email confirmation
      if (linkError.message.includes('email') || linkError.message.includes('confirmation') || linkError.message.includes('smtp')) {
        console.warn('Email sending failed, trying to create user without email confirmation')
        
        // Try creating user with email_confirm: true to bypass email
        const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { name: email.split('@')[0] }
        })
        
        if (adminError) {
          console.error('Admin user creation error:', adminError)
          return NextResponse.json({ 
            error: 'Failed to create account due to email configuration issues. Please try again later or contact support.',
            details: adminError.message 
          }, { status: 400 })
        }

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
        } catch (dbError) {
          console.error('Database error saving user with nickname:', dbError)
          // Continue even if database save fails
        }
        
        return NextResponse.json({ 
          success: true,
          user: adminData.user,
          nickname,
          message: 'Account created successfully! Email verification was skipped due to SMTP issues.',
          userCreated: true,
          emailSkipped: true
        })
      }
      
      return NextResponse.json({ error: linkError.message }, { status: 400 })
    }

    // Send custom email verification email
    try {
      await sendEmailVerificationEmail({
        to: email,
        verificationLink: linkData.properties?.action_link || '',
        userName: email.split('@')[0] // Use email prefix as username
      })
      
      console.log('Custom email verification email sent successfully to:', email)
    } catch (emailError) {
      console.error('Failed to send custom email verification email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send email verification email' },
        { status: 500 }
      )
    }

    // Save user to database with nickname
    try {
      await prisma.user.upsert({
        where: { id: linkData.user!.id },
        update: { nickname },
        create: {
          id: linkData.user!.id,
          email: linkData.user!.email!,
          nickname,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    } catch (dbError) {
      console.error('Database error saving user with nickname:', dbError)
      // Continue even if database save fails
    }

    return NextResponse.json({ 
      success: true, 
      user: linkData.user,
      nickname,
      message: 'User created successfully. Please check your email to verify your account.' 
    })

  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ 
      error: 'Failed to create user' 
    }, { status: 500 })
  }
} 
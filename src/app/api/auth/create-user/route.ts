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
      return NextResponse.json({ 
        error: 'Failed to create account. Please try again.',
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
    console.error('Create user error:', error)
    return NextResponse.json({ 
      error: 'Failed to create user' 
    }, { status: 500 })
  }
} 
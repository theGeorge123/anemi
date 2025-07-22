import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Create Supabase client with anon key for normal signup
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Try normal signup first
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify`
      }
    })

    if (error) {
      console.error('User creation error:', error)
      
      // If it's an email/SMTP error, try creating user without email confirmation
      if (error.message.includes('email') || error.message.includes('confirmation') || error.message.includes('smtp')) {
        console.warn('Email sending failed, trying to create user without email confirmation')
        
        // Try creating user with email_confirm: true to bypass email
        const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
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
        
        return NextResponse.json({ 
          success: true,
          user: adminData.user,
          message: 'Account created successfully! Email verification was skipped due to SMTP issues.',
          userCreated: true,
          emailSkipped: true
        })
      }
      
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      user: data.user,
      message: 'User created successfully. Please check your email to verify your account.' 
    })

  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ 
      error: 'Failed to create user' 
    }, { status: 500 })
  }
} 
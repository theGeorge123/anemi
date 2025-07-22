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

    // Use normal signup flow which automatically sends verification email
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify`
      }
    })

    if (error) {
      console.error('User creation error:', error)
      
      // Check if it's an email sending error
      if (error.message.includes('email') || error.message.includes('confirmation')) {
        console.warn('Email sending failed, but user might have been created')
        return NextResponse.json({ 
          error: 'User created but email verification failed. Please contact support or try again later.',
          details: error.message 
        }, { status: 400 })
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
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Create Supabase client with service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Generate a signup link that will create the user and send verification email
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: email,
      password: password,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify`
      }
    })

    if (error) {
      console.error('User creation error:', error)
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
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Create Supabase client with service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Manually confirm the user's email
    const { data, error } = await supabase.auth.admin.updateUserById(
      email, // This should be the user ID, but we'll try with email first
      { email_confirm: true }
    )

    if (error) {
      console.error('Manual confirmation error:', error)
      
      // Try alternative approach - get user by email first
      const { data: users, error: listError } = await supabase.auth.admin.listUsers()
      
      if (listError) {
        return NextResponse.json({ 
          error: 'Failed to confirm email',
          details: error.message 
        }, { status: 400 })
      }

      const user = users.users.find(u => u.email === email)
      
      if (!user) {
        return NextResponse.json({ 
          error: 'User not found',
          details: 'No user found with this email address'
        }, { status: 404 })
      }

      // Try to confirm the found user
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      )

      if (updateError) {
        return NextResponse.json({ 
          error: 'Failed to confirm email',
          details: updateError.message 
        }, { status: 400 })
      }

      return NextResponse.json({ 
        success: true,
        message: 'Email confirmed successfully',
        user: updateData.user
      })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Email confirmed successfully',
      user: data.user
    })

  } catch (error) {
    console.error('Manual confirm error:', error)
    return NextResponse.json({ 
      error: 'Failed to confirm email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 
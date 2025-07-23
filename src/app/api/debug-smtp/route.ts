import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ? '✅ Set' : '❌ Missing',
      emailFrom: process.env.EMAIL_FROM ? '✅ Set' : '❌ Missing',
    }

    // Test Supabase connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Test a simple signup to see what error we get
    const testEmail = `test-${Date.now()}@example.com`
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'testpassword123',
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify`
      }
    })

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      testSignup: {
        success: !error,
        error: error?.message || null,
        userCreated: !!data?.user,
        emailSent: !error || !error.message.includes('email'),
      },
      recommendations: {
        emailTemplate: 'Check Supabase email template settings',
        siteUrl: !process.env.NEXT_PUBLIC_SITE_URL ? 'Set NEXT_PUBLIC_SITE_URL' : '✅ Site URL set',
      }
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error('Debug SMTP error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to debug SMTP',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 
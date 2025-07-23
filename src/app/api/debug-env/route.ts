import { NextRequest, NextResponse } from 'next/server'
import { validateEnvironment } from '@/lib/env-validator'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const variables = {
      NEXT_PUBLIC_SITE_URL: {
        set: !!process.env.NEXT_PUBLIC_SITE_URL,
        value: process.env.NEXT_PUBLIC_SITE_URL ? 'Set' : 'Not set'
      },
      NEXT_PUBLIC_SUPABASE_URL: {
        set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      },

      EMAIL_FROM: {
        set: !!process.env.EMAIL_FROM,
        value: process.env.EMAIL_FROM || 'Not set'
      },
      DATABASE_URL: {
        set: !!process.env.DATABASE_URL,
        value: process.env.DATABASE_URL ? 'Set' : 'Not set'
      }
    }

    // Run validation
    const validation = validateEnvironment()

    // Additional checks
    const checks = {
      supabaseUrlFormat: process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://') || false,
      supabaseKeyLength: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0) > 50
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      variables,
      validation,
      checks,
      nodeEnv: process.env.NODE_ENV,
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production'
    })
  } catch (error) {
    console.error('Debug env error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check environment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 
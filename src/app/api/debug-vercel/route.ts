import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient, validateSupabaseConnection, testSupabaseAuth } from '@/lib/supabase-browser'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_URL: process.env.VERCEL_URL,
        VERCEL_ENV: process.env.VERCEL_ENV,
      },
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
      },
      other: {
        databaseUrl: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
        resendApiKey: process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing',
        emailFrom: process.env.EMAIL_FROM ? '✅ Set' : '❌ Missing',
        googleMapsKey: process.env.GOOGLE_MAPS_API_KEY ? '✅ Set' : '❌ Missing',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ? '✅ Set' : '❌ Missing',
      },
      connection: {
        supabaseClient: null as any,
        validationResult: null as any,
        authTestResult: null as any,
      }
    }

    // Test Supabase client creation
    try {
      const client = getSupabaseClient()
      debugInfo.connection.supabaseClient = client ? '✅ Created' : '❌ Failed'
      
      if (client) {
        // Test connection
        const validationResult = await validateSupabaseConnection()
        debugInfo.connection.validationResult = validationResult
        
        // Test auth
        const authTestResult = await testSupabaseAuth()
        debugInfo.connection.authTestResult = authTestResult
      }
    } catch (error) {
      debugInfo.connection.supabaseClient = `❌ Error: ${error}`
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    return NextResponse.json(
      { error: 'Debug failed', details: error },
      { status: 500 }
    )
  }
} 
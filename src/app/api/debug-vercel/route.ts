import { NextRequest, NextResponse } from 'next/server'
import { validateSupabaseConnection, testSupabaseAuth } from '@/lib/supabase-browser'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get environment variables
    const environment = {
      NODE_ENV: process.env.NODE_ENV || 'Not set',
      VERCEL: process.env.VERCEL || 'Not set',
      VERCEL_URL: process.env.VERCEL_URL || 'Not set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'Not set',
    }

    const supabase = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
    }

    const other = {
      databaseUrl: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
      resendApiKey: process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing',
      emailFrom: process.env.EMAIL_FROM ? '✅ Set' : '❌ Missing',
      googleMapsKey: process.env.GOOGLE_MAPS_API_KEY ? '✅ Set' : '❌ Missing',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '❌ Missing',
    }

    // Email verification specific checks
    const emailVerification = {
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '❌ Missing - Critical for email verification',
      resendKey: process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing - For custom SMTP',
      emailFrom: process.env.EMAIL_FROM || '❌ Missing - For custom sender',
      vercelUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '❌ Missing',
    }

    // Test Supabase connection
    const connectionResult = await validateSupabaseConnection()
    const authTestResult = await testSupabaseAuth()

    // Get current domain info
    const host = request.headers.get('host') || 'unknown'
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const currentDomain = `${protocol}://${host}`

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment,
      supabase,
      other,
      emailVerification,
      connection: {
        supabaseClient: connectionResult.valid ? '✅ Created' : '❌ Failed',
        validationResult: connectionResult,
        authTestResult: authTestResult,
      },
      domain: {
        currentDomain,
        customDomain: 'https://www.anemimeets.com',
        vercelUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'Not set',
        siteUrlEnv: process.env.NEXT_PUBLIC_SITE_URL || 'Not set',
      },
      recommendations: {
        siteUrl: !process.env.NEXT_PUBLIC_SITE_URL ? 'Set NEXT_PUBLIC_SITE_URL to your Vercel domain' : '✅ OK',
        smtp: !process.env.RESEND_API_KEY ? 'Consider using Resend for better email delivery' : '✅ OK',
        redirectUrls: 'Make sure Supabase redirect URLs include your Vercel domain',
        emailTemplate: 'Check Supabase email template uses correct SiteURL variable'
      }
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get debug info',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 
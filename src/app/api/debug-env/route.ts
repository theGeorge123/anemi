import { NextRequest, NextResponse } from 'next/server'
import { validateEnvironment } from '@/lib/env-validator'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check all critical environment variables
    const variables = {
      // Supabase Configuration
      NEXT_PUBLIC_SUPABASE_URL: {
        set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        critical: true
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
        critical: true
      },
      SUPABASE_SERVICE_ROLE_KEY: {
        set: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        value: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set',
        critical: true
      },

      // Site Configuration
      NEXT_PUBLIC_SITE_URL: {
        set: !!process.env.NEXT_PUBLIC_SITE_URL,
        value: process.env.NEXT_PUBLIC_SITE_URL || 'Not set',
        critical: true
      },

      // Database
      DATABASE_URL: {
        set: !!process.env.DATABASE_URL,
        value: process.env.DATABASE_URL ? 'Set' : 'Not set',
        critical: true
      },

      // Email Configuration
      EMAIL_FROM: {
        set: !!process.env.EMAIL_FROM,
        value: process.env.EMAIL_FROM || 'Not set',
        critical: false
      },
      RESEND_API_KEY: {
        set: !!process.env.RESEND_API_KEY,
        value: process.env.RESEND_API_KEY ? 'Set' : 'Not set',
        critical: false
      },

      // Optional Features
      GOOGLE_MAPS_API_KEY: {
        set: !!process.env.GOOGLE_MAPS_API_KEY,
        value: process.env.GOOGLE_MAPS_API_KEY ? 'Set' : 'Not set',
        critical: false
      },
      DISABLE_EMAILS: {
        set: !!process.env.DISABLE_EMAILS,
        value: process.env.DISABLE_EMAILS || 'false',
        critical: false
      }
    }

    // Run validation
    const validation = validateEnvironment()

    // Additional checks
    const checks = {
      supabaseUrlFormat: process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://') || false,
      supabaseKeyLength: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0) > 50,
      siteUrlFormat: process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https://') || false,
      databaseUrlFormat: process.env.DATABASE_URL?.startsWith('postgresql://') || false
    }

    // Calculate overall status
    const criticalVariables = Object.entries(variables).filter(([_, config]) => config.critical)
    const missingCritical = criticalVariables.filter(([_, config]) => !config.set).length
    const overallStatus = missingCritical === 0 ? 'healthy' : 'critical'

    // Generate recommendations
    const recommendations = []
    
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      recommendations.push('Set NEXT_PUBLIC_SITE_URL to your production domain (e.g., https://www.anemimeets.com)')
    }
    
    if (!process.env.EMAIL_FROM) {
      recommendations.push('Set EMAIL_FROM for custom email sender (e.g., noreply@anemi-meets.com)')
    }
    
    if (!process.env.RESEND_API_KEY) {
      recommendations.push('Set RESEND_API_KEY for email functionality')
    }
    
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      recommendations.push('Set GOOGLE_MAPS_API_KEY for map functionality (optional)')
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      variables,
      validation,
      checks,
      overallStatus,
      missingCritical,
      recommendations,
      nodeEnv: process.env.NODE_ENV,
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production',
      vercelUrl: process.env.VERCEL_URL,
      vercelEnv: process.env.VERCEL_ENV
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
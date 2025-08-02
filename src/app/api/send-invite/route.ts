import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendInviteEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { inviteCode, email, emails } = body

    // Support both single email and multiple emails (legacy)
    let emailList: string[] = []
    
    if (email && typeof email === 'string') {
      // Single email (new preferred method)
      emailList = [email]
    } else if (emails && Array.isArray(emails)) {
      // Multiple emails (legacy support)
      emailList = emails
    }

    if (!inviteCode || emailList.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: inviteCode and email required' },
        { status: 400 }
      )
    }

    // Validate emails
    const validEmails = emailList.filter((email: string) => 
      email && typeof email === 'string' && email.includes('@') && email.length > 3
    )

    if (validEmails.length === 0) {
      return NextResponse.json(
        { error: 'No valid email address provided' },
        { status: 400 }
      )
    }

    // Log for debugging
    console.log('📧 Sending invite emails:', { inviteCode, validEmails })

    // Get invite details from database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { data: invite, error: inviteError } = await supabase
      .from('MeetupInvite')
      .select(`
        *,
        cafe: cafeId (
          name,
          address,
          city
        )
      `)
      .eq('token', inviteCode)
      .single()

    if (inviteError || !invite) {
      return NextResponse.json(
        { error: 'Invite not found' },
        { status: 404 }
      )
    }

    // Check if email service is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️  RESEND_API_KEY not configured, email functionality disabled')
      return NextResponse.json(
        { 
          error: 'Email service not configured',
          message: 'Email functionality is currently disabled. Please configure RESEND_API_KEY environment variable.',
          success: false,
          debug: {
            hasResendKey: !!process.env.RESEND_API_KEY,
            hasEmailFrom: !!process.env.EMAIL_FROM,
            node_env: process.env.NODE_ENV
          }
        },
        { status: 503 }
      )
    }

    // Send emails to all recipients
    const emailPromises = validEmails.map(async (email: string) => {
      try {
        console.log(`📤 Attempting to send email to: ${email}`)
        
        const result = await sendInviteEmail({
          to: email,
          cafe: {
            name: invite.cafe?.name || 'Gekozen café',
            address: invite.cafe?.address || 'Adres volgt',
            priceRange: '€€',
            rating: 4.5,
            openHours: '09:00-18:00',
          },
          dates: invite.availableDates || [],
          times: invite.availableTimes || [],
          token: inviteCode,
          inviteLink: `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${inviteCode}`,
          organizerName: invite.organizerName,
        })
        
        console.log(`✅ Email sent successfully to: ${email}`)
        return { email, success: true, result }
      } catch (error) {
        console.error(`❌ Failed to send email to ${email}:`, error)
        return { 
          email, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      }
    })

    const results = await Promise.all(emailPromises)
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)

    return NextResponse.json({
      message: `Emails sent successfully`,
      results: {
        total: results.length,
        successful: successful.length,
        failed: failed.length,
        details: results
      }
    })

  } catch (error) {
    console.error('Error in send-invite API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
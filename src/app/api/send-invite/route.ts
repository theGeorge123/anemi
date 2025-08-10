import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendInviteEmail } from '@/lib/email'
import { SendInviteEmailSchema } from '@/lib/validation'
import { rateLimit } from '@/lib/rate-limit'
import { ERR } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    const rate = await rateLimit(request, 20, 60_000)
    if (!rate.success) {
      return NextResponse.json({ error: ERR.RATE_LIMIT }, { status: 429 })
    }

    const body = await request.json()
    const parsed = SendInviteEmailSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: ERR.INVALID_INPUT }, { status: 400 })
    }

    const { inviteCode, email, emails } = parsed.data
    const emailList = email ? [email] : emails!

    // Log for debugging
    console.log('📧 Sending invite emails:', { inviteCode, emailList })

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
        { error: ERR.INTERNAL, message: 'Email service not configured' },
        { status: 503 }
      )
    }

    // Send emails to all recipients
    const emailPromises = emailList.map(async (email: string) => {
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
      { error: ERR.INTERNAL },
      { status: 500 }
    )
  }
}
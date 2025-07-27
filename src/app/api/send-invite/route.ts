import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendInviteEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { inviteCode, emails } = await request.json()

    if (!inviteCode || !emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: inviteCode and emails array required' },
        { status: 400 }
      )
    }

    // Validate emails
    const validEmails = emails.filter((email: string) => 
      email && typeof email === 'string' && email.includes('@')
    )

    if (validEmails.length === 0) {
      return NextResponse.json(
        { error: 'No valid email addresses provided' },
        { status: 400 }
      )
    }

    // Get invite details from database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select(`
        *,
        meetups (
          organizer_name,
          organizer_email,
          city,
          available_dates,
          available_times,
          cafes (name, address)
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

    // Send emails to all recipients
    const emailPromises = validEmails.map(async (email: string) => {
      try {
        await sendInviteEmail({
          to: email,
          cafe: {
            name: invite.meetups.cafes?.name || 'Gekozen café',
            address: invite.meetups.cafes?.address || 'Adres volgt',
            priceRange: '€€',
            rating: 4.5,
            openHours: '09:00-18:00',
          },
          dates: invite.meetups.available_dates || [],
          times: invite.meetups.available_times || [],
          token: inviteCode,
          inviteLink: `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${inviteCode}`,
          organizerName: invite.meetups.organizer_name,
        })
        return { email, success: true }
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error)
        return { email, success: false, error: error instanceof Error ? error.message : 'Unknown error' }
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
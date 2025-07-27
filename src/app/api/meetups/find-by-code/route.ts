import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { inviteCode } = await request.json()

    if (!inviteCode || typeof inviteCode !== 'string') {
      return NextResponse.json(
        { error: 'Invalid invite code provided' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Find meetup by invite code - include all statuses
    const { data: meetups, error } = await supabase
      .from('invites')
      .select(`
        *,
        meetups (
          id,
          organizer_name,
          organizer_email,
          city,
          available_dates,
          available_times,
          cafes (
            id,
            name,
            address,
            city
          )
        )
      `)
      .eq('token', inviteCode)
      .in('status', ['pending', 'accepted', 'declined'])

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to find meetup' },
        { status: 500 }
      )
    }

    if (!meetups || meetups.length === 0) {
      return NextResponse.json(
        { error: 'No active meetup found with this invite code' },
        { status: 404 }
      )
    }

    // Transform the data to match the expected format
    const transformedMeetups = meetups.map(invite => ({
      id: invite.id,
      token: invite.token,
      organizerName: invite.meetups.organizer_name,
      organizerEmail: invite.meetups.organizer_email,
      status: invite.status,
      createdAt: invite.created_at,
      expiresAt: invite.expires_at,
      cafe: {
        id: invite.meetups.cafes.id,
        name: invite.meetups.cafes.name,
        address: invite.meetups.cafes.address,
        city: invite.meetups.cafes.city,
      },
      availableDates: invite.meetups.available_dates || [],
      availableTimes: invite.meetups.available_times || [],
      chosenDate: invite.chosen_date,
      chosenTime: invite.chosen_time,
      inviteeName: invite.invitee_name,
      inviteeEmail: invite.invitee_email,
    }))

    return NextResponse.json({
      meetups: transformedMeetups,
      message: 'Meetup found successfully'
    })

  } catch (error) {
    console.error('Error in find-by-code API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, userId } = await request.json()

    if (!email || !userId) {
      return NextResponse.json(
        { error: 'Email and userId are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Find invites where the user was invited (either as organizer or invitee)
    // and link them to the new user account
    const { data: invitesToUpdate, error: fetchError } = await supabase
      .from('invites')
      .select('*')
      .or(`invitee_email.eq.${email},meetups.organizer_email.eq.${email}`)

    if (fetchError) {
      console.error('Error fetching invites to link:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch meetups for linking' },
        { status: 500 }
      )
    }

    if (!invitesToUpdate || invitesToUpdate.length === 0) {
      return NextResponse.json({
        message: 'No meetups found to link to this account',
        linkedCount: 0
      })
    }

    // Update invites to link them to the user account
    const inviteIds = invitesToUpdate.map(invite => invite.id)
    
    const { error: updateError } = await supabase
      .from('invites')
      .update({ invitee_user_id: userId })
      .in('id', inviteIds)
      .eq('invitee_email', email) // Only update invites where they are the invitee

    if (updateError) {
      console.error('Error linking invites to account:', updateError)
      return NextResponse.json(
        { error: 'Failed to link meetups to account' },
        { status: 500 }
      )
    }

    // Also update meetups where they are the organizer
    const { error: meetupUpdateError } = await supabase
      .from('meetups')
      .update({ organizer_user_id: userId })
      .eq('organizer_email', email)

    if (meetupUpdateError) {
      console.error('Error linking meetups to account:', meetupUpdateError)
      // Don't fail the request for this, just log it
    }

    return NextResponse.json({
      message: `Successfully linked ${invitesToUpdate.length} meetups to your account`,
      linkedCount: invitesToUpdate.length
    })

  } catch (error) {
    console.error('Error in link-meetups API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Find all meetup invitations created by this user (organizer)
    const invitations = await prisma.meetupInvite.findMany({
      where: {
        createdBy: user.email,
        deletedAt: null
      },
      include: {
        cafe: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      invitations: invitations.map(invitation => ({
        id: invitation.id,
        token: invitation.token,
        organizerName: invitation.organizerName,
        organizerEmail: invitation.organizerEmail,
        inviteeName: invitation.inviteeName,
        inviteeEmail: invitation.inviteeEmail,
        status: invitation.status,
        createdAt: invitation.createdAt,
        expiresAt: invitation.expiresAt,
        confirmedAt: invitation.confirmedAt,
        declinedAt: invitation.declinedAt,
        chosenDate: invitation.chosenDate,
        chosenTime: invitation.chosenTime,
        cafe: invitation.cafe,
        availableDates: invitation.availableDates,
        availableTimes: invitation.availableTimes
      }))
    })
  } catch (error) {
    console.error('❌ Error fetching invitations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    )
  }
}
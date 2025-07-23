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

    const meetups = await prisma.meetupInvite.findMany({
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
      meetups: meetups.map(meetup => ({
        id: meetup.id,
        token: meetup.token,
        organizerName: meetup.organizerName,
        organizerEmail: meetup.organizerEmail,
        status: meetup.status,
        createdAt: meetup.createdAt,
        expiresAt: meetup.expiresAt,
        cafe: meetup.cafe,
        availableDates: meetup.availableDates,
        availableTimes: meetup.availableTimes,
        chosenDate: meetup.chosenDate,
        inviteeName: meetup.inviteeName,
        inviteeEmail: meetup.inviteeEmail
      }))
    })
  } catch (error) {
    console.error('❌ Error fetching meetups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meetups' },
      { status: 500 }
    )
  }
} 
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

    // Get all meetups for the user
    const meetups = await prisma.meetupInvite.findMany({
      where: {
        OR: [
          { createdBy: user.email },
          { inviteeUserId: user.id }
        ],
        deletedAt: null
      },
      include: {
        cafe: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // For each meetup, get additional metrics
    const meetupsWithMetrics = await Promise.all(
      meetups.map(async (meetup) => {
        // Get all invites for this meetup (same token)
        const allInvites = await prisma.meetupInvite.findMany({
          where: {
            token: meetup.token,
            deletedAt: null
          },
          select: {
            id: true,
            inviteeName: true,
            inviteeEmail: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            chosenDate: true,
            chosenTime: true
          }
        })

        // Calculate response metrics
        const responses = {
          accepted: allInvites.filter(invite => invite.status === 'confirmed' || invite.status === 'accepted').length,
          declined: allInvites.filter(invite => invite.status === 'declined').length,
          pending: allInvites.filter(invite => invite.status === 'pending').length
        }

        // Get participants list (excluding the organizer)
        const participants = allInvites
          .filter(invite => invite.inviteeEmail !== meetup.organizerEmail)
          .map(invite => ({
            name: invite.inviteeName || 'Onbekend',
            email: invite.inviteeEmail || '',
            status: invite.status,
            responseDate: invite.updatedAt,
            chosenDate: invite.chosenDate,
            chosenTime: invite.chosenTime
          }))

        return {
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
          inviteeEmail: meetup.inviteeEmail,
          inviteeUserId: meetup.inviteeUserId,
          createdBy: meetup.createdBy,
          // New metrics
          totalInvites: allInvites.length,
          responses,
          participants
        }
      })
    )

    return NextResponse.json({
      meetups: meetupsWithMetrics
    })
  } catch (error) {
    console.error('❌ Error fetching meetups:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meetups' },
      { status: 500 }
    )
  }
} 
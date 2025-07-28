import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Meetups API: Starting request')
    
    const authHeader = request.headers.get('authorization')
    console.log('🔍 Meetups API: Auth header present:', !!authHeader)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Meetups API: No valid authorization header')
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('🔍 Meetups API: Token length:', token.length)

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('🔍 Meetups API: Supabase URL present:', !!supabaseUrl)
    console.log('🔍 Meetups API: Supabase key present:', !!supabaseAnonKey)

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Meetups API: Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )

    console.log('🔍 Meetups API: Supabase client created, getting user...')
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error('❌ Meetups API: User error:', userError)
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    if (!user?.email) {
      console.error('❌ Meetups API: No user email found')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    console.log('✅ Meetups API: User authenticated:', user.email)

    console.log('🔍 Meetups API: Querying database for user:', user.email, 'ID:', user.id)
    
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

    console.log('✅ Meetups API: Found', meetups.length, 'meetups')

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
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    return NextResponse.json(
      { error: 'Failed to fetch meetups' },
      { status: 500 }
    )
  }
} 
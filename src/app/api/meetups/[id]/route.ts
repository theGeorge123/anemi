import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params
    const body = await request.json()
    const { organizerName, availableDates, availableTimes } = body

    // Verify the meetup belongs to the user
    const meetup = await prisma.meetupInvite.findFirst({
      where: {
        id,
        createdBy: user.email,
        deletedAt: null
      }
    })

    if (!meetup) {
      return NextResponse.json(
        { error: 'Meetup not found or access denied' },
        { status: 404 }
      )
    }

    // Update the meetup
    const updatedMeetup = await prisma.meetupInvite.update({
      where: { id },
      data: {
        organizerName,
        availableDates,
        availableTimes,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Meetup updated successfully',
      meetup: updatedMeetup
    })
  } catch (error) {
    console.error('Error updating meetup:', error)
    return NextResponse.json(
      { error: 'Failed to update meetup' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Verify the meetup belongs to the user
    const meetup = await prisma.meetupInvite.findFirst({
      where: {
        id,
        createdBy: user.email,
        deletedAt: null
      }
    })

    if (!meetup) {
      return NextResponse.json(
        { error: 'Meetup not found or access denied' },
        { status: 404 }
      )
    }

    // Soft delete the meetup
    await prisma.meetupInvite.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Meetup deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting meetup:', error)
    return NextResponse.json(
      { error: 'Failed to delete meetup' },
      { status: 500 }
    )
  }
} 
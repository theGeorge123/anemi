import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const { token } = params

    const invite = await prisma.meetupInvite.findFirst({
      where: {
        token: token,
        expiresAt: {
          gt: new Date()
        },
        deletedAt: null
      },
      include: {
        cafe: {
          select: {
            id: true,
            name: true,
            address: true,
            priceRange: true,
            rating: true,
            hours: true,
            isVerified: true,
            description: true,
            photos: true
          }
        }
      }
    })

    if (!invite) {
      return NextResponse.json(
        { error: 'Invite not found or has expired' },
        { status: 404 }
      )
    }

    // Format hours for display
    const formatHours = (hours: any) => {
      if (!hours) return 'Hours not available'
      if (typeof hours === 'string') return hours
      if (typeof hours === 'object') {
        return 'Open daily'
      }
      return 'Hours not available'
    }

    // Format the response to match frontend expectations
    const response = {
      id: invite.id,
      token: invite.token,
      cafe: {
        ...invite.cafe,
        hours: formatHours(invite.cafe.hours)
      },
      organizerName: invite.organizerName,
      organizerEmail: invite.organizerEmail,
      availableDates: invite.availableDates || [],
      availableTimes: invite.availableTimes || [],
      status: invite.status,
      chosenDate: invite.chosenDate,
      chosenTime: invite.chosenTime
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in invite GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
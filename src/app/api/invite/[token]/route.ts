import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
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
            openHours: true,
            isVerified: true,
            description: true
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

    // Format the response
    const response = {
      id: invite.id,
      token: invite.token,
      cafe: invite.cafe,
      formData: {
        name: invite.organizerName,
        email: invite.organizerEmail,
        dates: invite.availableDates,
        priceRange: invite.cafe.priceRange
      },
      status: invite.status,
      chosenDate: invite.chosenDate
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
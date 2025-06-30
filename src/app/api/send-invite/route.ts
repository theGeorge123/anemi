import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendInviteEmail } from '@/lib/email'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { cafe, formData, dates } = await request.json()

    // Generate a unique token for the invite
    const token = randomUUID()

    // Create the invite record
    const invite = await prisma.meetupInvite.create({
      data: {
        token: token,
        organizerName: formData.name,
        organizerEmail: formData.email,
        cafeId: cafe.id,
        availableDates: dates,
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      }
    })

    // Send invite email
    try {
      await sendInviteEmail({
        to: formData.email, // For now, send to organizer as demo
        cafe: cafe,
        dates: dates,
        token: token,
        organizerName: formData.name
      })
    } catch (emailError) {
      console.error('Failed to send email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      inviteId: invite.id,
      token: token 
    })
  } catch (error) {
    console.error('Error in send-invite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
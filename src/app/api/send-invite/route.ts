import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { rateLimit } = await import('@/lib/rate-limit')
    const { sendInviteEmail } = await import('@/lib/email')
    
    // Apply rate limiting (5 requests per minute for email sending)
    const rateLimitResult = await rateLimit(request, 5, 60000)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many invite requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { prisma } = await import('@/lib/prisma')
    const { cafe, formData, dates, times } = await request.json()

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
        availableTimes: times || [],
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      }
    })

    // Generate invite link
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const inviteLink = `${baseUrl}/invite/${token}`

    // Send invite email with the link
    try {
      await sendInviteEmail({
        to: formData.email, // For now, send to organizer as demo
        cafe: cafe,
        dates: dates,
        times: times,
        token: token,
        inviteLink: inviteLink,
        organizerName: formData.name
      })
    } catch (emailError) {
      console.error('Failed to send email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      inviteId: invite.id,
      token: token,
      inviteLink: inviteLink
    })
  } catch (error) {
    console.error('Error in send-invite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
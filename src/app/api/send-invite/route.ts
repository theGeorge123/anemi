import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { addDays } from 'date-fns'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  // CSRF protection: double-submit cookie pattern
  const csrfHeader = request.headers.get('x-csrf-token');
  const csrfCookie = request.cookies.get('csrf_token')?.value;
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }
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
    const { cafe, formData, dates, times, userId } = await request.json()

    // Server-side validation
    if (!formData || typeof formData.name !== 'string' || formData.name.length < 2 || formData.name.length > 50) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }
    if (!formData.email || !isValidEmail(formData.email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (!Array.isArray(dates) || dates.length === 0) {
      return NextResponse.json({ error: 'At least one date is required' }, { status: 400 })
    }
    if (times && !Array.isArray(times)) {
      return NextResponse.json({ error: 'Times must be an array' }, { status: 400 })
    }

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
        expiresAt: addDays(new Date(), 7),
        createdBy: userId || null,
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
      inviteLink: inviteLink,
      message: `🎉 Your coffee meetup is brewing! Share this magic link with your friend: ${inviteLink} \nWhoever clicks it first gets to pick the date! ☕️✨`
    })
  } catch (error) {
    console.error('Error in send-invite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { 
  sendMeetupCancellation,
  sendMeetupConfirmationEmail,
  sendMeetupConfirmation,
  sendWelcomeEmail,
  sendInviteEmail,
  sendCalendarInvite,
  sendMeetupReminder
} from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { 
      testType, 
      to, 
      meetupTitle, 
      meetupDate, 
      reason,
      organizerName,
      inviteeName,
      cafeName,
      cafeAddress,
      availableDates,
      availableTimes,
      chosenDate,
      chosenTime
    } = await request.json()

    console.log('🧪 Testing email functionality:', { testType, to })

    let result: any = {}

    switch (testType) {
      case 'cancellation':
        result = await sendMeetupCancellation(
          to || 'test@example.com',
          meetupTitle || 'Test Coffee Meetup',
          meetupDate || '2025-01-15',
          reason || 'Test cancellation'
        )
        break

      case 'confirmation':
        result = await sendMeetupConfirmationEmail({
          organizerName: organizerName || 'John Doe',
          organizerEmail: to || 'organizer@example.com',
          inviteeName: inviteeName || 'Jane Smith',
          inviteeEmail: to || 'invitee@example.com',
          cafe: {
            name: cafeName || 'Test Cafe',
            address: cafeAddress || 'Test Address 123'
          },
          availableDates: availableDates || ['2025-01-15', '2025-01-16'],
          availableTimes: availableTimes || ['09:00', '10:00'],
          chosenDate: chosenDate || '2025-01-15',
          chosenTime: chosenTime || '09:00'
        })
        break

      case 'confirmation-old':
        result = await sendMeetupConfirmation({
          to: to || 'test@example.com',
          participantName: inviteeName || 'Jane Smith',
          meetupTitle: meetupTitle || 'Test Coffee Meetup',
          meetupDate: meetupDate || '2025-01-15',
          meetupTime: chosenTime || '09:00',
          meetupLocation: cafeAddress || 'Test Address 123',
          cafeName: cafeName || 'Test Cafe',
          cafeAddress: cafeAddress || 'Test Address 123',
          otherParticipantName: organizerName || 'John Doe',
          otherParticipantEmail: to || 'organizer@example.com'
        })
        break

      case 'welcome':
        result = await sendWelcomeEmail({
          to: to || 'test@example.com',
          userName: 'Test User'
        })
        break

      case 'invite':
        result = await sendInviteEmail({
          to: to || 'test@example.com',
          cafe: {
            name: cafeName || 'Test Cafe',
            address: cafeAddress || 'Test Address 123',
            priceRange: 'MODERATE',
            rating: 4.5,
            openHours: '09:00-17:00'
          },
          dates: availableDates || ['2025-01-15', '2025-01-16'],
          times: availableTimes || ['09:00', '10:00'],
          token: 'test-token-123',
          inviteLink: 'https://anemi-meets.vercel.app/invite/test-token-123',
          organizerName: organizerName || 'John Doe'
        })
        break

      case 'calendar':
        result = await sendCalendarInvite({
          to: to || 'test@example.com',
          eventTitle: meetupTitle || 'Coffee Meetup',
          eventDescription: 'Coffee meetup with friends',
          eventLocation: cafeAddress || 'Test Address 123',
          eventStartTime: '2025-01-15T09:00:00Z',
          eventEndTime: '2025-01-15T10:00:00Z',
          attendeeName: inviteeName || 'Jane Smith'
        })
        break

      case 'reminder':
        result = await sendMeetupReminder(
          to || 'test@example.com',
          meetupTitle || 'Coffee Meetup',
          meetupDate || '2025-01-15',
          cafeAddress || 'Test Address 123'
        )
        break

      default:
        return NextResponse.json(
          { error: 'Invalid test type. Use: cancellation, confirmation, welcome, invite, calendar, or reminder' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: `${testType} email sent successfully`,
      testType,
      details: {
        to,
        meetupTitle,
        meetupDate,
        reason,
        organizerName,
        inviteeName,
        cafeName,
        cafeAddress
      },
      result
    })
  } catch (error) {
    console.error('❌ Email test failed:', error)
    return NextResponse.json(
      { 
        error: 'Email test failed',
        testType: 'unknown',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { sendMeetupConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { 
      meetupData,
      personA,
      personB
    } = await request.json()

    if (!meetupData || !personA || !personB) {
      return NextResponse.json({ 
        error: 'Meetup data and both participants are required' 
      }, { status: 400 })
    }

    // Send confirmation email to Person A
    await sendMeetupConfirmation({
      to: personA.email,
      participantName: personA.name,
      meetupTitle: meetupData.title,
      meetupDate: meetupData.date,
      meetupTime: meetupData.time,
      meetupLocation: meetupData.location,
      cafeName: meetupData.cafeName,
      cafeAddress: meetupData.cafeAddress,
      otherParticipantName: personB.name,
      otherParticipantEmail: personB.email
    })

    // Send confirmation email to Person B
    await sendMeetupConfirmation({
      to: personB.email,
      participantName: personB.name,
      meetupTitle: meetupData.title,
      meetupDate: meetupData.date,
      meetupTime: meetupData.time,
      meetupLocation: meetupData.location,
      cafeName: meetupData.cafeName,
      cafeAddress: meetupData.cafeAddress,
      otherParticipantName: personA.name,
      otherParticipantEmail: personA.email
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Meetup confirmation emails sent successfully' 
    })

  } catch (error) {
    console.error('Meetup confirmation error:', error)
    return NextResponse.json({ 
      error: 'Failed to send meetup confirmation emails' 
    }, { status: 500 })
  }
} 
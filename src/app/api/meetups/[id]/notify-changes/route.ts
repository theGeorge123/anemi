import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { changes, oldData } = body

    // Get the meetup with invitee info
    const meetup = await prisma.meetupInvite.findUnique({
      where: { id },
      include: {
        cafe: true
      }
    })

    if (!meetup || !meetup.inviteeEmail) {
      return NextResponse.json(
        { error: 'Meetup not found or no invitee email' },
        { status: 404 }
      )
    }

    // Create change notification email
    const changeSubject = `☕ Koffie meetup gewijzigd - ${meetup.cafe.name}`
    
    let changeDetails = ''
    let changeSummary = []
    
    if (changes.availableDates && JSON.stringify(changes.availableDates) !== JSON.stringify(oldData.availableDates)) {
      changeDetails += `📅 Nieuwe data: ${changes.availableDates.join(', ')}\n`
      changeSummary.push('data')
    }
    if (changes.availableTimes && JSON.stringify(changes.availableTimes) !== JSON.stringify(oldData.availableTimes)) {
      changeDetails += `⏰ Nieuwe tijden: ${changes.availableTimes.join(', ')}\n`
      changeSummary.push('tijden')
    }
    if (changes.organizerName && changes.organizerName !== oldData.organizerName) {
      changeDetails += `👤 Nieuwe organisator: ${changes.organizerName}\n`
      changeSummary.push('organisator')
    }

    const changeText = changeSummary.length > 0 
      ? `De ${changeSummary.join(', ')} zijn gewijzigd!` 
      : 'Er zijn wijzigingen aangebracht!'

    const emailContent = `
Hé ${meetup.inviteeName || 'daar'}! ☕

${meetup.organizerName} heeft de koffie meetup gewijzigd:

${changeDetails}

📍 Cafe: ${meetup.cafe.name}
📍 Adres: ${meetup.cafe.address}

${changeText} 

Wil je de nieuwe details bekijken en bevestigen?

🔗 Bekijk de gewijzigde uitnodiging:
${process.env.NEXT_PUBLIC_SITE_URL}/invite/${meetup.token}

Tot koffie! ☕✨

Met vriendelijke groet,
Het Anemi Meets team
    `.trim()

    // Send email using the email service
    try {
      await sendEmail({
        to: meetup.inviteeEmail,
        subject: changeSubject,
        html: emailContent.replace(/\n/g, '<br>')
      })
    } catch (emailError) {
      console.error('❌ Error sending change notification email:', emailError)
      // Don't fail the update, just log the error
      // In production, you might want to queue failed emails for retry
    }

    return NextResponse.json({
      message: 'Change notification sent successfully'
    })
  } catch (error) {
    console.error('Error sending change notification:', error)
    return NextResponse.json(
      { error: 'Failed to send change notification' },
      { status: 500 }
    )
  }
} 
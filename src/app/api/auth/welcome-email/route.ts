import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmailAfterVerification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email, userName } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await sendWelcomeEmailAfterVerification({
      to: email,
      userName: userName || email.split('@')[0]
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Welcome email sent successfully' 
    })

  } catch (error) {
    console.error('Welcome email error:', error)
    return NextResponse.json({ 
      error: 'Failed to send welcome email' 
    }, { status: 500 })
  }
} 
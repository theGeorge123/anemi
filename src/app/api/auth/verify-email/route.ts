import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Generate a simple verification token (you can make this more secure)
    const verificationToken = Buffer.from(`${email}-${Date.now()}`).toString('base64')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Send custom verification email
    const verificationHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">☕ Welcome to Anemi Meets!</h1>
          <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Your coffee adventure starts here</p>
        </div>
        
        <div style="padding: 40px 20px; background-color: #ffffff;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Verify Your Email</h2>
          
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            Hey there, coffee enthusiast! 🌟 We're so excited to have you join the Anemi Meets community. 
            To get started on your coffee adventure, please verify your email address.
          </p>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">What's waiting for you:</h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Discover amazing local coffee shops ☕</li>
              <li>Join meetups with fellow coffee lovers 👥</li>
              <li>Create your own coffee adventures 🗺️</li>
              <li>Connect with your coffee community 💫</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}" 
               style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 32px; 
                      text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;
                      box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.3); transition: all 0.3s ease;">
              ✨ Verify My Email ✨
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${siteUrl}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}" 
               style="color: #f59e0b; word-break: break-all;">
              ${siteUrl}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}
            </a>
          </p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            🚀 Ready to start your coffee journey?<br>
            <strong>The Anemi Meets Team</strong>
          </p>
          <div style="margin-top: 15px;">
            <a href="${siteUrl}" 
               style="color: #f59e0b; text-decoration: none; font-size: 14px;">
              Visit Anemi Meets
            </a>
          </div>
        </div>
      </div>
    `

    await sendEmail({
      to: email,
      subject: '☕ Welcome to Anemi Meets! Verify your email to start your coffee adventure',
      html: verificationHtml,
      from: process.env.EMAIL_FROM || 'hello@anemi-meets.com'
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Verification email sent successfully' 
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json({ 
      error: 'Failed to send verification email' 
    }, { status: 500 })
  }
} 
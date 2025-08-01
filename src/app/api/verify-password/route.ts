import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const correctPassword = process.env.SITE_ACCESS_PASSWORD

    if (!correctPassword) {
      console.error('❌ SITE_ACCESS_PASSWORD environment variable not set')
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 })
    }

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true })
      
      // Set a cookie that expires in 24 hours
      response.cookies.set('site-access', 'granted', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      })
      
      return response
    } else {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 })
    }
  } catch (error) {
    console.error('❌ Error in verify-password API:', error)
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}
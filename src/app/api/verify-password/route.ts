import { NextRequest, NextResponse } from 'next/server'

const CORRECT_PASSWORD = 'Lu0oriWkOz2hj48'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === CORRECT_PASSWORD) {
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
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}
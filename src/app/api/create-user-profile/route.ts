import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }
    // Create a UserProfile for the new user
    await prisma.userProfile.create({
      data: {
        userId,
        bio: '☕️ New to Anemi Meets! Ready for coffee adventures.',
        interests: [],
        skills: [],
      }
    })
    return NextResponse.json({ success: true, message: 'Profile created! Welcome to the coffee crew! 🎉' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create profile', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
} 
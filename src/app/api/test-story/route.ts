import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Create a test story
    const testStory = await prisma.story.create({
      data: {
        title: 'Mijn eerste Anemi coffee meeting',
        content: `Ik was nerveus voor mijn eerste coffee meeting via Anemi. Sarah en ik spraken af bij Coffee & Coconuts in Amsterdam. Het was een geweldige ervaring! We hebben uren gepraat over werk, reizen en onze passies. Wat ik het mooiste vond was hoe natuurlijk het voelde. Alsof we elkaar al jaren kenden.

We begonnen met een kopje koffie en eindigden met plannen voor een volgende ontmoeting. Het was geweldig om te zien hoe eenvoudig het was om via Anemi een echte connectie te maken.

Wat ik het meest waardevol vond was de authenticiteit van de ontmoeting. Geen geforceerde netwerkgesprekken, maar gewoon twee mensen die elkaar ontmoeten over een kopje koffie.`,
        excerpt: 'Een onvergetelijke ontmoeting in Amsterdam die bewijst dat echte connecties nog steeds mogelijk zijn',
        status: 'PUBLISHED',
        featured: false,
        viewCount: 0,
        likeCount: 0,
        images: [],
        tags: ['amsterdam', 'coffee', 'networking', 'eerste-keer', 'authenticiteit'],
        publishedAt: new Date(),
        authorId: 'eafe64b0-7c99-472d-96c8-35d7c47ce957' // Test user ID
      }
    })

    return NextResponse.json({
      success: true,
      story: testStory,
      message: 'Test story created successfully!'
    })
  } catch (error) {
    console.error('Error creating test story:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create test story'
    }, { status: 500 })
  }
} 
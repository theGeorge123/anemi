import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: storyId } = params

    // Check if story exists
    const story = await prisma.story.findFirst({
      where: {
        id: storyId,
        deletedAt: null
      }
    })

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    // Check if user already liked the story
    const existingLike = await prisma.storyLike.findUnique({
      where: {
        storyId_userId: {
          storyId,
          userId: user.id
        }
      }
    })

    if (existingLike) {
      return NextResponse.json(
        { error: 'Story already liked' },
        { status: 400 }
      )
    }

    // Create like and update story like count
    const [like] = await prisma.$transaction([
      prisma.storyLike.create({
        data: {
          storyId,
          userId: user.id
        }
      }),
      prisma.story.update({
        where: { id: storyId },
        data: {
          likeCount: {
            increment: 1
          }
        }
      })
    ])

    return NextResponse.json({
      success: true,
      like
    })

  } catch (error) {
    console.error('Error liking story:', error)
    return NextResponse.json(
      { error: 'Failed to like story' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: storyId } = params

    // Check if like exists
    const existingLike = await prisma.storyLike.findUnique({
      where: {
        storyId_userId: {
          storyId,
          userId: user.id
        }
      }
    })

    if (!existingLike) {
      return NextResponse.json(
        { error: 'Story not liked' },
        { status: 404 }
      )
    }

    // Remove like and update story like count
    await prisma.$transaction([
      prisma.storyLike.delete({
        where: {
          storyId_userId: {
            storyId,
            userId: user.id
          }
        }
      }),
      prisma.story.update({
        where: { id: storyId },
        data: {
          likeCount: {
            decrement: 1
          }
        }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Like removed successfully'
    })

  } catch (error) {
    console.error('Error unliking story:', error)
    return NextResponse.json(
      { error: 'Failed to unlike story' },
      { status: 500 }
    )
  }
} 
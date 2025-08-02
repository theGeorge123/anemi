import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const story = await prisma.story.findFirst({
      where: {
        id,
        deletedAt: null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            nickname: true,
            image: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.story.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      story
    })

  } catch (error) {
    console.error('Error fetching story:', error)
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const { id } = params
    const body = await request.json()

    // Check if user owns the story
    const existingStory = await prisma.story.findFirst({
      where: {
        id,
        authorId: user.id,
        deletedAt: null
      }
    })

    if (!existingStory) {
      return NextResponse.json(
        { error: 'Story not found or unauthorized' },
        { status: 404 }
      )
    }

    const {
      title,
      content,
      excerpt,
      images,
      tags,
      status,
      featured
    } = body

    const updateData: any = {}
    if (title) updateData.title = title
    if (content) updateData.content = content
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (images) updateData.images = images
    if (tags) updateData.tags = tags
    if (status) updateData.status = status
    if (featured !== undefined) updateData.featured = featured

    // Set publishedAt if status changes to PUBLISHED
    if (status === 'PUBLISHED' && existingStory.status !== 'PUBLISHED') {
      updateData.publishedAt = new Date()
    }

    const story = await prisma.story.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            nickname: true,
            image: true
          }
        },
        meetup: {
          select: {
            id: true,
            organizerName: true,
            cafe: {
              select: {
                name: true,
                city: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      story
    })

  } catch (error) {
    console.error('Error updating story:', error)
    return NextResponse.json(
      { error: 'Failed to update story' },
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

    const { id } = params

    // Check if user owns the story
    const existingStory = await prisma.story.findFirst({
      where: {
        id,
        authorId: user.id,
        deletedAt: null
      }
    })

    if (!existingStory) {
      return NextResponse.json(
        { error: 'Story not found or unauthorized' },
        { status: 404 }
      )
    }

    // Soft delete
    await prisma.story.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Story deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting story:', error)
    return NextResponse.json(
      { error: 'Failed to delete story' },
      { status: 500 }
    )
  }
} 
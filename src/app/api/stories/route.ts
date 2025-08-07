import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'PUBLISHED'
    const featured = searchParams.get('featured') === 'true'
    const tag = searchParams.get('tag')
    const authorId = searchParams.get('authorId')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      status: status as any,
      deletedAt: null
    }

    if (featured) {
      where.featured = true
    }

    if (tag) {
      where.tags = {
        has: tag
      }
    }

    if (authorId) {
      if (authorId === 'me') {
        // Get current user's stories
        const supabase = createRouteHandlerClient({ cookies })
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        }
        
        where.authorId = user.id
      } else {
        where.authorId = authorId
      }
    }

                    // Get stories with author info
                const stories = await prisma.story.findMany({
                  where,
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
                  },
                  orderBy: {
                    publishedAt: 'desc'
                  },
                  skip,
                  take: limit
                })

    // Get total count for pagination
    const total = await prisma.story.count({ where })

    return NextResponse.json({
      success: true,
      stories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      name,
      content,
      excerpt,
      images = [],
      tags = [],
      status = 'DRAFT'
    } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Create story
    const story = await prisma.story.create({
      data: {
        title,
        name: name || null,
        content,
        excerpt,
        images,
        tags,
        status: status as any,
        authorId: user.id,
        publishedAt: status === 'PUBLISHED' ? new Date() : null
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
        }
      }
    })

    return NextResponse.json({
      success: true,
      story
    })

  } catch (error) {
    console.error('Error creating story:', error)
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    )
  }
} 
'use client'

import { Suspense, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Coffee, Heart, MessageCircle, Eye, Calendar, MapPin, User, Share2, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/SupabaseProvider'

interface Story {
  id: string
  title: string
  excerpt?: string
  content: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featured: boolean
  viewCount: number
  likeCount: number
  images: string[]
  tags: string[]
  publishedAt?: string
  createdAt: string
  author: {
    id: string
    name: string
    nickname?: string
    image?: string
  }
  meetup?: {
    id: string
    organizerName: string
    cafe: {
      name: string
      city: string
    }
  }
  _count: {
    likes: number
    comments: number
  }
}

function StoryCard({ story }: { story: Story }) {
  const router = useRouter()
  const { user } = useSupabase()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(story._count.likes)
  const [viewCount, setViewCount] = useState(story.viewCount)

  const handleLike = async () => {
    if (!user) {
      alert('Je moet ingelogd zijn om een verhaal te liken')
      return
    }

    try {
      const response = await fetch(`/api/stories/${story.id}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
      } else {
        const errorData = await response.json()
        console.error('Failed to like/unlike story:', errorData)
        alert(errorData.error || 'Fout bij het liken van het verhaal')
      }
    } catch (error) {
      console.error('Error liking story:', error)
      alert('Er is een fout opgetreden bij het liken van het verhaal')
    }
  }

  const handleView = async () => {
    try {
      // Increment view count when story is viewed
      await fetch(`/api/stories/${story.id}`, {
        method: 'GET',
      })
      setViewCount(viewCount + 1)
    } catch (error) {
      console.error('Error viewing story:', error)
    }
  }

  const handleShare = async () => {
    const storyUrl = `${window.location.origin}/stories/${story.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.excerpt || 'Bekijk dit inspirerende coffee meeting verhaal!',
          url: storyUrl,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(storyUrl)
        alert('Link gekopieerd naar klembord!')
      } catch (error) {
        console.error('Error copying to clipboard:', error)
      }
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">
              <Link 
                href={`/stories/${story.id}`} 
                className="hover:text-amber-600 transition-colors"
                onClick={handleView}
              >
                {story.title}
              </Link>
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mb-3">
              {story.excerpt || story.content.substring(0, 150)}...
            </CardDescription>
          </div>
          {story.featured && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              ⭐ Featured
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{story.author.nickname || story.author.name}</span>
          </div>
          
          {story.meetup && (
            <div className="flex items-center gap-1">
              <Coffee className="w-4 h-4" />
              <span>{story.meetup.cafe.name}</span>
            </div>
          )}
          
          {story.publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(story.publishedAt).toLocaleDateString('nl-NL')}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{viewCount}</span>
            </div>
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                user 
                  ? 'hover:text-red-500 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              title={user ? 'Like dit verhaal' : 'Log in om te liken'}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{likeCount}</span>
            </button>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{story._count.comments}</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delen</span>
            </button>
          </div>
          
          <div className="flex gap-1">
            {story.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StoriesList() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        console.log('Fetching stories from API...')
        const response = await fetch('/api/stories?status=PUBLISHED&limit=20', {
          cache: 'no-store'
        })
        
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          console.error('API response not ok:', response.status, response.statusText)
          setError('Failed to fetch stories')
          return
        }
        
        const data = await response.json()
        console.log('Stories data:', data)
        setStories(data.stories || [])
      } catch (error) {
        console.error('Error fetching stories:', error)
        setError('Failed to fetch stories')
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Verhalen laden...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Tijdelijk niet beschikbaar</h3>
        <p className="text-gray-500 mb-6">
          Er is een probleem met het laden van de verhalen. Probeer het later opnieuw.
        </p>
        <Button asChild>
          <Link href="/stories/create">
            Schrijf je eerste verhaal
          </Link>
        </Button>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Nog geen verhalen</h3>
        <p className="text-gray-500 mb-6">
          Deel je eerste coffee meeting verhaal en inspireer anderen!
        </p>
        <Button asChild>
          <Link href="/stories/create">
            Schrijf je eerste verhaal
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  )
}

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Coffee className="w-10 h-10 text-amber-700" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Coffee Meeting Verhalen
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Ontdek inspirerende verhalen van echte ontmoetingen en deel je eigen ervaringen met de community
          </p>
          
          {/* Community Stats */}
          <div className="flex justify-center gap-8 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Community verhalen</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span>Gedeelde ervaringen</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span>Inspiratie voor anderen</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/stories/create">
                Deel je verhaal
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">
                Mijn Meetups
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Stories Grid */}
        <StoriesList />
      </div>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Coffee, Heart, MessageCircle, Eye, Calendar, MapPin, User, ArrowLeft, Send, Share2, Users, ThumbsUp, LogIn, Edit, Trash2, Save, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/SupabaseProvider'

interface Story {
  id: string
  title: string
  name?: string
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
 
  _count: {
    likes: number
    comments: number
  }
}

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    nickname?: string
    image?: string
  }
  parentId?: string
  replies?: Comment[]
}

export default function StoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useSupabase()
  const [story, setStory] = useState<Story | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [viewCount, setViewCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  
  // Edit functionality
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: '',
    name: '',
    content: '',
    excerpt: '',
    tags: [] as string[],
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED'
  })
  const [newTag, setNewTag] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/stories/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setStory(data.story)
          setLikeCount(data.story._count.likes)
          setViewCount(data.story.viewCount)
          
          // Initialize edit data
          setEditData({
            title: data.story.title,
            name: data.story.name || '',
            content: data.story.content,
            excerpt: data.story.excerpt || '',
            tags: data.story.tags,
            status: data.story.status
          })
        } else {
          console.error('Failed to fetch story')
        }
      } catch (error) {
        console.error('Error fetching story:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/stories/${params.id}/comments`)
        if (response.ok) {
          const data = await response.json()
          setComments(data.comments || [])
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      }
    }

    fetchStory()
    fetchComments()
  }, [params.id])

  const handleLike = async () => {
    if (!user) {
      alert('Je moet ingelogd zijn om een verhaal te liken')
      return
    }

    try {
      const response = await fetch(`/api/stories/${params.id}/like`, {
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

  const handleComment = async () => {
    if (!newComment.trim()) return

    if (!user) {
      alert('Je moet ingelogd zijn om een reactie te plaatsen')
      return
    }

    setSubmittingComment(true)
    try {
      const response = await fetch(`/api/stories/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments(prev => [data.comment, ...prev])
        setNewComment('')
      } else {
        const errorData = await response.json()
        console.error('Failed to post comment:', errorData)
        alert(errorData.error || 'Fout bij het plaatsen van reactie')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      alert('Er is een fout opgetreden bij het plaatsen van je reactie')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleShare = async () => {
    const storyUrl = `${window.location.origin}/stories/${params.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: story?.title || 'Coffee Meeting Verhaal',
          text: story?.excerpt || 'Bekijk dit inspirerende coffee meeting verhaal!',
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

  // Edit functionality
  const addTag = () => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim())) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSaveEdit = async () => {
    if (!story) return
    
    setSaving(true)
    try {
      const response = await fetch(`/api/stories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        const data = await response.json()
        setStory(data.story)
        setIsEditing(false)
        alert('Verhaal succesvol bijgewerkt!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Fout bij het bijwerken van het verhaal')
      }
    } catch (error) {
      console.error('Error updating story:', error)
      alert('Er is een fout opgetreden bij het bijwerken van het verhaal')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!story || !confirm('Weet je zeker dat je dit verhaal wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.')) {
      return
    }
    
    setDeleting(true)
    try {
      const response = await fetch(`/api/stories/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Verhaal succesvol verwijderd!')
        router.push('/stories')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Fout bij het verwijderen van het verhaal')
      }
    } catch (error) {
      console.error('Error deleting story:', error)
      alert('Er is een fout opgetreden bij het verwijderen van het verhaal')
    } finally {
      setDeleting(false)
    }
  }

  const isAuthor = user && story && user.id === story.author.id

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Verhaal laden...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Verhaal niet gevonden</h3>
            <p className="text-gray-500 mb-6">
              Het verhaal dat je zoekt bestaat niet meer.
            </p>
            <Button asChild>
              <Link href="/stories">
                Terug naar verhalen
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Buttons */}
        <div className="mb-6 flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar verhalen
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar Home
          </Button>
        </div>

        {/* Story Content */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={editData.title}
                      onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                      className="text-2xl font-bold"
                      placeholder="Titel van je verhaal"
                    />
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Naam van de persoon (optioneel)"
                    />
                    <Textarea
                      value={editData.excerpt}
                      onChange={(e) => setEditData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Korte samenvatting (optioneel)"
                      rows={2}
                    />
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-3xl mb-4">{story.title}</CardTitle>
                    {story.excerpt && (
                      <CardDescription className="text-lg mb-4">
                        {story.excerpt}
                      </CardDescription>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {story.featured && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    ⭐ Featured
                  </Badge>
                )}
                {isAuthor && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2"
                    >
                      {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                      {isEditing ? 'Annuleren' : 'Bewerken'}
                    </Button>
                    {isEditing && (
                      <Button
                        onClick={handleSaveEdit}
                        disabled={saving}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Opslaan...' : 'Opslaan'}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deleting ? 'Verwijderen...' : 'Verwijderen'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{story.author.nickname || story.author.name}</span>
              </div>
              
              {story.name && (
                <div className="flex items-center gap-1">
                  <Coffee className="w-4 h-4" />
                  <span>Over {story.name}</span>
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
            {isEditing ? (
              <div className="space-y-4">
                <Textarea
                  value={editData.content}
                  onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Vertel je verhaal..."
                  rows={12}
                  className="resize-none"
                />
                
                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Voeg een tag toe..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={editData.status === 'DRAFT' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEditData(prev => ({ ...prev, status: 'DRAFT' }))}
                    >
                      Concept
                    </Button>
                    <Button
                      type="button"
                      variant={editData.status === 'PUBLISHED' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEditData(prev => ({ ...prev, status: 'PUBLISHED' }))}
                    >
                      Gepubliceerd
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="prose prose-lg max-w-none mb-8">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {story.content}
                  </div>
                </div>
                
                {/* Tags */}
                {story.tags.length > 0 && (
                  <div className="flex gap-2 mb-6">
                    {story.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </>
            )}
            
            {/* Social Actions */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{viewCount} views</span>
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
                  <span>{likeCount} likes</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{comments.length} comments</span>
                </div>
              </div>
              
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Delen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Community Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <CardTitle>Community Reacties</CardTitle>
            </div>
            <CardDescription>
              Deel je gedachten en inspireer anderen met je reactie
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add Comment */}
            {user ? (
              <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                <Textarea
                  placeholder="Wat vind je van dit verhaal? Deel je gedachten..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">
                    💡 Je reactie helpt anderen om geïnspireerd te raken
                  </p>
                  <Button
                    onClick={handleComment}
                    disabled={submittingComment || !newComment.trim()}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {submittingComment ? 'Versturen...' : 'Reactie plaatsen'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <LogIn className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-800">Inloggen vereist</h4>
                </div>
                <p className="text-sm text-blue-700 mb-4">
                  Log in om je reactie te plaatsen en deel je gedachten met de community
                </p>
                <Button asChild size="sm">
                  <Link href="/auth/signin">
                    Inloggen om te reageren
                  </Link>
                </Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.author.nickname || comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('nl-NL')}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>Nog geen reacties. Wees de eerste om te reageren!</p>
                  <p className="text-sm mt-1">Je reactie inspireert anderen om ook hun verhalen te delen.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="text-center py-8">
            <ThumbsUp className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Vond je dit verhaal inspirerend?</h3>
            <p className="text-gray-600 mb-6">
              Deel je eigen coffee meeting ervaring en inspireer anderen in de community
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/stories/create">
                  Deel je verhaal
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/stories">
                  Meer verhalen
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
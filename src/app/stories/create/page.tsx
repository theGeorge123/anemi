'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coffee, Save, Eye, X, Plus, ArrowLeft, Users, Heart, Share2, Lightbulb, User } from 'lucide-react'
import { useSupabase } from '@/components/SupabaseProvider'



export default function CreateStoryPage() {
  const router = useRouter()
  const { user } = useSupabase()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    content: '',
    excerpt: '',
    tags: [] as string[],
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED'
  })
  
  const [newTag, setNewTag] = useState('')

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('Je moet ingelogd zijn om een verhaal te schrijven')
      return
    }
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Titel en inhoud zijn verplicht')
      return
    }
    
    setSaving(true)
    
    try {
      console.log('Submitting story with data:', formData)
      
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.status === 'PUBLISHED' ? new Date().toISOString() : null
        })
      })
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Story created successfully:', data)
        alert('Verhaal succesvol opgeslagen!')
        router.push(`/stories/${data.story.id}`)
      } else {
        const error = await response.json()
        console.error('API error:', error)
        alert(`Fout bij het opslaan: ${error.error || 'Onbekende fout'}`)
      }
    } catch (error) {
      console.error('Error submitting story:', error)
      alert('Er is een fout opgetreden bij het opslaan van je verhaal')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Inloggen vereist</h2>
              <p className="text-gray-600 mb-6">
                Je moet ingelogd zijn om een verhaal te schrijven
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild>
                  <a href="/auth/signin">Inloggen</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/">Terug naar Home</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Back to Home Button */}
          <div className="flex justify-start mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar Home
            </Button>
          </div>
          
          <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Coffee className="w-8 h-8 text-amber-700" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Deel je Coffee Meeting Verhaal
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Inspireer anderen met je ervaring en help de community groeien
          </p>
          
          {/* Community Benefits */}
          <div className="flex justify-center gap-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <span>Community</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-amber-600" />
              <span>Inspiratie</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-amber-600" />
              <span>Delen</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                    Verhaal Titel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="text"
                    placeholder="Bijv: 'Mijn onvergetelijke ontmoeting in Amsterdam'"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="text-lg"
                    required
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Maak een pakkende titel die anderen inspireert om je verhaal te lezen
                  </p>
                </CardContent>
              </Card>

              {/* Name */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-600" />
                    Naam van de Persoon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="text"
                    placeholder="Bijv: 'Sarah' of 'Mijn collega'"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Optioneel: de naam van de persoon uit je verhaal
                  </p>
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Je Verhaal</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Vertel over je coffee meeting ervaring... Wat maakte het speciaal? Wat heb je geleerd? Hoe voelde je je na de ontmoeting?"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className="resize-none"
                    required
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Deel je authentieke ervaring. Wat maakte deze ontmoeting bijzonder?
                  </p>
                </CardContent>
              </Card>

              {/* Excerpt */}
              <Card>
                <CardHeader>
                  <CardTitle>Korte Samenvatting</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Een korte samenvatting van je verhaal (optioneel)"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Dit wordt getoond in het overzicht van verhalen
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
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
                    
                    <p className="text-xs text-gray-600">
                      Tags helpen anderen om je verhaal te vinden
                    </p>
                  </div>
                </CardContent>
              </Card>

              

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Publiceren</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="w-full"
                      onClick={() => setFormData(prev => ({ ...prev, status: 'DRAFT' }))}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Opslaan...' : 'Concept Opslaan'}
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                      onClick={() => setFormData(prev => ({ ...prev, status: 'PUBLISHED' }))}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {saving ? 'Publiceren...' : 'Verhaal Publiceren'}
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPreview(!preview)}
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {preview ? 'Bewerken' : 'Preview'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        {/* Preview */}
        {preview && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <h2 className="text-2xl font-bold mb-4">{formData.title || 'Titel'}</h2>
                {formData.excerpt && (
                  <p className="text-gray-600 mb-4">{formData.excerpt}</p>
                )}
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{formData.content || 'Inhoud'}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Calendar, Clock, Trash2, Save, AlertTriangle, Coffee, MapPin, Users } from 'lucide-react'

interface MeetupData {
  id: string
  token: string
  organizerName: string
  organizerEmail: string
  status: string
  availableDates: string[]
  availableTimes: string[]
  chosenDate?: string
  inviteeName?: string
  inviteeEmail?: string
  cafe: {
    id: string
    name: string
    address: string
    city: string
  }
}

interface EditMeetupModalProps {
  isOpen: boolean
  onClose: () => void
  meetup: MeetupData | null
  onSave: (meetupId: string, updates: any) => Promise<void>
  onDelete: (meetupId: string) => Promise<void>
}

export function EditMeetupModal({ isOpen, onClose, meetup, onSave, onDelete }: EditMeetupModalProps) {
  const [organizerName, setOrganizerName] = useState('')
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Initialize form data when meetup changes
  useEffect(() => {
    if (meetup) {
      setOrganizerName(meetup.organizerName)
      setAvailableDates(meetup.availableDates)
      setAvailableTimes(meetup.availableTimes)
      setError(null)
    }
  }, [meetup])

  const handleSave = async () => {
    if (!meetup) return

    if (!organizerName.trim()) {
      setError('Hé! Vul even je naam in ☕')
      return
    }

    if (availableDates.length === 0) {
      setError('Oeps! Kies minimaal één leuke datum 📅')
      return
    }

    if (availableTimes.length === 0) {
      setError('Hey! Kies minimaal één gezellige tijd ⏰')
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      
      await onSave(meetup.id, {
        organizerName: organizerName.trim(),
        availableDates,
        availableTimes
      })

      onClose()
    } catch (err) {
      setError('Hmm, er ging iets mis! Probeer het nog een keer 😅')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!meetup) return

    try {
      setIsDeleting(true)
      setError(null)
      
      await onDelete(meetup.id)
      onClose()
    } catch (err) {
      setError('Oeps! Kon de meetup niet verwijderen. Probeer het nog een keer!')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const addDate = () => {
    const today = new Date()
    const currentDates = availableDates || []
    const newDate = new Date(today.getTime() + (currentDates.length + 1) * 24 * 60 * 60 * 1000)
    const dateString = newDate.toISOString().split('T')[0] || ''
    setAvailableDates([...currentDates, dateString])
  }

  const removeDate = (index: number) => {
    const currentDates = availableDates || []
    setAvailableDates(currentDates.filter((_, i) => i !== index))
  }

  const addTime = () => {
    const currentTimes = availableTimes || []
    const newTime = '14:00'
    setAvailableTimes([...currentTimes, newTime])
  }

  const removeTime = (index: number) => {
    const currentTimes = availableTimes || []
    setAvailableTimes(currentTimes.filter((_, i) => i !== index))
  }

  const updateDate = (index: number, value: string) => {
    const currentDates = availableDates || []
    const newDates = [...currentDates]
    newDates[index] = value || ''
    setAvailableDates(newDates)
  }

  const updateTime = (index: number, value: string) => {
    const currentTimes = availableTimes || []
    const newTimes = [...currentTimes]
    newTimes[index] = value || ''
    setAvailableTimes(newTimes)
  }

  if (!isOpen || !meetup) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader className="flex items-center justify-between bg-gradient-to-r from-amber-100 to-orange-100 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
              <Coffee className="w-5 h-5 text-amber-700" />
            </div>
            <CardTitle className="text-xl font-bold text-amber-800">✏️ Meetup Bewerken</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-amber-200">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">😅</span>
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Cafe Info */}
          <div className="bg-white border border-amber-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <Coffee className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900">☕ Cafe</h3>
            </div>
            <p className="text-gray-700 font-medium">{meetup.cafe.name}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{meetup.cafe.address}, {meetup.cafe.city}</span>
            </div>
          </div>

          {/* Organizer Name */}
          <div className="bg-white border border-amber-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <Label htmlFor="organizerName" className="font-semibold text-gray-900">👤 Jouw naam</Label>
            </div>
            <Input
              id="organizerName"
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              placeholder="Hoe mogen we je noemen?"
              className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          {/* Available Dates */}
          <div className="bg-white border border-amber-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <Label className="font-semibold text-gray-900">📅 Beschikbare data</Label>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addDate}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                + Datum toevoegen
              </Button>
            </div>
            
            <div className="space-y-3">
              {availableDates.map((date, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Input
                    type="date"
                    value={date || ''}
                    onChange={(e) => updateDate(index, e.target.value)}
                    className="flex-1 border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDate(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {availableDates.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <span className="text-lg">📅</span>
                  <p className="text-sm">Nog geen data gekozen</p>
                </div>
              )}
            </div>
          </div>

          {/* Available Times */}
          <div className="bg-white border border-amber-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <Label className="font-semibold text-gray-900">⏰ Beschikbare tijden</Label>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addTime}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                + Tijd toevoegen
              </Button>
            </div>
            
            <div className="space-y-3">
              {availableTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Input
                    type="time"
                    value={time || ''}
                    onChange={(e) => updateTime(index, e.target.value)}
                    className="flex-1 border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTime(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {availableTimes.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <span className="text-lg">⏰</span>
                  <p className="text-sm">Nog geen tijden gekozen</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Info */}
          {meetup.status !== 'pending' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 text-blue-800">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-medium">Hey! Let op:</span>
                  <p className="text-blue-700 text-sm mt-1">
                    Deze meetup is al {meetup.status === 'confirmed' ? 'bevestigd' : 'afgewezen'}. 
                    Wijzigingen kunnen impact hebben op de afspraak! 🤔
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving || isDeleting}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Opslaan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  💾 Opslaan
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSaving || isDeleting}
              className="border-red-300 text-red-600 hover:bg-red-50 font-semibold"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              🗑️ Verwijderen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <Card className="w-full max-w-md border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
            <CardHeader className="bg-gradient-to-r from-red-100 to-pink-100 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                  <span className="text-xl">⚠️</span>
                </div>
                <CardTitle className="text-lg font-bold text-red-700">Meetup Verwijderen</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="text-center">
                <span className="text-4xl mb-3 block">😱</span>
                <p className="text-gray-700 font-medium">
                  Weet je zeker dat je deze meetup wilt verwijderen?
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Deze actie kan niet ongedaan worden gemaakt! 🚨
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 font-semibold"
                >
                  {isDeleting ? 'Verwijderen...' : '😢 Ja, verwijderen'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  😅 Annuleren
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 
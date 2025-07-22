"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Calendar, Clock, Trash2, Save, AlertTriangle } from 'lucide-react'

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
      setError('Vul je naam in')
      return
    }

    if (availableDates.length === 0) {
      setError('Selecteer minimaal één datum')
      return
    }

    if (availableTimes.length === 0) {
      setError('Selecteer minimaal één tijd')
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
      setError('Kon meetup niet opslaan. Probeer het opnieuw.')
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
      setError('Kon meetup niet verwijderen. Probeer het opnieuw.')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const addDate = () => {
    const today = new Date()
    const newDate = new Date(today.getTime() + (availableDates.length + 1) * 24 * 60 * 60 * 1000)
    const dateString = newDate.toISOString().split('T')[0]
    setAvailableDates([...availableDates, dateString])
  }

  const removeDate = (index: number) => {
    setAvailableDates(availableDates.filter((_, i) => i !== index))
  }

  const addTime = () => {
    const newTime = '14:00'
    setAvailableTimes([...availableTimes, newTime])
  }

  const removeTime = (index: number) => {
    setAvailableTimes(availableTimes.filter((_, i) => i !== index))
  }

  const updateDate = (index: number, value: string) => {
    const newDates = [...availableDates]
    newDates[index] = value || ''
    setAvailableDates(newDates)
  }

  const updateTime = (index: number, value: string) => {
    const newTimes = [...availableTimes]
    newTimes[index] = value || ''
    setAvailableTimes(newTimes)
  }

  if (!isOpen || !meetup) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">✏️ Meetup Bewerken</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Cafe Info */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">☕ Cafe</h3>
            <p className="text-gray-700">{meetup.cafe.name}</p>
            <p className="text-sm text-gray-600">{meetup.cafe.address}, {meetup.cafe.city}</p>
          </div>

          {/* Organizer Name */}
          <div>
            <Label htmlFor="organizerName">Jouw naam</Label>
            <Input
              id="organizerName"
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              placeholder="Jouw naam"
              className="mt-1"
            />
          </div>

          {/* Available Dates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Beschikbare data
              </Label>
              <Button variant="outline" size="sm" onClick={addDate}>
                + Datum toevoegen
              </Button>
            </div>
            
            <div className="space-y-2">
              {availableDates.map((date, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={date || ''}
                    onChange={(e) => updateDate(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDate(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Available Times */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Beschikbare tijden
              </Label>
              <Button variant="outline" size="sm" onClick={addTime}>
                + Tijd toevoegen
              </Button>
            </div>
            
            <div className="space-y-2">
              {availableTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={time || ''}
                    onChange={(e) => updateTime(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTime(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Status Info */}
          {meetup.status !== 'pending' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Let op:</span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                Deze meetup is al {meetup.status === 'confirmed' ? 'bevestigd' : 'afgewezen'}. 
                Wijzigingen kunnen impact hebben op de afspraak.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving || isDeleting}
              className="flex-1 bg-amber-500 hover:bg-amber-600"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Opslaan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Opslaan
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSaving || isDeleting}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Verwijderen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-red-600">⚠️ Meetup Verwijderen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Weet je zeker dat je deze meetup wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
              </p>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  {isDeleting ? 'Verwijderen...' : 'Ja, verwijderen'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  Annuleren
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 
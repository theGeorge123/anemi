"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface DeclineModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  isDeclining: boolean
}

export function DeclineModal({ isOpen, onClose, onConfirm, isDeclining }: DeclineModalProps) {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    onConfirm(reason)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">😔</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Zeker dat je wilt afwijzen?</h3>
            <p className="text-gray-600">We begrijpen het! Misschien een andere keer?</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reason" className="text-sm text-gray-600">
                Reden (optioneel):
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                placeholder="Bijv. geen tijd, al andere plannen, etc..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Een reden is niet verplicht, maar helpt de organizer om 
                toekomstige meetups beter te plannen!
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isDeclining}
            >
              Annuleren
            </Button>
            
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeclining}
            >
              {isDeclining ? 'Afwijzen...' : 'Ja, afwijzen'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
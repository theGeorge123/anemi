"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, MessageCircle, Calendar, X } from 'lucide-react'

interface InviteModalProps {
  inviteCode: string
  isOpen: boolean
  onClose: () => void
}

export function InviteModal({ inviteCode, isOpen, onClose }: InviteModalProps) {
  const [copied, setCopied] = useState(false)
  
  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/invite/${inviteCode}` : ''
  const whatsappMessage = `Hey! ☕ Ik heb een koffie meetup gemaakt via Anemi Meets! 

Wil je meedoen? Klik op deze link om je voorkeuren in te vullen:
${inviteUrl}

Tot koffie! ☕`
  
  // Try multiple WhatsApp URL formats for better compatibility
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`
  const whatsappUrlFallback = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleWhatsAppShare = () => {
    if (typeof window !== 'undefined') {
      try {
        // Check if we're on mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        
        // Try the primary WhatsApp URL first
        const whatsappWindow = window.open(whatsappUrl, '_blank')
        
        // If the window didn't open, try the fallback URL
        if (!whatsappWindow || whatsappWindow.closed) {
          setTimeout(() => {
            window.open(whatsappUrlFallback, '_blank')
          }, 100)
        }
      } catch (error) {
        console.error('Error opening WhatsApp:', error)
        // Fallback: copy the message to clipboard
        try {
          navigator.clipboard.writeText(whatsappMessage).then(() => {
            alert('✅ WhatsApp bericht gekopieerd naar klembord! Je kunt het nu handmatig delen.')
          }).catch(() => {
            alert('📋 Kopieer deze link handmatig: ' + inviteUrl)
          })
        } catch (clipboardError) {
          alert('📋 Kopieer deze link handmatig: ' + inviteUrl)
        }
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <Card className="w-full max-w-md sm:max-w-lg shadow-2xl animate-bounceIn max-h-[90vh] overflow-y-auto">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl">🎉</span>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              Je Meetup is Klaar!
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Deel je uitnodiging met vrienden via WhatsApp of kopieer de link
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Invite Link */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">🔗 Invite Link</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="flex-1 bg-white px-2 sm:px-3 py-2 rounded border text-xs sm:text-sm min-h-[44px]"
                />
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="outline"
                  className="shrink-0 min-h-[44px] min-w-[44px] touch-target"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">{copied ? 'Gekopieerd!' : 'Kopieer'}</span>
                  <span className="sm:hidden">{copied ? '✓' : '📋'}</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Button
                onClick={handleWhatsAppShare}
                className="w-full bg-green-500 hover:bg-green-600 text-white h-10 sm:h-auto transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">📱 Deel via WhatsApp</span>
                <span className="sm:hidden">📱 WhatsApp</span>
              </Button>
              
              <Button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(inviteUrl, '_blank')
                  }
                }}
                variant="outline"
                className="w-full h-10 sm:h-auto"
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Bekijk invite pagina</span>
                <span className="sm:hidden">Bekijk</span>
              </Button>
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs sm:text-sm text-blue-800 mb-2">
                <strong>💡 Tip</strong>
              </p>
              <p className="text-xs text-blue-700">
                Deel de link via WhatsApp voor de beste ervaring. Je vrienden kunnen direct reageren op de uitnodiging!
              </p>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 sm:mt-8 text-center">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <X className="w-4 h-4 mr-2" />
              Sluiten
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
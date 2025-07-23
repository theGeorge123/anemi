"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Share2, MessageCircle, Calendar } from 'lucide-react'

interface InviteModalProps {
  inviteCode: string
  isOpen: boolean
  onClose: () => void
}

export function InviteModal({ inviteCode, isOpen, onClose }: InviteModalProps) {
  const [copied, setCopied] = useState(false)
  
  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/invite/${inviteCode}` : ''
  const whatsappMessage = `Hey! ☕ Ik heb een meetup gemaakt via Anemi. Wil je meedoen? Hier is de link: ${inviteUrl}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`

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
      window.open(whatsappUrl, '_blank')
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
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Je meetup is klaar!</h3>
            <p className="text-sm sm:text-base text-gray-600">Deel deze link met je vrienden ☕</p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">📋 Invite Code:</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <code className="flex-1 bg-white px-2 sm:px-3 py-2 rounded border font-mono text-xs sm:text-sm break-all">
                  {inviteCode}
                </code>
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="outline"
                  className="shrink-0 h-8 sm:h-auto"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">{copied ? 'Gekopieerd!' : 'Kopieer'}</span>
                  <span className="sm:hidden">{copied ? '✓' : '📋'}</span>
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">🔗 Volledige link:</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="flex-1 bg-white px-2 sm:px-3 py-2 rounded border text-xs sm:text-sm"
                />
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="outline"
                  className="shrink-0 h-8 sm:h-auto"
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
                className="w-full bg-green-500 hover:bg-green-600 text-white h-10 sm:h-auto"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Deel via WhatsApp</span>
                <span className="sm:hidden">WhatsApp</span>
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-blue-800">
                <strong>💡 Tip:</strong> Deel deze link met je vrienden via WhatsApp, 
                email of gewoon kopieer de link. Ze kunnen dan hun voorkeuren invullen!
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full h-10 sm:h-auto"
            >
              Sluiten
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-2xl animate-bounceIn">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Je meetup is klaar!</h3>
            <p className="text-gray-600">Deel deze link met je vrienden ☕</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-600 mb-2">📋 Invite Code:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white px-3 py-2 rounded border font-mono text-sm">
                  {inviteCode}
                </code>
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copied ? 'Gekopieerd!' : 'Kopieer'}
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-600 mb-2">🔗 Volledige link:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="flex-1 bg-white px-3 py-2 rounded border text-sm"
                />
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copied ? 'Gekopieerd!' : 'Kopieer'}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleWhatsAppShare}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Deel via WhatsApp
              </Button>
              
              <Button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(inviteUrl, '_blank')
                  }
                }}
                variant="outline"
                className="w-full"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Bekijk invite pagina
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Deel deze link met je vrienden via WhatsApp, 
                email of gewoon kopieer de link. Ze kunnen dan hun voorkeuren invullen!
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Sluiten
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
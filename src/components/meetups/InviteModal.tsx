"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Share2, MessageCircle, Calendar, Mail, Plus, X } from 'lucide-react'

interface InviteModalProps {
  inviteCode: string
  isOpen: boolean
  onClose: () => void
}

export function InviteModal({ inviteCode, isOpen, onClose }: InviteModalProps) {
  const [copied, setCopied] = useState(false)
  const [showEmailSection, setShowEmailSection] = useState(false)
  const [email, setEmail] = useState<string>('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  
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

  const sendInviteEmail = async () => {
    if (!email.trim() || !email.includes('@')) return

    setSendingEmail(true)
    try {
      const response = await fetch('/api/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteCode,
          email: email.trim(),
        }),
      })

      const responseData = await response.json()

      if (response.ok) {
        setEmailSent(true)
        setEmail('') // Clear the email input
        setTimeout(() => setEmailSent(false), 3000)
      } else {
        // Show specific error message
        console.error('Failed to send email:', responseData)
        throw new Error(responseData.message || responseData.error || 'Failed to send email')
      }
    } catch (error) {
      console.error('Error sending invite email:', error)
      // You could add a proper error state here if needed
      alert(`Fout bij het versturen van email: ${error instanceof Error ? error.message : 'Onbekende fout'}`)
    } finally {
      setSendingEmail(false)
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
                  className="shrink-0 min-h-[44px] min-w-[44px] touch-target"
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
                onClick={() => setShowEmailSection(!showEmailSection)}
                variant="outline"
                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <Mail className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Verstuur via Email</span>
                <span className="sm:hidden">Email</span>
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

            {/* Email Section */}
            {showEmailSection && (
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-blue-800 mb-2">
                    <strong>📧 Nieuwe single email functie</strong>
                  </p>
                  <p className="text-xs text-blue-700">
                    Je kunt nu <strong>één email</strong> per keer versturen. Dit zorgt voor betere deliverability en eenvoudiger beheer.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium">📧 Email Adres</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="email"
                      placeholder="vriend@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && email.trim() && email.includes('@')) {
                          sendInviteEmail()
                        }
                      }}
                    />
                    <Button
                      onClick={sendInviteEmail}
                      disabled={sendingEmail || !email.trim() || !email.includes('@')}
                      className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
                    >
                      {sendingEmail ? '📧 Versturen...' : '📧 Verstuur'}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Druk op Enter of klik op verstuur om de uitnodiging te verzenden
                  </p>
                </div>

                {emailSent && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm">✅ Uitnodiging succesvol verzonden!</p>
                  </div>
                )}
              </div>
            )}

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
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, Share2, Copy, QrCode, MessageCircle, 
  Mail, Smartphone, Link as LinkIcon, Plus, X,
  CheckCircle, Clock, Calendar
} from 'lucide-react'

interface EnhancedInviteCreatorProps {
  meetupToken: string
  meetupTitle: string
  cafeName: string
  cafeCity: string
  availableDates: string[]
  availableTimes: string[]
  onInviteSent?: () => void
}

interface Invitee {
  id: number
  name: string
  email: string
  method: 'email' | 'whatsapp' | 'link' | 'qr'
  status: 'pending' | 'sent' | 'error'
  sentAt?: string
}

export default function EnhancedInviteCreator({ meetupToken, meetupTitle, cafeName, cafeCity, availableDates, availableTimes, onInviteSent }: EnhancedInviteCreatorProps) {
  const [invitees, setInvitees] = useState<Invitee[]>([])
  const [newInvitee, setNewInvitee] = useState({ name: '', email: '' })
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'whatsapp' | 'link' | 'qr'>('email')
  const [isSending, setIsSending] = useState(false)

  const getInviteLink = () => {
    return `${window.location.origin}/invite/${meetupToken}`
  }

  const getWhatsAppMessage = () => {
    return encodeURIComponent(`Hé! Ik nodig je uit voor een koffie meetup bij ${cafeName} in ${cafeCity}!\n\n${getInviteLink()}`)
  }

  const addInvitee = () => {
    if (newInvitee.name.trim() && newInvitee.email.trim()) {
      setInvitees([...invitees, { ...newInvitee, id: Date.now(), status: 'pending', method: selectedMethod, sentAt: new Date().toISOString() }])
      setNewInvitee({ name: '', email: '' })
    }
  }

  const removeInvitee = (id: number) => {
    setInvitees(invitees.filter(invitee => invitee.id !== id))
  }

  const sendInvite = async (invitee: Invitee) => {
    setIsSending(true)
    try {
      const response = await fetch('/api/send-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: invitee.email,
          name: invitee.name,
          meetupToken,
          meetupTitle,
          cafeName,
          cafeCity
        })
      })

      if (response.ok) {
        updateInviteeStatus(invitee.id, 'sent')
        if (onInviteSent) onInviteSent()
      } else {
        updateInviteeStatus(invitee.id, 'error')
      }
    } catch (error) {
      updateInviteeStatus(invitee.id, 'error')
    } finally {
      setIsSending(false)
    }
  }

  const updateInviteeStatus = (id: number, status: 'pending' | 'sent' | 'error') => {
    setInvitees(invitees.map(invitee => 
      invitee.id === id ? { ...invitee, status } : invitee
    ))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: meetupTitle,
          text: `Ik nodig je uit voor een koffie meetup bij ${cafeName} in ${cafeCity}!`,
          url: getInviteLink()
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      copyToClipboard(getInviteLink())
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-green-600" />
      case 'error': return <X className="w-4 h-4 xs:w-5 xs:h-5 text-red-600" />
      default: return <Clock className="w-4 h-4 xs:w-5 xs:h-5 text-yellow-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Verzonden'
      case 'error': return 'Fout'
      default: return 'In afwachting'
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Quick Share Options */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-amber-800 text-lg xs:text-xl sm:text-2xl lg:text-3xl">
            <Share2 className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
            Snel Delen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            <Button 
              variant="outline" 
              onClick={() => copyToClipboard(getInviteLink())} 
              className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs xs:text-sm px-3 sm:px-4 py-2 sm:py-3 w-full"
            >
              <Copy className="w-4 h-4 xs:w-5 xs:h-5 mr-1 sm:mr-2" />
              Link Kopiëren
            </Button>
            <Button 
              variant="outline" 
              onClick={shareInvite} 
              className="border-green-300 text-green-700 hover:bg-green-50 text-xs xs:text-sm px-3 sm:px-4 py-2 sm:py-3 w-full"
            >
              <Share2 className="w-4 h-4 xs:w-5 xs:h-5 mr-1 sm:mr-2" />
              Delen
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open(`https://wa.me/?text=${getWhatsAppMessage()}`, '_blank')} 
              className="border-green-300 text-green-700 hover:bg-green-50 text-xs xs:text-sm px-3 sm:px-4 py-2 sm:py-3 w-full"
            >
              <MessageCircle className="w-4 h-4 xs:w-5 xs:h-5 mr-1 sm:mr-2" />
              WhatsApp
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open(`mailto:?subject=${encodeURIComponent(meetupTitle)}&body=${encodeURIComponent(`Ik nodig je uit voor een koffie meetup bij ${cafeName} in ${cafeCity}!\n\n${getInviteLink()}`)}`, '_blank')} 
              className="border-purple-300 text-purple-700 hover:bg-purple-50 text-xs xs:text-sm px-3 sm:px-4 py-2 sm:py-3 w-full"
            >
              <Mail className="w-4 h-4 xs:w-5 xs:h-5 mr-1 sm:mr-2" />
              Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Invites */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-lg xs:text-xl sm:text-2xl lg:text-3xl">
            <Users className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
            Persoonlijke Uitnodigingen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Add New Invitee */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <Input
              placeholder="Naam"
              value={newInvitee.name}
              onChange={(e) => setNewInvitee({ ...newInvitee, name: e.target.value })}
              className="flex-1 text-sm xs:text-base"
            />
            <Input
              placeholder="Email"
              type="email"
              value={newInvitee.email}
              onChange={(e) => setNewInvitee({ ...newInvitee, email: e.target.value })}
              className="flex-1 text-sm xs:text-base"
            />
            <div className="flex gap-2 sm:gap-3">
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value as any)}
                className="text-xs xs:text-sm px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md bg-white"
              >
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="link">Link</option>
              </select>
              <Button 
                onClick={addInvitee} 
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-xs xs:text-sm px-3 sm:px-4 py-2 sm:py-3"
              >
                <Plus className="w-4 h-4 xs:w-5 xs:h-5 mr-1" />
                Toevoegen
              </Button>
            </div>
          </div>

          {/* Invitees List */}
          {invitees.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-medium text-gray-900 text-sm xs:text-base sm:text-lg">Uitnodigingen ({invitees.length})</h4>
              {invitees.map((invitee) => (
                <div key={invitee.id} className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="font-medium text-sm xs:text-base text-gray-900">{invitee.name}</div>
                    <div className="text-xs xs:text-sm text-gray-600">{invitee.email}</div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1 text-xs xs:text-sm">
                      {getStatusIcon(invitee.status)}
                      <span className="text-gray-600">{getStatusText(invitee.status)}</span>
                    </div>
                    <Button
                      onClick={() => sendInvite(invitee)}
                      disabled={isSending || invitee.status === 'sent'}
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-xs xs:text-sm px-2 sm:px-3 py-1 sm:py-2"
                    >
                      {invitee.status === 'sent' ? 'Verzonden' : 'Verstuur'}
                    </Button>
                    <Button
                      onClick={() => removeInvitee(invitee.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50 text-xs xs:text-sm px-2 sm:px-3 py-1 sm:py-2"
                    >
                      <X className="w-3 h-3 xs:w-4 xs:h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {invitees.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <Users className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 text-gray-300" />
              <p className="text-sm xs:text-base sm:text-lg">Nog geen uitnodigingen toegevoegd</p>
              <p className="text-xs xs:text-sm text-gray-400 mt-1">Voeg mensen toe om ze uit te nodigen</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Link Display */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-lg xs:text-xl sm:text-2xl lg:text-3xl">
            <LinkIcon className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
            Uitnodigingslink
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm xs:text-base text-gray-600">Deel deze link met mensen die je wilt uitnodigen:</p>
            <div className="flex items-center gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg border">
              <Input 
                value={getInviteLink()} 
                readOnly 
                className="flex-1 text-xs xs:text-sm font-mono" 
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(getInviteLink())} 
                className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs xs:text-sm px-3 sm:px-4 py-2 sm:py-3"
              >
                <Copy className="w-4 h-4 xs:w-5 xs:h-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs xs:text-sm text-gray-500">
              <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4" />
              <span>Deze link werkt voor iedereen die je hem stuurt</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

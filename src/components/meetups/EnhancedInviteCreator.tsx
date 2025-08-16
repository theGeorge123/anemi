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
  id: string
  name: string
  email: string
  method: 'email' | 'whatsapp' | 'link' | 'qr'
  status: 'pending' | 'sent' | 'sent-failed'
}

export default function EnhancedInviteCreator({
  meetupToken,
  meetupTitle,
  cafeName,
  cafeCity,
  availableDates,
  availableTimes,
  onInviteSent
}: EnhancedInviteCreatorProps) {
  const [invitees, setInvitees] = useState<Invitee[]>([])
  const [newInvitee, setNewInvitee] = useState({ name: '', email: '' })
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'whatsapp' | 'link' | 'qr'>('email')
  const [isSending, setIsSending] = useState(false)

  const getInviteLink = () => {
    return `${window.location.origin}/invite/${meetupToken}`
  }

  const getWhatsAppMessage = () => {
    const message = `☕ ${meetupTitle} bij ${cafeName} in ${cafeCity}!\n\n` +
      `Ik nodig je uit voor een koffie meetup. ` +
      `Klik op de link om je voorkeuren door te geven:\n\n` +
      `${getInviteLink()}`
    
    return encodeURIComponent(message)
  }

  const addInvitee = () => {
    if (!newInvitee.name.trim() || !newInvitee.email.trim()) return

    const invitee: Invitee = {
      id: Date.now().toString(),
      name: newInvitee.name.trim(),
      email: newInvitee.email.trim(),
      method: selectedMethod,
      status: 'pending'
    }

    setInvitees([...invitees, invitee])
    setNewInvitee({ name: '', email: '' })
  }

  const removeInvitee = (id: string) => {
    setInvitees(invitees.filter(i => i.id !== id))
  }

  const sendInvite = async (invitee: Invitee) => {
    setIsSending(true)
    
    try {
      if (invitee.method === 'email') {
        // Send email invite
        const response = await fetch('/api/send-invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: invitee.email,
            name: invitee.name,
            meetupToken,
            method: 'email'
          })
        })
        
        if (response.ok) {
          updateInviteeStatus(invitee.id, 'sent')
        } else {
          updateInviteeStatus(invitee.id, 'sent-failed')
        }
      } else if (invitee.method === 'whatsapp') {
        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/?text=${getWhatsAppMessage()}`
        window.open(whatsappUrl, '_blank')
        updateInviteeStatus(invitee.id, 'sent')
      } else {
        // For link/QR, just mark as sent
        updateInviteeStatus(invitee.id, 'sent')
      }
      
      onInviteSent?.()
    } catch (error) {
      console.error('Error sending invite:', error)
      updateInviteeStatus(invitee.id, 'sent-failed')
    } finally {
      setIsSending(false)
    }
  }

  const updateInviteeStatus = (id: string, status: Invitee['status']) => {
    setInvitees(invitees.map(i => 
      i.id === id ? { ...i, status } : i
    ))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const shareInvite = async () => {
    const shareData = {
      title: `☕ ${meetupTitle}`,
      text: `Ik nodig je uit voor een koffie meetup bij ${cafeName} in ${cafeCity}!`,
      url: getInviteLink()
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      copyToClipboard(getInviteLink())
    }
  }

  const getStatusIcon = (status: Invitee['status']) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'sent-failed':
        return <X className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusText = (status: Invitee['status']) => {
    switch (status) {
      case 'sent':
        return 'Verzonden'
      case 'sent-failed':
        return 'Mislukt'
      default:
        return 'In afwachting'
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Share Options */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Share2 className="w-5 h-5" />
            Snel Delen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={() => copyToClipboard(getInviteLink())}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Copy className="w-4 h-4 mr-2" />
              Link Kopiëren
            </Button>
            
            <Button
              variant="outline"
              onClick={shareInvite}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Delen
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open(`https://wa.me/?text=${getWhatsAppMessage()}`, '_blank')}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open(`mailto:?subject=${encodeURIComponent(meetupTitle)}&body=${encodeURIComponent(`Ik nodig je uit voor een koffie meetup bij ${cafeName} in ${cafeCity}!\n\n${getInviteLink()}`)}`, '_blank')}
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Invites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Persoonlijke Uitnodigingen
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add New Invitee */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1 space-y-3">
              <Input
                placeholder="Naam"
                value={newInvitee.name}
                onChange={(e) => setNewInvitee({ ...newInvitee, name: e.target.value })}
                className="text-sm"
              />
              <Input
                placeholder="Email"
                type="email"
                value={newInvitee.email}
                onChange={(e) => setNewInvitee({ ...newInvitee, email: e.target.value })}
                className="text-sm"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  variant={selectedMethod === 'email' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMethod('email')}
                  className="text-xs"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>
                <Button
                  variant={selectedMethod === 'whatsapp' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMethod('whatsapp')}
                  className="text-xs"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  WhatsApp
                </Button>
              </div>
              
              <Button
                onClick={addInvitee}
                disabled={!newInvitee.name.trim() || !newInvitee.email.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Toevoegen
              </Button>
            </div>
          </div>

          {/* Invitees List */}
          {invitees.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Uitnodigingen ({invitees.length})</h4>
              
              {invitees.map((invitee) => (
                <div
                  key={invitee.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{invitee.name}</span>
                      <span className="text-sm text-gray-500">({invitee.email})</span>
                      <Badge variant="outline" className="text-xs">
                        {invitee.method === 'email' ? <Mail className="w-3 h-3 mr-1" /> : <MessageCircle className="w-3 h-3 mr-1" />}
                        {invitee.method === 'email' ? 'Email' : 'WhatsApp'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      {getStatusIcon(invitee.status)}
                      <span className={invitee.status === 'sent-failed' ? 'text-red-600' : 'text-gray-600'}>
                        {getStatusText(invitee.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {invitee.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => sendInvite(invitee)}
                        disabled={isSending}
                        className="bg-amber-600 hover:bg-amber-700 text-xs"
                      >
                        {isSending ? 'Verzenden...' : 'Verstuur'}
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeInvitee(invitee.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50 text-xs"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {invitees.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nog geen uitnodigingen toegevoegd</p>
              <p className="text-sm">Voeg mensen toe om persoonlijke uitnodigingen te versturen</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Link Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Uitnodigingslink
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Deel deze link met mensen die je wilt uitnodigen:
            </p>
            
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
              <Input
                value={getInviteLink()}
                readOnly
                className="flex-1 text-sm font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(getInviteLink())}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3" />
              <span>Deze link werkt voor iedereen die je hem stuurt</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, Clock, MapPin, Mail, CheckCircle, XCircle, AlertCircle, Copy, Check } from 'lucide-react'

interface InvitationResponse {
  id: string
  token: string
  organizerName: string
  organizerEmail: string
  inviteeName?: string
  inviteeEmail?: string
  status: string
  createdAt: string
  expiresAt: string
  confirmedAt?: string
  declinedAt?: string
  chosenDate?: string
  chosenTime?: string
  cafe: {
    id: string
    name: string
    address: string
    city: string
  }
  availableDates: string[]
  availableTimes: string[]
}

export function InvitationDashboard() {
  const { supabase, session } = useSupabase()
  const [invitations, setInvitations] = useState<InvitationResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      setIsLoading(false)
      return
    }

    const fetchInvitations = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        const accessToken = currentSession?.access_token

        if (!accessToken) {
          throw new Error('No access token available')
        }

        const response = await fetch('/api/invitations', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch invitations')
        }

        const data = await response.json()
        setInvitations(data.invitations)
      } catch (error) {
        console.error('❌ Error fetching invitations:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch invitations')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvitations()
  }, [session, supabase])

  const getStatusBadge = (status: string, confirmedAt?: string, declinedAt?: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Wachtend op reactie
        </Badge>
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Geaccepteerd
        </Badge>
      case 'declined':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Afgewezen
        </Badge>
      case 'expired':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          <Clock className="w-3 h-3 mr-1" />
          Verlopen
        </Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short'
    })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedToken(text)
      setTimeout(() => setCopiedToken(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const getInviteLink = (token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    return `${baseUrl}/invite/${token}`
  }

  const getStats = () => {
    const total = invitations.length
    const pending = invitations.filter(inv => inv.status === 'pending').length
    const accepted = invitations.filter(inv => inv.status === 'confirmed').length
    const declined = invitations.filter(inv => inv.status === 'declined').length

    return { total, pending, accepted, declined }
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-6 h-6 text-amber-600" />
        <h2 className="text-2xl font-bold text-gray-900">Uitnodigingen</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
            <div className="text-sm text-blue-700">Totaal</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-900">{stats.pending}</div>
            <div className="text-sm text-yellow-700">Wachtend</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-900">{stats.accepted}</div>
            <div className="text-sm text-green-700">Geaccepteerd</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-900">{stats.declined}</div>
            <div className="text-sm text-red-700">Afgewezen</div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Laden van uitnodigingen...</p>
          </CardContent>
        </Card>
      )}

      {/* No Invitations State */}
      {!isLoading && invitations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nog geen uitnodigingen</h3>
            <p className="text-gray-600 mb-4">
              Je hebt nog geen uitnodigingen verstuurd. Maak je eerste meetup om te beginnen!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Invitations List */}
      {!isLoading && invitations.length > 0 && (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="bg-white border-amber-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(invitation.status, invitation.confirmedAt, invitation.declinedAt)}
                      <div className="text-sm text-gray-500">
                        Verstuurd: {formatDate(invitation.createdAt)}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        ☕ {invitation.cafe.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        {invitation.cafe.address}, {invitation.cafe.city}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {invitation.inviteeEmail || 'Geen email'}
                        {invitation.inviteeName && ` (${invitation.inviteeName})`}
                      </div>
                    </div>

                    {invitation.chosenDate && invitation.chosenTime && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm text-green-800">
                          <Calendar className="w-4 h-4" />
                          <strong>Gekozen datum/tijd:</strong> {formatDateShort(invitation.chosenDate)} om {invitation.chosenTime}
                        </div>
                      </div>
                    )}

                    {invitation.status === 'pending' && (
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>Beschikbare datums: {invitation.availableDates.map(date => formatDateShort(date)).join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Beschikbare tijden: {invitation.availableTimes.join(', ')}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 md:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(getInviteLink(invitation.token))}
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      {copiedToken === invitation.token ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Gekopieerd!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Kopieer Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
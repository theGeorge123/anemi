"use client"

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToaster } from '@/components/ui/toaster'
import Link from 'next/link'
import { 
  Home, 
  User, 
  LogOut, 
  Save,
  Check,
  X,
  Coffee,
  MapPin,
  Mail,
  Phone
} from 'lucide-react'

interface UserProfile {
  id: string
  userId: string
  bio: string | null
  location: string | null
  phone: string | null
  website: string | null
  createdAt: string
  updatedAt: string
}

export default function SettingsClient() {
  const { session, supabase, user } = useSupabase()
  const { addToast } = useToaster()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form states - only essential fields
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')

  useEffect(() => {
    if (session?.user) {
      loadUserData()
    }
  }, [session])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Load user profile - simplified
      const { data: profileData, error: profileError } = await supabase
        .from('UserProfile')
        .select('*')
        .eq('userId', session?.user?.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError)
      }

      if (profileData) {
        setProfile(profileData)
        setBio(profileData.bio || '')
        setLocation(profileData.location || '')
        setPhone(profileData.phone || '')
        setWebsite(profileData.website || '')
      }

    } catch (error) {
      console.error('Error loading user data:', error)
      addToast({
        title: 'Fout',
        description: 'Kon gebruikersgegevens niet laden',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      
      // Save user profile - simplified
      const profileData = {
        userId: session?.user?.id,
        bio,
        location,
        phone,
        website
      }

      const { error: profileError } = await supabase
        .from('UserProfile')
        .upsert(profileData, { onConflict: 'userId' })

      if (profileError) {
        throw new Error(profileError.message)
      }

      addToast({
        title: 'Opgeslagen',
        description: 'Je profiel is succesvol opgeslagen',
        type: 'success'
      })

    } catch (error) {
      console.error('Error saving settings:', error)
      addToast({
        title: 'Fout',
        description: 'Kon instellingen niet opslaan',
        type: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      addToast({
        title: 'Uitgelogd',
        description: 'Je bent succesvol uitgelogd',
        type: 'success'
      })
    } catch (error) {
      console.error('Error logging out:', error)
      addToast({
        title: 'Fout',
        description: 'Kon niet uitloggen',
        type: 'error'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50">
        <div className="max-w-4xl mx-auto p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Instellingen laden...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-background to-orange-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 mb-4"
            >
              <Home className="w-4 h-4" />
              ← Terug naar Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Instellingen</h1>
          <p className="text-gray-600">Beheer je profiel en account</p>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Informatie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {user?.email || 'Gebruiker'}
                </h3>
                <p className="text-sm text-gray-500">
                  Lid sinds {user?.created_at ? new Date(user.created_at).toLocaleDateString('nl-NL') : 'onbekend'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profiel Instellingen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Over mij
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Vertel iets over jezelf..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows={4}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Locatie
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Stad, Land"
                className="max-w-md"
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Telefoon
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+31 6 12345678"
                  type="tel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Website
                </label>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Account Acties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Uitloggen
              </Button>
              
              <Link href="/legal/privacy">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <User className="w-4 h-4 mr-2" />
                  Privacy Beleid
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Opslaan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Profiel Opslaan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 
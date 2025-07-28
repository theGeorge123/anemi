"use client"

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, LogOut, Clock } from 'lucide-react'

interface SessionManagerProps {
  children: React.ReactNode
}

export function SessionManager({ children }: SessionManagerProps) {
  const { supabase, session } = useSupabase()
  const [sessionWarning, setSessionWarning] = useState<string | null>(null)
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!session) return

    // Check session expiry
    const checkSessionExpiry = () => {
      if (session?.expires_at) {
        const expiryTime = new Date(session.expires_at * 1000)
        const now = new Date()
        const timeUntilExpiry = expiryTime.getTime() - now.getTime()
        
        setSessionExpiry(expiryTime)

        // Show warning 5 minutes before expiry
        if (timeUntilExpiry > 0 && timeUntilExpiry < 5 * 60 * 1000) {
          const minutesLeft = Math.ceil(timeUntilExpiry / (60 * 1000))
          setSessionWarning(`⚠️ Je sessie verloopt over ${minutesLeft} minuten. Log opnieuw in om door te gaan.`)
        } else if (timeUntilExpiry <= 0) {
          setSessionWarning('❌ Je sessie is verlopen. Log opnieuw in om door te gaan.')
        } else {
          setSessionWarning(null)
        }
      }
    }

    // Check immediately
    checkSessionExpiry()

    // Check every minute
    const interval = setInterval(checkSessionExpiry, 60 * 1000)

    return () => clearInterval(interval)
  }, [session])

  // Test session persistence on page load
  useEffect(() => {
    const testSessionPersistence = async () => {
      try {
        // Test if session is available after page refresh
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (currentSession) {
          console.log('✅ Session persists after page refresh')
        } else {
          console.log('⚠️ No session found after page refresh')
        }
      } catch (error) {
        console.error('❌ Error checking session persistence:', error)
      }
    }

    testSessionPersistence()
  }, [supabase])

  const handleRefreshSession = async () => {
    setIsRefreshing(true)
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('❌ Failed to refresh session:', error)
        setSessionWarning('❌ Kon sessie niet vernieuwen. Log opnieuw in.')
      } else {
        console.log('✅ Session refreshed successfully')
        setSessionWarning(null)
      }
    } catch (error) {
      console.error('❌ Error refreshing session:', error)
      setSessionWarning('❌ Kon sessie niet vernieuwen. Log opnieuw in.')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      console.log('✅ Signed out successfully')
    } catch (error) {
      console.error('❌ Error signing out:', error)
    }
  }

  if (sessionWarning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Sessie Waarschuwing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              {sessionWarning}
            </p>
            
            {sessionExpiry && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    Sessie verloopt: {sessionExpiry.toLocaleString('nl-NL')}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleRefreshSession}
                disabled={isRefreshing}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Vernieuwen...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sessie Vernieuwen
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="flex-1"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Uitloggen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
} 
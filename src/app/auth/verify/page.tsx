"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { ErrorService } from '@/lib/error-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle, XCircle, RefreshCw, Mail, AlertTriangle } from 'lucide-react'
import type { EmailOtpType } from '@supabase/supabase-js'
import Link from 'next/link'

function VerifyPageContent() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [email, setEmail] = useState<string>('')

  const token = searchParams.get('token_hash') || searchParams.get('token')
  const emailParam = searchParams.get('email')
  const type = searchParams.get('type')

  // Debug: Log all parameters
  console.log('Verification parameters:', {
    token,
    emailParam,
    type,
    allParams: Object.fromEntries(searchParams.entries())
  })

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [emailParam])

  const handleVerification = useCallback(async () => {
    if (!token || !email) {
      console.error('Missing token or email:', { token, email })
      setVerificationStatus('error')
      ErrorService.showToast('Verificatie parameters ontbreken. Controleer je email link.', 'error')
      return
    }

    setIsVerifying(true)
    try {
      console.log('Attempting verification with:', { token, email, type })
      
      // Verify the token with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: (type as EmailOtpType) || 'email'
      })

      if (error) {
        console.error('Verification error:', error)
        setVerificationStatus('error')
        ErrorService.showToast(`Verificatie mislukt: ${error.message}`, 'error')
        return
      }

      if (data.user) {
        setVerificationStatus('success')
        ErrorService.showToast('🎉 Email succesvol geverifieerd! Welkom bij Anemi Meets!', 'success')
        
        // Send welcome email after successful verification
        try {
          const response = await fetch('/api/auth/welcome-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email,
              userName: email.split('@')[0] // Use email prefix as username
            }),
          })

          if (response.ok) {
            console.log('Welcome email sent successfully')
          } else {
            console.error('Failed to send welcome email')
          }
        } catch (error) {
          console.error('Error sending welcome email:', error)
        }
        
        // Redirect to sign in page after a short delay
        setTimeout(() => {
          // Check if there's a stored redirect URL from signup
          const storedRedirect = sessionStorage.getItem('signup_redirect')
          sessionStorage.removeItem('signup_redirect') // Clean up
          
          const signinUrl = storedRedirect 
            ? `/auth/signin?redirect=${storedRedirect}&message=verified`
            : '/auth/signin?message=verified'
          router.push(signinUrl)
        }, 3000)
      } else {
        setVerificationStatus('error')
        ErrorService.showToast('Verificatie mislukt. Probeer opnieuw.', 'error')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationStatus('error')
      ErrorService.showToast('Email verifiëren mislukt. Probeer opnieuw.', 'error')
    } finally {
      setIsVerifying(false)
    }
  }, [token, email, router, supabase, type])

  // Auto-verify when we have token and email
  useEffect(() => {
    if (token && (email || emailParam)) {
      const emailToUse = email || emailParam
      if (emailToUse && !email) {
        setEmail(emailToUse)
      }
      console.log('Auto-verifying with:', { token, email: emailToUse, type })
      handleVerification()
    }
  }, [token, email, emailParam, type, handleVerification])

  const resendVerification = async () => {
    if (!email) return

    try {
      // Use Supabase's built-in resend functionality
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/verify` : undefined
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: redirectUrl ? {
          emailRedirectTo: redirectUrl
        } : {}
      })

      if (error) {
        console.error('Resend error:', error)
        ErrorService.showToast('Verificatie email versturen mislukt. Probeer opnieuw.', 'error')
      } else {
        ErrorService.showToast('📧 Verificatie email verstuurd! Check je inbox.', 'success')
      }
    } catch (error) {
      console.error('Resend error:', error)
      ErrorService.showToast('Verificatie email versturen mislukt. Probeer opnieuw.', 'error')
    }
  }

  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <div className="text-6xl mb-4">⏳</div>
              <CardTitle className="text-3xl font-bold text-amber-700 mb-1">Je E-mail Verifiëren</CardTitle>
              <CardDescription className="text-base text-gray-500">
                Even geduld terwijl we je e-mailadres verifiëren...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show success state
  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <div className="text-6xl mb-4">✅</div>
              <CardTitle className="text-3xl font-bold text-green-700 mb-1">E-mail Geverifieerd!</CardTitle>
              <CardDescription className="text-base text-gray-500">
                Je e-mail is succesvol geverifieerd!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">🎉 Welkom bij Anemi Meets!</h3>
                  <p className="text-green-700 text-sm">
                    Je kunt nu inloggen en je koffie avontuur beginnen!
                  </p>
                </div>
                
                <Button 
                  onClick={() => {
                    // Check if there's a stored redirect URL
                    const storedRedirect = sessionStorage.getItem('signup_redirect')
                    sessionStorage.removeItem('signup_redirect') // Clean up
                    
                    const signinUrl = storedRedirect 
                      ? `/auth/signin?redirect=${storedRedirect}&message=verified`
                      : '/auth/signin?message=verified'
                    router.push(signinUrl)
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-lg font-semibold"
                >
                  ☕ Ga naar Inloggen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show error state
  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <div className="text-6xl mb-4">❌</div>
              <CardTitle className="text-3xl font-bold text-red-700 mb-1">Verificatie Mislukt</CardTitle>
              <CardDescription className="text-base text-gray-500">
                We konden je e-mail niet verifiëren. Probeer het opnieuw.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">🔧 Probleemoplossing</h3>
                  <p className="text-red-700 text-sm">
                    De verificatielink is mogelijk verlopen of ongeldig. Vraag een nieuwe aan.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={resendVerification}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-lg font-semibold"
                  >
                    📧 Verificatie E-mail Opnieuw Versturen
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/auth/signin')}
                    variant="outline"
                    className="w-full"
                  >
                    ☕ Terug naar Inloggen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // If no token, show the verification pending page
  if (!token && email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <div className="text-6xl mb-4">📧</div>
              <CardTitle className="text-3xl font-bold text-amber-700 mb-1">Check Je Email</CardTitle>
              <CardDescription className="text-base text-gray-500">
                We hebben een verificatie link gestuurd naar <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-800 mb-2">☕ Welkom bij Anemi Meets!</h3>
                  <p className="text-amber-700 text-sm">
                    Om je koffie avontuur te beginnen, klik op de verificatie link in je email.
                  </p>
                </div>
                
                <div className="text-sm text-gray-600 space-y-2">
                  <p>📧 Check je inbox (en spam folder)</p>
                  <p>🔗 Klik op de verificatie link</p>
                  <p>✅ Kom hier terug om in te loggen</p>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={resendVerification}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-lg font-semibold"
                  >
                    📧 Verificatie Email Opnieuw Versturen
                  </Button>
                  
                  <Link href="/auth/signin">
                    <Button variant="outline" className="w-full">
                      ☕ Terug naar Inloggen
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <Mail className="w-4 h-4" />
            ← Terug naar Home
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="text-6xl mb-4">☕</div>
            <CardTitle className="text-3xl font-bold text-amber-700 mb-1">Je Email Verifiëren</CardTitle>
            <CardDescription className="text-base text-gray-500">
              {isVerifying ? 'Even geduld terwijl we je email verifiëren...' : 'Check je email voor de verificatie link'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              {isVerifying && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                </div>
              )}
              <p className="text-gray-600">
                Geen email ontvangen? Check je spam folder of vraag een nieuwe aan.
              </p>
              <Button 
                onClick={resendVerification}
                className="w-full bg-amber-600 hover:bg-amber-700 text-lg font-semibold"
                disabled={isVerifying}
              >
                📧 Verificatie Email Opnieuw Versturen
              </Button>
              <Link href="/auth/signin">
                <Button variant="outline" className="w-full">
                  ☕ Terug naar Inloggen
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
    </div>
  )
} 

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <div className="text-6xl mb-4">☕</div>
              <CardTitle className="text-3xl font-bold text-amber-700 mb-1">Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  )
} 
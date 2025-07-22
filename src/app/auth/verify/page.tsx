"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabase } from '@/components/SupabaseProvider'
import { ErrorService } from '@/lib/error-service'
import { useCallback } from 'react'

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
      ErrorService.showToast('Missing verification parameters. Please check your email link.', 'error')
      return
    }

    setIsVerifying(true)
    try {
      console.log('Attempting verification with:', { token, email, type })
      
      // Verify the token with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type || 'email'
      })

      if (error) {
        console.error('Verification error:', error)
        setVerificationStatus('error')
        ErrorService.showToast(`Verification failed: ${error.message}`, 'error')
        return
      }

      if (data.user) {
        setVerificationStatus('success')
        ErrorService.showToast('🎉 Email verified successfully! Welcome to Anemi Meets!', 'success')
        
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
        ErrorService.showToast('Verification failed. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationStatus('error')
      ErrorService.showToast('Failed to verify email. Please try again.', 'error')
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
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`
        }
      })

      if (error) {
        console.error('Resend error:', error)
        ErrorService.showToast('Failed to send verification email. Please try again.', 'error')
      } else {
        ErrorService.showToast('📧 Verification email sent! Check your inbox.', 'success')
      }
    } catch (error) {
      console.error('Resend error:', error)
      ErrorService.showToast('Failed to send verification email. Please try again.', 'error')
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
              <CardTitle className="text-3xl font-bold text-amber-700 mb-1">Check Your Email</CardTitle>
              <CardDescription className="text-base text-gray-500">
                We&apos;ve sent a verification link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-800 mb-2">☕ Welcome to Anemi Meets!</h3>
                  <p className="text-amber-700 text-sm">
                    To start your coffee adventure, please click the verification link in your email.
                  </p>
                </div>
                
                <div className="text-sm text-gray-600 space-y-2">
                  <p>📧 Check your inbox (and spam folder)</p>
                  <p>🔗 Click the verification link</p>
                  <p>✅ Come back here to sign in</p>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={resendVerification}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-lg font-semibold"
                  >
                    📧 Resend Verification Email
                  </Button>
                  
                  <Link href="/auth/signin">
                    <Button variant="outline" className="w-full">
                      ☕ Back to Sign In
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
          <CardHeader className="text-center pb-2">
            <div className="text-6xl mb-4">☕</div>
            <CardTitle className="text-3xl font-bold text-amber-700 mb-1">Verifying Your Email</CardTitle>
            <CardDescription className="text-base text-gray-500">
              {isVerifying ? 'Please wait while we verify your email...' : 'Check your email for the verification link'}
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
                Didn&apos;t receive the email? Check your spam folder or request a new one.
              </p>
              <Button 
                onClick={resendVerification}
                className="w-full bg-amber-600 hover:bg-amber-700 text-lg font-semibold"
                disabled={isVerifying}
              >
                📧 Resend Verification Email
              </Button>
              <Link href="/auth/signin">
                <Button variant="outline" className="w-full">
                  ☕ Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
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
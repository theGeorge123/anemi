"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle, XCircle, RefreshCw, Mail, AlertTriangle, Home } from 'lucide-react'
import type { EmailOtpType } from '@supabase/supabase-js'
import Link from 'next/link'

function VerifyEmailPageContent() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [email, setEmail] = useState<string>('')
  const [countdown, setCountdown] = useState(3)

  const token = searchParams.get('token_hash') || searchParams.get('token')
  const emailParam = searchParams.get('email')
  const type = searchParams.get('type')

  // Debug: Log all parameters
  console.log('Email verification parameters:', {
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
    if (!token || !email || isVerifying) {
      console.error('Missing token or email, or already verifying:', { token, email, isVerifying })
      if (!token || !email) {
        setVerificationStatus('error')
        console.error('Email verificatie parameters ontbreken. Controleer je email link.')
      }
      return
    }

    setIsVerifying(true)
    try {
      console.log('Attempting email verification with:', { token, email, type })
      
      // Verify the token with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: (type as EmailOtpType) || 'signup'
      })

      if (error) {
        console.error('Email verification error:', error)
        setVerificationStatus('error')
        console.error(`Email verificatie mislukt: ${error.message}`)
        return
      }

      if (data.user) {
        setVerificationStatus('success')
        console.log('🎉 Email succesvol geverifieerd! Welkom bij Anemi Meets!')
        
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
        
        // Start countdown for redirect
        setCountdown(3)
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval)
              // Check if there's a stored redirect URL from signup
              const storedRedirect = sessionStorage.getItem('signup_redirect')
              sessionStorage.removeItem('signup_redirect') // Clean up
              
              const signinUrl = storedRedirect 
                ? `/auth/signin?redirect=${storedRedirect}&message=verified`
                : '/auth/signin?message=verified'
              router.push(signinUrl)
            }
            return prev - 1
          })
        }, 1000)
      } else {
        console.error('No user data returned from verification')
        setVerificationStatus('error')
      }
    } catch (error) {
      console.error('Email verification error:', error)
      setVerificationStatus('error')
      console.error('Email verifiëren mislukt. Probeer opnieuw.')
    } finally {
      setIsVerifying(false)
    }
  }, [token, email, type, supabase, router, isVerifying])

  // Auto-verify when component mounts
  useEffect(() => {
    if (token && email && verificationStatus === 'pending' && !isVerifying) {
      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (verificationStatus === 'pending') {
          console.error('Email verification timeout')
          setVerificationStatus('error')
        }
      }, 10000) // 10 second timeout

      handleVerification()

      return () => clearTimeout(timeoutId)
    }
  }, [token, email, verificationStatus, isVerifying])

  const resendVerification = async () => {
    if (!email) {
      console.error('No email available for resend')
      return
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        console.error('Resend error:', error)
        console.error('Verificatie email versturen mislukt. Probeer opnieuw.')
      } else {
        console.log('📧 Verificatie email verstuurd! Check je inbox.')
      }
    } catch (error) {
      console.error('Resend error:', error)
      console.error('Verificatie email versturen mislukt. Probeer opnieuw.')
    }
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Email Geverifieerd!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Je email is succesvol geverifieerd. Je wordt over {countdown} seconde{countdown !== 1 ? 'n' : ''} doorgestuurd naar de inlogpagina.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/signin">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">
                <Home className="w-4 h-4 mr-2" />
                Nu Inloggen
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              ❌ Verificatie Mislukt
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Er is een probleem met de email verificatie. Controleer je email link of probeer opnieuw.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button 
                onClick={resendVerification}
                variant="outline" 
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Nieuwe Verificatie Email Versturen
              </Button>
              
              <Link href="/auth/signin">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Terug naar Inloggen
                </Button>
              </Link>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2">💡 Tips</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Controleer je spam/junk folder</li>
                <li>• Zorg dat je de juiste email gebruikt</li>
                <li>• Klik op de link in de email</li>
                <li>• Probeer een nieuwe verificatie email</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className={`w-10 h-10 text-amber-600 ${isVerifying ? 'animate-spin' : ''}`} />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            🔐 Email Verifiëren
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {isVerifying ? 'Je email wordt geverifieerd...' : 'Email verificatie wordt voorbereid...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-10 h-10 text-amber-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              🔐 Loading...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <VerifyEmailPageContent />
    </Suspense>
  )
} 
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
        
        // Start countdown for redirect
        setCountdown(3)
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval)
              // Redirect to signin page with success message
              router.push('/auth/signin?message=verified')
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        console.error('No user data returned from verification')
        setVerificationStatus('error')
      }
    } catch (error) {
      console.error('Unexpected error during verification:', error)
      setVerificationStatus('error')
    } finally {
      setIsVerifying(false)
    }
  }, [token, email, type, isVerifying, supabase.auth, router])

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
  }, [token, email, verificationStatus, isVerifying, handleVerification])

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
        console.error('Failed to resend verification email:', error)
      } else {
        console.log('Verification email resent successfully')
      }
    } catch (error) {
      console.error('Error resending verification email:', error)
    }
  }

  // Loading state
  if (verificationStatus === 'pending' && isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-amber-700 mb-1">Email Verificeren</CardTitle>
            <CardDescription className="text-base text-gray-500">
              Even geduld...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">Je email wordt geverifieerd...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state
  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700 mb-1">Email Geverifieerd! 🎉</CardTitle>
            <CardDescription className="text-base text-gray-500">
              Je account is succesvol geactiveerd
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-800 font-medium mb-2">✅ Verificatie Succesvol</p>
              <p className="text-green-600 text-sm">
                Je email is geverifieerd en je account is actief.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-blue-800 font-medium mb-2">⏰ Automatische Redirect</p>
              <p className="text-blue-600 text-sm">
                Je wordt over {countdown} seconden doorgestuurd naar de login pagina.
              </p>
            </div>
            
            <Link href="/auth/signin?message=verified">
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

  // Error state
  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-700 mb-1">Verificatie Mislukt</CardTitle>
            <CardDescription className="text-base text-gray-500">
              Er ging iets mis bij het verifiëren van je email
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800 font-medium mb-2">❌ Verificatie Fout</p>
              <p className="text-red-600 text-sm">
                De verificatie link is ongeldig of verlopen. Controleer je email of probeer opnieuw.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={resendVerification}
                variant="outline"
                className="w-full border-amber-300 hover:bg-amber-50"
              >
                <Mail className="w-4 h-4 mr-2" />
                Verificatie Email Opnieuw Versturen
              </Button>
              
              <Link href="/auth/signin">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Terug naar Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Default state (should not be reached)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-amber-700 mb-1">Email Verificatie</CardTitle>
          <CardDescription className="text-base text-gray-500">
            Controleer je email voor de verificatie link
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Klik op de link in je email om je account te activeren.
          </p>
          
          <Link href="/auth/signin">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Terug naar Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    }>
      <VerifyEmailPageContent />
    </Suspense>
  )
} 
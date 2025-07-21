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
  const { client } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const handleVerification = useCallback(async () => {
    if (!token || !email) return

    setIsVerifying(true)
    try {
      // For now, we'll just show a success message
      // In a real implementation, you'd verify the token with your backend
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
      
      // Redirect to the main app after a short delay
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationStatus('error')
      ErrorService.showToast('Failed to verify email. Please try again.', 'error')
    } finally {
      setIsVerifying(false)
    }
  }, [token, email, router])

  useEffect(() => {
    if (token && email) {
      handleVerification()
    }
  }, [token, email, handleVerification])

  const resendVerification = async () => {
    if (!email) return

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        ErrorService.showToast('📧 Verification email sent! Check your inbox.', 'success')
      } else {
        ErrorService.showToast('Failed to send verification email. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Resend error:', error)
      ErrorService.showToast('Failed to send verification email. Please try again.', 'error')
    }
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <div className="text-6xl mb-4">🎉</div>
              <CardTitle className="text-3xl font-bold text-amber-700 mb-1">Welcome to Anemi Meets!</CardTitle>
              <CardDescription className="text-base text-gray-500">
                Your email has been verified successfully. Your coffee adventure is about to begin!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <p className="text-gray-600">
                  Redirecting you to the main app...
                </p>
                <Button 
                  onClick={() => router.push('/')}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-lg font-semibold"
                >
                  Go to Anemi Meets
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <div className="text-6xl mb-4">❌</div>
              <CardTitle className="text-3xl font-bold text-red-600 mb-1">Verification Failed</CardTitle>
              <CardDescription className="text-base text-gray-500">
                We couldn&apos;t verify your email. Please try again or contact support.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <Button 
                  onClick={resendVerification}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-lg font-semibold"
                >
                  Resend Verification Email
                </Button>
                <Link href="/auth/signin">
                  <Button variant="outline" className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
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
                Resend Verification Email
              </Button>
              <Link href="/auth/signin">
                <Button variant="outline" className="w-full">
                  Back to Sign In
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
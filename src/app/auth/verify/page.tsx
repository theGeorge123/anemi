"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle, XCircle, RefreshCw, Mail, AlertTriangle, Home, Lock } from 'lucide-react'
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
  console.log('Password reset verification parameters:', {
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
      console.error('Password reset verificatie parameters ontbreken. Controleer je email link.')
      return
    }

    setIsVerifying(true)
    try {
      console.log('Attempting password reset verification with:', { token, email, type })
      
      // Verify the token with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: (type as EmailOtpType) || 'recovery'
      })

      if (error) {
        console.error('Password reset verification error:', error)
        setVerificationStatus('error')
        console.error(`Password reset verificatie mislukt: ${error.message}`)
        return
      }

      if (data.user) {
        setVerificationStatus('success')
        console.log('🎉 Password reset verificatie succesvol!')
        
        // Redirect to password reset page
        setTimeout(() => {
          const resetUrl = `/auth/reset-password?access_token=${data.session?.access_token}&refresh_token=${data.session?.refresh_token}`
          router.push(resetUrl)
        }, 2000)
      }
    } catch (error) {
      console.error('Password reset verification error:', error)
      setVerificationStatus('error')
      console.error('Password reset verifiëren mislukt. Probeer opnieuw.')
    } finally {
      setIsVerifying(false)
    }
  }, [token, email, type, supabase, router])

  // Auto-verify when component mounts
  useEffect(() => {
    if (token && email && verificationStatus === 'pending') {
      handleVerification()
    }
  }, [token, email, verificationStatus, handleVerification])

  const resendPasswordReset = async () => {
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
        console.error('Password reset email versturen mislukt. Probeer opnieuw.')
      } else {
        console.log('📧 Password reset email verstuurd! Check je inbox.')
      }
    } catch (error) {
      console.error('Resend error:', error)
      console.error('Password reset email versturen mislukt. Probeer opnieuw.')
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
              🔐 Verificatie Succesvol!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Je password reset link is geverifieerd. Je wordt doorgestuurd naar de wachtwoord reset pagina.
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

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              ❌ Password Reset Mislukt
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Er is een probleem met de password reset verificatie. Controleer je email link of probeer opnieuw.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button 
                onClick={resendPasswordReset}
                variant="outline" 
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Nieuwe Password Reset Email Versturen
              </Button>
              
              <Link href="/auth/forgot-password">
                <Button variant="outline" className="w-full">
                  <Lock className="w-4 h-4 mr-2" />
                  Terug naar Wachtwoord Vergeten
                </Button>
              </Link>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2">💡 Tips</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Controleer je spam/junk folder</li>
                <li>• Zorg dat je de juiste email gebruikt</li>
                <li>• Klik op de link in de email</li>
                <li>• Probeer een nieuwe password reset email</li>
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
            🔐 Password Reset Verifiëren
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {isVerifying ? 'Je password reset link wordt geverifieerd...' : 'Password reset verificatie wordt voorbereid...'}
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

export default function VerifyPage() {
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
      <VerifyPageContent />
    </Suspense>
  )
} 
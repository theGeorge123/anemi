"use client"

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabase } from '@/components/SupabaseProvider'
import { useAsyncOperation } from '@/lib/use-async-operation'
import { ErrorService } from '@/lib/error-service'
import { useFormValidation } from '@/lib/use-form-validation'
import { Validators } from '@/lib/validators'
import { Home } from 'lucide-react'

function SignInPageContent() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const message = searchParams.get('message')
  const [specificError, setSpecificError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Show success message if user just verified their email
  useEffect(() => {
    if (message === 'verified') {
      setSuccessMessage('🎉 Email succesvol geverifieerd! Je kunt nu inloggen om je koffie avontuur te beginnen.')
    } else if (message === 'account_created') {
      setSuccessMessage('🎉 Account succesvol aangemaakt! Je kunt nu inloggen met je nieuwe account.')
    }
  }, [message])

  const form = useFormValidation({
    email: '',
    password: '',
  }, {
    email: [Validators.required, Validators.email],
    password: [Validators.required, Validators.minLength(8)],
  })

  const getSpecificErrorMessage = (error: any) => {
    if (!error) return 'Er ging iets mis'
    
    const message = error.message || ''
    const status = error.status || 0
    
    // Check for specific error types with friendly Dutch messages
    if (message.includes('Invalid login credentials') || status === 400) {
      return '❌ Verkeerde email of wachtwoord. Controleer je gegevens en probeer opnieuw.'
    }
    
    if (message.includes('Email not confirmed') || status === 422) {
      return '📧 Controleer je email en klik op de verificatie link voordat je inlogt.'
    }
    
    if (message.includes('Too many requests') || status === 429) {
      return '⏰ Te veel inlog pogingen. Wacht even en probeer opnieuw.'
    }
    
    if (message.includes('User not found')) {
      return '👤 Account niet gevonden. Controleer je email of maak een nieuw account aan.'
    }
    
    if (message.includes('No API key found')) {
      return '🔧 Technisch probleem. Probeer opnieuw of neem contact op met support.'
    }
    
    if (message.includes('Invalid email')) {
      return '📧 Voer een geldig email adres in.'
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return '🌐 Netwerk probleem. Controleer je internet verbinding en probeer opnieuw.'
    }
    
    if (message.includes('rate limit')) {
      return '⏰ Te veel pogingen. Wacht even en probeer opnieuw.'
    }
    
    if (message.includes('password')) {
      return '🔒 Wachtwoord moet minimaal 8 karakters lang zijn.'
    }
    
    // Default error message
    return `😅 ${message || 'Er ging iets mis. Probeer opnieuw.'}`
  }

  const {
    execute: signInAsync,
    isLoading: signInLoading,
    error: signInError,
  } = useAsyncOperation(async () => {
    if (!supabase) throw new Error('No Supabase client')
    
    setSpecificError(null) // Clear previous errors
    
    const { error } = await supabase.auth.signInWithPassword({
      email: form.values.email,
      password: form.values.password,
    })
    
    if (error) {
      const specificMessage = getSpecificErrorMessage(error)
      setSpecificError(specificMessage)
      throw error
    }
  }, {
    onSuccess: () => {
      // Show success message
      console.log('☕ Welkom terug! Inloggen...')
      
      // Handle redirect after successful login
      if (redirectUrl) {
        // Decode the redirect URL and navigate to it
        const decodedRedirect = decodeURIComponent(redirectUrl)
        router.push(decodedRedirect)
      } else {
        // Default redirect to dashboard
        router.push('/dashboard')
      }
    },
    onError: (err) => {
      // Error is already handled with specific message above
      console.error('Sign in error:', err)
    },
  })

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit((values) => {
      signInAsync()
    })(e)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      {/* Back to Home Button */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
        <Link href="/">
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1 sm:gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 text-xs sm:text-sm"
          >
            <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">← Terug naar Home</span>
            <span className="sm:hidden">← Home</span>
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-sm sm:max-w-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-amber-700 mb-1">☕ Welkom Terug!</CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-500">
              {redirectUrl 
                ? 'Log in om door te gaan naar je bestemming'
                : 'Klaar voor je volgende koffie avontuur?'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-5">
              {/* Success message */}
              {successMessage && (
                <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-xs sm:text-sm">{successMessage}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Voer je e-mail in"
                  value={form.values.email}
                  onChange={(e) => form.handleChange('email')(e)}
                  onBlur={form.handleBlur('email')}
                  required
                  className="text-sm sm:text-base"
                />
                {form.errors.email && <p className="text-red-500 text-xs sm:text-sm">{form.errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Voer je wachtwoord in"
                  value={form.values.password}
                  onChange={(e) => form.handleChange('password')(e)}
                  onBlur={form.handleBlur('password')}
                  required
                  className="text-sm sm:text-base"
                />
                {form.errors.password && <p className="text-red-500 text-xs sm:text-sm">{form.errors.password}</p>}
              </div>
              
              {/* Specific error message */}
              {specificError && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-xs sm:text-sm">{specificError}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-sm sm:text-lg font-semibold py-3 sm:py-4" 
                  disabled={signInLoading}
                >
                  {signInLoading ? '🔄 Inloggen...' : '☕ Log In'}
                </Button>
                <Link 
                  href={`/auth/signup${redirectUrl ? `?redirect=${redirectUrl}` : ''}`}
                  className="flex-1"
                >
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full border-2 border-amber-500 text-amber-700 hover:bg-amber-50 hover:border-amber-600 text-sm sm:text-lg font-semibold py-3 sm:py-4"
                  >
                    ✨ Registreer
                  </Button>
                </Link>
              </div>
            </form>
            
            <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
              Nieuw bij Anemi Meets? Klik hierboven op{' '}
              <Link href={`/auth/signup${redirectUrl ? `?redirect=${redirectUrl}` : ''}`} className="text-amber-700 hover:underline font-medium">
                Registreer
              </Link>{' '}
              om een account aan te maken.
            </div>
            
            <div className="mt-4 text-center">
              <Link href="/auth/forgot-password" className="text-xs sm:text-sm text-amber-700 hover:underline">
                Wachtwoord vergeten?
              </Link>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold text-amber-700 mb-1">☕ Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    }>
      <SignInPageContent />
    </Suspense>
  )
} 
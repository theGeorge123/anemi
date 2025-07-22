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
      setSuccessMessage('🎉 Email verified successfully! You can now sign in to start your coffee adventure.')
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
    if (!error) return 'Something went wrong'
    
    const message = error.message || ''
    const status = error.status || 0
    
    // Check for specific error types
    if (message.includes('Invalid login credentials') || status === 400) {
      return '❌ Wrong email or password. Please check your credentials and try again.'
    }
    
    if (message.includes('Email not confirmed') || status === 422) {
      return '📧 Please check your email and click the verification link before signing in.'
    }
    
    if (message.includes('Too many requests') || status === 429) {
      return '⏰ Too many login attempts. Please wait a few minutes and try again.'
    }
    
    if (message.includes('User not found')) {
      return '👤 Account not found. Please check your email or create a new account.'
    }
    
    if (message.includes('No API key found')) {
      return '🔧 Technical issue. Please try again or contact support.'
    }
    
    // Default error message
    return `😅 ${message || 'Something went wrong. Please try again.'}`
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
      ErrorService.showToast('☕ Welcome back! Signing you in...', 'success')
      // Redirect to the original URL if provided, otherwise to dashboard
      const targetUrl = redirectUrl ? decodeURIComponent(redirectUrl) : '/dashboard'
      router.push(targetUrl)
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
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <Home className="w-4 h-4" />
            ← Terug naar Home
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold text-amber-700 mb-1">☕ Welkom Terug!</CardTitle>
            <CardDescription className="text-base text-gray-500">
              {redirectUrl 
                ? 'Log in om door te gaan naar je bestemming'
                : 'Klaar voor je volgende koffie avontuur?'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-5">
              {/* Success message */}
              {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">{successMessage}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Voer je e-mail in"
                  value={form.values.email}
                  onChange={(e) => form.handleChange('email')(e)}
                  onBlur={form.handleBlur('email')}
                  required
                />
                {form.errors.email && <p className="text-red-500 text-sm">{form.errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Voer je wachtwoord in"
                  value={form.values.password}
                  onChange={(e) => form.handleChange('password')(e)}
                  onBlur={form.handleBlur('password')}
                  required
                />
                {form.errors.password && <p className="text-red-500 text-sm">{form.errors.password}</p>}
              </div>
              
              {/* Specific error message */}
              {specificError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{specificError}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg font-semibold" 
                disabled={signInLoading}
              >
                {signInLoading ? '🔄 Inloggen...' : '☕ Log In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              Heb je nog geen account?{' '}
              <Link href="/auth/signup" className="text-amber-700 hover:underline font-medium">
                Registreer hier
              </Link>
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-400">
              <Link href="/auth/verify" className="text-amber-600 hover:underline">
                Need to verify your email?
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
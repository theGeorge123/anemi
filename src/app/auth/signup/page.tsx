"use client"

import { useState, Suspense } from 'react'
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

function SignUpPageContent() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const [specificError, setSpecificError] = useState<string | null>(null)

  const form = useFormValidation({
    email: '',
    password: '',
    confirmPassword: '',
  }, {
    email: [Validators.required, Validators.email],
    password: [Validators.required, Validators.minLength(8)],
    confirmPassword: [Validators.required, (value: string) => {
      if (value !== form.values.password) {
        return '❌ Passwords do not match'
      }
      return true
    }],
  })

  const {
    execute: signUpAsync,
    isLoading: signUpLoading,
    error: signUpError,
  } = useAsyncOperation(async () => {
    if (!supabase) {
      console.error('Supabase client not available')
      throw new Error('Authentication service not available. Please refresh the page and try again.')
    }
    
    // Clear previous errors
    setSpecificError(null)
    
    // Check password match before proceeding
    if (form.values.password !== form.values.confirmPassword) {
      const errorMessage = '❌ Passwords do not match. Please make sure both passwords are identical.'
      setSpecificError(errorMessage)
      throw new Error(errorMessage)
    }

    console.log('Attempting signup with email:', form.values.email)
    
    // Create user via server-side API to avoid Supabase default emails
    const createUserResponse = await fetch('/api/auth/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.values.email,
        password: form.values.password,
      }),
    })

    if (!createUserResponse.ok) {
      const errorData = await createUserResponse.json()
      const errorMessage = errorData.error || 'Failed to create account'
      setSpecificError(`❌ ${errorMessage}`)
      throw new Error(errorMessage)
    }

    console.log('User created successfully')
    
    // The verification email is now sent automatically by the create-user API
    // No need to call a separate verify-email endpoint
    
    // The user profile will be created automatically by the SQL trigger
    // No need to call the API endpoint manually
  }, {
    onSuccess: (data: any) => {
      // Check if email was skipped due to SMTP issues
      if (data?.emailSkipped) {
        ErrorService.showToast('🎉 Account created! Email verification was skipped due to SMTP issues. You can now sign in directly.', 'success')
        router.push('/auth/signin?message=account_created')
      } else {
        ErrorService.showToast('🎉 Account created! Please check your email to verify your account before signing in.', 'success')
        router.push('/auth/verify?email=' + encodeURIComponent(form.values.email))
      }
    },
    onError: (err) => {
      console.error('Signup error:', err)
      // Don't show toast if we already set a specific error
      if (!specificError) {
        ErrorService.showToast(ErrorService.handleError(err), 'error')
      }
    },
  })

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit((values) => {
      signUpAsync()
    })(e)
  }

  // Show error if Supabase client is not available
  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold text-amber-700 mb-1">Service Unavailable</CardTitle>
              <CardDescription className="text-base text-gray-500">
                Authentication service is not available. Please refresh the page and try again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full bg-amber-600 hover:bg-amber-700 text-lg font-semibold"
              >
                Refresh Page
              </Button>
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
            <CardTitle className="text-3xl font-bold text-amber-700 mb-1">Maak je account aan</CardTitle>
            <CardDescription className="text-base text-gray-500">
              {redirectUrl 
                ? 'Registreer om door te gaan naar je bestemming'
                : 'Registreer in seconden en ontgrendel een wereld van koffie meetups, reconnect met vrienden, en goede vibes. ☕️✨'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Voer je e-mail in"
                  value={form.values.email}
                  onChange={form.handleChange('email')}
                  onBlur={form.handleBlur('email')}
                  required
                />
                {form.errors.email && <p className="text-red-500">{form.errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Maak een wachtwoord aan"
                  value={form.values.password}
                  onChange={form.handleChange('password')}
                  onBlur={form.handleBlur('password')}
                  required
                  minLength={8}
                />
                {form.errors.password && <p className="text-red-500">{form.errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Bevestig Wachtwoord</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Bevestig je wachtwoord"
                  value={form.values.confirmPassword}
                  onChange={form.handleChange('confirmPassword')}
                  onBlur={form.handleBlur('confirmPassword')}
                  required
                />
                {form.errors.confirmPassword && <p className="text-red-500">{form.errors.confirmPassword}</p>}
                              </div>
                
                {/* Specific error message */}
                {specificError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{specificError}</p>
                  </div>
                )}
                
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-lg font-semibold" disabled={signUpLoading}>
                {signUpLoading ? 'Account aanmaken...' : 'Account Aanmaken'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Heb je al een account?{' '}
              <Link href={`/auth/signin${redirectUrl ? `?redirect=${redirectUrl}` : ''}`} className="text-amber-700 hover:underline font-medium">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold text-amber-700 mb-1">Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    }>
      <SignUpPageContent />
    </Suspense>
  )
} 
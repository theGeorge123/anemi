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
  const { client } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')

  const form = useFormValidation({
    email: '',
    password: '',
    confirmPassword: '',
  }, {
    email: [Validators.required, Validators.email],
    password: [Validators.required, Validators.minLength(8)],
    confirmPassword: [Validators.required],
  })

  const {
    execute: signUpAsync,
    isLoading: signUpLoading,
    error: signUpError,
  } = useAsyncOperation(async () => {
    if (!client) {
      console.error('Supabase client not available')
      throw new Error('Authentication service not available. Please refresh the page and try again.')
    }
    
    if (form.values.password !== form.values.confirmPassword) {
      throw new Error('Passwords do not match')
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
      throw new Error(errorData.error || 'Failed to create account')
    }

    console.log('User created successfully')
    
    // Automatically sign in the user after account creation
    const { error: signInError } = await client.auth.signInWithPassword({
      email: form.values.email,
      password: form.values.password,
    })

    if (signInError) {
      console.error('Auto sign-in error:', signInError)
      // Don't throw error here, just log it - user can sign in manually
    }
    
    // Send our custom verification email
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: form.values.email,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to send verification email')
    }
    
    // The user profile will be created automatically by the SQL trigger
    // No need to call the API endpoint manually
  }, {
    onSuccess: () => {
      ErrorService.showToast('🎉 Account created and signed in! Check your email for a fun verification message to start your coffee adventure!', 'success')
      // Redirect to the original URL if provided, otherwise to dashboard
      const targetUrl = redirectUrl ? decodeURIComponent(redirectUrl) : '/dashboard'
      router.push(targetUrl)
    },
    onError: (err) => {
      console.error('Signup error:', err)
      ErrorService.showToast(ErrorService.handleError(err), 'error')
    },
  })

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit((values) => {
      signUpAsync()
    })(e)
  }

  // Show error if Supabase client is not available
  if (!client) {
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
            <CardTitle className="text-3xl font-bold text-amber-700 mb-1">Create your account</CardTitle>
            <CardDescription className="text-base text-gray-500">
              {redirectUrl 
                ? 'Sign up to continue to your destination'
                : 'Sign up in seconds and unlock a world of coffee meetups, new friends, and good vibes. ☕️✨'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.values.email}
                  onChange={form.handleChange('email')}
                  onBlur={form.handleBlur('email')}
                  required
                />
                {form.errors.email && <p className="text-red-500">{form.errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={form.values.password}
                  onChange={form.handleChange('password')}
                  onBlur={form.handleBlur('password')}
                  required
                  minLength={8}
                />
                {form.errors.password && <p className="text-red-500">{form.errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={form.values.confirmPassword}
                  onChange={form.handleChange('confirmPassword')}
                  onBlur={form.handleBlur('confirmPassword')}
                  required
                />
                {form.errors.confirmPassword && <p className="text-red-500">{form.errors.confirmPassword}</p>}
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-lg font-semibold" disabled={signUpLoading}>
                {signUpLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href={`/auth/signin${redirectUrl ? `?redirect=${redirectUrl}` : ''}`} className="text-amber-700 hover:underline font-medium">
                Sign in
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
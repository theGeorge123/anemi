"use client"

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PasswordStrength } from '@/components/ui/password-strength'
import { useSupabase } from '@/components/SupabaseProvider'
import { useAsyncOperation } from '@/lib/use-async-operation'
import { ErrorService } from '@/lib/error-service'
import { useFormValidation } from '@/lib/use-form-validation'
import { Validators } from '@/lib/validators'
import { Home, Coffee } from 'lucide-react'

function SignUpPageContent() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const [specificError, setSpecificError] = useState<string | null>(null)
  const [generatedNickname, setGeneratedNickname] = useState<string | null>(null)

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
    
    // Use Supabase's built-in signUp method
    const { data, error } = await supabase.auth.signUp({
      email: form.values.email,
      password: form.values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          nickname: form.values.email.split('@')[0] + Math.floor(Math.random() * 1000)
        }
      }
    })

    if (error) {
      let errorMessage = error.message
      
      // Provide more specific and friendly error messages
      if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
        errorMessage = '📧 Dit email adres is al geregistreerd. Probeer in te loggen of gebruik een ander email adres.'
      } else if (errorMessage.includes('Invalid email')) {
        errorMessage = '📧 Voer een geldig email adres in.'
      } else if (errorMessage.includes('password')) {
        errorMessage = '🔒 Wachtwoord moet minimaal 8 karakters lang zijn.'
      } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        errorMessage = '🌐 Netwerk probleem. Controleer je internet verbinding en probeer opnieuw.'
      } else if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
        errorMessage = '⏰ Te veel pogingen. Wacht even en probeer opnieuw.'
      } else {
        errorMessage = `😅 ${errorMessage}`
      }
      
      setSpecificError(errorMessage)
      throw new Error(errorMessage)
    }

    console.log('User created successfully')
    
    // Store the generated nickname from user metadata
    const nickname = data?.user?.user_metadata?.nickname
    if (nickname) {
      setGeneratedNickname(nickname)
    }
    
    // Supabase will automatically send verification email
    // The user profile will be created automatically by database triggers

    return data
  }, {
    onSuccess: (data: any) => {
        console.log(`🎉 Account created! Je bijnaam is: ${data.nickname || 'Onbekend'}`)
      // Redirect to email verification page
      const verifyUrl = `/auth/verify-email?email=${encodeURIComponent(form.values.email)}&message=check_email`
        router.push(verifyUrl)
    },
    onError: (err) => {
      console.error('Signup error:', err)
      // Don't show toast if we already set a specific error
      if (!specificError) {
        console.error('Registration error:', err)
      }
    },
  })

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit((values) => {
      signUpAsync()
    })(e)
  }

  // Show success state with email verification
  if (generatedNickname) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-amber-700 mb-1">Account Aangemaakt! 🎉</CardTitle>
            <CardDescription className="text-base text-gray-500">
              Controleer je email voor verificatie
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-blue-800 font-medium mb-2">📧 Email Verificatie</p>
              <p className="text-blue-600 text-sm">
                We hebben een verificatie email gestuurd naar:<br/>
                <strong>{form.values.email}</strong>
              </p>
              <p className="text-blue-600 text-xs mt-2">
                Klik op de link in de email om je account te activeren
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-800 font-medium mb-2">Je bijnaam:</p>
              <p className="text-green-600 text-lg font-bold">{generatedNickname}</p>
              <p className="text-green-600 text-sm mt-2">
                Je kunt deze later aanpassen in je profiel
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/auth/verify-email?email=' + encodeURIComponent(form.values.email))}
                className="w-full bg-amber-600 hover:bg-amber-700 text-lg font-semibold"
              >
                📧 Ga naar Verificatie
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => router.push('/auth/signin')}
                className="w-full"
              >
                Inloggen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
              
              {/* Password Strength Indicator */}
              <PasswordStrength password={form.values.password} />
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
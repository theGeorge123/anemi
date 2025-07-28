"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabase } from '@/components/SupabaseProvider'
import { useAsyncOperation } from '@/lib/use-async-operation'
import { useFormValidation } from '@/lib/use-form-validation'
import { Validators } from '@/lib/validators'
import { Home, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

function ResetPasswordPageContent() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)
  const [isValidResetLink, setIsValidResetLink] = useState(false)

  const form = useFormValidation({
    password: '',
    confirmPassword: '',
  }, {
    password: [Validators.required, Validators.minLength(8)],
    confirmPassword: [Validators.required],
  })

  // Custom validation for password confirmation
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  
  useEffect(() => {
    if (form.values.password && form.values.confirmPassword) {
      if (form.values.password !== form.values.confirmPassword) {
        setConfirmPasswordError('Wachtwoorden komen niet overeen')
      } else {
        setConfirmPasswordError('')
      }
    }
  }, [form.values.password, form.values.confirmPassword])

  const {
    execute: resetPassword,
    isLoading: resettingPassword,
    error: resetError,
  } = useAsyncOperation(async () => {
    if (!supabase) throw new Error('No Supabase client')
    
    const { error } = await supabase.auth.updateUser({
      password: form.values.password
    })
    
    if (error) {
      throw error
    }
  }, {
    onSuccess: () => {
      setPasswordReset(true)
    },
    onError: (err) => {
      console.error('Password reset error:', err)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit((values) => {
      if (values.password !== values.confirmPassword) {
        setConfirmPasswordError('Wachtwoorden komen niet overeen')
        return
      }
      resetPassword()
    })(e)
  }

  // Check if we have a valid reset link
  useEffect(() => {
    // For password reset, we need to check if the user is authenticated
    // The resetPasswordForEmail method should have set up the session
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (session && !error) {
        console.log('Valid session found for password reset')
        setIsValidResetLink(true)
      } else {
        console.error('No valid session found for password reset')
        console.error('Ongeldige of ontbrekende reset link. Vraag een nieuwe reset link aan.')
        setIsValidResetLink(false)
      }
    }

    checkSession()
  }, [supabase])

  if (passwordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700 mb-1">✅ Wachtwoord Gewijzigd!</CardTitle>
            <CardDescription className="text-base text-gray-500">
              Je wachtwoord is succesvol gereset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm">
                Je kunt nu inloggen met je nieuwe wachtwoord.
              </p>
            </div>
            
            <Link href="/auth/signin">
              <Button className="w-full bg-amber-500 hover:bg-amber-600">
                Inloggen met Nieuw Wachtwoord
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Terug naar Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error if reset link is invalid
  if (!isValidResetLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-700 mb-1">❌ Ongeldige Reset Link</CardTitle>
            <CardDescription className="text-base text-gray-500">
              Deze reset link is ongeldig of verlopen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">
                Vraag een nieuwe wachtwoord reset link aan.
              </p>
            </div>
            
            <Link href="/auth/forgot-password">
              <Button className="w-full bg-amber-500 hover:bg-amber-600">
                Nieuwe Reset Link Aanvragen
              </Button>
            </Link>
            
            <Link href="/auth/signin">
              <Button variant="outline" className="w-full">
                Terug naar Inloggen
              </Button>
            </Link>
          </CardContent>
        </Card>
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
          <CardTitle className="text-3xl font-bold text-amber-700 mb-1">🔐 Nieuw Wachtwoord</CardTitle>
          <CardDescription className="text-base text-gray-500">
            Kies een sterk nieuw wachtwoord voor je account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">Nieuw Wachtwoord</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Voer je nieuwe wachtwoord in"
                  value={form.values.password}
                  onChange={(e) => form.handleChange('password')(e)}
                  onBlur={form.handleBlur('password')}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.errors.password && <p className="text-red-500 text-sm">{form.errors.password}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Bevestig Nieuw Wachtwoord</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Voer je nieuwe wachtwoord opnieuw in"
                  value={form.values.confirmPassword}
                  onChange={(e) => form.handleChange('confirmPassword')(e)}
                  onBlur={form.handleBlur('confirmPassword')}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
            </div>
            
            {/* Error message */}
            {resetError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  ❌ {resetError.message || 'Er ging iets mis bij het wijzigen van je wachtwoord. Probeer opnieuw.'}
                </p>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg font-semibold" 
              disabled={resettingPassword || form.values.password !== form.values.confirmPassword || !!confirmPasswordError}
            >
              {resettingPassword ? '🔄 Wachtwoord Wijzigen...' : '🔐 Wachtwoord Wijzigen'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <Link href="/auth/signin" className="text-amber-700 hover:underline font-medium">
              ← Terug naar Inloggen
            </Link>
          </div>
          
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700">
              <strong>💡 Tip:</strong> Kies een sterk wachtwoord met minimaal 8 karakters
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold text-amber-700 mb-1">🔐 Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  )
} 
"use client"

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabase } from '@/components/SupabaseProvider'
import { useAsyncOperation } from '@/lib/use-async-operation'
import { useFormValidation } from '@/lib/use-form-validation'
import { Validators } from '@/lib/validators'
import { Home, Mail, ArrowLeft } from 'lucide-react'

function ForgotPasswordPageContent() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')

  const form = useFormValidation({
    email: '',
  }, {
    email: [Validators.required, Validators.email],
  })

  const {
    execute: sendResetEmail,
    isLoading: sendingEmail,
    error: sendError,
  } = useAsyncOperation(async () => {
    if (!supabase) throw new Error('No Supabase client')
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/verify`,
    })
    
    if (error) {
      throw error
    }
  }, {
    onSuccess: () => {
      setEmailSent(true)
    },
    onError: (err) => {
      console.error('Password reset error:', err)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit((values) => {
      setEmail(values.email)
      sendResetEmail()
    })(e)
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700 mb-1">📧 Email Verzonden!</CardTitle>
            <CardDescription className="text-base text-gray-500">
              We hebben een wachtwoord reset link naar je email gestuurd
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <p className="text-green-700 text-sm">
                  Controleer je inbox (en spam folder) voor een email met de titel &quot;Wachtwoord Reset - Anemi Meets&quot;.
                  Klik op de link in de email om je wachtwoord te resetten.
                </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  setEmailSent(false)
                  form.setValues({ email: '' })
                }}
                className="w-full bg-amber-500 hover:bg-amber-600"
              >
                Nog een email versturen
              </Button>
              
              <Link href="/auth/signin">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Terug naar Inloggen
                </Button>
              </Link>
            </div>
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
          <CardTitle className="text-3xl font-bold text-amber-700 mb-1">🔐 Wachtwoord Vergeten?</CardTitle>
          <CardDescription className="text-base text-gray-500">
            Geen zorgen! Voer je email in en we sturen je een reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
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
            
            {/* Error message */}
            {sendError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  {sendError.message === 'User not found' 
                    ? '❌ Geen account gevonden met dit email adres. Controleer je email of maak een nieuw account aan.'
                    : `❌ ${sendError.message || 'Er ging iets mis. Probeer opnieuw.'}`
                  }
                </p>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg font-semibold" 
              disabled={sendingEmail}
            >
              {sendingEmail ? '🔄 Versturen...' : '📧 Reset Link Versturen'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <Link href="/auth/signin" className="text-amber-700 hover:underline font-medium">
              ← Terug naar Inloggen
            </Link>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-400">
            <p>Geen account?{' '}
              <Link href="/auth/signup" className="text-amber-600 hover:underline">
                Registreer hier
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ForgotPasswordPage() {
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
      <ForgotPasswordPageContent />
    </Suspense>
  )
} 
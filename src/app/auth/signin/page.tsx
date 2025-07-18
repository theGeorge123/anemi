"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function SignInPage() {
  const { client } = useSupabase()
  const router = useRouter()

  const form = useFormValidation({
    email: '',
    password: '',
  }, {
    email: [Validators.required, Validators.email],
    password: [Validators.required, Validators.minLength(8)],
  })

  const {
    execute: signInAsync,
    isLoading: signInLoading,
    error: signInError,
  } = useAsyncOperation(async () => {
    if (!client) throw new Error('No Supabase client')
    const { error } = await client.auth.signInWithPassword({
      email: form.values.email,
      password: form.values.password,
    })
    if (error) throw error
  }, {
    onSuccess: () => {
      ErrorService.showToast('Signed in successfully!', 'success')
      router.push('/dashboard')
    },
    onError: (err) => {
      ErrorService.showToast(ErrorService.handleError(err), 'error')
    },
  })

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit((values) => {
      signInAsync()
    })(e)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold text-amber-700 mb-1">Sign in</CardTitle>
            <CardDescription className="text-base text-gray-500">Welcome back! Sign in to your account to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.values.email}
                  onChange={(e) => form.handleChange('email')(e)}
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
                  placeholder="Enter your password"
                  value={form.values.password}
                  onChange={(e) => form.handleChange('password')(e)}
                  onBlur={form.handleBlur('password')}
                  required
                />
                {form.errors.password && <p className="text-red-500">{form.errors.password}</p>}
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-lg font-semibold" disabled={signInLoading}>
                {signInLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-amber-700 hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
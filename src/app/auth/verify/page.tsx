"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center">
      <h1 className="text-4xl font-extrabold mb-4 text-amber-700">📬 Check your email!</h1>
      <p className="mb-6 text-lg max-w-xl mx-auto">
        We just sent you a verification link. Click it to activate your account and start your coffee adventure.<br/>
        Didn&apos;t get the email? Check your spam folder or <span className="font-semibold">try signing up again</span>.
      </p>
      <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg text-lg mb-3 shadow-md transition">
        <Link href="/auth/signin">Sign In</Link>
      </Button>
      <div className="text-gray-600 mt-2">
        Ready to explore? <Link href="/" className="text-amber-700 hover:underline font-semibold">Back to Home</Link>
      </div>
    </div>
  )
} 
"use client"
import React, { useState, useEffect } from 'react'
import { useSupabase } from './SupabaseProvider'
import { useRouter } from 'next/navigation'

export function withAuth(Page: React.ComponentType) {
  return function Protected(props: any) {
    const { session, client } = useSupabase()
    const router = useRouter()
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
      setHasMounted(true)
    }, [])

    // Always render loading on first mount (SSR and first client render)
    if (!hasMounted) return <div>Loading...</div>
    if (!client) return <div>Loading...</div>
    if (!session) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4 text-center">
          <h2 className="text-4xl font-extrabold mb-4">👋 Hey coffee lover!</h2>
          <p className="mb-6 text-lg max-w-xl mx-auto">
            To start your coffee adventure, you need to <span className="font-semibold text-amber-700">sign in</span>.<br/>
            No account yet? No worries! Creating one is as quick and easy as brewing an espresso ☕️✨
          </p>
          <button
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg text-lg mb-3 shadow-md transition"
            onClick={() => router.push('/auth/signin')}
          >
            Sign In &rarr;
          </button>
          <div className="text-gray-600">
            <span>New here?</span>{' '}
            <a href="/auth/signup" className="text-amber-700 hover:underline font-semibold">Create an account</a>
          </div>
        </div>
      )
    }

    return <Page {...props} />
  }
} 
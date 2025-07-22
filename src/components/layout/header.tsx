"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useSupabase } from '@/components/SupabaseProvider'

export function Header() {
  const { session, supabase } = useSupabase()
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="lg" showText />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {supabase && session && (
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Mijn Meetups
            </Link>
          )}
        </nav>

        {supabase && session && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Welkom, {session.user.email}
            </div>
            <Button
              onClick={async () => {
                if (supabase) {
                  await supabase.auth.signOut()
                }
              }}
              variant="outline"
              size="sm"
            >
              Uitloggen
            </Button>
          </div>
        )}

        {supabase && session ? (
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/auth/signin">
            <Button variant="outline" size="sm">
              Inloggen
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
} 
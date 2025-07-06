"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useSupabase } from '@/components/SupabaseProvider'

export function Header() {
  const { session, client } = useSupabase()
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="lg" showText />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/meetups" className="text-sm font-medium transition-colors hover:text-primary">
            Meetups
          </Link>
          <Link href="/coffee-shops" className="text-sm font-medium transition-colors hover:text-primary">
            Coffee Shops
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
          {client && session && (
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              My Meetups
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {client && session ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  if (client) {
                    await client.auth.signOut()
                  }
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
} 
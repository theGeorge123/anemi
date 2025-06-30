"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Anemi Meets</span>
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
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
          <Button size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
} 
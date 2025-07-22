"use client"

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Anemi Meets</h3>
            <p className="text-sm text-muted-foreground">
              Verbind met je community over koffie. Ontdek lokale meetups en koffie shops.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/create" className="text-muted-foreground hover:text-foreground">
                  Meetup Maken
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Ondersteuning</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:team@anemimeets.com" className="text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </li>
              <li>
                <a href="/api/health" className="text-muted-foreground hover:text-foreground">
                  Systeem Status
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Rechtelijk</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-muted-foreground hover:text-foreground">
                  Gebruiksvoorwaarden
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Anemi Meets. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  )
} 
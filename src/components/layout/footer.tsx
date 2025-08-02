"use client"

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
      <div className="container py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-display font-bold text-foreground">Anemi Meets</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Verbind met je community over koffie. Ontdek lokale meetups en koffie shops.
            </p>
          </div>
          
          {/* Platform Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-display font-semibold text-foreground">Platform</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Meetup Maken
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Home
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-display font-semibold text-foreground">Ondersteuning</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/system-status" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Systeem Status
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-display font-semibold text-foreground">Rechtelijk</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li>
                <Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Gebruiksvoorwaarden
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-amber-200">
          <p className="text-center text-sm sm:text-base text-muted-foreground">
            © 2024 Anemi Meets. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  )
} 
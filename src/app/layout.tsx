import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import '@/styles/globals.css'
import { SupabaseProvider } from '@/components/SupabaseProvider'
import { Toaster, ToasterProvider } from '@/components/ui/toaster'
import { LayoutWrapper } from '@/components/layout/LayoutWrapper'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { GlobalErrorHandler } from '@/components/GlobalErrorHandler'
import { EnvironmentBanner } from '@/components/EnvironmentBanner'
import { BackgroundAgentProvider } from '@/components/BackgroundAgentProvider'
import { SessionManager } from '@/components/SessionManager'
import { validateStartup } from '@/lib/startup'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Anemi Meets - Herverbind Over Koffie',
  description: 'Plan koffie meetups met vrienden en ontdek geweldige cafés samen.',
  keywords: 'koffie, meetups, cafés, vrienden, sociaal, herverbinden',
  authors: [{ name: 'Anemi Meets' }],
  creator: 'Anemi Meets',
  publisher: 'Anemi Meets',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Anemi Meets - Herverbind Over Koffie',
    description: 'Plan koffie meetups met vrienden en ontdek geweldige cafés samen.',
    url: '/',
    siteName: 'Anemi Meets',
    images: [
      {
        url: '/screenshot-desktop.png',
        width: 1200,
        height: 630,
        alt: 'Anemi Meets - Herverbind Over Koffie',
      },
    ],
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anemi Meets - Herverbind Over Koffie',
    description: 'Plan koffie meetups met vrienden en ontdek geweldige cafés samen.',
    images: ['/screenshot-desktop.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

// Initialize startup validation
if (typeof window === 'undefined') {
  // Server-side startup validation
  validateStartup().catch(error => {
    console.error('❌ Startup validation failed:', error)
  })
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <ErrorBoundary>
          <GlobalErrorHandler>
            <EnvironmentBanner />
            <ToasterProvider>
            <SupabaseProvider>
              <SessionManager>
                <BackgroundAgentProvider autoRegister={true} enableNotifications={true}>
                  <LayoutWrapper>
                    {children}
                  </LayoutWrapper>
                </BackgroundAgentProvider>
              </SessionManager>
              <Toaster />
            </SupabaseProvider>
            </ToasterProvider>
          </GlobalErrorHandler>
        </ErrorBoundary>
      </body>
    </html>
  )
} 
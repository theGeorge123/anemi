import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { SupabaseProvider } from '@/components/SupabaseProvider'
import { Toaster } from '@/components/ui/toaster'
import { LayoutWrapper } from '@/components/layout/LayoutWrapper'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { EnvironmentBanner, EnvironmentStatus } from '@/components/EnvironmentBanner'
import { validateStartup } from '@/lib/startup'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Anemi Meets - Coffee Shop Meetups',
  description: 'Plan coffee shop meetups with friends and discover great cafes together.',
  keywords: 'coffee, meetups, cafes, friends, social',
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
    title: 'Anemi Meets - Coffee Shop Meetups',
    description: 'Plan coffee shop meetups with friends and discover great cafes together.',
    url: '/',
    siteName: 'Anemi Meets',
    images: [
      {
        url: '/screenshot-desktop.png',
        width: 1200,
        height: 630,
        alt: 'Anemi Meets - Coffee Shop Meetups',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anemi Meets - Coffee Shop Meetups',
    description: 'Plan coffee shop meetups with friends and discover great cafes together.',
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
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <EnvironmentBanner />
          <SupabaseProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster />
          </SupabaseProvider>
          <EnvironmentStatus />
        </ErrorBoundary>
      </body>
    </html>
  )
} 
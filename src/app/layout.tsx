import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import ClientRoot from '@/components/ClientRoot';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@/components/analytics';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Anemi Meets - Coffee Shop Meetups & Community',
    template: '%s | Anemi Meets',
  },
  description: 'Create coffee meetups and discover great local spots with friends.',
  keywords: [
    'coffee shop meetups',
    'local community',
    'coffee discovery',
    'meetup platform',
    'social networking',
    'location-based meetups',
  ],
  authors: [{ name: 'Anemi Team' }],
  creator: 'Anemi Team',
  publisher: 'Anemi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Anemi Meets - Coffee Shop Meetups & Community',
    description: 'Create coffee meetups and discover great local spots with friends.',
    siteName: 'Anemi Meets',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anemi Meets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anemi Meets - Coffee Shop Meetups & Community',
    description: 'Create coffee meetups and discover great local spots with friends.',
    images: ['/og-image.png'],
    creator: '@anemi_meets',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Anemi Meets" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ClientRoot>
          <div className="min-h-screen bg-background">
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
          <Analytics />
        </ClientRoot>
      </body>
    </html>
  );
} 
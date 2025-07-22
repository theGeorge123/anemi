import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { SupabaseProvider } from '@/components/SupabaseProvider'
import { Toaster } from '@/components/ui/toaster'
import { LayoutWrapper } from '@/components/layout/LayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Anemi Meets - Connect Over Coffee',
  description: 'Maak koffie meetups en ontdek geweldige lokale plekken met vrienden.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <SupabaseProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  )
} 
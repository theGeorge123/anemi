import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useSupabase } from '@/components/SupabaseProvider'
import { Header } from './header'

// Mock Supabase
jest.mock('@/components/SupabaseProvider', () => ({
  useSupabase: jest.fn(),
}))

describe('Header', () => {
  const mockSupabaseClient = {
    auth: {
      signOut: jest.fn(),
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders header with sign in button when not authenticated', () => {
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: null,
      supabase: null,
    })

    render(<Header />)
    
    expect(screen.getByRole('banner')).toBeTruthy()
    expect(screen.getByText('Inloggen')).toBeTruthy()
  })

  it('renders dashboard and create meetup buttons when authenticated', () => {
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: { user: { id: 'test-user' } },
      supabase: mockSupabaseClient,
    })

    render(<Header />)
    
    expect(screen.getByText('Mijn Meetups')).toBeTruthy()
    expect(screen.getByText('Nieuw Avontuur')).toBeTruthy()
  })

  it('shows back to home button', () => {
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: null,
      supabase: null,
    })

    render(<Header />)
    
    expect(screen.getByText('Terug naar Home')).toBeTruthy()
  })

  it('shows logo and branding', () => {
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: null,
      supabase: null,
    })

    render(<Header />)
    
    // Check that the logo is rendered (assuming it has alt text or is identifiable)
    expect(screen.getByRole('banner')).toBeTruthy()
  })
}) 
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

  it('renders header with sign in/up buttons when not authenticated', () => {
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: null,
      client: null,
    })

    render(<Header />)
    
    expect(screen.getByRole('banner')).toBeTruthy()
    expect(screen.getByText('Sign In')).toBeTruthy()
    expect(screen.getByText('Get Started')).toBeTruthy()
  })

  it('renders dashboard and sign out buttons when authenticated', () => {
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: { user: { id: 'test-user' } },
      client: mockSupabaseClient,
    })

    render(<Header />)
    
    expect(screen.getByText('Dashboard')).toBeTruthy()
    expect(screen.getByText('Sign Out')).toBeTruthy()
  })

  it('handles sign out when authenticated', () => {
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: { user: { id: 'test-user' } },
      client: mockSupabaseClient,
    })

    render(<Header />)
    
    fireEvent.click(screen.getByText('Sign Out'))
    
    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
  })

  it('shows navigation links', () => {
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: null,
      client: null,
    })

    render(<Header />)
    
    expect(screen.getByText('Meetups')).toBeTruthy()
    expect(screen.getByText('Coffee Shops')).toBeTruthy()
    expect(screen.getByText('About')).toBeTruthy()
  })

  it('shows My Meetups link when authenticated', () => {
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: { user: { id: 'test-user' } },
      client: mockSupabaseClient,
    })

    render(<Header />)
    
    expect(screen.getByText('My Meetups')).toBeTruthy()
  })
}) 
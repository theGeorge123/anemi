import React from 'react'
import { render, screen } from '@testing-library/react'
import { SupabaseProvider, useSupabase } from './SupabaseProvider'

// Mock Supabase client
jest.mock('@/lib/supabase-browser', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
    },
  },
}))

// Test component to use the hook
const TestComponent = () => {
  const { session, client } = useSupabase()
  return (
    <div>
      <span data-testid="session">{session ? 'authenticated' : 'not-authenticated'}</span>
      <span data-testid="client">{client ? 'client-available' : 'no-client'}</span>
    </div>
  )
}

describe('SupabaseProvider', () => {
  it('renders children', () => {
    render(
      <SupabaseProvider>
        <div>Test content</div>
      </SupabaseProvider>
    )
    
    expect(screen.getByText('Test content')).toBeTruthy()
  })

  it('provides context to children', () => {
    render(
      <SupabaseProvider>
        <TestComponent />
      </SupabaseProvider>
    )
    
    expect(screen.getByTestId('session')).toBeTruthy()
    expect(screen.getByTestId('client')).toBeTruthy()
  })

  it('throws error when useSupabase is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useSupabase must be used within SupabaseProvider')
    
    consoleSpy.mockRestore()
  })
}) 
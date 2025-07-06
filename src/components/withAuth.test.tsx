import React from 'react'
import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useSupabase } from './SupabaseProvider'
import { withAuth } from './withAuth'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock Supabase
jest.mock('./SupabaseProvider', () => ({
  useSupabase: jest.fn(),
}))

// Test component
const TestComponent = () => <div>Protected Content</div>

describe('withAuth HOC', () => {
  const mockRouter = {
    replace: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('renders protected component when authenticated', () => {
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: { user: { id: 'test-user' } },
      client: { auth: {} },
    })

    const ProtectedComponent = withAuth(TestComponent)
    render(<ProtectedComponent />)
    
    expect(screen.getByText('Protected Content')).toBeTruthy()
  })

  it('redirects to login when not authenticated', () => {
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: null,
      client: { auth: {} },
    })

    const ProtectedComponent = withAuth(TestComponent)
    render(<ProtectedComponent />)
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/login')
  })

  it('shows loading when client is not available', () => {
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: null,
      client: null,
    })

    const ProtectedComponent = withAuth(TestComponent)
    render(<ProtectedComponent />)
    
    expect(screen.getByText('Loading...')).toBeTruthy()
  })

  it('does not redirect when client is not available', () => {
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: null,
      client: null,
    })

    const ProtectedComponent = withAuth(TestComponent)
    render(<ProtectedComponent />)
    
    expect(mockRouter.replace).not.toHaveBeenCalled()
  })
}) 
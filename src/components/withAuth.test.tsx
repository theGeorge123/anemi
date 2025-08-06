import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { useRouter, usePathname } from 'next/navigation'
import { useSupabase } from './SupabaseProvider'
import { withAuth } from './withAuth'

jest.mock('next/navigation')
jest.mock('./SupabaseProvider')

const mockUseRouter = useRouter as jest.Mock
const mockUsePathname = usePathname as jest.Mock
const mockUseSupabase = useSupabase as jest.Mock

const TestComponent = () => <div>Protected Content</div>

describe('withAuth HOC', () => {
  let mockReplace: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockReplace = jest.fn()
    mockUseRouter.mockReturnValue({ replace: mockReplace })
    mockUsePathname.mockReturnValue('/dashboard')
  })

  it('shows loading state when Supabase is loading', () => {
    mockUseSupabase.mockReturnValue({ loading: true, session: null })
    const ProtectedComponent = withAuth(TestComponent)
    render(<ProtectedComponent />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('redirects to login when not authenticated', async () => {
    mockUseSupabase.mockReturnValue({ loading: false, session: null })
    const ProtectedComponent = withAuth(TestComponent)
    render(<ProtectedComponent />)
    
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/auth/signin?redirect=/dashboard')
    })
  })

  it('does not redirect when on an auth page', () => {
    mockUsePathname.mockReturnValue('/auth/signin')
    mockUseSupabase.mockReturnValue({ loading: false, session: null })
    const ProtectedComponent = withAuth(TestComponent)
    render(<ProtectedComponent />)
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('renders component when authenticated', () => {
    mockUseSupabase.mockReturnValue({
      loading: false,
      session: { user: { id: 'test-user' } },
    })
    const ProtectedComponent = withAuth(TestComponent)
    render(<ProtectedComponent />)
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
}) 
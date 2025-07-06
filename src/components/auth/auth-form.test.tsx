import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/SupabaseProvider'
import SignInPage from '@/app/auth/signin/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock Supabase
jest.mock('@/components/SupabaseProvider', () => ({
  useSupabase: jest.fn(),
}))

// Mock toast
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}))

describe('SignInPage', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  const mockSupabaseClient = {
    auth: {
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useSupabase as jest.Mock).mockReturnValue({
      client: mockSupabaseClient,
    })
  })

  it('renders sign in form', () => {
    render(<SignInPage />)
    
    expect(screen.getByText('Welcome back')).toBeTruthy()
    expect(screen.getByLabelText('Email')).toBeTruthy()
    expect(screen.getByLabelText('Password')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeTruthy()
  })

  it('handles form submission', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      error: null,
    })

    render(<SignInPage />)
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('handles Google sign in', async () => {
    mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
      error: null,
    })

    render(<SignInPage />)
    
    fireEvent.click(screen.getByRole('button', { name: 'Google' }))

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/dashboard'),
        },
      })
    })
  })

  it('shows loading state during submission', async () => {
    mockSupabaseClient.auth.signInWithPassword.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
    )

    render(<SignInPage />)
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeTruthy()
  })
}) 
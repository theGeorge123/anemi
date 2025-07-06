import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/SupabaseProvider'
import SignUpPage from './page'

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

describe('SignUpPage', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  const mockSupabaseClient = {
    auth: {
      signUp: jest.fn(),
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

  it('renders sign up form', () => {
    render(<SignUpPage />)
    
    expect(screen.getByText('Create an account')).toBeTruthy()
    expect(screen.getByLabelText('Email')).toBeTruthy()
    expect(screen.getByLabelText('Password')).toBeTruthy()
    expect(screen.getByLabelText('Confirm Password')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeTruthy()
  })

  it('validates password confirmation', async () => {
    render(<SignUpPage />)
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'differentpassword' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signUp).not.toHaveBeenCalled()
    })
  })

  it('handles successful sign up', async () => {
    mockSupabaseClient.auth.signUp.mockResolvedValue({
      error: null,
    })

    render(<SignUpPage />)
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    await waitFor(() => {
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: expect.stringContaining('/auth/verify'),
        },
      })
    })
  })

  it('handles Google sign up', async () => {
    mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
      error: null,
    })

    render(<SignUpPage />)
    
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
}) 
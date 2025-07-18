import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignInPage from '@/app/auth/signin/page'
import { useSupabase } from '@/components/SupabaseProvider'

// Mock the Supabase provider
jest.mock('@/components/SupabaseProvider', () => ({
  useSupabase: jest.fn(),
}))

// Mock the form validation hook
jest.mock('@/lib/use-form-validation', () => ({
  useFormValidation: jest.fn(() => ({
    form: {
      values: { email: '', password: '' },
      handleSubmit: jest.fn((fn) => fn),
      handleChange: jest.fn((field) => jest.fn()),
      handleBlur: jest.fn((field) => jest.fn()),
    },
    errors: {},
    isValid: true,
  })),
}))

// Mock the async operation hook
jest.mock('@/lib/use-async-operation', () => ({
  useAsyncOperation: jest.fn(() => ({
    execute: jest.fn(),
    isLoading: false,
    error: null,
  })),
}))

describe('SignInPage', () => {
  const mockSupabaseClient = {
    auth: {
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSupabase as jest.Mock).mockReturnValue({
      client: mockSupabaseClient,
      session: null,
    })
  })

  it('renders sign in form', () => {
    render(<SignInPage />)
    
    expect(screen.getByText('Sign in')).toBeTruthy()
    expect(screen.getByText('Welcome back! Sign in to your account to continue.')).toBeTruthy()
    expect(screen.getByLabelText('Email')).toBeTruthy()
    expect(screen.getByLabelText('Password')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeTruthy()
  })

  it('handles form submission', async () => {
    const mockExecute = jest.fn()
    ;(require('@/lib/use-async-operation').useAsyncOperation as jest.Mock).mockReturnValue({
      execute: mockExecute,
      isLoading: false,
      error: null,
    })

    render(<SignInPage />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalled()
    })
  })

  it('shows loading state during sign in', () => {
    ;(require('@/lib/use-async-operation').useAsyncOperation as jest.Mock).mockReturnValue({
      execute: jest.fn(),
      isLoading: true,
      error: null,
    })

    render(<SignInPage />)
    
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeDisabled()
  })

  it('shows error message on sign in failure', () => {
    ;(require('@/lib/use-async-operation').useAsyncOperation as jest.Mock).mockReturnValue({
      execute: jest.fn(),
      isLoading: false,
      error: 'Sign in failed',
    })

    render(<SignInPage />)
    
    expect(screen.getByText('Sign in failed')).toBeTruthy()
  })
}) 
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUpPage from './page'
import { useSupabase } from '@/components/SupabaseProvider'

// Mock the Supabase provider
jest.mock('@/components/SupabaseProvider', () => ({
  useSupabase: jest.fn(),
}))

// Mock the form validation hook
jest.mock('@/lib/use-form-validation', () => ({
  useFormValidation: jest.fn(() => ({
    form: {
      values: { email: '', password: '', confirmPassword: '' },
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

describe('SignUpPage', () => {
  const mockSupabaseClient = {
    auth: {
      signUp: jest.fn(),
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

  it('renders sign up form', () => {
    render(<SignUpPage />)
    
    expect(screen.getByText('Create your account')).toBeTruthy()
    expect(screen.getByLabelText('Email')).toBeTruthy()
    expect(screen.getByLabelText('Password')).toBeTruthy()
    expect(screen.getByLabelText('Confirm Password')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeTruthy()
  })

  it('validates password confirmation', async () => {
    const mockExecute = jest.fn()
    ;(require('@/lib/use-async-operation').useAsyncOperation as jest.Mock).mockReturnValue({
      execute: mockExecute,
      isLoading: false,
      error: null,
    })

    render(<SignUpPage />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalled()
    })
  })

  it('handles successful sign up', async () => {
    const mockExecute = jest.fn().mockResolvedValue({ user: { id: '123' } })
    ;(require('@/lib/use-async-operation').useAsyncOperation as jest.Mock).mockReturnValue({
      execute: mockExecute,
      isLoading: false,
      error: null,
    })

    render(<SignUpPage />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalled()
    })
  })

  it('shows loading state during sign up', () => {
    ;(require('@/lib/use-async-operation').useAsyncOperation as jest.Mock).mockReturnValue({
      execute: jest.fn(),
      isLoading: true,
      error: null,
    })

    render(<SignUpPage />)
    
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeDisabled()
  })

  it('shows error message on sign up failure', () => {
    ;(require('@/lib/use-async-operation').useAsyncOperation as jest.Mock).mockReturnValue({
      execute: jest.fn(),
      isLoading: false,
      error: 'Sign up failed',
    })

    render(<SignUpPage />)
    
    expect(screen.getByText('Sign up failed')).toBeTruthy()
  })
}) 
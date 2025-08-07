import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignInPage from '@/app/auth/signin/page'
import { useSupabase } from '@/components/SupabaseProvider'

// Mock the Supabase provider to avoid actual API calls
jest.mock('@/components/SupabaseProvider', () => ({
  useSupabase: jest.fn(),
}))

// Mock useAsyncOperation
jest.mock('@/lib/use-async-operation', () => ({
  useAsyncOperation: jest.fn(),
}))

describe('SignInPage', () => {
  let mockSupabase: any
  let mockUseAsyncOperation: any

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()

    // Deep mock of the Supabase client
    mockSupabase = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
        signInWithOAuth: jest.fn().mockResolvedValue({ error: null }),
      },
    }

    // Mock the return value of useSupabase
    ;(useSupabase as jest.Mock).mockReturnValue({
      supabase: mockSupabase,
      session: null,
      loading: false,
    })

    // Mock useAsyncOperation
    mockUseAsyncOperation = {
      execute: jest.fn(),
      isLoading: false,
      error: null,
    }
    
    const { useAsyncOperation } = require('@/lib/use-async-operation')
    ;(useAsyncOperation as jest.Mock).mockReturnValue(mockUseAsyncOperation)
  })

  it('renders sign in form correctly', () => {
    render(<SignInPage />)
    // Check for more specific text to ensure the correct component is rendered
    expect(screen.getByText('☕ Welkom Terug!')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Wachtwoord')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '☕ Log In' })).toBeInTheDocument()
  })

  it('allows user to type in email and password fields', () => {
    render(<SignInPage />)
    const emailInput = screen.getByLabelText('E-mail')
    const passwordInput = screen.getByLabelText('Wachtwoord')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('handles form submission and calls Supabase auth', async () => {
    render(<SignInPage />)
    
    const emailInput = screen.getByLabelText('E-mail')
    const passwordInput = screen.getByLabelText('Wachtwoord')
    const submitButton = screen.getByRole('button', { name: '☕ Log In' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockUseAsyncOperation.execute).toHaveBeenCalled()
    })
  })

  it('shows loading state during sign in', async () => {
    // Make the loading state true
    mockUseAsyncOperation.isLoading = true

    render(<SignInPage />)
    
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Wachtwoord'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: '🔄 Inloggen...' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '🔄 Inloggen...' })).toBeDisabled()
    })
  })
}) 
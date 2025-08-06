import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignInPage from '@/app/auth/signin/page'
import { useSupabase } from '@/components/SupabaseProvider'

// Mock the Supabase provider to avoid actual API calls
jest.mock('@/components/SupabaseProvider', () => ({
  useSupabase: jest.fn(),
}))

// We are not mocking useFormValidation or useAsyncOperation anymore
// to allow for more integrated testing.

describe('SignInPage', () => {
  let mockSupabase: any

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
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('shows loading state during sign in', async () => {
    // Make the promise hang
    mockSupabase.auth.signInWithPassword.mockImplementation(() => new Promise(() => {}))

    render(<SignInPage />)
    
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Wachtwoord'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: '☕ Log In' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '🔄 Inloggen...' })).toBeDisabled()
    })
  })

  it('shows an error message on sign in failure', async () => {
    const error = { message: 'Invalid login credentials' }
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ error })

    render(<SignInPage />)

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Wachtwoord'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: '☕ Log In' }))
    
    await waitFor(() => {
      const errorMessage = screen.getByText(/Verkeerde email of wachtwoord/i)
      expect(errorMessage).toBeInTheDocument()
    })
  })
}) 
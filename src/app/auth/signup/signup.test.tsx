import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUpPage from './page'
import { useSupabase } from '@/components/SupabaseProvider'
import { useRouter } from 'next/navigation'

// Mock the Supabase provider
jest.mock('@/components/SupabaseProvider', () => ({
  useSupabase: jest.fn(),
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

describe('SignUpPage', () => {
  let mockSupabase: any
  let mockRouter: any

  beforeEach(() => {
    jest.clearAllMocks()

    mockSupabase = {
      auth: {
        signUp: jest.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null }),
      },
    }

    mockRouter = {
      push: jest.fn(),
    }

    ;(useSupabase as jest.Mock).mockReturnValue({
      supabase: mockSupabase,
      session: null,
      loading: false,
    })

    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('renders sign up form correctly', () => {
    render(<SignUpPage />)
    expect(screen.getByText('Maak je account aan')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Wachtwoord')).toBeInTheDocument()
    expect(screen.getByLabelText('Bevestig Wachtwoord')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Account Aanmaken' })).toBeInTheDocument()
  })

  it('shows password mismatch error', async () => {
    render(<SignUpPage />)
    
    const passwordInput = screen.getByLabelText('Wachtwoord')
    const confirmPasswordInput = screen.getByLabelText('Bevestig Wachtwoord')
    const submitButton = screen.getByRole('button', { name: 'Account Aanmaken' })

    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } })
    fireEvent.blur(confirmPasswordInput)

    const errorMessage = await screen.findByText(/Wachtwoorden komen niet overeen./i)
    expect(errorMessage).toBeInTheDocument()
    expect(mockSupabase.auth.signUp).not.toHaveBeenCalled()
  })

  it('handles successful sign up and redirects', async () => {
    render(<SignUpPage />)
    
    const emailInput = screen.getByLabelText('E-mail')
    const passwordInput = screen.getByLabelText('Wachtwoord')
    const confirmPasswordInput = screen.getByLabelText('Bevestig Wachtwoord')
    const submitButton = screen.getByRole('button', { name: 'Account Aanmaken' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: expect.any(String),
        },
      })
    })

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/auth/verify-email'))
    })
  })

  it('shows loading state during sign up', async () => {
    mockSupabase.auth.signUp.mockImplementation(() => new Promise(() => {}))

    render(<SignUpPage />)
    
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Wachtwoord'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Bevestig Wachtwoord'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Account Aanmaken' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Account aanmaken...' })).toBeDisabled()
    })
  })

  it('shows error message on sign up failure', async () => {
    const error = { message: 'User already registered' }
    mockSupabase.auth.signUp.mockResolvedValue({ data: {}, error })

    render(<SignUpPage />)

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText('Wachtwoord'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText('Bevestig Wachtwoord'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Account Aanmaken' }))
    
    await waitFor(() => {
      expect(screen.getByText('📧 Dit email adres is al geregistreerd. Probeer in te loggen of gebruik een ander email adres.')).toBeInTheDocument()
    })
  })
}) 
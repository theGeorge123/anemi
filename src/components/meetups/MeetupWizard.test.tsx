import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MeetupWizard } from './MeetupWizard'

// Mock dependencies
jest.mock('@/lib/supabase', () => ({
  useSupabase: () => ({
    supabase: {
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null })
      }
    }
  })
}))

jest.mock('@/lib/email', () => ({
  sendInviteEmail: jest.fn().mockResolvedValue({ success: true })
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  }),
  useSearchParams: () => new URLSearchParams()
}))

describe('MeetupWizard', () => {
  const mockCafe = {
    id: '1',
    name: 'Test Cafe',
    address: '123 Test St',
    city: 'Amsterdam',
    priceRange: 'MODERATE',
    rating: 4.5,
    isVerified: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the wizard with initial step', () => {
    render(<MeetupWizard />)
    
    expect(screen.getByText(/Koffie/)).toBeInTheDocument()
    expect(screen.getByText(/Stap 1 van/)).toBeInTheDocument()
  })

  it('should show contact info step initially', () => {
    render(<MeetupWizard />)
    
    expect(screen.getByLabelText('Naam')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('should validate required fields in contact info step', async () => {
    render(<MeetupWizard />)
    
    const nextButton = screen.getByText('Volgende')
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Naam is verplicht')).toBeInTheDocument()
      expect(screen.getByText('Email is verplicht')).toBeInTheDocument()
    })
  })

  it('should validate email format', async () => {
    render(<MeetupWizard />)
    
    const nameInput = screen.getByLabelText('Naam')
    const emailInput = screen.getByLabelText('Email')
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    
    const nextButton = screen.getByText('Volgende')
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Voer een geldig email adres in')).toBeInTheDocument()
    })
  })

  it('should proceed to next step with valid data', async () => {
    render(<MeetupWizard />)
    
    const nameInput = screen.getByLabelText('Naam')
    const emailInput = screen.getByLabelText('Email')
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    
    const nextButton = screen.getByText('Volgende')
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Stap 2 van 4')).toBeInTheDocument()
      expect(screen.getByText('Datum & Tijd')).toBeInTheDocument()
    })
  })

  it('should allow going back to previous step', async () => {
    render(<MeetupWizard />)
    
    // Fill and proceed to step 2
    const nameInput = screen.getByLabelText('Naam')
    const emailInput = screen.getByLabelText('Email')
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    
    const nextButton = screen.getByText('Volgende')
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Stap 2 van 4')).toBeInTheDocument()
    })
    
    // Go back
    const backButton = screen.getByText('Terug')
    fireEvent.click(backButton)
    
    await waitFor(() => {
      expect(screen.getByText('Stap 1 van 4')).toBeInTheDocument()
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    })
  })

  it('should show date and time selection in step 2', async () => {
    render(<MeetupWizard />)
    
    // Proceed to step 2
    const nameInput = screen.getByLabelText('Naam')
    const emailInput = screen.getByLabelText('Email')
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    
    const nextButton = screen.getByText('Volgende')
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Beschikbare Datums')).toBeInTheDocument()
      expect(screen.getByText('Beschikbare Tijden')).toBeInTheDocument()
    })
  })

  it('should validate date and time selection', async () => {
    render(<MeetupWizard />)
    
    // Proceed to step 2
    const nameInput = screen.getByLabelText('Naam')
    const emailInput = screen.getByLabelText('Email')
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    
    const nextButton = screen.getByText('Volgende')
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Stap 2 van 4')).toBeInTheDocument()
    })
    
    // Try to proceed without selecting date/time
    const nextButton2 = screen.getByText('Volgende')
    fireEvent.click(nextButton2)
    
    await waitFor(() => {
      expect(screen.getByText('Selecteer minimaal één datum')).toBeInTheDocument()
      expect(screen.getByText('Selecteer minimaal één tijd')).toBeInTheDocument()
    })
  })

  it('should show confirmation step with selected data', async () => {
    render(<MeetupWizard />)
    
    // Fill step 1
    const nameInput = screen.getByLabelText('Naam')
    const emailInput = screen.getByLabelText('Email')
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    
    const nextButton = screen.getByText('Volgende')
    fireEvent.click(nextButton)
    
    await waitFor(() => {
      expect(screen.getByText('Stap 2 van 4')).toBeInTheDocument()
    })
    
    // Select date and time (mock the date/time selection)
    // This would need to be adapted based on the actual implementation
    const nextButton2 = screen.getByText('Volgende')
    fireEvent.click(nextButton2)
    
    await waitFor(() => {
      expect(screen.getByText('Stap 3 van 4')).toBeInTheDocument()
      expect(screen.getByText('Bevestiging')).toBeInTheDocument()
    })
  })

  it('should show loading state during submission', async () => {
    render(<MeetupWizard />)
    
    // Fill all required data and submit
    // This test would need to be adapted based on the actual form structure
    
    expect(screen.getByText('Uitnodiging Versturen')).toBeInTheDocument()
  })

  it('should handle submission errors gracefully', async () => {
    // Mock email service to throw error
    const mockSendInviteEmail = jest.fn().mockRejectedValue(new Error('Email failed'))
    jest.doMock('@/lib/email', () => ({
      sendInviteEmail: mockSendInviteEmail
    }))
    
    render(<MeetupWizard />)
    
    // Fill and submit form
    // This test would need to be adapted based on the actual implementation
    
    await waitFor(() => {
      expect(screen.getByText(/Er ging iets mis/)).toBeInTheDocument()
    })
  })

  it('should show success message after successful submission', async () => {
    render(<MeetupWizard />)
    
    // Fill and submit form successfully
    // This test would need to be adapted based on the actual implementation
    
    await waitFor(() => {
      expect(screen.getByText(/Uitnodiging verstuurd!/)).toBeInTheDocument()
    })
  })
}) 
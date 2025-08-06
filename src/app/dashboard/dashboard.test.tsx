import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { useSupabase } from '@/components/SupabaseProvider'
import Dashboard from './page'

// Mock Supabase and withAuth HOC
jest.mock('@/components/SupabaseProvider')
jest.mock('@/components/withAuth', () => ({
  withAuth: (Component: React.ComponentType) => (props: any) => <Component {...props} />,
}))

const mockUseSupabase = useSupabase as jest.Mock

describe('Dashboard', () => {
  let mockSupabaseRpc: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    mockSupabaseRpc = jest.fn()

    mockUseSupabase.mockReturnValue({
      supabase: {
        rpc: mockSupabaseRpc,
      },
      session: { user: { id: 'test-user-id' } },
      loading: false,
    })
  })

  it('renders loading state initially', () => {
    mockUseSupabase.mockReturnValue({
      supabase: { rpc: mockSupabaseRpc },
      session: { user: { id: 'test-user-id' } },
      loading: true, // Simulate initial loading state
    })

    render(<Dashboard />)
    expect(screen.getByText('✨ Je dashboard wordt geladen...')).toBeInTheDocument()
  })

  it('fetches and displays meetups successfully', async () => {
    const meetups = [
      { id: '1', title: 'Coffee Meetup 1', date: '2024-01-15T10:00:00Z', status: 'confirmed' },
      { id: '2', title: 'Coffee Meetup 2', date: '2024-01-20T14:00:00Z', status: 'pending' },
    ]
    mockSupabaseRpc.mockResolvedValue({ data: { meetups }, error: null })

    render(<Dashboard />)

    expect(await screen.findByText('Jouw Koffie Meetups')).toBeInTheDocument()
    expect(screen.getByText('Coffee Meetup 1')).toBeInTheDocument()
    expect(screen.getByText('Coffee Meetup 2')).toBeInTheDocument()
    expect(mockSupabaseRpc).toHaveBeenCalledWith('get_user_meetups')
  })

  it('displays an empty state when there are no meetups', async () => {
    mockSupabaseRpc.mockResolvedValue({ data: { meetups: [] }, error: null })

    render(<Dashboard />)

    expect(await screen.findByText('Jouw Koffie Meetups')).toBeInTheDocument()
    expect(screen.getByText('☕ Tijd voor een nieuwe koffie-afspraak?')).toBeInTheDocument()
    expect(screen.getByText('Je hebt nog geen meetups gepland. Klik hieronder om je eerste koffie-date te organiseren!')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Plan je eerste meetup' })).toBeInTheDocument()
  })

  it('displays an error message when fetching meetups fails', async () => {
    mockSupabaseRpc.mockResolvedValue({ data: null, error: new Error('Failed to fetch') })

    render(<Dashboard />)

    expect(await screen.findByText('⚠️ Er ging iets mis')).toBeInTheDocument()
    expect(screen.getByText('We konden je meetups niet laden. Probeer het later opnieuw.')).toBeInTheDocument()
  })
}) 
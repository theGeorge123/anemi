import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { useSupabase } from '@/components/SupabaseProvider'
import Dashboard from './page'

// Mock Supabase
jest.mock('@/components/SupabaseProvider', () => ({
  useSupabase: jest.fn(),
}))

// Mock withAuth HOC
jest.mock('@/components/withAuth', () => ({
  withAuth: (Component: React.ComponentType) => Component,
}))

describe('Dashboard', () => {
  const mockSupabaseClient = {
    from: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSupabase as jest.Mock).mockReturnValue({
      session: { user: { id: 'test-user-id' } },
      client: mockSupabaseClient,
    })
  })

  it('renders dashboard title', () => {
    mockSupabaseClient.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [] }),
      }),
    })

    render(<Dashboard />)
    expect(screen.getByText('My Meetups')).toBeTruthy()
  })

  it('fetches user meetups on mount', async () => {
    const mockSelect = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ data: [] }),
    })
    mockSupabaseClient.from.mockReturnValue({
      select: mockSelect,
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('Meetup')
      expect(mockSelect).toHaveBeenCalledWith('id,title,date')
    })
  })

  it('displays meetups when data is available', async () => {
    const mockMeetups = [
      { id: '1', title: 'Coffee Meetup 1', date: '2024-01-15' },
      { id: '2', title: 'Coffee Meetup 2', date: '2024-01-20' },
    ]

    const mockSelect = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ data: mockMeetups }),
    })
    mockSupabaseClient.from.mockReturnValue({
      select: mockSelect,
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Coffee Meetup 1')).toBeTruthy()
      expect(screen.getByText('Coffee Meetup 2')).toBeTruthy()
    })
  })

  it('handles empty meetups list', async () => {
    const mockSelect = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ data: [] }),
    })
    mockSupabaseClient.from.mockReturnValue({
      select: mockSelect,
    })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('My Meetups')).toBeTruthy()
    })
  })
}) 
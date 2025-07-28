import { NextRequest } from 'next/server'
import { POST } from './route'
import { prisma } from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    meetupInvite: {
      findMany: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/meetups/find-by-email', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 when email is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/meetups/find-by-email', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email is required')
  })

  it('should return 400 when email is empty', async () => {
    const request = new NextRequest('http://localhost:3000/api/meetups/find-by-email', {
      method: 'POST',
      body: JSON.stringify({ email: '' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email is required')
  })

  it('should find meetups by email successfully', async () => {
    const mockMeetups = [
      {
        id: '1',
        token: 'token1',
        organizerName: 'John Doe',
        organizerEmail: 'john@example.com',
        status: 'pending',
        createdAt: new Date('2024-01-01'),
        expiresAt: new Date('2024-01-08'),
        cafe: {
          id: 'cafe1',
          name: 'Coffee Shop',
          address: '123 Main St',
          city: 'Amsterdam',
        },
        availableDates: ['2024-01-02', '2024-01-03'],
        availableTimes: ['10:00', '14:00'],
        chosenDate: null,
        chosenTime: null,
        inviteeName: 'Jane Smith',
        inviteeEmail: 'jane@example.com',
      },
    ]

    ;(mockPrisma.meetupInvite.findMany as jest.Mock).mockResolvedValue(mockMeetups)

    const request = new NextRequest('http://localhost:3000/api/meetups/find-by-email', {
      method: 'POST',
      body: JSON.stringify({ email: 'jane@example.com' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.meetups).toHaveLength(1)
    expect(data.meetups[0]).toEqual({
      id: '1',
      token: 'token1',
      organizerName: 'John Doe',
      organizerEmail: 'john@example.com',
      status: 'pending',
      createdAt: expect.any(String),
      expiresAt: expect.any(String),
      cafe: {
        id: 'cafe1',
        name: 'Coffee Shop',
        address: '123 Main St',
        city: 'Amsterdam',
      },
      availableDates: ['2024-01-02', '2024-01-03'],
      availableTimes: ['10:00', '14:00'],
      chosenDate: null,
      chosenTime: null,
      inviteeName: 'Jane Smith',
      inviteeEmail: 'jane@example.com',
    })

    expect(mockPrisma.meetupInvite.findMany).toHaveBeenCalledWith({
      where: {
        inviteeEmail: 'jane@example.com',
        deletedAt: null,
        status: {
          in: ['pending', 'confirmed', 'declined', 'expired'],
        },
      },
      include: {
        cafe: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  })

  it('should handle database errors gracefully', async () => {
    ;(mockPrisma.meetupInvite.findMany as jest.Mock).mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/meetups/find-by-email', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to find meetups')
  })

  it('should normalize email case and trim whitespace', async () => {
    const mockMeetups: any[] = []
    ;(mockPrisma.meetupInvite.findMany as jest.Mock).mockResolvedValue(mockMeetups)

    const request = new NextRequest('http://localhost:3000/api/meetups/find-by-email', {
      method: 'POST',
      body: JSON.stringify({ email: '  TEST@EXAMPLE.COM  ' }),
    })

    await POST(request)

    expect(mockPrisma.meetupInvite.findMany).toHaveBeenCalledWith({
      where: {
        inviteeEmail: 'test@example.com',
        deletedAt: null,
        status: {
          in: ['pending', 'confirmed', 'declined', 'expired'],
        },
      },
      include: {
        cafe: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  })

  it('should return empty array when no meetups found', async () => {
    ;(mockPrisma.meetupInvite.findMany as jest.Mock).mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/meetups/find-by-email', {
      method: 'POST',
      body: JSON.stringify({ email: 'nonexistent@example.com' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.meetups).toEqual([])
  })
}) 
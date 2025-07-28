import { NextRequest } from 'next/server'
import { GET } from './route'
import { prisma } from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    meetupInvite: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    cafe: {
      findMany: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/meetups', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return 401 when user is not authenticated', async () => {
      const request = new NextRequest('http://localhost:3000/api/meetups')
      
      const response = await GET(request)
      
      expect(response.status).toBe(401)
    })

    it('should return meetups for authenticated user', async () => {
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
        },
      ]

      ;(mockPrisma.meetupInvite.findMany as jest.Mock).mockResolvedValue(mockMeetups)

      // Mock authenticated request
      const request = new NextRequest('http://localhost:3000/api/meetups', {
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.meetups).toHaveLength(1)
      expect(data.meetups[0].id).toBe('1')
    })

    it('should handle database errors gracefully', async () => {
      ;(mockPrisma.meetupInvite.findMany as jest.Mock).mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/meetups', {
        headers: {
          'authorization': 'Bearer valid-token'
        }
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch meetups')
    })
  })
}) 
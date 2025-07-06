import { sendInviteEmail, sendCalendarInvite } from './email'

// Mock Resend
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'test-email-id' }),
    },
  })),
}))

describe('Email Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.RESEND_API_KEY = 'test-api-key'
    process.env.EMAIL_FROM = 'test@example.com'
  })

  describe('sendInviteEmail', () => {
    it('sends invite email with correct parameters', async () => {
      const inviteData = {
        to: 'test@example.com',
        cafe: {
          name: 'Test Coffee Shop',
          address: '123 Test Street',
          priceRange: '€€',
          rating: 4.5,
          openHours: '8:00 AM - 6:00 PM',
        },
        dates: ['2024-01-15'],
        times: ['14:00'],
        token: 'test-token',
        organizerName: 'John Doe',
      }

      const result = await sendInviteEmail(inviteData)

      expect(result.success).toBe(true)
    })

    it('handles missing environment variables', async () => {
      delete process.env.RESEND_API_KEY
      delete process.env.EMAIL_FROM

      const inviteData = {
        to: 'test@example.com',
        cafe: {
          name: 'Test Coffee Shop',
          address: '123 Test Street',
          priceRange: '€€',
          rating: 4.5,
          openHours: '8:00 AM - 6:00 PM',
        },
        dates: ['2024-01-15'],
        times: ['14:00'],
        token: 'test-token',
        organizerName: 'John Doe',
      }

      try {
        await sendInviteEmail(inviteData)
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('sendCalendarInvite', () => {
    it('sends calendar invite with correct parameters', async () => {
      const calendarData = {
        to: 'test@example.com',
        eventTitle: 'Coffee Meetup',
        eventDescription: 'Join us for coffee!',
        eventLocation: 'Test Coffee Shop, 123 Test Street',
        eventStartTime: '2024-01-15T14:00:00Z',
        eventEndTime: '2024-01-15T16:00:00Z',
        attendeeName: 'Jane Smith',
      }

      const result = await sendCalendarInvite(calendarData)

      expect(result.success).toBe(true)
    })

    it('handles missing environment variables', async () => {
      delete process.env.RESEND_API_KEY
      delete process.env.EMAIL_FROM

      const calendarData = {
        to: 'test@example.com',
        eventTitle: 'Coffee Meetup',
        eventDescription: 'Join us for coffee!',
        eventLocation: 'Test Coffee Shop, 123 Test Street',
        eventStartTime: '2024-01-15T14:00:00Z',
        eventEndTime: '2024-01-15T16:00:00Z',
        attendeeName: 'Jane Smith',
      }

      try {
        await sendCalendarInvite(calendarData)
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })
}) 
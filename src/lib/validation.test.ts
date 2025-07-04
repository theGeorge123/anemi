import { shuffleCafeSchema, sendInviteSchema, inviteConfirmSchema } from './validation'

describe('Validation Schemas', () => {
  describe('shuffleCafeSchema', () => {
    it('should validate correct shuffle cafe input', () => {
      const validInput = {
        priceRange: 'MODERATE' as const,
        city: 'Amsterdam' as const
      }
      const result = shuffleCafeSchema.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('should validate partial input', () => {
      const partialInput = { city: 'Rotterdam' as const }
      const result = shuffleCafeSchema.safeParse(partialInput)
      expect(result.success).toBe(true)
    })

    it('should reject invalid city', () => {
      const invalidInput = { city: 'London' }
      const result = shuffleCafeSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })

    it('should reject invalid price range', () => {
      const invalidInput = { priceRange: 'INVALID' }
      const result = shuffleCafeSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })
  })

  describe('sendInviteSchema', () => {
    it('should validate correct send invite input', () => {
      const validInput = {
        cafe: {
          id: '1',
          name: 'Test Cafe',
          city: 'Amsterdam',
          address: 'Test Address',
          priceRange: 'MODERATE',
          rating: 4.5,
          isVerified: true
        },
        formData: {
          name: 'John Doe',
          email: 'john@example.com',
          city: 'Amsterdam' as const,
          priceRange: 'MODERATE' as const,
          dates: ['2024-01-15'],
          times: ['14:00']
        },
        dates: ['2024-01-15']
      }
      const result = sendInviteSchema.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidInput = {
        cafe: {
          id: '1',
          name: 'Test Cafe',
          city: 'Amsterdam',
          address: 'Test Address',
          priceRange: 'MODERATE',
          rating: 4.5,
          isVerified: true
        },
        formData: {
          name: 'John Doe',
          email: 'invalid-email',
          city: 'Amsterdam' as const,
          priceRange: 'MODERATE' as const,
          dates: ['2024-01-15'],
          times: ['14:00']
        },
        dates: ['2024-01-15']
      }
      const result = sendInviteSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })

    it('should reject missing required fields', () => {
      const invalidInput = {
        cafe: {
          id: '1',
          name: 'Test Cafe',
          city: 'Amsterdam',
          address: 'Test Address',
          priceRange: 'MODERATE',
          rating: 4.5,
          isVerified: true
        },
        formData: {
          name: '', // Empty name
          email: 'john@example.com',
          city: 'Amsterdam' as const,
          priceRange: 'MODERATE' as const,
          dates: ['2024-01-15'],
          times: ['14:00']
        },
        dates: ['2024-01-15']
      }
      const result = sendInviteSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })
  })

  describe('inviteConfirmSchema', () => {
    it('should validate correct invite confirmation input', () => {
      const validInput = {
        token: 'valid-token-123',
        chosenDate: '2024-01-15'
      }
      const result = inviteConfirmSchema.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('should reject empty token', () => {
      const invalidInput = {
        token: '',
        chosenDate: '2024-01-15'
      }
      const result = inviteConfirmSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })

    it('should reject empty date', () => {
      const invalidInput = {
        token: 'valid-token-123',
        chosenDate: ''
      }
      const result = inviteConfirmSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })
  })
}) 
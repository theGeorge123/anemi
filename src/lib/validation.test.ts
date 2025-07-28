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

    it('should validate empty object', () => {
      const emptyInput = {}
      const result = shuffleCafeSchema.safeParse(emptyInput)
      expect(result.success).toBe(true)
    })
  })

  describe('sendInviteSchema', () => {
    const validCafe = {
      id: '1',
      name: 'Test Cafe',
      city: 'Amsterdam',
      address: 'Test Address',
      priceRange: 'MODERATE',
      rating: 4.5,
      isVerified: true,
      description: 'A test cafe'
    }

    const validFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      city: 'Amsterdam' as const,
      priceRange: 'MODERATE' as const,
      dates: ['2024-01-15'],
      times: ['14:00'],
      dateTimePreferences: {
        '2024-01-15': ['14:00', '15:00']
      }
    }

    it('should validate correct send invite input', () => {
      const validInput = {
        cafe: validCafe,
        formData: validFormData,
        dates: ['2024-01-15']
      }
      const result = sendInviteSchema.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidInput = {
        cafe: validCafe,
        formData: {
          ...validFormData,
          email: 'invalid-email'
        },
        dates: ['2024-01-15']
      }
      const result = sendInviteSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      if (!result.success && result.error.issues && result.error.issues.length > 0) {
        expect(result.error.issues[0]?.message).toBe('Invalid email address')
      }
    })

    it('should reject missing required fields', () => {
      const invalidInput = {
        cafe: validCafe,
        formData: {
          ...validFormData,
          name: '' // Empty name
        },
        dates: ['2024-01-15']
      }
      const result = sendInviteSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      if (!result.success && result.error.issues && result.error.issues.length > 0) {
        expect(result.error.issues[0]?.message).toBe('Name is required')
      }
    })

    it('should reject invalid city', () => {
      const invalidInput = {
        cafe: validCafe,
        formData: {
          ...validFormData,
          city: 'London' as any
        },
        dates: ['2024-01-15']
      }
      const result = sendInviteSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })

    it('should reject invalid price range', () => {
      const invalidInput = {
        cafe: validCafe,
        formData: {
          ...validFormData,
          priceRange: 'INVALID' as any
        },
        dates: ['2024-01-15']
      }
      const result = sendInviteSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })

    it('should validate without optional fields', () => {
      const minimalInput = {
        cafe: {
          ...validCafe,
          description: undefined
        },
        formData: {
          ...validFormData,
          dateTimePreferences: undefined
        },
        dates: ['2024-01-15']
      }
      const result = sendInviteSchema.safeParse(minimalInput)
      expect(result.success).toBe(true)
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
      if (!result.success && result.error.issues && result.error.issues.length > 0) {
        expect(result.error.issues[0]?.message).toBe('Token is required')
      }
    })

    it('should reject empty date', () => {
      const invalidInput = {
        token: 'valid-token-123',
        chosenDate: ''
      }
      const result = inviteConfirmSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
      if (!result.success && result.error.issues && result.error.issues.length > 0) {
        expect(result.error.issues[0]?.message).toBe('Date is required')
      }
    })

    it('should reject missing token', () => {
      const invalidInput = {
        chosenDate: '2024-01-15'
      }
      const result = inviteConfirmSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })

    it('should reject missing date', () => {
      const invalidInput = {
        token: 'valid-token-123'
      }
      const result = inviteConfirmSchema.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })
  })
}) 
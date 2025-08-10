import { z } from 'zod'

// Validation for shuffle-cafe API
export const shuffleCafeSchema = z.object({
  priceRange: z.enum(['BUDGET', 'MODERATE', 'EXPENSIVE', 'LUXURY']).optional(),
  city: z.enum(['Amsterdam', 'Rotterdam']).optional()
})

// Validation for send-invite API
export const sendInviteSchema = z.object({
  cafe: z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    address: z.string(),
    priceRange: z.string(),
    rating: z.number(),
    isVerified: z.boolean(),
    description: z.string().optional()
  }),
  formData: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    city: z.enum(['Amsterdam', 'Rotterdam']),
    priceRange: z.enum(['BUDGET', 'MODERATE', 'EXPENSIVE', 'LUXURY']),
    dates: z.array(z.string()),
    times: z.array(z.string()),
    dateTimePreferences: z.record(z.array(z.string())).optional()
  }),
  dates: z.array(z.string())
})

// Validation for invite confirmation
export const inviteConfirmSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  chosenDate: z.string().min(1, 'Date is required')
})

// Validation for send-invite email payload
export const SendInviteEmailSchema = z.object({
  inviteCode: z.string().min(1, 'inviteCode is required'),
  email: z.string().email().optional(),
  emails: z.array(z.string().email()).optional()
}).refine(data => data.email || (data.emails && data.emails.length > 0), {
  message: 'At least one email is required'
});

// Type exports
export type ShuffleCafeInput = z.infer<typeof shuffleCafeSchema>
export type SendInviteInput = z.infer<typeof sendInviteSchema>
export type InviteConfirmInput = z.infer<typeof inviteConfirmSchema>
export type SendInviteEmailInput = z.infer<typeof SendInviteEmailSchema>

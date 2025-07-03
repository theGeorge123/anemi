import { z } from 'zod';

// Database table schemas
export const CoffeeShopSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  city: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  rating: z.number(),
  reviewCount: z.number(),
  priceRange: z.enum(['BUDGET', 'MODERATE', 'EXPENSIVE', 'LUXURY']),
  features: z.array(z.string()),
  hours: z.any().nullable(),
  photos: z.array(z.string()),
  isVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const MeetupInviteSchema = z.object({
  id: z.string(),
  token: z.string(),
  organizerName: z.string(),
  organizerEmail: z.string(),
  inviteeName: z.string().nullable(),
  inviteeEmail: z.string().nullable(),
  cafeId: z.string(),
  availableDates: z.array(z.string()),
  availableTimes: z.array(z.string()),
  chosenDate: z.string().nullable(),
  chosenTime: z.string().nullable(),
  status: z.string(),
  expiresAt: z.string(),
  confirmedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.string().nullable(),
  image: z.string().nullable(),
  password: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Request/Response schemas
export const QueryRequestSchema = z.object({
  table: z.string(),
  select: z.array(z.string()).optional(),
  where: z.record(z.any()).optional(),
  orderBy: z.record(z.any()).optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export const InsertRequestSchema = z.object({
  table: z.string(),
  data: z.record(z.any()),
});

export const UpdateRequestSchema = z.object({
  table: z.string(),
  data: z.record(z.any()),
  where: z.record(z.any()),
});

export const DeleteRequestSchema = z.object({
  table: z.string(),
  where: z.record(z.any()),
});

export const ExecuteSqlRequestSchema = z.object({
  sql: z.string(),
  params: z.array(z.any()).optional(),
});

// Export types
export type CoffeeShop = z.infer<typeof CoffeeShopSchema>;
export type MeetupInvite = z.infer<typeof MeetupInviteSchema>;
export type User = z.infer<typeof UserSchema>;
export type QueryRequest = z.infer<typeof QueryRequestSchema>;
export type InsertRequest = z.infer<typeof InsertRequestSchema>;
export type UpdateRequest = z.infer<typeof UpdateRequestSchema>;
export type DeleteRequest = z.infer<typeof DeleteRequestSchema>;
export type ExecuteSqlRequest = z.infer<typeof ExecuteSqlRequestSchema>; 
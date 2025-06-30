import { NextRequest } from 'next/server'

// Simple in-memory rate limiter
const memoryStore = new Map<string, { count: number; resetTime: number }>()

export async function rateLimit(request: NextRequest, maxRequests = 10, windowMs = 10000) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const now = Date.now()
  
  const record = memoryStore.get(ip)
  
  if (!record || now > record.resetTime) {
    memoryStore.set(ip, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: maxRequests - 1 }
  }
  
  if (record.count >= maxRequests) {
    return { success: false, remaining: 0 }
  }
  
  record.count++
  return { success: true, remaining: maxRequests - record.count }
}

// Clean up old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now()
  memoryStore.forEach((record, ip) => {
    if (now > record.resetTime) {
      memoryStore.delete(ip)
    }
  })
}, 5 * 60 * 1000) 
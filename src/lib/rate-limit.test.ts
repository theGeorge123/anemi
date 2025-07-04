import { rateLimit, memoryStore } from './rate-limit'
import { NextRequest } from 'next/server'

// Mock NextRequest
const createMockRequest = (ip?: string): NextRequest => {
  const headers = new Headers()
  if (ip) {
    headers.set('x-forwarded-for', ip)
  }
  
  return {
    ip,
    headers,
  } as NextRequest
}

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear the memory store before each test
    jest.clearAllMocks()
    jest.useFakeTimers()
    memoryStore.clear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('rateLimit', () => {
    it('should allow first request', async () => {
      const request = createMockRequest('192.168.1.1')
      const result = await rateLimit(request, 5, 1000)
      
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it('should allow multiple requests within limit', async () => {
      const request = createMockRequest('192.168.1.1')
      
      // First request
      let result = await rateLimit(request, 3, 1000)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(2)
      
      // Second request
      result = await rateLimit(request, 3, 1000)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(1)
      
      // Third request
      result = await rateLimit(request, 3, 1000)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(0)
    })

    it('should block requests when limit exceeded', async () => {
      const request = createMockRequest('192.168.1.1')
      
      // Make 3 requests (limit is 3)
      await rateLimit(request, 3, 1000)
      await rateLimit(request, 3, 1000)
      await rateLimit(request, 3, 1000)
      
      // Fourth request should be blocked
      const result = await rateLimit(request, 3, 1000)
      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should reset after window expires', async () => {
      const request = createMockRequest('192.168.1.1')
      
      // Make 2 requests
      await rateLimit(request, 3, 1000)
      await rateLimit(request, 3, 1000)
      
      // Fast forward time by 1.1 seconds
      jest.advanceTimersByTime(1100)
      
      // Should be allowed again
      const result = await rateLimit(request, 3, 1000)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(2)
    })

    it('should handle different IPs separately', async () => {
      const request1 = createMockRequest('192.168.1.1')
      const request2 = createMockRequest('192.168.1.2')
      
      // Both should be allowed
      const result1 = await rateLimit(request1, 2, 1000)
      const result2 = await rateLimit(request2, 2, 1000)
      
      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result1.remaining).toBe(1)
      expect(result2.remaining).toBe(1)
    })

    it('should use x-forwarded-for header when IP is not available', async () => {
      const request = createMockRequest()
      request.headers.set('x-forwarded-for', '10.0.0.1')
      
      const result = await rateLimit(request, 5, 1000)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it('should fall back to 127.0.0.1 when no IP is available', async () => {
      const request = createMockRequest()
      
      const result = await rateLimit(request, 5, 1000)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it('should handle custom limits and windows', async () => {
      const request = createMockRequest('192.168.1.1')
      
      // Test with 1 request limit and 500ms window
      const result1 = await rateLimit(request, 1, 500)
      expect(result1.success).toBe(true)
      expect(result1.remaining).toBe(0)
      
      // Second request should be blocked
      const result2 = await rateLimit(request, 1, 500)
      expect(result2.success).toBe(false)
      expect(result2.remaining).toBe(0)
      
      // Wait for window to expire
      jest.advanceTimersByTime(600)
      
      // Should be allowed again
      const result3 = await rateLimit(request, 1, 500)
      expect(result3.success).toBe(true)
      expect(result3.remaining).toBe(0)
    })
  })
}) 
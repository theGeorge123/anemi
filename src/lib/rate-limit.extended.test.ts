import { rateLimit, memoryStore } from './rate-limit'

// Mock request creation
function createMockRequest(ip: string) {
  return {
    ip: ip,
    headers: {
      get: (name: string) => {
        if (name === 'x-forwarded-for') return ip
        return null
      }
    },
  } as any
}

describe('Rate Limiting Extended Tests', () => {
  beforeEach(() => {
    memoryStore.clear()
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    memoryStore.clear()
  })

  describe('Rate limit with different configurations', () => {
    it('handles very low limits', async () => {
      const request = createMockRequest('192.168.1.1')
      
      // Test with 1 request limit
      const result1 = await rateLimit(request, 1, 1000)
      expect(result1.success).toBe(true)
      expect(result1.remaining).toBe(0)
      
      // Second request should be blocked
      const result2 = await rateLimit(request, 1, 1000)
      expect(result2.success).toBe(false)
      expect(result2.remaining).toBe(0)
    })

    it('handles very high limits', async () => {
      const request = createMockRequest('192.168.1.1')
      
      // Test with 1000 request limit
      for (let i = 0; i < 100; i++) {
        const result = await rateLimit(request, 1000, 1000)
        expect(result.success).toBe(true)
        expect(result.remaining).toBe(1000 - i - 1)
      }
    })

    it('handles very short windows', async () => {
      const request = createMockRequest('192.168.1.1')
      
      // Test with 100ms window
      const result1 = await rateLimit(request, 1, 100)
      expect(result1.success).toBe(true)
      
      const result2 = await rateLimit(request, 1, 100)
      expect(result2.success).toBe(false)
      
      // Wait for window to expire
      jest.advanceTimersByTime(150)
      
      const result3 = await rateLimit(request, 1, 100)
      expect(result3.success).toBe(true)
    })

    it('handles very long windows', async () => {
      const request = createMockRequest('192.168.1.1')
      
      // Test with 1 hour window
      const result1 = await rateLimit(request, 5, 3600000)
      expect(result1.success).toBe(true)
      expect(result1.remaining).toBe(4)
      
      // Should still be limited after 30 minutes
      jest.advanceTimersByTime(1800000)
      const result2 = await rateLimit(request, 5, 3600000)
      expect(result2.success).toBe(true)
      expect(result2.remaining).toBe(3)
    })
  })

  describe('IP address handling', () => {
    it('handles different IP formats', async () => {
      const ips = [
        '192.168.1.1',
        '10.0.0.1',
        '172.16.0.1',
        '127.0.0.1',
        '::1', // IPv6 localhost
        '2001:db8::1', // IPv6
      ]
      
      for (const ip of ips) {
        const request = createMockRequest(ip)
        const result = await rateLimit(request, 5, 1000)
        expect(result.success).toBe(true)
        expect(result.remaining).toBe(4)
      }
    })

    it('handles missing IP address', async () => {
      const request = {
        headers: {
          get: (name: string) => null
        }
      } as any
      
      const result = await rateLimit(request, 5, 1000)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it('handles malformed IP address', async () => {
      const request = {
        ip: 'invalid-ip',
        headers: {
          get: (name: string) => 'invalid-ip'
        }
      } as any
      
      const result = await rateLimit(request, 5, 1000)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4)
    })
  })

  describe('Edge cases and error handling', () => {
    it('handles zero limit', async () => {
      const request = createMockRequest('192.168.1.1')
      
      const result = await rateLimit(request, 0, 1000)
      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('handles negative limit', async () => {
      const request = createMockRequest('192.168.1.1')
      
      const result = await rateLimit(request, -5, 1000)
      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('handles zero window', async () => {
      const request = createMockRequest('192.168.1.1')
      
      const result = await rateLimit(request, 5, 0)
      expect(result.success).toBe(true) // Window of 0 is treated as immediate reset
      expect(result.remaining).toBe(4)
    })

    it('handles negative window', async () => {
      const request = createMockRequest('192.168.1.1')
      
      const result = await rateLimit(request, 5, -1000)
      expect(result.success).toBe(true) // Negative window is treated as immediate reset
      expect(result.remaining).toBe(4)
    })

    it('handles very large numbers', async () => {
      const request = createMockRequest('192.168.1.1')
      
      const result = await rateLimit(request, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(Number.MAX_SAFE_INTEGER - 1)
    })
  })

  describe('Concurrent requests', () => {
    it('handles multiple simultaneous requests', async () => {
      const request = createMockRequest('192.168.1.1')
      
      // Make 10 simultaneous requests
      const promises = Array.from({ length: 10 }, () => rateLimit(request, 5, 1000))
      const results = await Promise.all(promises)
      
      const successful = results.filter(r => r.success)
      const failed = results.filter(r => !r.success)
      
      expect(successful).toHaveLength(5)
      expect(failed).toHaveLength(5)
    })

    it('handles requests from different IPs concurrently', async () => {
      const ips = ['192.168.1.1', '192.168.1.2', '192.168.1.3']
      
      for (const ip of ips) {
        const request = createMockRequest(ip)
        
        // Each IP should have its own limit
        const promises = Array.from({ length: 3 }, () => rateLimit(request, 2, 1000))
        const ipResults = await Promise.all(promises)
        
        const successful = ipResults.filter(r => r.success)
        const failed = ipResults.filter(r => !r.success)
        
        expect(successful).toHaveLength(2)
        expect(failed).toHaveLength(1)
      }
    })
  })

  describe('Memory management', () => {
    it('cleans up expired entries', async () => {
      const request = createMockRequest('192.168.1.1')
      
      // Make a request with short window
      const result1 = await rateLimit(request, 1, 100)
      expect(result1.success).toBe(true)
      
      // Wait for window to expire
      jest.advanceTimersByTime(150)
      
      // Make another request - should reset the counter
      const result2 = await rateLimit(request, 1, 100)
      expect(result2.success).toBe(true)
      expect(result2.remaining).toBe(0)
    })

    it('handles memory store overflow', async () => {
      // Fill up the memory store
      for (let i = 0; i < 1000; i++) {
        const request = createMockRequest(`192.168.1.${i}`)
        await rateLimit(request, 1, 1000)
      }
      
      // Should still work
      const request = createMockRequest('192.168.1.1000')
      const result = await rateLimit(request, 1, 1000)
      expect(result.success).toBe(true)
    })
  })
}) 
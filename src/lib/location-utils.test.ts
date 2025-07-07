import {
  calculateDistance,
  getBoundingBox,
  sortByDistance,
  filterByDistance,
  formatDistance,
  isValidLocation,
  Location,
} from './location-utils'

// Mock Prisma to avoid database calls in tests
jest.mock('./prisma', () => ({
  prisma: {
    coffeeShop: {
      findMany: jest.fn(),
    },
  },
}))

describe('Location Utils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points correctly', () => {
      // Amsterdam coordinates
      const amsterdam = { lat: 52.3676, lng: 4.9041 }
      // Rotterdam coordinates
      const rotterdam = { lat: 51.9225, lng: 4.4792 }
      
      const distance = calculateDistance(
        amsterdam.lat,
        amsterdam.lng,
        rotterdam.lat,
        rotterdam.lng
      )
      
      // Distance should be approximately 57km
      expect(distance).toBeGreaterThan(50)
      expect(distance).toBeLessThan(65)
    })

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(52.3676, 4.9041, 52.3676, 4.9041)
      expect(distance).toBe(0)
    })

    it('should handle antipodal points', () => {
      const distance = calculateDistance(0, 0, 0, 180)
      expect(distance).toBeGreaterThan(20000) // Should be roughly half Earth's circumference
    })
  })

  describe('getBoundingBox', () => {
    it('should calculate bounding box correctly', () => {
      const center: Location = { latitude: 52.3676, longitude: 4.9041 }
      const radiusKm = 10
      
      const box = getBoundingBox(center, radiusKm)
      
      expect(box.minLat).toBeLessThan(center.latitude)
      expect(box.maxLat).toBeGreaterThan(center.latitude)
      expect(box.minLng).toBeLessThan(center.longitude)
      expect(box.maxLng).toBeGreaterThan(center.longitude)
      
      // Box should be roughly 20km wide (10km radius * 2)
      const latDiff = box.maxLat - box.minLat
      const lngDiff = box.maxLng - box.minLng
      
      expect(latDiff).toBeGreaterThan(0.15) // ~17km
      expect(latDiff).toBeLessThan(0.2) // ~22km
    })

    it('should handle edge cases', () => {
      const center: Location = { latitude: 0, longitude: 0 }
      const box = getBoundingBox(center, 1)
      
      expect(box.minLat).toBeLessThan(0)
      expect(box.maxLat).toBeGreaterThan(0)
    })
  })

  describe('sortByDistance', () => {
    it('should sort locations by distance from center', () => {
      const center: Location = { latitude: 52.3676, longitude: 4.9041 }
      const locations = [
        { latitude: 52.3676, longitude: 4.9041, name: 'Center' }, // 0km
        { latitude: 52.3776, longitude: 4.9041, name: 'North' },  // ~1.1km
        { latitude: 52.3576, longitude: 4.9041, name: 'South' },  // ~1.1km
        { latitude: 52.3676, longitude: 4.9141, name: 'East' },   // ~0.7km
      ]
      
      const sorted = sortByDistance(locations, center)
      
      expect(sorted[0]).toBeDefined()
      expect(sorted[0]?.name).toBe('Center')
      expect(sorted[1]).toBeDefined()
      expect(sorted[1]?.name).toBe('East')
      expect(sorted[2]).toBeDefined()
      expect(sorted[2]?.name).toBe('North')
      expect(sorted[3]).toBeDefined()
      expect(sorted[3]?.name).toBe('South')
    })

    it('should handle empty array', () => {
      const center: Location = { latitude: 52.3676, longitude: 4.9041 }
      const sorted = sortByDistance([], center)
      expect(sorted).toEqual([])
    })
  })

  describe('filterByDistance', () => {
    it('should filter locations within radius', () => {
      const center: Location = { latitude: 52.3676, longitude: 4.9041 }
      const locations = [
        { latitude: 52.3676, longitude: 4.9041, name: 'Center' }, // 0km
        { latitude: 52.3776, longitude: 4.9041, name: 'Near' },   // ~1.1km
        { latitude: 52.4676, longitude: 4.9041, name: 'Far' },    // ~11km
      ]
      
      const nearby = filterByDistance(locations, center, 5)
      
      expect(nearby).toHaveLength(2)
      const far = nearby.find(l => l.name === 'Far')
      expect(far).toBeUndefined()
    })

    it('should handle empty array', () => {
      const center: Location = { latitude: 52.3676, longitude: 4.9041 }
      const filtered = filterByDistance([], center, 5)
      expect(filtered).toEqual([])
    })
  })

  describe('formatDistance', () => {
    it('should format distances less than 1km in meters', () => {
      expect(formatDistance(0.5)).toBe('500m')
      expect(formatDistance(0.1)).toBe('100m')
      expect(formatDistance(0.999)).toBe('999m')
    })

    it('should format distances 1km and above in kilometers', () => {
      expect(formatDistance(1)).toBe('1.0km')
      expect(formatDistance(1.5)).toBe('1.5km')
      expect(formatDistance(10.25)).toBe('10.3km')
    })

    it('should handle zero distance', () => {
      expect(formatDistance(0)).toBe('0m')
    })
  })

  describe('isValidLocation', () => {
    it('should validate correct coordinates', () => {
      expect(isValidLocation({ latitude: 0, longitude: 0 })).toBe(true)
      expect(isValidLocation({ latitude: 90, longitude: 180 })).toBe(true)
      expect(isValidLocation({ latitude: -90, longitude: -180 })).toBe(true)
      expect(isValidLocation({ latitude: 52.3676, longitude: 4.9041 })).toBe(true)
    })

    it('should reject invalid coordinates', () => {
      expect(isValidLocation({ latitude: 91, longitude: 0 })).toBe(false)
      expect(isValidLocation({ latitude: -91, longitude: 0 })).toBe(false)
      expect(isValidLocation({ latitude: 0, longitude: 181 })).toBe(false)
      expect(isValidLocation({ latitude: 0, longitude: -181 })).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isValidLocation({ latitude: 90, longitude: 180 })).toBe(true)
      expect(isValidLocation({ latitude: -90, longitude: -180 })).toBe(true)
    })
  })
}) 
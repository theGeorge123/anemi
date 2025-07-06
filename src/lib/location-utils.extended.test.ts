import {
  calculateDistance,
  getBoundingBox,
  sortByDistance,
  filterByDistance,
  formatDistance,
  isValidLocation,
  Location,
} from './location-utils'

describe('Location Utils Extended Tests', () => {
  describe('calculateDistance edge cases', () => {
    it('handles very small distances', () => {
      const distance = calculateDistance(52.3676, 4.9041, 52.3677, 4.9042)
      expect(distance).toBeGreaterThan(0)
      expect(distance).toBeLessThan(0.1)
    })

    it('handles very large distances', () => {
      const distance = calculateDistance(0, 0, 90, 180)
      expect(distance).toBeGreaterThan(10000)
    })

    it('handles negative coordinates', () => {
      const distance = calculateDistance(-52.3676, -4.9041, -52.3776, -4.9141)
      expect(distance).toBeGreaterThan(0)
    })

    it('handles coordinates at poles', () => {
      const distance = calculateDistance(90, 0, 89, 0)
      expect(distance).toBeGreaterThan(0)
      expect(distance).toBeLessThan(200)
    })
  })

  describe('getBoundingBox edge cases', () => {
    it('handles center location with radius', () => {
      const center = { latitude: 52.3676, longitude: 4.9041 }
      const box = getBoundingBox(center, 5)
      
      expect(box.minLat).toBeLessThan(52.3676)
      expect(box.maxLat).toBeGreaterThan(52.3676)
      expect(box.minLng).toBeLessThan(4.9041)
      expect(box.maxLng).toBeGreaterThan(4.9041)
    })

    it('handles zero radius', () => {
      const center = { latitude: 52.3676, longitude: 4.9041 }
      const box = getBoundingBox(center, 0)
      
      expect(box.minLat).toBeCloseTo(52.3676, 5)
      expect(box.maxLat).toBeCloseTo(52.3676, 5)
      expect(box.minLng).toBeCloseTo(4.9041, 5)
      expect(box.maxLng).toBeCloseTo(4.9041, 5)
    })

    it('handles large radius', () => {
      const center = { latitude: 52.3676, longitude: 4.9041 }
      const box = getBoundingBox(center, 100)
      
      expect(box.minLat).toBeLessThan(52)
      expect(box.maxLat).toBeGreaterThan(52)
    })
  })

  describe('sortByDistance edge cases', () => {
    it('handles empty array', () => {
      const center: Location = { latitude: 52.3676, longitude: 4.9041 }
      const sorted = sortByDistance([], center)
      expect(sorted).toEqual([])
    })

    it('handles single location', () => {
      const center: Location = { latitude: 52.3676, longitude: 4.9041 }
      const locations = [{ latitude: 52.3776, longitude: 4.9041, name: 'Near' }]
      const sorted = sortByDistance(locations, center)
      
      expect(sorted).toHaveLength(1)
      expect(sorted[0]?.name).toBe('Near')
    })

    it('handles locations with same distance', () => {
      const center: Location = { latitude: 52.3676, longitude: 4.9041 }
      const locations = [
        { latitude: 52.3776, longitude: 4.9041, name: 'A' },
        { latitude: 52.3776, longitude: 4.9041, name: 'B' }
      ]
      const sorted = sortByDistance(locations, center)
      
      expect(sorted).toHaveLength(2)
      // Both locations should be at the same distance from center
      const distance1 = calculateDistance(center.latitude, center.longitude, sorted[0]?.latitude || 0, sorted[0]?.longitude || 0)
      const distance2 = calculateDistance(center.latitude, center.longitude, sorted[1]?.latitude || 0, sorted[1]?.longitude || 0)
      expect(distance1).toBeCloseTo(distance2, 5)
    })
  })

  describe('filterByDistance edge cases', () => {
    it('handles zero radius', () => {
      const center: Location = { latitude: 52.3676, longitude: 4.9041 }
      const locations = [
        { latitude: 52.3676, longitude: 4.9041, name: 'Exact' },
        { latitude: 52.3776, longitude: 4.9041, name: 'Near' }
      ]
      
      const filtered = filterByDistance(locations, center, 0)
      expect(filtered).toHaveLength(1)
      expect(filtered[0]?.name).toBe('Exact')
    })

    it('handles very large radius', () => {
      const center: Location = { latitude: 52.3676, longitude: 4.9041 }
      const locations = [
        { latitude: 52.3676, longitude: 4.9041, name: 'Near' },
        { latitude: 53.3676, longitude: 4.9041, name: 'Far' }
      ]
      
      const filtered = filterByDistance(locations, center, 1000)
      expect(filtered).toHaveLength(2)
    })

    it('handles negative radius', () => {
      const center: Location = { latitude: 52.3676, longitude: 4.9041 }
      const locations = [
        { latitude: 52.3676, longitude: 4.9041, name: 'Near' }
      ]
      
      const filtered = filterByDistance(locations, center, -1)
      expect(filtered).toHaveLength(0)
    })
  })

  describe('formatDistance edge cases', () => {
    it('handles very small distances', () => {
      expect(formatDistance(0.001)).toBe('1m')
      expect(formatDistance(0.0001)).toBe('0m')
    })

    it('handles very large distances', () => {
      expect(formatDistance(1000)).toBe('1000.0km')
      expect(formatDistance(9999.9)).toBe('9999.9km')
    })

    it('handles negative distances', () => {
      expect(formatDistance(-1)).toBe('-1000m')
      expect(formatDistance(-0.5)).toBe('-500m')
    })

    it('handles exact kilometer values', () => {
      expect(formatDistance(1.0)).toBe('1.0km')
      expect(formatDistance(2.0)).toBe('2.0km')
    })

    it('handles decimal precision', () => {
      expect(formatDistance(1.234)).toBe('1.2km')
      expect(formatDistance(1.256)).toBe('1.3km')
    })
  })

  describe('isValidLocation edge cases', () => {
    it('handles boundary values', () => {
      expect(isValidLocation({ latitude: 90, longitude: 180 })).toBe(true)
      expect(isValidLocation({ latitude: -90, longitude: -180 })).toBe(true)
      expect(isValidLocation({ latitude: 90.1, longitude: 0 })).toBe(false)
      expect(isValidLocation({ latitude: -90.1, longitude: 0 })).toBe(false)
      expect(isValidLocation({ latitude: 0, longitude: 180.1 })).toBe(false)
      expect(isValidLocation({ latitude: 0, longitude: -180.1 })).toBe(false)
    })

    it('handles non-numeric values', () => {
      expect(isValidLocation({ latitude: NaN, longitude: 0 })).toBe(false)
      expect(isValidLocation({ latitude: 0, longitude: NaN })).toBe(false)
      expect(isValidLocation({ latitude: Infinity, longitude: 0 })).toBe(false)
      expect(isValidLocation({ latitude: 0, longitude: -Infinity })).toBe(false)
    })

    it('handles null and undefined', () => {
      // These should throw errors since the function doesn't handle null/undefined
      expect(() => isValidLocation(null as any)).toThrow()
      expect(() => isValidLocation(undefined as any)).toThrow()
    })

    it('handles missing properties', () => {
      expect(isValidLocation({} as any)).toBe(false)
      expect(isValidLocation({ latitude: 0 } as any)).toBe(false)
      expect(isValidLocation({ longitude: 0 } as any)).toBe(false)
    })
  })
}) 
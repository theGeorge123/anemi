import { cities, cityMeta } from './cities'

describe('Cities Constants', () => {
  it('should export cities array', () => {
    expect(Array.isArray(cities)).toBe(true)
  })

  it('should have Amsterdam and Rotterdam', () => {
    expect(cities).toContain('Amsterdam')
    expect(cities).toContain('Rotterdam')
  })

  it('should have correct city structure', () => {
    cities.forEach(city => {
      expect(typeof city).toBe('string')
    })
  })

  it('should have cityMeta for each city', () => {
    cities.forEach(city => {
      expect(cityMeta[city]).toBeDefined()
      expect(cityMeta[city]).toHaveProperty('emoji')
      expect(cityMeta[city]).toHaveProperty('tag')
    })
  })

  it('should have unique values', () => {
    const uniqueValues = new Set(cities)
    expect(uniqueValues.size).toBe(cities.length)
  })
}) 
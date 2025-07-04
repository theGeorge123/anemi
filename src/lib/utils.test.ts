import { 
  cn, 
  formatDate, 
  formatTime, 
  formatDateTime,
  formatDuration,
  generateId,
  isValidEmail,
  isValidUrl,
  truncateText,
  capitalizeFirst,
  slugify,
  getInitials,
  formatFileSize,
  getTimeAgo
} from './utils'

describe('Utils', () => {
  describe('cn', () => {
    it('should combine class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'valid')).toBe('base valid')
    })

    it('should handle objects', () => {
      expect(cn('base', { conditional: true, other: false })).toBe('base conditional')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date)).toBe('January 15, 2024')
    })

    it('should handle different date formats', () => {
      const date = new Date('2024-12-25')
      expect(formatDate(date)).toBe('December 25, 2024')
    })
  })

  describe('formatTime', () => {
    it('should format time correctly', () => {
      expect(formatTime(new Date('2024-01-01T14:30:00'))).toBe('2:30 PM')
      expect(formatTime(new Date('2024-01-01T09:15:00'))).toBe('9:15 AM')
      expect(formatTime(new Date('2024-01-01T23:45:00'))).toBe('11:45 PM')
    })

    it('should handle edge cases', () => {
      expect(formatTime(new Date('2024-01-01T00:00:00'))).toBe('12:00 AM')
      expect(formatTime(new Date('2024-01-01T12:00:00'))).toBe('12:00 PM')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
    })

    it('should generate IDs with correct format', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })
  })

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2024-01-15T14:30:00')
      const result = formatDateTime(date)
      expect(result).toContain('Jan 15, 2024')
      expect(result).toContain('2:30 PM')
    })
  })

  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      expect(formatDuration(30)).toBe('30m')
      expect(formatDuration(60)).toBe('1h')
      expect(formatDuration(90)).toBe('1h 30m')
      expect(formatDuration(120)).toBe('2h')
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://localhost:3000')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('truncateText', () => {
    it('should truncate long text', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is a ...')
    })

    it('should not truncate short text', () => {
      expect(truncateText('Short', 10)).toBe('Short')
    })
  })

  describe('capitalizeFirst', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello')
      expect(capitalizeFirst('world')).toBe('World')
    })
  })

  describe('slugify', () => {
    it('should create URL-friendly slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Test & More!')).toBe('test-more')
    })
  })

  describe('getInitials', () => {
    it('should get initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('Mary Jane Smith')).toBe('MJ')
    })
  })

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
    })
  })

  describe('getTimeAgo', () => {
    it('should format time ago correctly', () => {
      const now = new Date()
      const oneMinuteAgo = new Date(now.getTime() - 60000)
      const oneHourAgo = new Date(now.getTime() - 3600000)
      
      expect(getTimeAgo(oneMinuteAgo)).toBe('1m ago')
      expect(getTimeAgo(oneHourAgo)).toBe('1h ago')
    })
  })
}) 
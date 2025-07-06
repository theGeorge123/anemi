import { cn } from './utils'

describe('cn utility function', () => {
  it('combines multiple class names', () => {
    expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3')
  })

  it('handles conditional classes with boolean', () => {
    expect(cn('base', true && 'conditional')).toBe('base conditional')
    expect(cn('base', false && 'conditional')).toBe('base')
  })

  it('handles conditional classes with ternary', () => {
    const isActive = true
    expect(cn('base', isActive ? 'active' : 'inactive')).toBe('base active')
    
    const isInactive = false
    expect(cn('base', isInactive ? 'active' : 'inactive')).toBe('base inactive')
  })

  it('handles undefined and null values', () => {
    expect(cn('base', undefined, null, 'valid')).toBe('base valid')
  })

  it('handles empty strings', () => {
    expect(cn('base', '', 'valid')).toBe('base valid')
  })

  it('handles object syntax', () => {
    expect(cn('base', { conditional: true, other: false })).toBe('base conditional')
    expect(cn('base', { conditional: false, other: true })).toBe('base other')
  })

  it('handles mixed input types', () => {
    expect(cn('base', 'static', true && 'conditional', { dynamic: true })).toBe('base static conditional dynamic')
  })

  it('handles arrays', () => {
    expect(cn('base', ['class1', 'class2'])).toBe('base class1 class2')
  })

  it('handles nested arrays', () => {
    expect(cn('base', ['class1', ['class2', 'class3']])).toBe('base class1 class2 class3')
  })

  it('handles complex conditional objects', () => {
    const isPrimary = true
    const isLarge = false
    const isDisabled = true
    
    expect(cn(
      'base',
      {
        'btn-primary': isPrimary,
        'btn-large': isLarge,
        'btn-disabled': isDisabled,
      }
    )).toBe('base btn-primary btn-disabled')
  })

  it('handles edge cases', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn('', '', '')).toBe('')
    expect(cn('single')).toBe('single')
  })
}) 
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Badge } from './badge'

describe('Badge Component', () => {
  it('renders with children', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeTruthy()
  })

  it('renders with variant styles', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>)
    const badge = screen.getByText('Secondary Badge')
    expect(badge).toBeTruthy()
    expect(badge.className).toContain('bg-secondary')
  })

  it('renders with default variant', () => {
    render(<Badge>Default Badge</Badge>)
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeTruthy()
    expect(badge.className).toContain('bg-primary')
  })

  it('renders with destructive variant', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>)
    const badge = screen.getByText('Destructive Badge')
    expect(badge).toBeTruthy()
    expect(badge.className).toContain('bg-destructive')
  })

  it('renders with outline variant', () => {
    render(<Badge variant="outline">Outline Badge</Badge>)
    const badge = screen.getByText('Outline Badge')
    expect(badge).toBeTruthy()
    expect(badge.className).toContain('border')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>)
    const badge = screen.getByText('Custom Badge')
    expect(badge).toBeTruthy()
    expect(badge.className).toContain('custom-class')
  })

  it('combines variant and custom className', () => {
    render(
      <Badge variant="secondary" className="custom-class">
        Combined Badge
      </Badge>
    )
    const badge = screen.getByText('Combined Badge')
    expect(badge).toBeTruthy()
    expect(badge.className).toContain('bg-secondary')
    expect(badge.className).toContain('custom-class')
  })

  it('handles empty children', () => {
    render(<Badge></Badge>)
    const badges = screen.getAllByRole('generic')
    expect(badges.length).toBeGreaterThan(0)
  })

  it('handles numeric children', () => {
    render(<Badge>42</Badge>)
    expect(screen.getByText('42')).toBeTruthy()
  })

  it('handles complex children', () => {
    render(
      <Badge>
        <span>Icon</span> Label
      </Badge>
    )
    expect(screen.getByText('Icon')).toBeTruthy()
    expect(screen.getByText('Label')).toBeTruthy()
  })
}) 
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Input } from './input'

describe('Input Component', () => {
  it('should render with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('should render with value', () => {
    render(<Input value="test value" readOnly />)
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<Input className="custom-class" placeholder="test" />)
    const input = screen.getByPlaceholderText('test')
    expect(input).toHaveClass('custom-class')
  })

  it('should handle different input types', () => {
    render(<Input type="email" placeholder="email" />)
    const input = screen.getByPlaceholderText('email')
    expect(input).toHaveAttribute('type', 'email')
  })
}) 
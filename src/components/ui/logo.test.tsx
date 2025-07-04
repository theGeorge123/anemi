import React from 'react'
import { render, screen } from '@testing-library/react'
import { Logo } from './logo'

describe('Logo Component', () => {
  it('renders with text', () => {
    render(<Logo showText />)
    expect(screen.getByText('Anemi')).toBeInTheDocument()
    expect(screen.getByText('Meets')).toBeInTheDocument()
  })

  it('renders without text', () => {
    render(<Logo />)
    expect(screen.queryByText('Anemi')).not.toBeInTheDocument()
    expect(screen.queryByText('Meets')).not.toBeInTheDocument()
  })
}) 
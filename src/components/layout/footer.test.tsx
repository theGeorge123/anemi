import React from 'react'
import { render, screen } from '@testing-library/react'
import { Footer } from './footer'

describe('Footer', () => {
  it('renders', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
}) 
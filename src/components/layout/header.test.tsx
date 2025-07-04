import React from 'react'
import { render, screen } from '@testing-library/react'
import { Header } from './header'

describe('Header', () => {
  it('renders', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
}) 
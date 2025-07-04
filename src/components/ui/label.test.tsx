import React from 'react'
import { render, screen } from '@testing-library/react'
import { Label } from './label'

describe('Label Component', () => {
  it('renders with children', () => {
    render(<Label>Test Label</Label>)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })
}) 
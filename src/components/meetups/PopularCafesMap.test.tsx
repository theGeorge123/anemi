import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PopularCafesMap from './PopularCafesMap'

describe('PopularCafesMap', () => {
  it('renders loading state initially', () => {
    render(<PopularCafesMap city="Amsterdam" />)
    expect(screen.getByText('Populaire cafés laden...')).toBeInTheDocument()
  })
})

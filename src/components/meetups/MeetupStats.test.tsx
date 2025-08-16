import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MeetupStats from './MeetupStats'

describe('MeetupStats', () => {
  it('renders loading state initially', () => {
    render(<MeetupStats city="Amsterdam" />)
    expect(screen.getByText('Meetup statistieken laden...')).toBeInTheDocument()
  })
})

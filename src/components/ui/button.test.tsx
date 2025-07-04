import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button Component', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('should render button with variant styles', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button', { name: 'Delete' })
    expect(button).toHaveClass('bg-destructive')
  })

  it('should render button with size styles', () => {
    render(<Button size="sm">Small Button</Button>)
    const button = screen.getByRole('button', { name: 'Small Button' })
    expect(button).toHaveClass('h-9')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button', { name: 'Disabled Button' })
    expect(button).toBeDisabled()
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Clickable</Button>)
    
    const button = screen.getByRole('button', { name: 'Clickable' })
    button.click()
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should render as a link when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link', { name: 'Link Button' })
    expect(link).toHaveAttribute('href', '/test')
  })
}) 
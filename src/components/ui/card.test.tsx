import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render with children', () => {
      render(<Card>Test content</Card>)
      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<Card className="custom-class">Test</Card>)
      const card = screen.getByText('Test').closest('div')
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('CardHeader', () => {
    it('should render with children', () => {
      render(<CardHeader>Header content</CardHeader>)
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })
  })

  describe('CardTitle', () => {
    it('should render with children', () => {
      render(<CardTitle>Card Title</CardTitle>)
      expect(screen.getByText('Card Title')).toBeInTheDocument()
    })
  })

  describe('CardDescription', () => {
    it('should render with children', () => {
      render(<CardDescription>Card Description</CardDescription>)
      expect(screen.getByText('Card Description')).toBeInTheDocument()
    })
  })

  describe('CardContent', () => {
    it('should render with children', () => {
      render(<CardContent>Content</CardContent>)
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('CardFooter', () => {
    it('should render with children', () => {
      render(<CardFooter>Footer</CardFooter>)
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })
}) 
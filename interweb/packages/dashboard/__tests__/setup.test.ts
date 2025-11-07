/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'

// Simple test to verify Jest configuration is working
describe('Jest Setup', () => {
  it('should render a simple component', () => {
    const TestComponent = () => React.createElement('div', { 'data-testid': 'test-element' }, 'Hello World')
    
    render(React.createElement(TestComponent))
    
    expect(screen.getByTestId('test-element')).toBeInTheDocument()
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should have jsdom environment', () => {
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')
  })

  it('should have Next.js mocks available', () => {
    // Test that Next.js router mock is working
    const { useRouter } = require('next/router')
    const router = useRouter()
    
    expect(router).toBeDefined()
    expect(typeof router.push).toBe('function')
  })
})

import React from 'react'
import { render, screen } from '../../utils/test-utils'
import { StatusIndicator } from '../../../components/admin/status-indicator'

describe('StatusIndicator', () => {
  const getIconClass = () => {
    const icon = document.querySelector('svg.lucide') as SVGElement | null
    expect(icon).toBeTruthy()
    return icon!.getAttribute('class') || ''
  }

  it('renders without text by default', () => {
    render(<StatusIndicator status="ready" />)
    // Icon exists
    const icon = document.querySelector('svg.lucide')
    expect(icon).toBeInTheDocument()
    // No text
    expect(screen.queryByText('Ready')).not.toBeInTheDocument()
  })

  it('shows text when showText is true', () => {
    render(<StatusIndicator status="installed" showText />)
    expect(screen.getByText('Installed')).toBeInTheDocument()
  })

  it('applies correct icon color per status', () => {
    const { rerender } = render(<StatusIndicator status="creating" />)
    // creating → yellow + animate-pulse
    expect(getIconClass()).toMatch(/text-yellow-600/)

    rerender(<StatusIndicator status="pending" />)
    expect(getIconClass()).toMatch(/text-yellow-600/)

    rerender(<StatusIndicator status="error" />)
    expect(getIconClass()).toMatch(/text-red-600/)

    rerender(<StatusIndicator status="not-installed" />)
    expect(getIconClass()).toMatch(/text-gray-400/)

    rerender(<StatusIndicator status="ready" />)
    expect(getIconClass()).toMatch(/text-green-600/)

    rerender(<StatusIndicator status="installed" />)
    expect(getIconClass()).toMatch(/text-green-600/)

    rerender(<StatusIndicator status="unknown" />)
    expect(getIconClass()).toMatch(/text-gray-400/)
  })

  it('shows matching text color when showText is true', () => {
    render(<StatusIndicator status="creating" showText />)
    const text = screen.getByText('Creating')
    expect(text).toBeInTheDocument()
    expect(text.className).toMatch(/text-yellow-600/)
  })

  it('merges custom className on root', () => {
    render(<StatusIndicator status="ready" className="data-test-class" />)
    const root = document.querySelector('div.inline-flex')
    expect(root).toBeInTheDocument()
    expect(root!.className).toMatch(/data-test-class/)
  })
})

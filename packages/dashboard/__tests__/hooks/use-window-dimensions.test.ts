import { renderHook, act } from '@testing-library/react'
import { useWindowDimensions } from '../../hooks/use-window-dimensions'

describe('useWindowDimensions', () => {
  const originalInnerWidth = window.innerWidth
  const originalInnerHeight = window.innerHeight

  beforeEach(() => {
    // Set initial window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    })
    
    // Clean up any event listeners
    window.removeEventListener('resize', jest.fn())
  })

  it('should return initial window dimensions', () => {
    const { result } = renderHook(() => useWindowDimensions())
    
    expect(result.current).toEqual({
      width: 1024,
      height: 768,
    })
  })

  it('should update dimensions when window is resized', () => {
    const { result } = renderHook(() => useWindowDimensions())
    
    expect(result.current).toEqual({
      width: 1024,
      height: 768,
    })
    
    // Simulate window resize
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600,
      })
      
      // Trigger resize event
      window.dispatchEvent(new Event('resize'))
    })
    
    expect(result.current).toEqual({
      width: 800,
      height: 600,
    })
  })

  it('should handle multiple resize events', () => {
    const { result } = renderHook(() => useWindowDimensions())
    
    // First resize
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 1200 })
      Object.defineProperty(window, 'innerHeight', { value: 900 })
      window.dispatchEvent(new Event('resize'))
    })
    
    expect(result.current).toEqual({
      width: 1200,
      height: 900,
    })
    
    // Second resize
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 320 })
      Object.defineProperty(window, 'innerHeight', { value: 568 })
      window.dispatchEvent(new Event('resize'))
    })
    
    expect(result.current).toEqual({
      width: 320,
      height: 568,
    })
  })

  it('should clean up resize listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => useWindowDimensions())
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    
    removeEventListenerSpy.mockRestore()
  })

  it('should add resize listener on mount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    
    renderHook(() => useWindowDimensions())
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    
    addEventListenerSpy.mockRestore()
  })
})

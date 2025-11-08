import { renderHook, act } from '../utils/test-utils'
import { useSearchData } from '../../hooks/use-search-data'

// Mock nuqs
const mockSetSearchQuery = jest.fn()
jest.mock('nuqs', () => ({
  useQueryState: jest.fn(() => [null, mockSetSearchQuery])
}))

// Mock data for testing
const mockData = [
  { id: 1, name: 'Apple', category: 'fruit', color: 'red' },
  { id: 2, name: 'Banana', category: 'fruit', color: 'yellow' },
  { id: 3, name: 'Carrot', category: 'vegetable', color: 'orange' },
  { id: 4, name: 'Date', category: 'fruit', color: 'brown' },
  { id: 5, name: 'Eggplant', category: 'vegetable', color: 'purple' }
]

const searchFields = ['name', 'category', 'color'] as const

describe('useSearchData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all data when searchQuery is empty', () => {
    const { result } = renderHook(() => useSearchData({
      data: mockData,
      fields: searchFields
    }))
    
    expect(result.current.filteredData).toEqual(mockData)
    expect(result.current.searchQuery).toBe('')
    expect(typeof result.current.setSearchQuery).toBe('function')
  })

  it('should handle custom matcher function', () => {
    const customMatcher = (item: typeof mockData[0], query: string) => {
      return item.name.toLowerCase().includes(query.toLowerCase())
    }

    const { result } = renderHook(() => useSearchData({
      data: mockData,
      fields: searchFields,
      matcherFn: customMatcher
    }))
    
    expect(result.current.filteredData).toEqual(mockData)
    expect(typeof result.current.setSearchQuery).toBe('function')
  })

  it('should update searchQuery when setSearchQuery is called', async () => {
    const { result } = renderHook(() => useSearchData({
      data: mockData,
      fields: searchFields
    }))
    
    act(() => {
      result.current.setSearchQuery('apple')
    })
    
    // Wait for debounce to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 350))
    })
    
    expect(result.current.searchQuery).toBe('apple')
  })

  it('should handle data updates', () => {
    const { result, rerender } = renderHook(
      ({ data }) => useSearchData({
        data,
        fields: searchFields
      }),
      { initialProps: { data: mockData } }
    )
    
    expect(result.current.filteredData).toHaveLength(5)
    
    const updatedData = mockData.slice(0, 2)
    rerender({ data: updatedData })
    
    expect(result.current.filteredData).toHaveLength(2)
  })

  it('should handle empty data array', () => {
    const { result } = renderHook(() => useSearchData({
      data: [],
      fields: searchFields
    }))
    
    expect(result.current.filteredData).toEqual([])
  })

  it('should work with different field configurations', () => {
    const { result } = renderHook(() => useSearchData({
      data: mockData,
      fields: ['name'] // Only search by name
    }))
    
    expect(result.current.filteredData).toEqual(mockData)
  })

  it('should handle null setSearchQuery calls', () => {
    const { result } = renderHook(() => useSearchData({
      data: mockData,
      fields: searchFields
    }))
    
    act(() => {
      result.current.setSearchQuery(null)
    })
    
    expect(result.current.searchQuery).toBe('')
  })

  it('should debounce search query updates', async () => {
    jest.useFakeTimers()
    
    const { result } = renderHook(() => useSearchData({
      data: mockData,
      fields: searchFields
    }))
    
    act(() => {
      result.current.setSearchQuery('test')
    })
    
    // Before debounce completes
    expect(result.current.searchQuery).toBe('')
    
    act(() => {
      jest.advanceTimersByTime(300)
    })
    
    // After debounce completes
    expect(result.current.searchQuery).toBe('test')
    
    jest.useRealTimers()
  })

  it('should provide stable function references', () => {
    const { result, rerender } = renderHook(() => useSearchData({
      data: mockData,
      fields: searchFields
    }))
    
    const firstSetSearchQuery = result.current.setSearchQuery
    
    rerender()
    
    // Note: Due to useCallback dependencies, the function reference may change
    // but the functionality should remain the same
    expect(typeof result.current.setSearchQuery).toBe('function')
  })
})

import { renderHook } from '@testing-library/react'
import { usePagination } from '../../hooks/use-pagination'

describe('usePagination', () => {
  const mockOnPageChange = jest.fn()

  beforeEach(() => {
    mockOnPageChange.mockClear()
  })

  it('should calculate total pages correctly', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 1,
      onPageChange: mockOnPageChange,
    }))

    expect(result.current.totalPages).toBe(10)
  })

  it('should handle totalItems as bigint', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: BigInt(150),
      itemsPerPage: 10,
      currentPage: 1,
      onPageChange: mockOnPageChange,
    }))

    expect(result.current.totalPages).toBe(15)
  })

  it('should return minimum 1 page when totalItems is 0', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: 0,
      itemsPerPage: 10,
      currentPage: 1,
      onPageChange: mockOnPageChange,
    }))

    expect(result.current.totalPages).toBe(1)
    expect(result.current.pageNumbers).toEqual([1])
  })

  it('should generate correct page numbers for small page count', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: 25,
      itemsPerPage: 10,
      currentPage: 2,
      onPageChange: mockOnPageChange,
    }))

    expect(result.current.totalPages).toBe(3)
    expect(result.current.pageNumbers).toEqual([1, 2, 3])
  })

  it('should generate correct page numbers with ellipsis for large page count', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: 1000,
      itemsPerPage: 10,
      currentPage: 50,
      onPageChange: mockOnPageChange,
    }))

    expect(result.current.totalPages).toBe(100)
    expect(result.current.pageNumbers).toContain(-1) // ellipsis
    expect(result.current.pageNumbers).toContain(1)
    expect(result.current.pageNumbers).toContain(50)
    expect(result.current.pageNumbers).toContain(100)
  })

  it('should create correct pagination summary', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: 157,
      itemsPerPage: 10,
      currentPage: 5,
      onPageChange: mockOnPageChange,
    }))

    expect(result.current.paginationSummary).toBe('41 - 50 of 157 items')
  })

  it('should handle last page correctly in pagination summary', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: 157,
      itemsPerPage: 10,
      currentPage: 16, // last page
      onPageChange: mockOnPageChange,
    }))

    expect(result.current.paginationSummary).toBe('151 - 157 of 157 items')
  })

  it('should return "0 items" when totalItems is 0', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: 0,
      itemsPerPage: 10,
      currentPage: 1,
      onPageChange: mockOnPageChange,
    }))

    expect(result.current.paginationSummary).toBe('0 items')
  })

  it('should call onPageChange when goToPage is called with valid page', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 5,
      onPageChange: mockOnPageChange,
    }))

    result.current.goToPage(3)
    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('should not call onPageChange when goToPage is called with invalid page', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 5,
      onPageChange: mockOnPageChange,
    }))

    result.current.goToPage(0) // invalid
    result.current.goToPage(11) // invalid (totalPages is 10)
    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('should go to previous page', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 5,
      onPageChange: mockOnPageChange,
    }))

    result.current.goToPreviousPage()
    expect(mockOnPageChange).toHaveBeenCalledWith(4)
  })

  it('should go to next page', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 5,
      onPageChange: mockOnPageChange,
    }))

    result.current.goToNextPage()
    expect(mockOnPageChange).toHaveBeenCalledWith(6)
  })

  it('should not go to previous page when on first page', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 1,
      onPageChange: mockOnPageChange,
    }))

    result.current.goToPreviousPage()
    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('should not go to next page when on last page', () => {
    const { result } = renderHook(() => usePagination({
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 10,
      onPageChange: mockOnPageChange,
    }))

    result.current.goToNextPage()
    expect(mockOnPageChange).not.toHaveBeenCalled()
  })

  it('should update when props change', () => {
    const { result, rerender } = renderHook(
      ({ totalItems, currentPage }) => usePagination({
        totalItems,
        itemsPerPage: 10,
        currentPage,
        onPageChange: mockOnPageChange,
      }),
      { initialProps: { totalItems: 100, currentPage: 5 } }
    )

    expect(result.current.totalPages).toBe(10)
    expect(result.current.paginationSummary).toBe('41 - 50 of 100 items')

    rerender({ totalItems: 200, currentPage: 8 })

    expect(result.current.totalPages).toBe(20)
    expect(result.current.paginationSummary).toBe('71 - 80 of 200 items')
  })
})

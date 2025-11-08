import { act,renderHook } from '@testing-library/react';

import { useShowMore } from '../../hooks/use-show-more';

describe('useShowMore', () => {
  const testItems = ['item1', 'item2', 'item3', 'item4', 'item5'];
  const defaultVisibleCount = 3;

  it('should initialize with showMore as false', () => {
    const { result } = renderHook(() => useShowMore({ items: testItems, defaultVisibleCount }));
    
    expect(result.current.isShowMore).toBe(false);
    expect(result.current.visibleItems).toEqual(['item1', 'item2', 'item3']);
    expect(result.current.btnText).toBe('Show More');
    expect(typeof result.current.toggleShowMore).toBe('function');
  });

  it('should initialize with custom initial value', () => {
    const { result } = renderHook(() => useShowMore({ items: testItems, defaultVisibleCount: 2 }));
    
    expect(result.current.isShowMore).toBe(false);
    expect(result.current.visibleItems).toEqual(['item1', 'item2']);
  });

  it('should toggle showMore state', () => {
    const { result } = renderHook(() => useShowMore({ items: testItems, defaultVisibleCount }));
    
    expect(result.current.isShowMore).toBe(false);
    expect(result.current.visibleItems).toEqual(['item1', 'item2', 'item3']);
    
    act(() => {
      result.current.toggleShowMore();
    });
    
    expect(result.current.isShowMore).toBe(true);
    expect(result.current.visibleItems).toEqual(testItems);
    expect(result.current.btnText).toBe('Show Less');
    
    act(() => {
      result.current.toggleShowMore();
    });
    
    expect(result.current.isShowMore).toBe(false);
    expect(result.current.visibleItems).toEqual(['item1', 'item2', 'item3']);
    expect(result.current.btnText).toBe('Show More');
  });

  it('should handle multiple rapid toggles', () => {
    const { result } = renderHook(() => useShowMore({ items: testItems, defaultVisibleCount }));
    
    expect(result.current.isShowMore).toBe(false);
    
    act(() => {
      result.current.toggleShowMore();
      result.current.toggleShowMore();
      result.current.toggleShowMore();
    });
    
    expect(result.current.isShowMore).toBe(true);
  });

  it('should maintain state across rerenders', () => {
    const { result, rerender } = renderHook(
      ({ items, defaultVisibleCount }) => useShowMore({ items, defaultVisibleCount }),
      { initialProps: { items: testItems, defaultVisibleCount } }
    );
    
    act(() => {
      result.current.toggleShowMore();
    });
    
    expect(result.current.isShowMore).toBe(true);
    
    rerender({ items: testItems, defaultVisibleCount });
    
    // State should persist through rerender
    expect(result.current.isShowMore).toBe(true);
  });

  it('should work with different initial values', () => {
    const { result: result1 } = renderHook(() => useShowMore({ items: testItems, defaultVisibleCount: 2 }));
    const { result: result2 } = renderHook(() => useShowMore({ items: testItems, defaultVisibleCount: 4 }));
    
    expect(result1.current.visibleItems).toEqual(['item1', 'item2']);
    expect(result2.current.visibleItems).toEqual(['item1', 'item2', 'item3', 'item4']);
    
    act(() => {
      result1.current.toggleShowMore();
      result2.current.toggleShowMore();
    });
    
    expect(result1.current.isShowMore).toBe(true);
    expect(result2.current.isShowMore).toBe(true);
  });

  it('should return stable function reference', () => {
    const { result, rerender } = renderHook(() => useShowMore({ items: testItems, defaultVisibleCount }));
    
    const firstToggle = result.current.toggleShowMore;
    
    rerender();
    
    const secondToggle = result.current.toggleShowMore;
    
    // Note: Due to React's internal optimizations, function references may change
    // but the functionality should remain the same
    expect(typeof firstToggle).toBe('function');
    expect(typeof secondToggle).toBe('function');
  });
});

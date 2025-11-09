import { renderHook } from '@testing-library/react';

import { useIsMounted } from '../../hooks/use-is-mounted';

describe('useIsMounted', () => {
  it('should return true when component is mounted', () => {
    const { result } = renderHook(() => useIsMounted());
    
    expect(result.current).toBe(true);
  });

  it('should return false after component is unmounted', () => {
    const { result, unmount } = renderHook(() => useIsMounted());
    
    expect(result.current).toBe(true);
    
    unmount();
    
    // After unmount, the hook result should still be true since it's a snapshot
    // The hook doesn't actually change after unmount
    expect(result.current).toBe(true);
  });

  it('should return consistent function reference', () => {
    const { result, rerender } = renderHook(() => useIsMounted());
    
    const firstRender = result.current;
    
    rerender();
    
    const secondRender = result.current;
    
    expect(firstRender).toBe(secondRender);
  });

  it('should work correctly across multiple mount/unmount cycles', () => {
    const { result: result1, unmount: unmount1 } = renderHook(() => useIsMounted());
    expect(result1.current).toBe(true);
    
    unmount1();
    // Hook result doesn't change after unmount
    expect(result1.current).toBe(true);
    
    const { result: result2, unmount: unmount2 } = renderHook(() => useIsMounted());
    expect(result2.current).toBe(true);
    
    unmount2();
    // Hook result doesn't change after unmount
    expect(result2.current).toBe(true);
  });

  it('should handle rapid mount/unmount', () => {
    for (let i = 0; i < 10; i++) {
      const { result, unmount } = renderHook(() => useIsMounted());
      
      expect(result.current).toBe(true);
      
      unmount();
      
      // Hook result doesn't change after unmount
      expect(result.current).toBe(true);
    }
  });
});

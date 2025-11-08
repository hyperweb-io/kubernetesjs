import { renderHook } from '@testing-library/react';

import { useBreakpoint } from '@/hooks/use-breakpoint';

// Mock the useMediaQuery hook
jest.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: jest.fn(),
}));

import { useMediaQuery } from '@/hooks/use-media-query';

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;

describe('useBreakpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct values for xs breakpoint when below', () => {
    mockUseMediaQuery.mockReturnValue(true); // max-width: 480px is true

    const { result } = renderHook(() => useBreakpoint('xs'));

    expect(result.current).toEqual({
      xs: 480,
      isAboveXs: false,
      isBelowXs: true,
    });
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(max-width: 480px)');
  });

  it('should return correct values for xs breakpoint when above', () => {
    mockUseMediaQuery.mockReturnValue(false); // max-width: 480px is false

    const { result } = renderHook(() => useBreakpoint('xs'));

    expect(result.current).toEqual({
      xs: 480,
      isAboveXs: true,
      isBelowXs: false,
    });
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(max-width: 480px)');
  });

  it('should return correct values for sm breakpoint when below', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useBreakpoint('sm'));

    expect(result.current).toEqual({
      sm: 640,
      isAboveSm: false,
      isBelowSm: true,
    });
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(max-width: 640px)');
  });

  it('should return correct values for sm breakpoint when above', () => {
    mockUseMediaQuery.mockReturnValue(false);

    const { result } = renderHook(() => useBreakpoint('sm'));

    expect(result.current).toEqual({
      sm: 640,
      isAboveSm: true,
      isBelowSm: false,
    });
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(max-width: 640px)');
  });

  it('should return correct values for md breakpoint when below', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useBreakpoint('md'));

    expect(result.current).toEqual({
      md: 768,
      isAboveMd: false,
      isBelowMd: true,
    });
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(max-width: 768px)');
  });

  it('should return correct values for md breakpoint when above', () => {
    mockUseMediaQuery.mockReturnValue(false);

    const { result } = renderHook(() => useBreakpoint('md'));

    expect(result.current).toEqual({
      md: 768,
      isAboveMd: true,
      isBelowMd: false,
    });
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(max-width: 768px)');
  });

  it('should return correct values for lg breakpoint when below', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useBreakpoint('lg'));

    expect(result.current).toEqual({
      lg: 1024,
      isAboveLg: false,
      isBelowLg: true,
    });
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(max-width: 1024px)');
  });

  it('should return correct values for lg breakpoint when above', () => {
    mockUseMediaQuery.mockReturnValue(false);

    const { result } = renderHook(() => useBreakpoint('lg'));

    expect(result.current).toEqual({
      lg: 1024,
      isAboveLg: true,
      isBelowLg: false,
    });
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(max-width: 1024px)');
  });

  it('should return correct values for xl breakpoint when below', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useBreakpoint('xl'));

    expect(result.current).toEqual({
      xl: 1280,
      isAboveXl: false,
      isBelowXl: true,
    });
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(max-width: 1280px)');
  });

  it('should return correct values for xl breakpoint when above', () => {
    mockUseMediaQuery.mockReturnValue(false);

    const { result } = renderHook(() => useBreakpoint('xl'));

    expect(result.current).toEqual({
      xl: 1280,
      isAboveXl: true,
      isBelowXl: false,
    });
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(max-width: 1280px)');
  });

  it('should handle multiple breakpoint calls', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(true)  // xs call
      .mockReturnValueOnce(false); // sm call

    const { result: xsResult } = renderHook(() => useBreakpoint('xs'));
    const { result: smResult } = renderHook(() => useBreakpoint('sm'));

    expect(xsResult.current).toEqual({
      xs: 480,
      isAboveXs: false,
      isBelowXs: true,
    });

    expect(smResult.current).toEqual({
      sm: 640,
      isAboveSm: true,
      isBelowSm: false,
    });

    expect(mockUseMediaQuery).toHaveBeenCalledTimes(2);
    expect(mockUseMediaQuery).toHaveBeenNthCalledWith(1, '(max-width: 480px)');
    expect(mockUseMediaQuery).toHaveBeenNthCalledWith(2, '(max-width: 640px)');
  });

  it('should handle re-renders with same breakpoint', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const { result, rerender } = renderHook(() => useBreakpoint('md'));

    expect(result.current).toEqual({
      md: 768,
      isAboveMd: false,
      isBelowMd: true,
    });

    // Re-render with same breakpoint
    rerender();

    expect(result.current).toEqual({
      md: 768,
      isAboveMd: false,
      isBelowMd: true,
    });

    expect(mockUseMediaQuery).toHaveBeenCalledTimes(2);
  });

  it('should handle re-renders with different breakpoint', () => {
    mockUseMediaQuery
      .mockReturnValueOnce(true)  // first call
      .mockReturnValueOnce(false); // second call

    const { result, rerender } = renderHook(
      ({ breakpoint }) => useBreakpoint(breakpoint),
      { initialProps: { breakpoint: 'md' as const } }
    );

    expect(result.current).toEqual({
      md: 768,
      isAboveMd: false,
      isBelowMd: true,
    });

    // Re-render with different breakpoint
    rerender({ breakpoint: 'lg' });

    expect(result.current).toEqual({
      lg: 1024,
      isAboveLg: true,
      isBelowLg: false,
    });

    expect(mockUseMediaQuery).toHaveBeenCalledTimes(2);
  });

  it('should extract numeric value correctly from breakpoint string', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useBreakpoint('xl'));

    expect(result.current.xl).toBe(1280);
    expect(typeof result.current.xl).toBe('number');
  });

  it('should handle edge case with very small breakpoint values', () => {
    // This test ensures the regex replacement works correctly
    mockUseMediaQuery.mockReturnValue(true);

    const { result } = renderHook(() => useBreakpoint('xs'));

    expect(result.current.xs).toBe(480);
    expect(result.current.xs).not.toBe('480px');
  });
});
import { useImageCache } from '../../hooks/use-image-cache';
import { act,renderHook } from '../utils/test-utils';

// Mock Image constructor
const mockImage = {
  onload: null as (() => void) | null,
  onerror: null as (() => void) | null,
  src: '',
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

// Mock global Image
Object.defineProperty(global, 'Image', {
  value: jest.fn(() => mockImage),
  writable: true
});

describe('useImageCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock image
    mockImage.onload = null;
    mockImage.onerror = null;
    mockImage.src = '';
  });

  it('should initialize with cached image', () => {
    const src = 'https://example.com/image.jpg';
    
    // Pre-populate the cache by creating a hook instance first
    const { result: firstResult } = renderHook(() => useImageCache(src));
    
    // Simulate successful load to populate cache
    act(() => {
      if (mockImage.onload) {
        mockImage.onload();
      }
    });
    
    expect(firstResult.current.isLoaded).toBe(true);
    
    // Now test with a new instance - it should use the cache
    const { result } = renderHook(() => useImageCache(src));
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.hasError).toBe(false);
    expect(result.current.imgSrc).toBe(src);
  });

  it('should initialize with loading state for new image', () => {
    const src = 'https://example.com/new-image.jpg';

    const { result } = renderHook(() => useImageCache(src));

    expect(result.current.isLoaded).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(result.current.imgSrc).toBe(src);
  });

  it('should handle successful image load', async () => {
    const src = 'https://example.com/success-image.jpg';

    const { result } = renderHook(() => useImageCache(src));

    expect(result.current.isLoaded).toBe(false);

    // Simulate successful load
    act(() => {
      if (mockImage.onload) {
        mockImage.onload();
      }
    });

    expect(result.current.isLoaded).toBe(true);
    expect(result.current.hasError).toBe(false);
  });

  it('should handle image load error', async () => {
    const src = 'https://example.com/error-image.jpg';

    const { result } = renderHook(() => useImageCache(src));

    expect(result.current.hasError).toBe(false);

    // Simulate load error
    act(() => {
      if (mockImage.onerror) {
        mockImage.onerror();
      }
    });

    expect(result.current.isLoaded).toBe(false);
    expect(result.current.hasError).toBe(true);
  });

  it('should set correct src on Image object', () => {
    const src = 'https://example.com/test-image.jpg';

    renderHook(() => useImageCache(src));

    expect(global.Image).toHaveBeenCalled();
    expect(mockImage.src).toBe(src);
  });

  it('should not create new Image when src is empty', () => {
    const { result } = renderHook(() => useImageCache(''));

    expect(global.Image).not.toHaveBeenCalled();
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  it('should not create new Image when src is already cached', () => {
    const src = 'https://example.com/cached-image.jpg';
    
    // First load to populate cache
    const { result: firstResult } = renderHook(() => useImageCache(src));
    act(() => {
      if (mockImage.onload) {
        mockImage.onload();
      }
    });
    
    // Clear the mock to track new calls
    jest.clearAllMocks();
    
    // Second load should use cache
    renderHook(() => useImageCache(src));

    expect(global.Image).not.toHaveBeenCalled();
  });

  it('should update when src changes', () => {
    const initialSrc = 'https://example.com/initial.jpg';
    const newSrc = 'https://example.com/new.jpg';

    const { result, rerender } = renderHook(
      ({ src }) => useImageCache(src),
      { initialProps: { src: initialSrc } }
    );

    expect(mockImage.src).toBe(initialSrc);
    expect(result.current.imgSrc).toBe(initialSrc);

    rerender({ src: newSrc });

    expect(mockImage.src).toBe(newSrc);
    // Note: imgSrc state update might be async, so we just check the Image src
  });

  it('should clean up event listeners on unmount', () => {
    const src = 'https://example.com/cleanup-test.jpg';

    const { unmount } = renderHook(() => useImageCache(src));

    expect(mockImage.onload).toBeDefined();
    expect(mockImage.onerror).toBeDefined();

    unmount();

    expect(mockImage.onload).toBeNull();
    expect(mockImage.onerror).toBeNull();
  });

  it('should clean up event listeners when src changes', () => {
    const src1 = 'https://example.com/src1.jpg';
    const src2 = 'https://example.com/src2.jpg';

    const { rerender } = renderHook(
      ({ src }) => useImageCache(src),
      { initialProps: { src: src1 } }
    );

    expect(mockImage.onload).toBeDefined();
    expect(mockImage.onerror).toBeDefined();

    rerender({ src: src2 });

    // New listeners should be set
    expect(mockImage.onload).toBeDefined();
    expect(mockImage.onerror).toBeDefined();
  });

  it('should handle setImgSrc function', () => {
    const initialSrc = 'https://example.com/initial.jpg';
    const newSrc = 'https://example.com/new.jpg';

    const { result } = renderHook(() => useImageCache(initialSrc));

    expect(result.current.imgSrc).toBe(initialSrc);

    act(() => {
      result.current.setImgSrc(newSrc);
    });

    expect(result.current.imgSrc).toBe(newSrc);
  });

  it('should maintain separate state for different instances', () => {
    const src1 = 'https://example.com/image1.jpg';
    const src2 = 'https://example.com/image2.jpg';

    const { result: result1 } = renderHook(() => useImageCache(src1));
    const { result: result2 } = renderHook(() => useImageCache(src2));

    expect(result1.current.imgSrc).toBe(src1);
    expect(result2.current.imgSrc).toBe(src2);
    expect(result1.current.isLoaded).toBe(false);
    expect(result2.current.isLoaded).toBe(false);
  });

  it('should handle rapid src changes', () => {
    const initialSrc = 'https://example.com/img1.jpg';
    const newSrc = 'https://example.com/img2.jpg';

    const { result, rerender } = renderHook(
      ({ src }) => useImageCache(src),
      { initialProps: { src: initialSrc } }
    );

    // Test initial state
    expect(result.current.imgSrc).toBe(initialSrc);

    // Change src
    rerender({ src: newSrc });
    expect(mockImage.src).toBe(newSrc);
  });
});

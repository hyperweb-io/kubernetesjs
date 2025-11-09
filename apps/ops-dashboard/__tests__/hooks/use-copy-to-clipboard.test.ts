import { act,renderHook } from '@testing-library/react';

import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard';

describe('useCopyToClipboard', () => {
  let mockWriteText: jest.Mock;
  
  beforeEach(() => {
    jest.useFakeTimers();
    mockWriteText = jest.fn();
    
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });
  
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should initialize with false isCopied state', () => {
    const { result } = renderHook(() => useCopyToClipboard());
    
    expect(typeof result.current[0]).toBe('function');
    expect(result.current[1]).toBe(false);
  });

  it('should copy text to clipboard successfully', async () => {
    mockWriteText.mockResolvedValueOnce(undefined);
    
    const { result } = renderHook(() => useCopyToClipboard());
    const [copyToClipboard] = result.current;
    
    let copyResult: boolean;
    await act(async () => {
      copyResult = await copyToClipboard('test text');
    });
    
    expect(mockWriteText).toHaveBeenCalledWith('test text');
    expect(copyResult!).toBe(true);
    expect(result.current[1]).toBe(true);
  });

  it('should reset isCopied state after timeout', async () => {
    mockWriteText.mockResolvedValueOnce(undefined);
    
    const { result } = renderHook(() => useCopyToClipboard());
    const [copyToClipboard] = result.current;
    
    await act(async () => {
      await copyToClipboard('test text');
    });
    
    expect(result.current[1]).toBe(true);
    
    act(() => {
      jest.advanceTimersByTime(800);
    });
    
    expect(result.current[1]).toBe(false);
  });

  it('should handle clipboard write failure', async () => {
    const error = new Error('Clipboard write failed');
    mockWriteText.mockRejectedValueOnce(error);
    
    const { result } = renderHook(() => useCopyToClipboard());
    const [copyToClipboard] = result.current;
    
    let copyResult: boolean;
    await act(async () => {
      copyResult = await copyToClipboard('test text');
    });
    
    expect(mockWriteText).toHaveBeenCalledWith('test text');
    expect(copyResult!).toBe(false);
    expect(result.current[1]).toBe(false);
  });

  it('should handle when clipboard API is not available', async () => {
    Object.assign(navigator, {
      clipboard: undefined,
    });
    
    const { result } = renderHook(() => useCopyToClipboard());
    const [copyToClipboard] = result.current;
    
    let copyResult: boolean;
    await act(async () => {
      copyResult = await copyToClipboard('test text');
    });
    
    expect(copyResult!).toBe(false);
    expect(result.current[1]).toBe(false);
  });

  it('should handle empty string', async () => {
    mockWriteText.mockResolvedValueOnce(undefined);
    
    const { result } = renderHook(() => useCopyToClipboard());
    const [copyToClipboard] = result.current;
    
    let copyResult: boolean;
    await act(async () => {
      copyResult = await copyToClipboard('');
    });
    
    expect(mockWriteText).toHaveBeenCalledWith('');
    expect(copyResult!).toBe(true);
    expect(result.current[1]).toBe(true);
  });

  it('should handle multiple rapid copies', async () => {
    mockWriteText.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useCopyToClipboard());
    const [copyToClipboard] = result.current;
    
    await act(async () => {
      await copyToClipboard('first text');
      await copyToClipboard('second text');
    });
    
    expect(mockWriteText).toHaveBeenCalledTimes(2);
    expect(result.current[1]).toBe(true);
  });
});

import { act,renderHook } from '@testing-library/react';

import { useDebounce } from '../../hooks/use-debounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('应该返回初始值', () => {
    const { result } = renderHook(() => useDebounce('initial', 100));
    
    expect(result.current).toBe('initial');
  });

  it('应该在延迟后更新值', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );

    expect(result.current).toBe('initial');

    // 更新值
    rerender({ value: 'updated', delay: 100 });
    
    // 延迟时间未到，值应该还是旧的
    expect(result.current).toBe('initial');

    // 快进时间
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // 现在值应该更新了
    expect(result.current).toBe('updated');
  });

  it('应该取消之前的更新如果值再次改变', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );

    // 第一次更新
    rerender({ value: 'first', delay: 100 });
    
    // 快进50ms
    act(() => {
      jest.advanceTimersByTime(50);
    });
    
    // 值应该还是旧的
    expect(result.current).toBe('initial');

    // 第二次更新（应该取消第一次）
    rerender({ value: 'second', delay: 100 });
    
    // 快进100ms（完整的延迟时间）
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    // 值应该是第二次更新的值
    expect(result.current).toBe('second');
  });

  it('应该处理空值', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: null, delay: 100 } }
    );

    expect(result.current).toBe(null);

    rerender({ value: 'test', delay: 100 });
    
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe('test');
  });

  it('应该处理零延迟', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );

    rerender({ value: 'updated', delay: 0 });
    
    // 零延迟应该立即更新
    act(() => {
      jest.runAllTimers();
    });
    
    expect(result.current).toBe('updated');
  });

  it('应该清理定时器在组件卸载时', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );

    rerender({ value: 'updated', delay: 100 });
    
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });
});

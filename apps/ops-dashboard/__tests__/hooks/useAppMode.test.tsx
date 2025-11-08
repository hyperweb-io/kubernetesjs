import { useAppMode } from '../../contexts/AppContext';
import { AppProvider } from '../../contexts/AppContext';
import { act,renderHook } from '../utils/test-utils';

describe('useAppMode', () => {
  it('should return initial mode', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider initialMode="infra">
        {children}
      </AppProvider>
    );

    const { result } = renderHook(() => useAppMode(), { wrapper });

    expect(result.current.mode).toBe('infra');
    expect(typeof result.current.setMode).toBe('function');
  });

  it('should return custom initial mode', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider initialMode="smart-objects">
        {children}
      </AppProvider>
    );

    const { result } = renderHook(() => useAppMode(), { wrapper });

    expect(result.current.mode).toBe('smart-objects');
    expect(typeof result.current.setMode).toBe('function');
  });

  it('should update mode when setMode is called', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider initialMode="infra">
        {children}
      </AppProvider>
    );

    const { result } = renderHook(() => useAppMode(), { wrapper });

    expect(result.current.mode).toBe('infra');

    act(() => {
      result.current.setMode('smart-objects');
    });

    expect(result.current.mode).toBe('smart-objects');
  });

  it('should support switching between modes', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider initialMode="infra">
        {children}
      </AppProvider>
    );

    const { result } = renderHook(() => useAppMode(), { wrapper });

    expect(result.current.mode).toBe('infra');

    act(() => {
      result.current.setMode('smart-objects');
    });
    expect(result.current.mode).toBe('smart-objects');

    act(() => {
      result.current.setMode('infra');
    });
    expect(result.current.mode).toBe('infra');
  });

  it('should throw error when used outside AppProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useAppMode(), { wrapper: ({ children }) => <>{children}</> });
    }).toThrow('useAppMode must be used within an AppProvider');

    console.error = originalError;
  });

  it('should maintain referential stability of setMode function', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider initialMode="infra">
        {children}
      </AppProvider>
    );

    const { result, rerender } = renderHook(() => useAppMode(), { wrapper });

    const firstSetMode = result.current.setMode;

    // Rerender without changing mode
    rerender();

    expect(result.current.setMode).toBe(firstSetMode);
  });

  it('should handle rapid mode changes', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider initialMode="infra">
        {children}
      </AppProvider>
    );

    const { result } = renderHook(() => useAppMode(), { wrapper });

    // Rapidly change mode multiple times
    act(() => {
      result.current.setMode('smart-objects');
      result.current.setMode('infra');
      result.current.setMode('smart-objects');
    });

    expect(result.current.mode).toBe('smart-objects');
  });

  it('should work with both valid modes', () => {
    const modes = ['infra', 'smart-objects'] as const;

    modes.forEach(mode => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AppProvider initialMode={mode}>
          {children}
        </AppProvider>
      );

      const { result } = renderHook(() => useAppMode(), { wrapper });

      expect(result.current.mode).toBe(mode);
    });
  });

  it('should handle mode changes with TypeScript type safety', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider initialMode="infra">
        {children}
      </AppProvider>
    );

    const { result } = renderHook(() => useAppMode(), { wrapper });

    // Test that TypeScript types are correctly enforced
    act(() => {
      result.current.setMode('smart-objects');
    });
    expect(result.current.mode).toBe('smart-objects');

    act(() => {
      result.current.setMode('infra');
    });
    expect(result.current.mode).toBe('infra');
  });

  it('should maintain state across re-renders', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider initialMode="infra">
        {children}
      </AppProvider>
    );

    const { result, rerender } = renderHook(() => useAppMode(), { wrapper });

    act(() => {
      result.current.setMode('smart-objects');
    });

    expect(result.current.mode).toBe('smart-objects');

    // Rerender and check state is maintained
    rerender();

    expect(result.current.mode).toBe('smart-objects');
  });
});

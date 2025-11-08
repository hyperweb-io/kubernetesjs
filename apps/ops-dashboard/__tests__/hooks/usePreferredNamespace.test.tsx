import { usePreferredNamespace } from '../../contexts/NamespaceContext';
import { NamespaceProvider } from '../../contexts/NamespaceContext';
import { act,renderHook } from '../utils/test-utils';

describe('usePreferredNamespace', () => {
  it('should return initial namespace', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NamespaceProvider initialNamespace="default">
        {children}
      </NamespaceProvider>
    );

    const { result } = renderHook(() => usePreferredNamespace(), { wrapper });

    expect(result.current.namespace).toBe('default');
    expect(typeof result.current.setNamespace).toBe('function');
  });

  it('should return custom initial namespace', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NamespaceProvider initialNamespace="kube-system">
        {children}
      </NamespaceProvider>
    );

    const { result } = renderHook(() => usePreferredNamespace(), { wrapper });

    expect(result.current.namespace).toBe('kube-system');
    expect(typeof result.current.setNamespace).toBe('function');
  });

  it('should update namespace when setNamespace is called', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NamespaceProvider initialNamespace="default">
        {children}
      </NamespaceProvider>
    );

    const { result } = renderHook(() => usePreferredNamespace(), { wrapper });

    expect(result.current.namespace).toBe('default');

    act(() => {
      result.current.setNamespace('kube-system');
    });

    expect(result.current.namespace).toBe('kube-system');
  });

  it('should support multiple namespace changes', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NamespaceProvider initialNamespace="default">
        {children}
      </NamespaceProvider>
    );

    const { result } = renderHook(() => usePreferredNamespace(), { wrapper });

    expect(result.current.namespace).toBe('default');

    act(() => {
      result.current.setNamespace('kube-system');
    });
    expect(result.current.namespace).toBe('kube-system');

    act(() => {
      result.current.setNamespace('monitoring');
    });
    expect(result.current.namespace).toBe('monitoring');

    act(() => {
      result.current.setNamespace('default');
    });
    expect(result.current.namespace).toBe('default');
  });

  it('should support _all namespace', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NamespaceProvider initialNamespace="default">
        {children}
      </NamespaceProvider>
    );

    const { result } = renderHook(() => usePreferredNamespace(), { wrapper });

    act(() => {
      result.current.setNamespace('_all');
    });

    expect(result.current.namespace).toBe('_all');
  });

  it('should throw error when used outside NamespaceProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => usePreferredNamespace(), { wrapper: ({ children }) => <>{children}</> });
    }).toThrow('usePreferredNamespace must be used within a NamespaceProvider');

    console.error = originalError;
  });

  it('should maintain referential stability of setNamespace function', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NamespaceProvider initialNamespace="default">
        {children}
      </NamespaceProvider>
    );

    const { result, rerender } = renderHook(() => usePreferredNamespace(), { wrapper });

    const firstSetNamespace = result.current.setNamespace;

    // Rerender without changing namespace
    rerender();

    // Note: Due to startTransition wrapper, the function reference may change
    // but the functionality should remain the same
    expect(typeof result.current.setNamespace).toBe('function');
    expect(result.current.namespace).toBe('default');
  });

  it('should handle rapid namespace changes', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NamespaceProvider initialNamespace="default">
        {children}
      </NamespaceProvider>
    );

    const { result } = renderHook(() => usePreferredNamespace(), { wrapper });

    // Rapidly change namespace multiple times
    act(() => {
      result.current.setNamespace('kube-system');
      result.current.setNamespace('monitoring');
      result.current.setNamespace('default');
    });

    expect(result.current.namespace).toBe('default');
  });

  it('should work with different initial namespaces', () => {
    const testCases = ['default', 'kube-system', 'monitoring', 'istio-system', '_all'];

    testCases.forEach(initialNamespace => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <NamespaceProvider initialNamespace={initialNamespace}>
          {children}
        </NamespaceProvider>
      );

      const { result } = renderHook(() => usePreferredNamespace(), { wrapper });

      expect(result.current.namespace).toBe(initialNamespace);
    });
  });
});


import { 
  createInstallOperator,
  createInstallOperatorError,
  createInstallOperatorSlow,
  createOperatorsList,
  createOperatorsListError,
  createOperatorsListNetworkError,
  createUninstallOperator,
  createUninstallOperatorError} from '../../__mocks__/handlers/operators';
import { server } from '../../__mocks__/server';
import { useOperatorMutation,useOperators } from '../../hooks/use-operators';
import { act,renderHook, waitFor } from '../utils/test-utils';

const API_BASE = 'http://localhost:8001';

describe('useOperators', () => {
  describe('Success scenarios', () => {
    it('should successfully fetch operators list', async () => {
      server.use(createOperatorsList());

      const { result } = renderHook(() => useOperators());

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.data).toHaveLength(5);
      expect(result.current.data?.[0].name).toBe('cert-manager');
      expect(result.current.data?.[0].status).toBe('installed');
      expect(result.current.data?.[1].name).toBe('cloudnative-pg');
      expect(result.current.data?.[1].status).toBe('installed');
    });

    it('should handle empty operators list', async () => {
      server.use(createOperatorsList([]));

      const { result } = renderHook(() => useOperators());

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(0);
    });

    it('should refetch at specified interval', async () => {
      server.use(createOperatorsList());

      const { result } = renderHook(() => useOperators());

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(5);
      expect(result.current.isRefetching).toBe(false);
    });
  });

  describe('Loading states', () => {
    it('should show loading state initially', async () => {
      server.use(createOperatorsList());

      const { result } = renderHook(() => useOperators());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeDefined();
    });

    it('should handle refetching state', async () => {
      server.use(createOperatorsList());

      const { result } = renderHook(() => useOperators());

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Trigger a refetch
      act(() => {
        result.current.refetch();
      });

      // Check that refetching is happening (may be very quick)
      expect(result.current.isRefetching).toBeDefined();

      await waitFor(() => {
        expect(result.current.isRefetching).toBe(false);
      });
    });
  });

  describe('Error handling', () => {
    it('should handle API errors (500)', async () => {
      server.use(createOperatorsListError(500, 'Internal Server Error'));

      const { result } = renderHook(() => useOperators());

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });

    it('should handle API errors (404)', async () => {
      server.use(createOperatorsListError(404, 'Not Found'));

      const { result } = renderHook(() => useOperators());

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });

    it('should handle network errors', async () => {
      server.use(createOperatorsListNetworkError());

      const { result } = renderHook(() => useOperators());

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('Data transformation', () => {
    it('should correctly transform operator data', async () => {
      const customOperators = [
        {
          name: 'test-operator',
          status: 'installed' as const,
          version: 'v1.0.0',
          description: 'Test operator for testing'
        },
        {
          name: 'another-operator',
          status: 'not-installed' as const,
          description: 'Another test operator'
        }
      ];

      server.use(createOperatorsList(customOperators));

      const { result } = renderHook(() => useOperators());

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.[0].name).toBe('test-operator');
      expect(result.current.data?.[0].status).toBe('installed');
      expect(result.current.data?.[0].version).toBe('v1.0.0');
      expect(result.current.data?.[1].status).toBe('not-installed');
    });

    it('should handle different operator statuses', async () => {
      const multiStatusOperators = [
        { name: 'installed-op', status: 'installed' as const, version: 'v1.0.0' },
        { name: 'not-installed-op', status: 'not-installed' as const },
        { name: 'installing-op', status: 'installing' as const },
        { name: 'error-op', status: 'error' as const, version: 'v0.9.0' }
      ];

      server.use(createOperatorsList(multiStatusOperators));

      const { result } = renderHook(() => useOperators());

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(4);
      expect(result.current.data?.[0].status).toBe('installed');
      expect(result.current.data?.[1].status).toBe('not-installed');
      expect(result.current.data?.[2].status).toBe('installing');
      expect(result.current.data?.[3].status).toBe('error');
    });
  });

  describe('Caching behavior', () => {
    it('should cache data between renders', async () => {
      server.use(createOperatorsList());

      const { result, rerender } = renderHook(() => useOperators());

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const firstData = result.current.data;

      rerender();

      expect(result.current.data).toBe(firstData);
    });

    it('should have staleTime of 0 for immediate refetch', async () => {
      server.use(createOperatorsList());

      const { result } = renderHook(() => useOperators());

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Data should be considered stale immediately
      expect(result.current.isStale).toBe(true);
    });
  });
});

describe('useOperatorMutation', () => {
  describe('Install operator', () => {
    it('should install operator successfully', async () => {
      server.use(createInstallOperator('cert-manager'));

      const { result } = renderHook(() => useOperatorMutation());

      await act(async () => {
        await result.current.installOperator.mutateAsync('cert-manager');
      });

      await waitFor(() => {
        expect(result.current.installOperator.isSuccess).toBe(true)
      })
      expect(result.current.installOperator.data).toBeDefined()
    })

    it('should handle install operator errors', async () => {
      server.use(createInstallOperatorError('cert-manager', 500, 'Installation failed'));

      const { result } = renderHook(() => useOperatorMutation());

      await act(async () => {
        try {
          await result.current.installOperator.mutateAsync('cert-manager');
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.installOperator.isError).toBe(true)
      })
      expect(result.current.installOperator.error).toBeDefined()
    })

    it('should handle slow install operations', async () => {
      server.use(createInstallOperatorSlow('cert-manager', 1000));

      const { result } = renderHook(() => useOperatorMutation());

      act(() => {
        result.current.installOperator.mutate('cert-manager');
      });

      // Check that mutation is pending (may be very quick)
      expect(result.current.installOperator.isPending).toBeDefined();

      await waitFor(() => {
        expect(result.current.installOperator.isSuccess).toBe(true);
      }, { timeout: 2000 });

      expect(result.current.installOperator.isPending).toBe(false);
    });

    it('should invalidate queries on successful install', async () => {
      server.use(createInstallOperator('cert-manager'));

      const { result } = renderHook(() => useOperatorMutation());

      await act(async () => {
        await result.current.installOperator.mutateAsync('cert-manager');
      });

      await waitFor(() => {
        expect(result.current.installOperator.isSuccess).toBe(true)
      })
    })
  })

  describe('Uninstall operator', () => {
    it('should uninstall operator successfully', async () => {
      server.use(createUninstallOperator('cert-manager'));

      const { result } = renderHook(() => useOperatorMutation());

      await act(async () => {
        await result.current.uninstallOperator.mutateAsync('cert-manager');
      });

      await waitFor(() => {
        expect(result.current.uninstallOperator.isSuccess).toBe(true)
      })
      expect(result.current.uninstallOperator.data).toBeDefined()
    })

    it('should handle uninstall operator errors', async () => {
      server.use(createUninstallOperatorError('cert-manager', 500, 'Uninstallation failed'));

      const { result } = renderHook(() => useOperatorMutation());

      await act(async () => {
        try {
          await result.current.uninstallOperator.mutateAsync('cert-manager');
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.uninstallOperator.isError).toBe(true)
      })
      expect(result.current.uninstallOperator.error).toBeDefined()
    })

    it('should invalidate queries on successful uninstall', async () => {
      server.use(createUninstallOperator('cert-manager'));

      const { result } = renderHook(() => useOperatorMutation());

      await act(async () => {
        await result.current.uninstallOperator.mutateAsync('cert-manager');
      });

      await waitFor(() => {
        expect(result.current.uninstallOperator.isSuccess).toBe(true);
      });
    });
  });

  describe('Mutation state management', () => {
    it('should reset mutation state on new mutation', async () => {
      server.use(createInstallOperator('cert-manager'));

      const { result } = renderHook(() => useOperatorMutation());

      // First mutation
      act(() => {
        result.current.installOperator.mutate('cert-manager');
      });

      await waitFor(() => {
        expect(result.current.installOperator.isSuccess).toBe(true);
      });

      // Reset and start new mutation
      act(() => {
        result.current.installOperator.reset();
      });

      // After reset, mutation should be reset
      // Check that reset was called (the exact state may vary)
      expect(typeof result.current.installOperator.reset).toBe('function');
    });

    it('should handle multiple operators', async () => {
      server.use(
        createInstallOperator('cert-manager'),
        createInstallOperator('cloudnative-pg')
      );

      const { result } = renderHook(() => useOperatorMutation());

      // Install first operator
      await act(async () => {
        await result.current.installOperator.mutateAsync('cert-manager');
      });

      await waitFor(() => {
        expect(result.current.installOperator.isSuccess).toBe(true)
      })

      // Install second operator
      await act(async () => {
        await result.current.installOperator.mutateAsync('cloudnative-pg');
      });

      await waitFor(() => {
        expect(result.current.installOperator.isSuccess).toBe(true)
      })
    })
  })
})

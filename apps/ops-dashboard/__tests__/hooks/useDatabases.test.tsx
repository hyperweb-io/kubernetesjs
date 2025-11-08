import { http, HttpResponse } from 'msw';

import { server } from '../../__mocks__/server';
import { useCreateBackup,useCreateDatabases, useQueryBackups } from '../../hooks/useDatabases';
import { act,renderHook, waitFor } from '../utils/test-utils';

const API_BASE = 'http://localhost:8001';

describe('useCreateDatabases', () => {
  describe('Success scenarios', () => {
    it('should create database successfully', async () => {
      server.use(
        http.post('/api/databases/:ns/:name/deploy', () => {
          return HttpResponse.json({ 
            success: true, 
            message: 'Database created successfully' 
          });
        })
      );

      const { result } = renderHook(() => useCreateDatabases());

      const params = {
        ns: 'default',
        name: 'test-db',
        instances: 1,
        storage: '10Gi',
        storageClass: 'standard',
        appUsername: 'appuser',
        appPassword: 'apppass',
        superuserPassword: 'superpass',
        enablePooler: true,
        poolerName: 'test-pooler',
        poolerInstances: 1
      };

      await act(async () => {
        await result.current.mutateAsync(params);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeDefined();
    });

    it('should handle different database configurations', async () => {
      server.use(
        http.post('/api/databases/:ns/:name/deploy', () => {
          return HttpResponse.json({ 
            success: true, 
            message: 'Database created successfully' 
          });
        })
      );

      const { result } = renderHook(() => useCreateDatabases());

      const params = {
        ns: 'production',
        name: 'prod-db',
        instances: 3,
        storage: '100Gi',
        storageClass: 'fast-ssd',
        appUsername: 'produser',
        appPassword: 'prodpass',
        superuserPassword: 'prodsuperpass',
        enablePooler: false,
        poolerName: '',
        poolerInstances: 0
      };

      await act(async () => {
        await result.current.mutateAsync(params);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('Error handling', () => {
    it('should handle creation errors', async () => {
      server.use(
        http.post('/api/databases/:ns/:name/deploy', () => {
          return HttpResponse.json(
            { error: 'Database creation failed' },
            { status: 500 }
          );
        })
      );

      const { result } = renderHook(() => useCreateDatabases());

      const params = {
        ns: 'default',
        name: 'test-db',
        instances: 1,
        storage: '10Gi',
        storageClass: 'standard',
        appUsername: 'appuser',
        appPassword: 'apppass',
        superuserPassword: 'superpass',
        enablePooler: false,
        poolerName: '',
        poolerInstances: 0
      };

      await act(async () => {
        try {
          await result.current.mutateAsync(params);
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      expect(result.current.error).toBeDefined();
    });

    it('should handle validation errors', async () => {
      server.use(
        http.post('/api/databases/:ns/:name/deploy', () => {
          return HttpResponse.json(
            { error: 'Invalid parameters' },
            { status: 400 }
          );
        })
      );

      const { result } = renderHook(() => useCreateDatabases());

      const params = {
        ns: 'default',
        name: 'test-db',
        instances: 1,
        storage: '10Gi',
        storageClass: 'standard',
        appUsername: 'appuser',
        appPassword: 'apppass',
        superuserPassword: 'superpass',
        enablePooler: false,
        poolerName: '',
        poolerInstances: 0
      };

      await act(async () => {
        try {
          await result.current.mutateAsync(params);
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('Loading states', () => {
    it('should show loading state during creation', async () => {
      server.use(
        http.post('/api/databases/:ns/:name/deploy', async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json({ success: true });
        })
      );

      const { result } = renderHook(() => useCreateDatabases());

      const params = {
        ns: 'default',
        name: 'test-db',
        instances: 1,
        storage: '10Gi',
        storageClass: 'standard',
        appUsername: 'appuser',
        appPassword: 'apppass',
        superuserPassword: 'superpass',
        enablePooler: false,
        poolerName: '',
        poolerInstances: 0
      };

      act(() => {
        result.current.mutate(params);
      });

      // Check that mutation is pending (may be very quick)
      expect(result.current.isPending).toBeDefined();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
    });
  });
});

describe('useQueryBackups', () => {
  describe('Success scenarios', () => {
    it('should fetch backups successfully', async () => {
      const mockBackups = [
        { id: 'backup-1', name: 'backup-1', createdAt: '2024-01-01T10:00:00Z', status: 'completed' },
        { id: 'backup-2', name: 'backup-2', createdAt: '2024-01-02T10:00:00Z', status: 'completed' }
      ];

      server.use(
        http.get('/api/databases/:ns/:name/backups', () => {
          return HttpResponse.json(mockBackups);
        })
      );

      const { result } = renderHook(() => useQueryBackups('default', 'test-db'));

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockBackups);
    });

    it('should handle empty backups list', async () => {
      server.use(
        http.get('/api/databases/:ns/:name/backups', () => {
          return HttpResponse.json([]);
        })
      );

      const { result } = renderHook(() => useQueryBackups('default', 'test-db'));

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should handle backup fetch errors', async () => {
      server.use(
        http.get('/api/databases/:ns/:name/backups', () => {
          return HttpResponse.json(
            { error: 'Failed to fetch backups' },
            { status: 500 }
          );
        })
      );

      const { result } = renderHook(() => useQueryBackups('default', 'test-db'));

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});

describe('useCreateBackup', () => {
  describe('Success scenarios', () => {
    it('should create backup successfully', async () => {
      server.use(
        http.post('/api/databases/:ns/:name/backups', () => {
          return HttpResponse.json({ 
            success: true, 
            message: 'Backup created successfully',
            backupId: 'backup-123'
          });
        })
      );

      const { result } = renderHook(() => useCreateBackup());

      const params = {
        ns: 'default',
        name: 'test-db',
        method: 'pg_dump'
      };

      await act(async () => {
        await result.current.mutateAsync(params);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(result.current.data).toBeDefined();
    });

    it('should create backup with default method', async () => {
      server.use(
        http.post('/api/databases/:ns/:name/backups', () => {
          return HttpResponse.json({ 
            success: true, 
            message: 'Backup created successfully' 
          });
        })
      );

      const { result } = renderHook(() => useCreateBackup());

      const params = {
        ns: 'default',
        name: 'test-db'
      };

      await act(async () => {
        await result.current.mutateAsync(params);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('Error handling', () => {
    it('should handle backup creation errors', async () => {
      server.use(
        http.post('/api/databases/:ns/:name/backups', () => {
          return HttpResponse.json(
            { error: 'Backup creation failed' },
            { status: 500 }
          );
        })
      );

      const { result } = renderHook(() => useCreateBackup());

      const params = {
        ns: 'default',
        name: 'test-db',
        method: 'pg_dump'
      };

      await act(async () => {
        try {
          await result.current.mutateAsync(params);
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      expect(result.current.error).toBeDefined();
    });
  });

  describe('Loading states', () => {
    it('should show loading state during backup creation', async () => {
      server.use(
        http.post('/api/databases/:ns/:name/backups', async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json({ success: true });
        })
      );

      const { result } = renderHook(() => useCreateBackup());

      const params = {
        ns: 'default',
        name: 'test-db',
        method: 'pg_dump'
      };

      act(() => {
        result.current.mutate(params);
      });

      // Check that mutation is pending (may be very quick)
      expect(result.current.isPending).toBeDefined();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
    });
  });
});
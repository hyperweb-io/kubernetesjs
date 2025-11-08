import React from 'react';
import { render, screen, waitFor, act } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { server } from '@/__mocks__/server';
import { http, HttpResponse } from 'msw';
import AdminBackupView from '@/app/admin/backups/page';
import { createBackupsList, createBackupsListError, createBackupsListNetworkError, createBackupsListData, BackupInfo } from '@/__mocks__/handlers/backups';

// Mock data factory
const createMockBackup = (overrides: Partial<BackupInfo> = {}): BackupInfo => ({
  name: 'backup-1',
  namespace: 'postgres-db',
  status: 'Running',
  ready: '1/1',
  restarts: 0,
  age: '1d',
  nodeName: 'node-1',
  createdAt: '2024-01-01T10:00:00Z',
  size: '10Gi',
  method: 'pg_dump',
  ...overrides
});

const mockBackups: BackupInfo[] = [
  createMockBackup({ name: 'backup-1', status: 'Running' }),
  createMockBackup({ name: 'backup-2', status: 'Pending' }),
  createMockBackup({ name: 'backup-3', status: 'Failed' })
];

// Setup MSW handlers
beforeAll(() => {
  server.use(
    http.get('/api/databases/postgres-db/postgres-cluster/backups', () => {
      return HttpResponse.json({ backups: mockBackups });
    })
  );
});

afterEach(() => {
  server.resetHandlers();
  server.use(
    http.get('/api/databases/postgres-db/postgres-cluster/backups', () => {
      return HttpResponse.json({ backups: mockBackups });
    })
  );
});

describe('AdminBackupView', () => {
  describe('Rendering', () => {
    it('should render the backups page with correct title and description', async () => {
      render(<AdminBackupView />);
      
      expect(screen.getByText('Backups')).toBeInTheDocument();
      expect(screen.getByText('Manage your Backups')).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      render(<AdminBackupView />);
      
      const refreshButton = screen.getByRole('button');
      expect(refreshButton).toBeInTheDocument();
    });

    it('should render stats cards with correct labels', () => {
      render(<AdminBackupView />);
      
      expect(screen.getByText('Total Backups')).toBeInTheDocument();
      expect(screen.getByText('Running')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });

    it('should render backups table with correct headers', async () => {
      render(<AdminBackupView />);
      
      // Wait for data to load and table to be rendered
      await waitFor(() => {
        expect(screen.getByText('backup-1')).toBeInTheDocument();
      });
      
      // Check table headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Namespace')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Ready')).toBeInTheDocument();
      expect(screen.getByText('Restarts')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Node')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    it('should display correct backup counts in stats cards', async () => {
      render(<AdminBackupView />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument(); // Total backups
      });
      
      // Check specific counts by looking at the card content
      expect(screen.getByText('3')).toBeInTheDocument(); // Total
      expect(screen.getAllByText('1')).toHaveLength(3); // Running, Pending, Failed
    });

    it('should render backup rows with correct data', async () => {
      render(<AdminBackupView />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('backup-1')).toBeInTheDocument();
      });
      
      // Check backup data
      expect(screen.getByText('backup-1')).toBeInTheDocument();
      expect(screen.getByText('backup-2')).toBeInTheDocument();
      expect(screen.getByText('backup-3')).toBeInTheDocument();
      expect(screen.getAllByText('postgres-db')).toHaveLength(3);
    });
  });

  describe('Loading States', () => {
    it('should show loading state with spinning refresh icon', async () => {
      // Mock loading state by using a handler that never resolves
      server.use(
        http.get('/api/databases/postgres-db/postgres-cluster/backups', () => {
          return new Promise(() => {}); // Never resolves, simulating loading
        })
      );

      render(<AdminBackupView />);
      
      // Should show loading spinner in the table area
      await waitFor(() => {
        const loadingSpinner = screen.getByRole('button').querySelector('svg');
        expect(loadingSpinner).toHaveClass('animate-spin');
      });
    });
  });

  describe('Error Handling', () => {
    it('should show error state with retry button', async () => {
      server.use(
        http.get('/api/databases/postgres-db/postgres-cluster/backups', () => {
          return HttpResponse.json(
            { error: 'Failed to list backups' },
            { status: 500 }
          );
        })
      );

      render(<AdminBackupView />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to list backups')).toBeInTheDocument();
      });
      
      // Should show retry button
      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
    });

    it('should show network error state', async () => {
      server.use(
        http.get('/api/databases/postgres-db/postgres-cluster/backups', () => {
          return HttpResponse.error();
        })
      );

      render(<AdminBackupView />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
      });
    });

    it('should retry when retry button is clicked', async () => {
      const user = userEvent.setup();
      
      // First request fails
      server.use(
        http.get('/api/databases/postgres-db/postgres-cluster/backups', () => {
          return HttpResponse.json(
            { error: 'Failed to list backups' },
            { status: 500 }
          );
        })
      );

      render(<AdminBackupView />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to list backups')).toBeInTheDocument();
      });
      
      // Second request succeeds
      server.use(
        http.get('/api/databases/postgres-db/postgres-cluster/backups', () => {
          return HttpResponse.json({ backups: mockBackups });
        })
      );
      
      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);
      
      // Should show data after retry
      await waitFor(() => {
        expect(screen.getByText('backup-1')).toBeInTheDocument();
      });
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no backups', async () => {
      server.use(
        http.get('/api/databases/postgres-db/postgres-cluster/backups', () => {
          return HttpResponse.json({ backups: [] });
        })
      );

      render(<AdminBackupView />);
      
      await waitFor(() => {
        expect(screen.getByText(/No backups found/)).toBeInTheDocument();
      });
      
      // Should show refresh button in empty state
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call refetch when refresh button is clicked', async () => {
      const user = userEvent.setup();
      render(<AdminBackupView />);
      
      // Wait for initial data to load
      await waitFor(() => {
        expect(screen.getByText('backup-1')).toBeInTheDocument();
      });
      
      // Mock new data for refresh
      const newBackups = [
        ...mockBackups,
        createMockBackup({ name: 'backup-4', status: 'Running' })
      ];
      server.use(
        http.get('/api/databases/postgres-db/postgres-cluster/backups', () => {
          return HttpResponse.json({ backups: newBackups });
        })
      );
      
      // Find the refresh button (the one without a title attribute)
      const refreshButton = screen.getAllByRole('button').find(button => !button.getAttribute('title'));
      expect(refreshButton).toBeDefined();
      await user.click(refreshButton!);
      
      // Verify refresh happened by checking for new data
      await waitFor(() => {
        expect(screen.getByText('backup-4')).toBeInTheDocument();
      });
    });

    it('should handle view details button click', async () => {
      const user = userEvent.setup();
      render(<AdminBackupView />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('backup-1')).toBeInTheDocument();
      });
      
      // Find and click the first view details button
      const viewButton = screen.getAllByTitle('View details')[0];
      await user.click(viewButton);
      
      // The click should work without errors (function just logs to console)
      expect(viewButton).toBeInTheDocument();
    });

    it('should handle view logs button click', async () => {
      const user = userEvent.setup();
      render(<AdminBackupView />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('backup-1')).toBeInTheDocument();
      });
      
      // Find and click the first view logs button
      const logsButton = screen.getAllByTitle('View logs')[0];
      await user.click(logsButton);
      
      // The click should work without errors (function just logs to console)
      expect(logsButton).toBeInTheDocument();
    });

    it('should handle delete button click', async () => {
      const user = userEvent.setup();
      render(<AdminBackupView />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('backup-1')).toBeInTheDocument();
      });
      
      // Find and click the first delete button
      const deleteButton = screen.getAllByTitle('Delete pod')[0];
      await user.click(deleteButton);
      
      // The click should work without errors (function just logs to console)
      expect(deleteButton).toBeInTheDocument();
    });

    it('should disable refresh button during loading', async () => {
      // Mock loading state
      server.use(
        http.get('/api/databases/postgres-db/postgres-cluster/backups', () => {
          return new Promise(() => {}); // Never resolves
        })
      );

      render(<AdminBackupView />);
      
      const refreshButton = screen.getByRole('button');
      expect(refreshButton).toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed API response', async () => {
      server.use(
        http.get('/api/databases/postgres-db/postgres-cluster/backups', () => {
          return HttpResponse.json({ invalid: 'data' });
        })
      );

      render(<AdminBackupView />);
      
      // Should handle gracefully - show empty state or error
      await waitFor(() => {
        expect(screen.getAllByText('0')).toHaveLength(4); // All stats show 0
      });
    });

    it('should handle null/undefined backup data', async () => {
      server.use(
        http.get('/api/databases/postgres-db/postgres-cluster/backups', () => {
          return HttpResponse.json({ backups: null });
        })
      );

      render(<AdminBackupView />);
      
      // Should handle gracefully
      await waitFor(() => {
        expect(screen.getAllByText('0')).toHaveLength(4); // All stats show 0
      });
    });
  });
});

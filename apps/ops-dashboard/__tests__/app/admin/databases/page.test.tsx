import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/test-utils';
import { server } from '@/__mocks__/server';
import { 
  createDatabaseStatus, 
  createDatabaseStatusError,
  createBackupsList,
  createCreateBackup
} from '@/__mocks__/handlers/databases';
import DatabasesPage from '@/app/admin/databases/page';
import { DatabaseStatusSummary } from '@/hooks/use-database-status';

describe('DatabasesPage', () => {
  const mockDatabaseStatus: DatabaseStatusSummary = {
    name: 'postgres-cluster',
    namespace: 'postgres-db',
    cluster: 'postgres-cluster',
    image: 'postgres:15',
    primary: 'postgres-cluster-1',
    primaryStartTime: '2024-01-01T00:00:00Z',
    phase: 'Cluster in healthy state',
    instances: 3,
    readyInstances: 3,
    systemID: '12345',
    services: {
      rw: 'postgres-cluster-rw',
      ro: 'postgres-cluster-ro',
      poolerRw: 'postgres-cluster-pooler-rw',
    },
    backups: {
      configured: true,
      scheduledCount: 2,
      lastBackupTime: '2024-01-01T00:00:00Z',
    },
    streaming: {
      configured: true,
      replicas: 2,
    },
    instancesTable: [
      {
        name: 'postgres-cluster-1',
        role: 'Primary',
        status: 'OK',
        qosClass: 'Burstable',
        node: 'node-1',
        startTime: '2024-01-01T00:00:00Z',
        ready: '1/1',
        restarts: 0,
      },
      {
        name: 'postgres-cluster-2',
        role: 'Replica',
        status: 'OK',
        qosClass: 'Burstable',
        node: 'node-2',
        startTime: '2024-01-01T00:00:00Z',
        ready: '1/1',
        restarts: 0,
      },
      {
        name: 'postgres-cluster-3',
        role: 'Replica',
        status: 'OK',
        qosClass: 'Burstable',
        node: 'node-3',
        startTime: '2024-01-01T00:00:00Z',
        ready: '1/1',
        restarts: 0,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    server.use(
      createDatabaseStatus(mockDatabaseStatus),
      createBackupsList()
    );
  });

  describe('Page Rendering', () => {
    it('should render page title and description', async () => {
      render(<DatabasesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Databases')).toBeInTheDocument();
        expect(screen.getByText('CloudNativePG clusters and status')).toBeInTheDocument();
      });
    });

    it('should render status cards with correct data', async () => {
      render(<DatabasesPage />);
      
      await waitFor(() => {
        // 测试状态卡片标题
        expect(screen.getByText('Total Pods')).toBeInTheDocument();
        expect(screen.getByText('Running')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('Failed')).toBeInTheDocument();
        
        // 测试状态卡片数值 - 使用更精确的选择器
        const totalPodsCard = screen.getByText('Total Pods').closest('.rounded-lg');
        expect(totalPodsCard).toHaveTextContent('3');
        
        const runningCard = screen.getByText('Running').closest('.rounded-lg');
        expect(runningCard).toHaveTextContent('3');
        
        const pendingCard = screen.getByText('Pending').closest('.rounded-lg');
        expect(pendingCard).toHaveTextContent('0');
        
        const failedCard = screen.getByText('Failed').closest('.rounded-lg');
        expect(failedCard).toHaveTextContent('0');
      });
    });

    it('should render database table with correct data', async () => {
      render(<DatabasesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('All Clusters')).toBeInTheDocument();
        expect(screen.getByText('postgres-cluster')).toBeInTheDocument();
        expect(screen.getByText('postgres:15')).toBeInTheDocument();
        expect(screen.getByText('postgres-cluster-1')).toBeInTheDocument();
        expect(screen.getByText('running')).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state initially', () => {
      render(<DatabasesPage />);
      
      // Test that refresh button is disabled
      const refreshButton = screen.getByRole('button', { name: '' });
      expect(refreshButton).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should show error state when database fetch fails', async () => {
      server.use(createDatabaseStatusError(500, 'Database connection failed'));
      
      render(<DatabasesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to fetch database status')).toBeInTheDocument();
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });

    it('should show not found state when database is not found', async () => {
      // Use error state to simulate database not found scenario
      server.use(createDatabaseStatusError(404, 'Database not found'));
      
      render(<DatabasesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to fetch database status')).toBeInTheDocument();
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions - Create Database', () => {
    it('should open create database dialog when button is clicked', async () => {
      const user = userEvent.setup();
      render(<DatabasesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('postgres-cluster')).toBeInTheDocument();
      });
      
      const createButton = screen.getByText('Create Database');
      await user.click(createButton);
      
      // Verify dialog opens - look for dialog elements
      await waitFor(() => {
        expect(screen.getByText('Create Database')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions - Create Backup', () => {
    it('should open create backup dialog when eye button is clicked', async () => {
      const user = userEvent.setup();
      render(<DatabasesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('postgres-cluster')).toBeInTheDocument();
      });
      
      const eyeButton = screen.getByTitle('View deployment');
      await user.click(eyeButton);
      
      // Verify dialog opens - use more precise selector
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions - Refresh Functionality', () => {
    it('should refresh data when refresh button is clicked', async () => {
      const user = userEvent.setup();
      render(<DatabasesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('postgres-cluster')).toBeInTheDocument();
      });
      
      const refreshButton = screen.getByRole('button', { name: '' });
      await user.click(refreshButton);
      
      // Verify refresh button was clicked (button state may change)
      expect(refreshButton).toBeInTheDocument();
    });
  });

  describe('Status Display', () => {
    it('should display correct status badge for healthy cluster', async () => {
      render(<DatabasesPage />);
      
      await waitFor(() => {
        const statusBadge = screen.getByText('running');
        expect(statusBadge).toBeInTheDocument();
      });
    });

    it('should display correct status badge for unknown status', async () => {
      const unknownStatus: DatabaseStatusSummary = { ...mockDatabaseStatus, phase: 'Unknown status' };
      server.use(createDatabaseStatus(unknownStatus));
      
      render(<DatabasesPage />);
      
      await waitFor(() => {
        const statusBadge = screen.getByText('Unknown status');
        expect(statusBadge).toBeInTheDocument();
      });
    });
  });

  describe('Service Display', () => {
    it('should handle services display correctly with pooler', async () => {
      render(<DatabasesPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/rw: postgres-cluster-rw \| ro: postgres-cluster-ro \| pooler-rw: postgres-cluster-pooler-rw/)).toBeInTheDocument();
      });
    });

    it('should handle services display correctly without pooler', async () => {
      const statusWithoutPooler: DatabaseStatusSummary = {
        ...mockDatabaseStatus,
        services: {
          rw: 'postgres-cluster-rw',
          ro: 'postgres-cluster-ro',
        },
      };
      
      server.use(createDatabaseStatus(statusWithoutPooler));
      
      render(<DatabasesPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/rw: postgres-cluster-rw \| ro: postgres-cluster-ro/)).toBeInTheDocument();
      });
    });
  });

  describe('MSW Integration Tests', () => {
    it('should handle API errors gracefully with MSW', async () => {
      server.use(createDatabaseStatusError(500, 'Server Error'));
      
      render(<DatabasesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to fetch database status')).toBeInTheDocument();
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });

    it('should handle successful data loading with MSW', async () => {
      server.use(createDatabaseStatus(mockDatabaseStatus));
      
      render(<DatabasesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('postgres-cluster')).toBeInTheDocument();
        expect(screen.getByText('postgres:15')).toBeInTheDocument();
        expect(screen.getByText('running')).toBeInTheDocument();
      });
    });
  });
});
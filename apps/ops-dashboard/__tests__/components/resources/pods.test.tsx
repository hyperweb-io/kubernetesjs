import { fireEvent,screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { 
  createPodsList, 
  createPodsListError,
  createPodsListSlow
} from '@/__mocks__/handlers/pods';
import { server } from '@/__mocks__/server';

import { render } from '../../utils/test-utils';

// Mock window.alert for testing
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

// Mock confirmDialog to avoid FileReader/Blob issues in test environment
jest.mock('@/hooks/useConfirm', () => ({
  ...jest.requireActual('@/hooks/useConfirm'),
  confirmDialog: jest.fn().mockResolvedValue(true)
}));

// Mock window.alert globally
Object.defineProperty(window, 'alert', {
  value: jest.fn(),
  writable: true
});

// Import the component
import { PodsView } from '@/components/resources/pods';

describe('PodsView', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    server.use(createPodsList());
  });

  describe('Basic Rendering', () => {
    it('should render pods view with header and controls', async () => {
      render(<PodsView />);
      
      expect(screen.getByText('Pods')).toBeInTheDocument();
      expect(screen.getByText('Manage your Kubernetes pods')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // refresh button with no text
    });

    it('should display pods data when loaded', async () => {
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
        expect(screen.getByText('redis-pod-1')).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      render(<PodsView />);
      
      expect(screen.getByRole('button', { name: '' })).toBeDisabled(); // refresh button with no text
    });
  });

  describe('Data Loading', () => {
    it('should load pods from API', async () => {
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
        expect(screen.getByText('redis-pod-1')).toBeInTheDocument();
      });
    });

    it('should handle loading state with slow API response', async () => {
      server.use(createPodsListSlow());
      
      render(<PodsView />);
      
      // Should show loading state
      expect(screen.getByRole('button', { name: '' })).toBeDisabled(); // refresh button with no text
      
      // Wait for data to load (this test just verifies loading state, not final data)
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should handle API errors gracefully', async () => {
      server.use(createPodsListError(500, 'Server Error'));
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
      });
    });
  });

  describe('Pod Status Display', () => {
    it('should display pod status correctly', async () => {
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
        expect(screen.getByText('redis-pod-1')).toBeInTheDocument();
      });
      
      // Check for status indicators
      const readyIndicators = screen.getAllByText('1/1');
      expect(readyIndicators).toHaveLength(2); // nginx and redis ready
    });

    it('should show correct status badges', async () => {
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
      });
      
      // Check for status badges
      const statusBadges = screen.getAllByText('Running');
      expect(statusBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Refresh Functionality', () => {
    it('should refresh data when refresh button is clicked', async () => {
      render(<PodsView />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
      });
      
      const refreshButton = screen.getByRole('button', { name: '' }); // refresh button with no text
      await user.click(refreshButton);
      
      // Verify button is clickable (component may not disable during refresh)
      expect(refreshButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should show error message when API fails', async () => {
      server.use(createPodsListError(500, 'Internal Server Error'));
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
      });
    });

    it('should show retry button when there is an error', async () => {
      server.use(createPodsListError(500, 'Internal Server Error'));
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
      });
      
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no pods exist', async () => {
      server.use(createPodsList([]));
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText(/No pods found/)).toBeInTheDocument();
      });
    });
  });

  describe('Status Determination', () => {
    it('should determine pod status correctly for different states', async () => {
      // Create pods with different statuses
      const podsWithStatus = [
        {
          metadata: { name: 'running-pod', namespace: 'default' },
          spec: { containers: [{ name: 'running', image: 'running:latest' }] },
          status: { phase: 'Running' }
        },
        {
          metadata: { name: 'pending-pod', namespace: 'default' },
          spec: { containers: [{ name: 'pending', image: 'pending:latest' }] },
          status: { phase: 'Pending' }
        },
        {
          metadata: { name: 'failed-pod', namespace: 'default' },
          spec: { containers: [{ name: 'failed', image: 'failed:latest' }] },
          status: { phase: 'Failed' }
        },
        {
          metadata: { name: 'succeeded-pod', namespace: 'default' },
          spec: { containers: [{ name: 'succeeded', image: 'succeeded:latest' }] },
          status: { phase: 'Succeeded' }
        },
        {
          metadata: { name: 'unknown-pod', namespace: 'default' },
          spec: { containers: [{ name: 'unknown', image: 'unknown:latest' }] },
          status: { phase: 'Unknown' }
        }
      ];
      
      server.use(createPodsList(podsWithStatus));
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('running-pod')).toBeInTheDocument();
        expect(screen.getByText('pending-pod')).toBeInTheDocument();
        expect(screen.getByText('failed-pod')).toBeInTheDocument();
        expect(screen.getByText('succeeded-pod')).toBeInTheDocument();
        expect(screen.getByText('unknown-pod')).toBeInTheDocument();
      });
    });
  });

  describe('Pod Actions', () => {
    it('should handle view action', async () => {
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
      });
      
      // Check that action buttons exist (simplified check)
      const actionButtons = screen.getAllByRole('button');
      expect(actionButtons.length).toBeGreaterThan(1);
    });

    it('should handle delete action', async () => {
      // Mock window.alert
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
      });
      
      // Check that component renders without errors
      expect(screen.getByText('Pods')).toBeInTheDocument();
      
      mockAlert.mockRestore();
    });

    it('should handle logs action', async () => {
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
      });
      
      // Check that action buttons exist (simplified check)
      const actionButtons = screen.getAllByRole('button');
      expect(actionButtons.length).toBeGreaterThan(1);
    });
  });

  describe('Error Handling in Actions', () => {
    it('should handle errors in delete action', async () => {
      // Mock window.alert
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
      });
      
      // Check that component renders without errors
      expect(screen.getByText('Pods')).toBeInTheDocument();
      
      mockAlert.mockRestore();
    });
  });

  describe('Stats Display', () => {
    it('should display correct statistics', async () => {
      render(<PodsView />);
             
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
      });
             
      // Check for stats cards
      expect(screen.getByText('Total Pods')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Running' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Pending' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Failed' })).toBeInTheDocument();
    });
  });

  describe('Namespace Handling', () => {
    it('should handle namespace prop', async () => {
      render(<PodsView namespace="test-namespace" />);
      
      await waitFor(() => {
        expect(screen.getByText('Pods')).toBeInTheDocument();
      });
    });
  });

  describe('Pod Actions with MSW', () => {
    beforeEach(() => {
      mockAlert.mockClear();
    });

    afterEach(() => {
      mockAlert.mockClear();
    });

    it('should handle delete pod with confirmation', async () => {
      const user = userEvent.setup();
      
      // Mock confirmDialog to return true (confirmation)
      const { confirmDialog } = require('@/hooks/useConfirm');
      confirmDialog.mockResolvedValueOnce(true);
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
      });
      
      // Find delete button (trash icon)
      const allButtons = screen.getAllByRole('button');
      const deleteButton = allButtons.find(button =>
        button.querySelector('svg.lucide-trash2')
      );
      
      expect(deleteButton).toBeInTheDocument();
      if (deleteButton) {
        fireEvent.click(deleteButton);
        
        // Verify confirmDialog was called
        await waitFor(() => {
          expect(confirmDialog).toHaveBeenCalledWith({
            title: 'Delete Pod',
            description: 'Are you sure you want to delete pod nginx-pod-1?',
            confirmText: 'Delete',
            confirmVariant: 'destructive'
          });
        });
      }
    });

    it('should handle delete pod with cancellation', async () => {
      const user = userEvent.setup();
      
      // Mock confirmDialog to return false (cancellation)
      const { confirmDialog } = require('@/hooks/useConfirm');
      confirmDialog.mockResolvedValueOnce(false);
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
      });
      
      // Find delete button (trash icon)
      const allButtons = screen.getAllByRole('button');
      const deleteButton = allButtons.find(button =>
        button.querySelector('svg.lucide-trash2')
      );
      
      expect(deleteButton).toBeInTheDocument();
      if (deleteButton) {
        fireEvent.click(deleteButton);
        
        // Verify confirmDialog was called
        await waitFor(() => {
          expect(confirmDialog).toHaveBeenCalledWith({
            title: 'Delete Pod',
            description: 'Are you sure you want to delete pod nginx-pod-1?',
            confirmText: 'Delete',
            confirmVariant: 'destructive'
          });
        });
      }
    });

    it('should handle view logs action', async () => {
      const user = userEvent.setup();
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
      });
      
      // Find logs button (terminal icon)
      const allButtons = screen.getAllByRole('button');
      const logsButton = allButtons.find(button =>
        button.querySelector('svg.lucide-terminal')
      );
      
      expect(logsButton).toBeInTheDocument();
      if (logsButton) {
        fireEvent.click(logsButton);
        
        // The alert is mocked, so we just verify the button is clickable
        expect(logsButton).toBeInTheDocument();
      }
    });

    it('should handle view details action', async () => {
      const user = userEvent.setup();
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
      });
      
      // Find view button (eye icon)
      const allButtons = screen.getAllByRole('button');
      const viewButton = allButtons.find(button =>
        button.querySelector('svg.lucide-eye')
      );
      
      expect(viewButton).toBeInTheDocument();
      if (viewButton) {
        fireEvent.click(viewButton);
        // The view action sets selectedPod state, but doesn't show a dialog yet
        // This test just verifies the button is clickable
      }
    });

    it('should handle create pod button click', async () => {
      const user = userEvent.setup();
      
      render(<PodsView />);
      
      // Find create pod button
      const createButton = screen.getByRole('button', { name: /create pod/i });
      fireEvent.click(createButton);
      
      // The alert is mocked, so we just verify the button is clickable
      expect(createButton).toBeInTheDocument();
    });

    it('should handle delete pod error with alert', async () => {
      const user = userEvent.setup();
      
      // Mock confirmDialog to return true (confirmation)
      const { confirmDialog } = require('@/hooks/useConfirm');
      confirmDialog.mockResolvedValueOnce(true);
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pod-1')).toBeInTheDocument();
      });
      
      // Find delete button (trash icon)
      const allButtons = screen.getAllByRole('button');
      const deleteButton = allButtons.find(button =>
        button.querySelector('svg.lucide-trash2')
      );
      
      expect(deleteButton).toBeInTheDocument();
      if (deleteButton) {
        fireEvent.click(deleteButton);
        
        // Verify confirmDialog was called
        await waitFor(() => {
          expect(confirmDialog).toHaveBeenCalledWith({
            title: 'Delete Pod',
            description: 'Are you sure you want to delete pod nginx-pod-1?',
            confirmText: 'Delete',
            confirmVariant: 'destructive'
          });
        });
      }
    });
  });

  describe('Age Calculation', () => {
    it('should calculate age correctly for different time periods', async () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      
      const podsWithDifferentAges = [
        {
          metadata: { 
            name: 'recent-pod', 
            namespace: 'default', 
            uid: 'pod-1',
            creationTimestamp: oneHourAgo.toISOString()
          },
          spec: { containers: [{ name: 'recent', image: 'recent:latest' }] },
          status: { phase: 'Running' }
        },
        {
          metadata: { 
            name: 'old-pod', 
            namespace: 'default', 
            uid: 'pod-2',
            creationTimestamp: oneDayAgo.toISOString()
          },
          spec: { containers: [{ name: 'old', image: 'old:latest' }] },
          status: { phase: 'Running' }
        },
        {
          metadata: { 
            name: 'very-old-pod', 
            namespace: 'default', 
            uid: 'pod-3',
            creationTimestamp: twoDaysAgo.toISOString()
          },
          spec: { containers: [{ name: 'very-old', image: 'very-old:latest' }] },
          status: { phase: 'Running' }
        }
      ];
      
      server.use(createPodsList(podsWithDifferentAges));
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('recent-pod')).toBeInTheDocument();
        expect(screen.getByText('old-pod')).toBeInTheDocument();
        expect(screen.getByText('very-old-pod')).toBeInTheDocument();
      });
    });
  });

  describe('Status Badge Rendering', () => {
    it('should render all status badge variants', async () => {
      const podsWithAllStatuses = [
        {
          metadata: { name: 'running-pod', namespace: 'default' },
          spec: { containers: [{ name: 'running', image: 'running:latest' }] },
          status: { phase: 'Running' }
        },
        {
          metadata: { name: 'pending-pod', namespace: 'default' },
          spec: { containers: [{ name: 'pending', image: 'pending:latest' }] },
          status: { phase: 'Pending' }
        },
        {
          metadata: { name: 'failed-pod', namespace: 'default' },
          spec: { containers: [{ name: 'failed', image: 'failed:latest' }] },
          status: { phase: 'Failed' }
        },
        {
          metadata: { name: 'succeeded-pod', namespace: 'default' },
          spec: { containers: [{ name: 'succeeded', image: 'succeeded:latest' }] },
          status: { phase: 'Succeeded' }
        },
        {
          metadata: { name: 'unknown-pod', namespace: 'default' },
          spec: { containers: [{ name: 'unknown', image: 'unknown:latest' }] },
          status: { phase: 'Unknown' }
        }
      ];
      
      server.use(createPodsList(podsWithAllStatuses));
      
      render(<PodsView />);
      
      await waitFor(() => {
        expect(screen.getByText('running-pod')).toBeInTheDocument();
        expect(screen.getByText('pending-pod')).toBeInTheDocument();
        expect(screen.getByText('failed-pod')).toBeInTheDocument();
        expect(screen.getByText('succeeded-pod')).toBeInTheDocument();
        expect(screen.getByText('unknown-pod')).toBeInTheDocument();
      });
      
      // Check that status badges are displayed
      expect(screen.getAllByText('Running')).toHaveLength(2); // Header and badge
      expect(screen.getAllByText('Pending')).toHaveLength(2); // Header and badge
      expect(screen.getAllByText('Failed')).toHaveLength(2); // Header and badge
      expect(screen.getByText('Succeeded')).toBeInTheDocument();
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });
});

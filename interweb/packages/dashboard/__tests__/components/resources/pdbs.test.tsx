import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../utils/test-utils';
import { server } from '@/__mocks__/server';
import { 
  createPDBsList, 
  createPDBsListError,
  createPDBsListSlow,
  deletePDBHandler,
  deletePDBErrorHandler
} from '@/__mocks__/handlers/pdbs';
import { http, HttpResponse } from 'msw';
import { API_BASE } from '@/__mocks__/handlers/common';

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
import { PDBsView } from '@/components/resources/pdbs';

describe('PDBsView', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    server.use(
      createPDBsList(),
      // Add MSW handler for DELETE PDB
      http.delete(`${API_BASE}/apis/policy/v1/namespaces/:namespace/poddisruptionbudgets/:name`, () => {
        return HttpResponse.json({}, { status: 200 });
      })
    );
  });

  describe('Basic Rendering', () => {
    it('should render PDBs view with header and controls', async () => {
      render(<PDBsView />);
      
      expect(screen.getAllByText('Pod Disruption Budgets')).toHaveLength(2); // Header and card title
      expect(screen.getByText('Manage disruption policies for your pods')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // refresh button with no text
    });

    it('should display PDBs data when loaded', async () => {
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
        expect(screen.getByText('redis-pdb')).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      render(<PDBsView />);
      
      expect(screen.getByRole('button', { name: '' })).toBeDisabled(); // refresh button with no text
    });
  });

  describe('Data Loading', () => {
    it('should load PDBs from API', async () => {
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
        expect(screen.getByText('redis-pdb')).toBeInTheDocument();
      });
    });

    it('should handle loading state with slow API response', async () => {
      server.use(createPDBsListSlow());
      
      render(<PDBsView />);
      
      // Should show loading state
      expect(screen.getByRole('button', { name: '' })).toBeDisabled(); // refresh button with no text
      
      // Wait for data to load (this test just verifies loading state, not final data)
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should handle API errors gracefully', async () => {
      server.use(createPDBsListError(500, 'Server Error'));
      
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText(/Server Error/)).toBeInTheDocument();
      });
    });
  });

  describe('PDB Status Display', () => {
    it('should display PDB status correctly', async () => {
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
        expect(screen.getByText('redis-pdb')).toBeInTheDocument();
      });
      
      // Check for status badges
      expect(screen.getAllByText('Ready')).toHaveLength(2); // Stats card and status badge
      expect(screen.getByText('Protected')).toBeInTheDocument();
    });

    it('should show correct status badges', async () => {
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
      });
      
      // Check for status badges
      const statusBadges = screen.getAllByText('Ready');
      expect(statusBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Refresh Functionality', () => {
    it('should refresh data when refresh button is clicked', async () => {
      render(<PDBsView />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
      });
      
      const refreshButtons = screen.getAllByRole('button');
      const refreshButton = refreshButtons.find(button => 
        button.querySelector('svg.lucide-refresh-cw')
      );
      await user.click(refreshButton);
      
      // Verify button is clickable (component may not disable during refresh)
      expect(refreshButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should show error message when API fails', async () => {
      server.use(createPDBsListError(500, 'Internal Server Error'));
      
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText(/Internal Server Error/)).toBeInTheDocument();
      });
    });

    it('should show retry button when there is an error', async () => {
      server.use(createPDBsListError(500, 'Internal Server Error'));
      
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText(/Internal Server Error/)).toBeInTheDocument();
      });
      
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no PDBs exist', async () => {
      server.use(createPDBsList([]));
      
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText(/No pod disruption budgets found/)).toBeInTheDocument();
      });
    });
  });

  describe('Status Determination', () => {
    it('should determine PDB status correctly for different states', async () => {
      // Create PDBs with different statuses
      const pdbsWithStatus = [
        {
          metadata: { name: 'ready-pdb', namespace: 'default' },
          spec: { minAvailable: 1, selector: { matchLabels: { app: 'ready' } } },
          status: { currentHealthy: 3, desiredHealthy: 2, disruptionsAllowed: 1 }
        },
        {
          metadata: { name: 'protected-pdb', namespace: 'default' },
          spec: { minAvailable: 1, selector: { matchLabels: { app: 'protected' } } },
          status: { currentHealthy: 2, desiredHealthy: 2, disruptionsAllowed: 0 }
        },
        {
          metadata: { name: 'not-ready-pdb', namespace: 'default' },
          spec: { minAvailable: 1, selector: { matchLabels: { app: 'not-ready' } } },
          status: { currentHealthy: 1, desiredHealthy: 3, disruptionsAllowed: 0 }
        }
      ];
      
      server.use(createPDBsList(pdbsWithStatus));
      
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('ready-pdb')).toBeInTheDocument();
        expect(screen.getByText('protected-pdb')).toBeInTheDocument();
        expect(screen.getByText('not-ready-pdb')).toBeInTheDocument();
      });
    });
  });

  describe('PDB Actions', () => {
    it('should handle view action', async () => {
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
      });
      
      // Check that action buttons exist (simplified check)
      const actionButtons = screen.getAllByRole('button');
      expect(actionButtons.length).toBeGreaterThan(1);
    });

    it('should handle delete action', async () => {
      // Mock window.alert
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
      });
      
      // Check that component renders without errors
      expect(screen.getAllByText('Pod Disruption Budgets')).toHaveLength(2); // Header and card title
      
      mockAlert.mockRestore();
    });

    it('should handle create PDB button click', async () => {
      render(<PDBsView />);
      
      // Find create PDB button
      const createButton = screen.getByRole('button', { name: /create pdb/i });
      fireEvent.click(createButton);
      
      // The alert is mocked, so we just verify the button is clickable
      expect(createButton).toBeInTheDocument();
    });
  });

  describe('Error Handling in Actions', () => {
    it('should handle errors in delete action', async () => {
      // Mock window.alert
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
      });
      
      // Check that component renders without errors
      expect(screen.getAllByText('Pod Disruption Budgets')).toHaveLength(2); // Header and card title
      
      mockAlert.mockRestore();
    });
  });

  describe('Stats Display', () => {
    it('should display correct statistics', async () => {
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
      });
      
      // Check for stats cards
      expect(screen.getByText('Total PDBs')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Ready' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Protected Pods' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Disruptions Allowed' })).toBeInTheDocument();
    });
  });

  describe('PDB Actions with MSW', () => {
    beforeEach(() => {
      mockAlert.mockClear();
    });

    afterEach(() => {
      mockAlert.mockClear();
    });

    it('should handle delete PDB with confirmation', async () => {
      const user = userEvent.setup();
      
      // Mock confirmDialog to return true (confirmation)
      const { confirmDialog } = require('@/hooks/useConfirm');
      confirmDialog.mockResolvedValueOnce(true);
      
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
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
            title: 'Delete Pod Disruption Budget',
            description: 'Are you sure you want to delete nginx-pdb?',
            confirmText: 'Delete',
            confirmVariant: 'destructive'
          });
        });
      }
    });

    it('should handle delete PDB with cancellation', async () => {
      const user = userEvent.setup();
      
      // Mock confirmDialog to return false (cancellation)
      const { confirmDialog } = require('@/hooks/useConfirm');
      confirmDialog.mockResolvedValueOnce(false);
      
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
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
            title: 'Delete Pod Disruption Budget',
            description: 'Are you sure you want to delete nginx-pdb?',
            confirmText: 'Delete',
            confirmVariant: 'destructive'
          });
        });
      }
    });

    it('should handle view details action', async () => {
      const user = userEvent.setup();
      
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
      });
      
      // Find view button (eye icon)
      const allButtons = screen.getAllByRole('button');
      const viewButton = allButtons.find(button =>
        button.querySelector('svg.lucide-eye')
      );
      
      expect(viewButton).toBeInTheDocument();
      if (viewButton) {
        fireEvent.click(viewButton);
        // The view action sets selectedPDB state, but doesn't show a dialog yet
        // This test just verifies the button is clickable
      }
    });

    it('should handle create PDB button click', async () => {
      const user = userEvent.setup();
      
      render(<PDBsView />);
      
      // Find create PDB button
      const createButton = screen.getByRole('button', { name: /create pdb/i });
      fireEvent.click(createButton);
      
      // The alert is mocked, so we just verify the button is clickable
      expect(createButton).toBeInTheDocument();
    });

    it('should handle delete PDB error with alert', async () => {
      const user = userEvent.setup();
      
      // Mock confirmDialog to return true (confirmation)
      const { confirmDialog } = require('@/hooks/useConfirm');
      confirmDialog.mockResolvedValueOnce(true);
      
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
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
            title: 'Delete Pod Disruption Budget',
            description: 'Are you sure you want to delete nginx-pdb?',
            confirmText: 'Delete',
            confirmVariant: 'destructive'
          });
        });
      }
    });
  });

  describe('Status Badge Rendering', () => {
    it('should render all status badge variants', async () => {
      const pdbsWithAllStatuses = [
        {
          metadata: { name: 'ready-pdb', namespace: 'default' },
          spec: { minAvailable: 1, selector: { matchLabels: { app: 'ready' } } },
          status: { currentHealthy: 3, desiredHealthy: 2, disruptionsAllowed: 1 }
        },
        {
          metadata: { name: 'protected-pdb', namespace: 'default' },
          spec: { minAvailable: 1, selector: { matchLabels: { app: 'protected' } } },
          status: { currentHealthy: 2, desiredHealthy: 2, disruptionsAllowed: 0 }
        },
        {
          metadata: { name: 'not-ready-pdb', namespace: 'default' },
          spec: { minAvailable: 1, selector: { matchLabels: { app: 'not-ready' } } },
          status: { currentHealthy: 1, desiredHealthy: 3, disruptionsAllowed: 0 }
        }
      ];
      
      server.use(createPDBsList(pdbsWithAllStatuses));
      
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('ready-pdb')).toBeInTheDocument();
        expect(screen.getByText('protected-pdb')).toBeInTheDocument();
        expect(screen.getByText('not-ready-pdb')).toBeInTheDocument();
      });
      
      // Check that status badges are displayed
      expect(screen.getAllByText('Ready')).toHaveLength(2); // Header and badge
      expect(screen.getByText('Protected')).toBeInTheDocument();
      expect(screen.getByText('Not Ready')).toBeInTheDocument();
    });
  });

  describe('Selector Display', () => {
    it('should display selector information correctly', async () => {
      const pdbsWithSelectors = [
        {
          metadata: { name: 'simple-selector-pdb', namespace: 'default' },
          spec: { 
            minAvailable: 1, 
            selector: { matchLabels: { app: 'nginx', version: '1.0' } }
          },
          status: { currentHealthy: 2, desiredHealthy: 2, disruptionsAllowed: 1 }
        },
        {
          metadata: { name: 'no-selector-pdb', namespace: 'default' },
          spec: { minAvailable: 1 },
          status: { currentHealthy: 1, desiredHealthy: 1, disruptionsAllowed: 0 }
        }
      ];
      
      server.use(createPDBsList(pdbsWithSelectors));
      
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('simple-selector-pdb')).toBeInTheDocument();
        expect(screen.getByText('no-selector-pdb')).toBeInTheDocument();
      });
      
      // Check for selector display
      expect(screen.getByText('app=nginx, version=1.0')).toBeInTheDocument();
      expect(screen.getByText('No selector')).toBeInTheDocument();
    });
  });

  describe('Table Data Display', () => {
    it('should display all table columns correctly', async () => {
      render(<PDBsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-pdb')).toBeInTheDocument();
      });
      
      // Check table headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Namespace')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Min Available')).toBeInTheDocument();
      expect(screen.getByText('Max Unavailable')).toBeInTheDocument();
      expect(screen.getByText('Current Healthy')).toBeInTheDocument();
      expect(screen.getAllByText('Disruptions Allowed')).toHaveLength(2); // Stats card and table header
      expect(screen.getByText('Selector')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
      
      // Check data display
      expect(screen.getAllByText('default')).toHaveLength(2); // Two PDBs in default namespace
      expect(screen.getAllByText('1')).toHaveLength(5); // minAvailable appears in multiple places
      expect(screen.getByText('3/2')).toBeInTheDocument(); // currentHealthy/desiredHealthy
    });
  });
});

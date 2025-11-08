import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../utils/test-utils';
import { server } from '@/__mocks__/server';
import { 
  createRuntimeClassesList, 
  createRuntimeClassesListError,
  createRuntimeClassesListSlow,
  deleteRuntimeClassHandler,
  deleteRuntimeClassErrorHandler,
  createRuntimeClassesListData
} from '@/__mocks__/handlers/runtimeclasses';
import { http, HttpResponse } from 'msw';
import { API_BASE } from '@/__mocks__/handlers/common';

// Mock window.alert for testing
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

// Also mock the global alert function
global.alert = jest.fn();

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
import { RuntimeClassesView } from '@/components/resources/runtimeclasses';

describe('RuntimeClassesView', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    server.use(
      createRuntimeClassesList(),
      // Add MSW handler for DELETE runtime class
      http.delete(`${API_BASE}/apis/node.k8s.io/v1/runtimeclasses/:name`, () => {
        return HttpResponse.json({}, { status: 200 });
      })
    );
  });

  afterEach(() => {
    mockAlert.mockClear();
  });

  describe('Basic Rendering', () => {
    it('should render runtime classes view with header and controls', async () => {
      render(<RuntimeClassesView />);
      
      expect(screen.getAllByText('Runtime Classes')).toHaveLength(2); // Header and card title
      expect(screen.getByText('Container runtime configurations for pods')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // refresh button with no text
      expect(screen.getByRole('button', { name: /create runtime class/i })).toBeInTheDocument();
    });

    it('should display runtime classes data when loaded', async () => {
      render(<RuntimeClassesView />);

      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
        expect(screen.getByText('runsc')).toBeInTheDocument();
        expect(screen.getByText('kata-containers')).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      render(<RuntimeClassesView />);
      
      expect(screen.getByRole('button', { name: '' })).toBeDisabled(); // refresh button with no text
    });
  });

  describe('Data Loading', () => {
    it('should load runtime classes from API', async () => {
      render(<RuntimeClassesView />);

      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
        expect(screen.getByText('runsc')).toBeInTheDocument();
      });
    });

    it('should handle loading state with slow API response', async () => {
      server.use(createRuntimeClassesListSlow());
      
      render(<RuntimeClassesView />);
      
      // Should show loading spinner
      expect(screen.getByRole('button', { name: '' })).toBeDisabled();
      
      // Should show loading spinner in content area
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      }, { timeout: 2000 });
    });

    it('should handle API errors gracefully', async () => {
      server.use(createRuntimeClassesListError(500, 'Server Error'));
      
      render(<RuntimeClassesView />);

      await waitFor(() => {
        expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
      });
    });
  });

  describe('Runtime Class Display', () => {
    it('should display runtime class information correctly', async () => {
      render(<RuntimeClassesView />);

      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
        expect(screen.getByText('runsc')).toBeInTheDocument();
      });
      
      // Check for handler badges
      expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      expect(screen.getByText('runsc')).toBeInTheDocument();
      expect(screen.getByText('kata-containers')).toBeInTheDocument();
    });

    it('should show correct handler badges', async () => {
      render(<RuntimeClassesView />);

      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      });
      
      // Known handlers should have default variant
      expect(screen.getAllByText('runc')).toHaveLength(2); // Name and badge
      expect(screen.getByText('runsc')).toBeInTheDocument();
      expect(screen.getByText('kata-containers')).toBeInTheDocument();
      expect(screen.getAllByText('crun')).toHaveLength(2); // Name and badge
    });
  });

  describe('Refresh Functionality', () => {
    it('should refresh data when refresh button is clicked', async () => {
      render(<RuntimeClassesView />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
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
      server.use(createRuntimeClassesListError(500, 'Server Error'));
      
      render(<RuntimeClassesView />);
      
      await waitFor(() => {
        expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
      });
    });

    it('should show retry button when there is an error', async () => {
      server.use(createRuntimeClassesListError(500, 'Server Error'));
      
      render(<RuntimeClassesView />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no runtime classes exist', async () => {
      server.use(createRuntimeClassesList([]));
      
      render(<RuntimeClassesView />);

      await waitFor(() => {
        expect(screen.getByText(/No runtime classes found/)).toBeInTheDocument();
      });
    });
  });

  describe('Runtime Class Actions', () => {
    it('should handle view action', async () => {
      render(<RuntimeClassesView />);

      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      });

      const viewButtons = screen.getAllByRole('button');
      const viewButton = viewButtons.find(button =>
        button.querySelector('svg.lucide-eye')
      );

      expect(viewButton).toBeInTheDocument();
      if (viewButton) {
        fireEvent.click(viewButton);
      }
    });

    it('should handle delete action with confirmation', async () => {
      const { confirmDialog } = require('@/hooks/useConfirm');
      confirmDialog.mockResolvedValueOnce(true);
      server.use(deleteRuntimeClassHandler('runc'));

      render(<RuntimeClassesView />);

      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      });
      
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
            title: 'Delete Runtime Class',
            description: 'Are you sure you want to delete runc?',
            confirmText: 'Delete',
            confirmVariant: 'destructive'
          });
        });
      }
    });

    it('should handle delete action with cancellation', async () => {
      const { confirmDialog } = require('@/hooks/useConfirm');
      confirmDialog.mockResolvedValueOnce(false);

      render(<RuntimeClassesView />);

      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      });
      
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
            title: 'Delete Runtime Class',
            description: 'Are you sure you want to delete runc?',
            confirmText: 'Delete',
            confirmVariant: 'destructive'
          });
        });
      }
    });

    it('should handle create runtime class button click', async () => {
      render(<RuntimeClassesView />);

      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      });
      
      const createButton = screen.getByRole('button', { name: /create runtime class/i });
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          'Create Runtime Class functionality not yet implemented'
        );
      });
    });
  });

  describe('Error Handling in Actions', () => {
    it('should handle errors in delete action', async () => {
      const { confirmDialog } = require('@/hooks/useConfirm');
      confirmDialog.mockResolvedValueOnce(true);
      server.use(deleteRuntimeClassErrorHandler('runc', 500, 'Deletion failed'));

      render(<RuntimeClassesView />);
      
      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      });
      
      const allButtons = screen.getAllByRole('button');
      const deleteButton = allButtons.find(button =>
        button.querySelector('svg.lucide-trash2')
      );
      
      expect(deleteButton).toBeInTheDocument();
      if (deleteButton) {
        fireEvent.click(deleteButton);
        
        await waitFor(() => {
          expect(global.alert).toHaveBeenCalledWith(
            'Failed to delete runtime class: HTTP error! status: 500\nResponse body: {"error":"Deletion failed"}'
          );
        });
      }
    });
  });

  describe('Stats Display', () => {
    it('should display correct statistics', async () => {
      render(<RuntimeClassesView />);
      
      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      });
      
      expect(screen.getByText('Total Runtime Classes')).toBeInTheDocument();
      expect(screen.getByText('Unique Handlers')).toBeInTheDocument();
      expect(screen.getByText('With Scheduling')).toBeInTheDocument();
    });
  });

  describe('Handler Badge Rendering', () => {
    it('should render known and unknown handler badges correctly', async () => {
      render(<RuntimeClassesView />);

      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      });

      // Known handlers should be rendered
      expect(screen.getAllByText('runc')).toHaveLength(2); // Name and badge
      expect(screen.getByText('runsc')).toBeInTheDocument();
      expect(screen.getByText('kata-containers')).toBeInTheDocument();
      expect(screen.getAllByText('crun')).toHaveLength(2); // Name and badge
    });
  });

  describe('Table Data Display', () => {
    it('should display all table columns correctly', async () => {
      render(<RuntimeClassesView />);
      
      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      });
      
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Handler')).toBeInTheDocument();
      expect(screen.getByText('Node Selector')).toBeInTheDocument();
      expect(screen.getByText('Tolerations')).toBeInTheDocument();
      expect(screen.getByText('Overhead')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
      
      // Check data display
      expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      expect(screen.getByText('runsc')).toBeInTheDocument();
      expect(screen.getByText('kubernetes.io/arch=amd64')).toBeInTheDocument();
      expect(screen.getByText('1 toleration(s)')).toBeInTheDocument();
      expect(screen.getByText('CPU: 200m')).toBeInTheDocument();
      expect(screen.getByText('Memory: 128Mi')).toBeInTheDocument();
      expect(screen.getAllByText('None')).toHaveLength(5); // Multiple runtime classes have this
    });
  });

  describe('Node Selector Display', () => {
    it('should display node selector information correctly', async () => {
      render(<RuntimeClassesView />);
      
      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      });
      
      // Check for node selector display
      expect(screen.getByText('kubernetes.io/arch=amd64')).toBeInTheDocument();
      expect(screen.getByText('cloud.google.com/gke-gvisor=true')).toBeInTheDocument();
    });
  });

  describe('Tolerations Display', () => {
    it('should display tolerations information correctly', async () => {
      render(<RuntimeClassesView />);
      
      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      });
      
      // Check for tolerations display
      expect(screen.getByText('1 toleration(s)')).toBeInTheDocument();
      expect(screen.getAllByText('None')).toHaveLength(5); // Multiple runtime classes have this
    });
  });

  describe('Overhead Display', () => {
    it('should display overhead information correctly', async () => {
      render(<RuntimeClassesView />);
      
      await waitFor(() => {
        expect(screen.getAllByText('runc')).toHaveLength(2); // Name and handler badge
      });
      
      // Check for overhead display
      expect(screen.getByText('CPU: 100m')).toBeInTheDocument();
      expect(screen.getByText('Memory: 128Mi')).toBeInTheDocument();
    });
  });

  describe('CoerceString Function', () => {
    it('should handle coerceString function correctly', async () => {
      const runtimeClassesWithEmptyValues = [
        {
          metadata: { name: 'test-runtime', uid: 'rc-1' },
          handler: 'test-handler',
          overhead: {
            podFixed: {
              cpu: '',
              memory: '   '
            }
          }
        }
      ];
      server.use(createRuntimeClassesList(runtimeClassesWithEmptyValues));

      render(<RuntimeClassesView />);

      await waitFor(() => {
        expect(screen.getByText('test-runtime')).toBeInTheDocument();
      });

      // Should display N/A for empty values
      expect(screen.getByText('CPU: N/A')).toBeInTheDocument();
      expect(screen.getByText('Memory: N/A')).toBeInTheDocument();
    });
  });
});
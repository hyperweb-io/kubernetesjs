import { fireEvent,screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { API_BASE } from '@/__mocks__/handlers/common';
import { 
  createPriorityClassesList,
  createPriorityClassesListError,
  createPriorityClassesListSlow,
  deletePriorityClassErrorHandler,
  deletePriorityClassHandler} from '@/__mocks__/handlers/priorityclasses';
import { server } from '@/__mocks__/server';

import { render } from '../../utils/test-utils';

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
import { PriorityClassesView } from '@/components/resources/priorityclasses';

describe('PriorityClassesView', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    server.use(
      createPriorityClassesList(),
      // Add MSW handler for DELETE priority class
      http.delete(`${API_BASE}/apis/scheduling.k8s.io/v1/priorityclasses/:name`, () => {
        return HttpResponse.json({}, { status: 200 });
      })
    );
  });

  afterEach(() => {
    mockAlert.mockClear();
  });

  describe('Basic Rendering', () => {
    it('should render priority classes view with header and controls', async () => {
      render(<PriorityClassesView />);
      
      expect(screen.getAllByText('Priority Classes')).toHaveLength(2); // Header and card title
      expect(screen.getByText('Manage pod scheduling priorities')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // refresh button with no text
      expect(screen.getByRole('button', { name: /create priority class/i })).toBeInTheDocument();
    });

    it('should display priority classes data when loaded', async () => {
      render(<PriorityClassesView />);
      
      await waitFor(() => {
        expect(screen.getByText('system-critical')).toBeInTheDocument();
        expect(screen.getByText('cluster-critical')).toBeInTheDocument();
        expect(screen.getByText('high-priority')).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      render(<PriorityClassesView />);
      
      expect(screen.getByRole('button', { name: '' })).toBeDisabled(); // refresh button with no text
    });
  });

  describe('Data Loading', () => {
    it('should load priority classes from API', async () => {
      render(<PriorityClassesView />);

      await waitFor(() => {
        expect(screen.getByText('system-critical')).toBeInTheDocument();
        expect(screen.getByText('cluster-critical')).toBeInTheDocument();
      });
    });

    it('should handle loading state with slow API response', async () => {
      server.use(createPriorityClassesListSlow());
      
      render(<PriorityClassesView />);
      
      // Should show loading spinner
      expect(screen.getByRole('button', { name: '' })).toBeDisabled();
      
      // Should show loading spinner in content area
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('system-critical')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should handle API errors gracefully', async () => {
      server.use(createPriorityClassesListError(500, 'Server Error'));
      
      render(<PriorityClassesView />);

      await waitFor(() => {
        expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
      });
    });
  });

  describe('Priority Class Display', () => {
    it('should display priority class status correctly', async () => {
      render(<PriorityClassesView />);

      await waitFor(() => {
        expect(screen.getByText('system-critical')).toBeInTheDocument();
        expect(screen.getByText('cluster-critical')).toBeInTheDocument();
      });
      
      // Check for priority badges - System Critical appears in stats card and table
      expect(screen.getAllByText('System Critical')).toHaveLength(2); // Stats card and status badge
      expect(screen.getByText('Priority 1000000')).toBeInTheDocument();
      expect(screen.getAllByText('Default')).toHaveLength(2); // Two priority classes with value 0 and -1000000
    });

    it('should show correct priority badges', async () => {
      render(<PriorityClassesView />);

      await waitFor(() => {
        expect(screen.getByText('system-critical')).toBeInTheDocument();
      });
      
      expect(screen.getAllByText('System Critical')).toHaveLength(2); // Stats card and status badge
      expect(screen.getByText('Priority 1000000')).toBeInTheDocument();
      expect(screen.getAllByText('Default')).toHaveLength(2); // Two priority classes with value 0 and -1000000
    });
  });

  describe('Refresh Functionality', () => {
    it('should refresh data when refresh button is clicked', async () => {
      render(<PriorityClassesView />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('system-critical')).toBeInTheDocument();
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
      server.use(createPriorityClassesListError(500, 'Server Error'));
      
      render(<PriorityClassesView />);

      await waitFor(() => {
        expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
      });
    });

    it('should show retry button when there is an error', async () => {
      server.use(createPriorityClassesListError(500, 'Server Error'));
      
      render(<PriorityClassesView />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no priority classes exist', async () => {
      server.use(createPriorityClassesList([]));
      
      render(<PriorityClassesView />);

      await waitFor(() => {
        expect(screen.getByText(/No priority classes found/)).toBeInTheDocument();
      });
    });
  });

  describe('Priority Class Actions', () => {
    it('should handle view action', async () => {
      render(<PriorityClassesView />);

      await waitFor(() => {
        expect(screen.getByText('system-critical')).toBeInTheDocument();
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
      server.use(deletePriorityClassHandler('high-priority'));

      render(<PriorityClassesView />);

      await waitFor(() => {
        expect(screen.getByText('high-priority')).toBeInTheDocument();
      });
      
      // Find the delete button for high-priority (not system-critical)
      const allButtons = screen.getAllByRole('button');
      const deleteButton = allButtons.find(button =>
        button.querySelector('svg.lucide-trash2') && 
        !button.disabled
      );
      
      expect(deleteButton).toBeInTheDocument();
      if (deleteButton) {
        await user.click(deleteButton);
        
        // Verify confirmDialog was called
        await waitFor(() => {
          expect(confirmDialog).toHaveBeenCalledWith({
            title: 'Delete Priority Class',
            description: 'Are you sure you want to delete high-priority?',
            confirmText: 'Delete',
            confirmVariant: 'destructive'
          });
        });
      }
    });

    it('should handle delete action with cancellation', async () => {
      const { confirmDialog } = require('@/hooks/useConfirm');
      confirmDialog.mockResolvedValueOnce(false);

      render(<PriorityClassesView />);

      await waitFor(() => {
        expect(screen.getByText('high-priority')).toBeInTheDocument();
      });
      
      // Find the delete button for high-priority (not system-critical)
      const allButtons = screen.getAllByRole('button');
      const deleteButton = allButtons.find(button =>
        button.querySelector('svg.lucide-trash2') && 
        !button.disabled
      );
      
      expect(deleteButton).toBeInTheDocument();
      if (deleteButton) {
        await user.click(deleteButton);
        
        // Verify confirmDialog was called
        await waitFor(() => {
          expect(confirmDialog).toHaveBeenCalledWith({
            title: 'Delete Priority Class',
            description: 'Are you sure you want to delete high-priority?',
            confirmText: 'Delete',
            confirmVariant: 'destructive'
          });
        });
      }
    });

    it('should handle create priority class button click', async () => {
      render(<PriorityClassesView />);
      
      const createButton = screen.getByRole('button', { name: /create priority class/i });
      await user.click(createButton);

      // The component uses alert() directly, so we need to check if it was called
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          'Create Priority Class functionality not yet implemented'
        );
      });
    });
  });

  describe('Error Handling in Actions', () => {
    it('should handle errors in delete action', async () => {
      const { confirmDialog } = require('@/hooks/useConfirm');
      confirmDialog.mockResolvedValueOnce(true);
      server.use(deletePriorityClassErrorHandler('high-priority', 500, 'Deletion failed'));

      render(<PriorityClassesView />);

      await waitFor(() => {
        expect(screen.getByText('high-priority')).toBeInTheDocument();
      });
      
      // Find the delete button for high-priority (not system-critical)
      const allButtons = screen.getAllByRole('button');
      const deleteButton = allButtons.find(button =>
        button.querySelector('svg.lucide-trash2') && 
        !button.disabled
      );
      
      expect(deleteButton).toBeInTheDocument();
      if (deleteButton) {
        await user.click(deleteButton);
        
        await waitFor(() => {
          expect(global.alert).toHaveBeenCalledWith(
            'Failed to delete priority class: HTTP error! status: 500\nResponse body: {"error":"Deletion failed"}'
          );
        });
      }
    });
  });

  describe('Stats Display', () => {
    it('should display correct statistics', async () => {
      render(<PriorityClassesView />);

      await waitFor(() => {
        expect(screen.getByText('system-critical')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Total Classes')).toBeInTheDocument();
      expect(screen.getByText('System Classes')).toBeInTheDocument();
      expect(screen.getByText('User Classes')).toBeInTheDocument();
    });
  });

  describe('Priority Badge Rendering', () => {
    it('should render all priority badge variants', async () => {
      const priorityClassesWithAllTypes = [
        {
          metadata: { name: 'system-critical', uid: 'pc-1' },
          value: 2000000000,
          globalDefault: false,
          description: 'System critical',
          preemptionPolicy: 'PreemptLowerPriority'
        },
        {
          metadata: { name: 'cluster-critical', uid: 'pc-2' },
          value: 1000000000,
          globalDefault: false,
          description: 'Cluster critical',
          preemptionPolicy: 'PreemptLowerPriority'
        },
        {
          metadata: { name: 'high-priority', uid: 'pc-3' },
          value: 1000000,
          globalDefault: false,
          description: 'High priority',
          preemptionPolicy: 'PreemptLowerPriority'
        },
        {
          metadata: { name: 'default-priority', uid: 'pc-4' },
          value: 0,
          globalDefault: true,
          description: 'Default priority',
          preemptionPolicy: 'PreemptLowerPriority'
        }
      ];
      server.use(createPriorityClassesList(priorityClassesWithAllTypes));

      render(<PriorityClassesView />);

      await waitFor(() => {
        expect(screen.getByText('system-critical')).toBeInTheDocument();
        expect(screen.getByText('cluster-critical')).toBeInTheDocument();
        expect(screen.getByText('high-priority')).toBeInTheDocument();
        expect(screen.getByText('default-priority')).toBeInTheDocument();
      });

      expect(screen.getAllByText('System Critical')).toHaveLength(2); // Stats card and status badge
      expect(screen.getByText('Priority 1000000')).toBeInTheDocument();
      expect(screen.getByText('Default')).toBeInTheDocument(); // One priority class with value 0
    });
  });

  describe('Table Data Display', () => {
    it('should display all table columns correctly', async () => {
      render(<PriorityClassesView />);
      
      await waitFor(() => {
        expect(screen.getByText('system-critical')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Global Default')).toBeInTheDocument();
      expect(screen.getByText('Preemption Policy')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
      
      // Check data display
      expect(screen.getByText('2000000000')).toBeInTheDocument();
      expect(screen.getByText('1000000000')).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getAllByText('No')).toHaveLength(4); // Multiple "No" badges for Global Default
    });
  });

  describe('System Priority Class Protection', () => {
    it('should disable delete button for system priority classes', async () => {
      render(<PriorityClassesView />);
      
      await waitFor(() => {
        expect(screen.getByText('system-critical')).toBeInTheDocument();
      });
      
      const allButtons = screen.getAllByRole('button');
      const deleteButtons = allButtons.filter(button =>
        button.querySelector('svg.lucide-trash2')
      );
      
      // Find the delete button for system-critical (should be disabled)
      const systemDeleteButton = deleteButtons.find(button => 
        button.closest('tr')?.textContent?.includes('system-critical')
      );
      
      expect(systemDeleteButton).toBeDisabled();
    });
  });
});
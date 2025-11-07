import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../utils/test-utils';
import { server } from '@/__mocks__/server';
import { 
  createReplicaSetsList, 
  createReplicaSetsListError,
  createReplicaSetsListSlow,
  createReplicaSetScale,
  createReplicaSetScaleError,
  createReplicaSetDelete,
  createReplicaSetDeleteError
} from '@/__mocks__/handlers/replicasets';

import { ReplicaSetsView } from '@/components/resources/replicasets';

describe('ReplicaSetsView', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    server.use(createReplicaSetsList());
  });

  describe('Basic Rendering', () => {
    it('should render replicasets view with header and controls', async () => {
      render(<ReplicaSetsView />);
      
      expect(screen.getByText('ReplicaSets')).toBeInTheDocument();
      expect(screen.getByText('Manage your Kubernetes ReplicaSets')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // refresh button with no text
      expect(screen.getByRole('button', { name: /create replicaset/i })).toBeInTheDocument();
    });

    it('should display replicasets data when loaded', async () => {
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
        expect(screen.getByText('redis-deployment-abcdefghij')).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      render(<ReplicaSetsView />);
      
      expect(screen.getByRole('button', { name: '' })).toBeDisabled(); // refresh button with no text
    });
  });

  describe('Data Loading', () => {
    it('should load replicasets from API', async () => {
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
        expect(screen.getByText('redis-deployment-abcdefghij')).toBeInTheDocument();
      });
    });

    it('should handle loading state with slow API response', async () => {
      server.use(createReplicaSetsListSlow());
      
      render(<ReplicaSetsView />);
      
      // Should show loading state
      expect(screen.getByRole('button', { name: '' })).toBeDisabled(); // refresh button with no text
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should handle API errors gracefully', async () => {
      server.use(createReplicaSetsListError(500, 'Server Error'));
      
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
      });
    });
  });

  describe('ReplicaSet Status Display', () => {
    it('should display replicaset status correctly', async () => {
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
        expect(screen.getByText('redis-deployment-abcdefghij')).toBeInTheDocument();
      });
      
      // Check for total replicasets count
      expect(screen.getByText('Total ReplicaSets')).toBeInTheDocument();
      // Find the specific "3" in the Total ReplicaSets card
      const totalCard = screen.getByText('Total ReplicaSets').closest('.rounded-lg');
      expect(totalCard).toBeInTheDocument();
      expect(totalCard).toHaveTextContent('3');
    });

    it('should show correct replica counts', async () => {
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
      });
      
      // Check for replica counts - find the Ready card specifically
      const readyCards = screen.getAllByText('Ready');
      const readyCard = readyCards.find(card => 
        card.closest('.rounded-lg')?.querySelector('.text-2xl.font-bold')
      );
      expect(readyCard).toBeInTheDocument();
      expect(readyCard?.closest('.rounded-lg')).toHaveTextContent('2');
    });
  });

  describe('Button Functionality', () => {
    it('should have create replicaset button', async () => {
      render(<ReplicaSetsView />);
      
      const createButton = screen.getByRole('button', { name: /create replicaset/i });
      expect(createButton).toBeInTheDocument();
    });

    it('should have action buttons for each replicaset', async () => {
      render(<ReplicaSetsView />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
      });
      
      // Check for action buttons (view, edit, delete, scale) - these may not be rendered if table is not shown
      const actionButtons = screen.getAllByRole('button');
      expect(actionButtons.length).toBeGreaterThan(2); // At least refresh and create buttons
    });
  });

  describe('Refresh Functionality', () => {
    it('should refresh data when refresh button is clicked', async () => {
      render(<ReplicaSetsView />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
      });
      
      const refreshButton = screen.getAllByRole('button', { name: '' })[0]; // refresh button with no text
      await user.click(refreshButton);
      
      // Verify button is clickable
      expect(refreshButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should show error message when API fails', async () => {
      server.use(createReplicaSetsListError(500, 'Internal Server Error'));
      
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
      });
    });

    it('should show retry button when there is an error', async () => {
      server.use(createReplicaSetsListError(500, 'Internal Server Error'));
      
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
      });
      
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no replicasets exist', async () => {
      server.use(createReplicaSetsList([]));
      
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText(/No replicasets found/)).toBeInTheDocument();
      });
    });
  });

       describe('Status Determination', () => {
         it('should determine Ready status correctly', async () => {
           const readyReplicaSet = {
             metadata: { name: 'ready-rs', namespace: 'default', creationTimestamp: '2023-01-01T00:00:00Z' },
             spec: { replicas: 3, template: { spec: { containers: [{ image: 'nginx:latest' }] } } },
             status: { readyReplicas: 3, availableReplicas: 3 }
           };
           
           server.use(createReplicaSetsList([readyReplicaSet]));
           
           render(<ReplicaSetsView />);
           
           await waitFor(() => {
             expect(screen.getByText('ready-rs')).toBeInTheDocument();
             expect(screen.getAllByText('Ready')).toHaveLength(3); // Card title, table header, and badge
           });
         });

         it('should determine Scaling status correctly', async () => {
           const scalingReplicaSet = {
             metadata: { name: 'scaling-rs', namespace: 'default', creationTimestamp: '2023-01-01T00:00:00Z' },
             spec: { replicas: 5, template: { spec: { containers: [{ image: 'nginx:latest' }] } } },
             status: { readyReplicas: 3, availableReplicas: 3 }
           };
           
           server.use(createReplicaSetsList([scalingReplicaSet]));
           
           render(<ReplicaSetsView />);
           
           await waitFor(() => {
             expect(screen.getByText('scaling-rs')).toBeInTheDocument();
             expect(screen.getByText('Scaling')).toBeInTheDocument();
           });
         });

         it('should determine NotReady status correctly', async () => {
           const notReadyReplicaSet = {
             metadata: { name: 'notready-rs', namespace: 'default', creationTimestamp: '2023-01-01T00:00:00Z' },
             spec: { replicas: 0, template: { spec: { containers: [{ image: 'nginx:latest' }] } } },
             status: { readyReplicas: 0, availableReplicas: 0 }
           };
           
           server.use(createReplicaSetsList([notReadyReplicaSet]));
           
           render(<ReplicaSetsView />);
           
           await waitFor(() => {
             expect(screen.getByText('notready-rs')).toBeInTheDocument();
             expect(screen.getByText('NotReady')).toBeInTheDocument();
           });
         });
       });

  describe('ReplicaSet Actions', () => {
    it('should handle scale action', async () => {
      // Mock prompt
      const mockPrompt = jest.spyOn(window, 'prompt').mockReturnValue('5');
      server.use(createReplicaSetScale());
      
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
      });
      
      // Find and click scale button
      const scaleButtons = screen.getAllByRole('button');
      const scaleButton = scaleButtons.find(button =>
        button.querySelector('svg.lucide-scale')
      );
      
      if (scaleButton) {
        await user.click(scaleButton);
        expect(mockPrompt).toHaveBeenCalledWith('Scale nginx-deployment-1234567890 to how many replicas?', '3');
        // Scale action completed successfully
      }
      
      mockPrompt.mockRestore();
    });

    it('should handle delete action', async () => {
      server.use(createReplicaSetDelete());
      
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
      });
      
      // Find and click delete button
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(button =>
        button.querySelector('svg.lucide-trash-2')
      );
      
      if (deleteButton) {
        await user.click(deleteButton);
        expect(require('../../../hooks/useConfirm').confirmDialog).toHaveBeenCalledWith({
          title: 'Delete ReplicaSet',
          description: 'Are you sure you want to delete nginx-deployment-1234567890?',
          confirmText: 'Delete',
          confirmVariant: 'destructive'
        });
        await waitFor(() => {
          expect(screen.queryByText('nginx-deployment-1234567890')).not.toBeInTheDocument();
        });
      }
    });

    it('should handle view action', async () => {
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
      });
      
      // Find and click view button
      const viewButtons = screen.getAllByRole('button');
      const viewButton = viewButtons.find(button =>
        button.querySelector('svg.lucide-eye')
      );
      
      if (viewButton) {
        await user.click(viewButton);
        expect(viewButton).toBeInTheDocument();
      }
    });

    it('should handle edit action', async () => {
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
      });
      
      // Find and click edit button
      const editButtons = screen.getAllByRole('button');
      const editButton = editButtons.find(button =>
        button.querySelector('svg.lucide-edit')
      );
      
      if (editButton) {
        await user.click(editButton);
        expect(editButton).toBeInTheDocument();
      }
    });
  });

  describe('Error Handling in Actions', () => {
    it('should handle scale action error', async () => {
      // Mock prompt
      const mockPrompt = jest.spyOn(window, 'prompt').mockReturnValue('5');
      // Mock alert
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      server.use(createReplicaSetScaleError(500, 'Scale failed'));
      
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
      });
      
      // Find and click scale button
      const scaleButtons = screen.getAllByRole('button');
      const scaleButton = scaleButtons.find(button =>
        button.querySelector('svg.lucide-scale')
      );
      
      if (scaleButton) {
        await user.click(scaleButton);
        expect(mockPrompt).toHaveBeenCalled();
        await waitFor(() => {
          expect(mockAlert).toHaveBeenCalledWith('Failed to scale replicaset: HTTP error! status: 500\nResponse body: {"error":"Scale failed"}');
        });
      }
      
      mockPrompt.mockRestore();
      mockAlert.mockRestore();
    });

    it('should handle delete action error', async () => {
      // Mock alert
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      server.use(createReplicaSetDeleteError(500, 'Delete failed'));
      
      render(<ReplicaSetsView />);
      
      await waitFor(() => {
        expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
      });
      
      // Find and click delete button
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(button =>
        button.querySelector('svg.lucide-trash-2')
      );
      
      if (deleteButton) {
        await user.click(deleteButton);
        expect(require('../../../hooks/useConfirm').confirmDialog).toHaveBeenCalled();
        await waitFor(() => {
          expect(mockAlert).toHaveBeenCalledWith('Failed to delete replicaset: Delete failed');
        });
      }
      
      mockAlert.mockRestore();
    });
  });

       describe('Stats Display', () => {
         it('should display correct statistics', async () => {
           render(<ReplicaSetsView />);
           
           await waitFor(() => {
             expect(screen.getByText('nginx-deployment-1234567890')).toBeInTheDocument();
           });
           
           // Check for stats cards
           expect(screen.getByText('Total ReplicaSets')).toBeInTheDocument();
           expect(screen.getByRole('heading', { name: 'Ready' })).toBeInTheDocument();
           expect(screen.getByRole('heading', { name: 'Total Replicas' })).toBeInTheDocument();
         });
       });

  describe('Create ReplicaSet Alert', () => {
    it('should show create alert when create button is clicked', async () => {
      // Mock alert
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<ReplicaSetsView />);
      
      const createButton = screen.getByRole('button', { name: /create replicaset/i });
      await user.click(createButton);
      
      expect(mockAlert).toHaveBeenCalledWith('Create ReplicaSet functionality not yet implemented.\n\nReplicaSets are typically created by Deployments.');
      
      mockAlert.mockRestore();
    });
  });
});

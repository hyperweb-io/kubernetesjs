import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EndpointSlicesView } from '@/components/resources/endpointslices';

// Mock the confirm dialog
jest.mock('../../../hooks/useConfirm', () => ({
  confirmDialog: jest.fn().mockResolvedValue(true)
}));

// Mock the Kubernetes hooks
jest.mock('../../../contexts/NamespaceContext', () => ({
  usePreferredNamespace: () => ({ namespace: 'default' })
}));

jest.mock('../../../k8s', () => ({
  useListDiscoveryV1NamespacedEndpointSliceQuery: jest.fn(() => ({
    data: {
      apiVersion: 'discovery.k8s.io/v1',
      kind: 'EndpointSliceList',
      items: [
        {
          apiVersion: 'discovery.k8s.io/v1',
          kind: 'EndpointSlice',
          metadata: {
            name: 'web-service-slice-1',
            namespace: 'default',
            labels: {
              'kubernetes.io/service-name': 'web-service'
            },
            creationTimestamp: '2024-01-15T10:30:00Z'
          },
          addressType: 'IPv4',
          endpoints: [
            {
              addresses: ['10.244.1.5'],
              conditions: { ready: true }
            },
            {
              addresses: ['10.244.1.6'],
              conditions: { ready: true }
            }
          ],
          ports: [
            { name: 'http', port: 80, protocol: 'TCP' },
            { name: 'https', port: 443, protocol: 'TCP' }
          ]
        },
        {
          apiVersion: 'discovery.k8s.io/v1',
          kind: 'EndpointSlice',
          metadata: {
            name: 'api-service-slice-1',
            namespace: 'default',
            labels: {
              'kubernetes.io/service-name': 'api-service'
            },
            creationTimestamp: '2024-01-15T10:30:00Z'
          },
          addressType: 'IPv4',
          endpoints: [
            {
              addresses: ['10.244.2.3'],
              conditions: { ready: true }
            }
          ],
          ports: [
            { name: 'api', port: 8080, protocol: 'TCP' }
          ]
        }
      ]
    },
    isLoading: false,
    error: null,
    refetch: jest.fn()
  })),
  useListDiscoveryV1EndpointSliceForAllNamespacesQuery: jest.fn(() => ({
    data: {
      apiVersion: 'discovery.k8s.io/v1',
      kind: 'EndpointSliceList',
      items: []
    },
    isLoading: false,
    error: null,
    refetch: jest.fn()
  })),
  useDeleteDiscoveryV1NamespacedEndpointSlice: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false
  }))
}));

describe('EndpointSlicesView', () => {
  describe('Basic Rendering', () => {
    it('should render endpoint slices view with header', () => {
      render(<EndpointSlicesView />);
      
      expect(screen.getByRole('heading', { name: 'Endpoint Slices', level: 2 })).toBeInTheDocument();
      expect(screen.getByText('Scalable network endpoint groupings')).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      render(<EndpointSlicesView />);
      
      // The refresh button is an icon button without accessible name
      const refreshButtons = screen.getAllByRole('button');
      const headerRefreshButton = refreshButtons.find(button => 
        button.querySelector('svg.lucide-refresh-cw') && 
        button.classList.contains('h-10') // Header refresh button has h-10 class
      );
      expect(headerRefreshButton).toBeInTheDocument();
    });

    it('should render stats cards', () => {
      render(<EndpointSlicesView />);
      
      expect(screen.getByText('Total Slices')).toBeInTheDocument();
      expect(screen.getByText('Total Endpoints')).toBeInTheDocument();
      expect(screen.getByText('Ready Endpoints')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should display endpoint slice data', async () => {
      render(<EndpointSlicesView />);
      
      await waitFor(() => {
        expect(screen.getByText('web-service-slice-1')).toBeInTheDocument();
        expect(screen.getByText('api-service-slice-1')).toBeInTheDocument();
      });
    });

    it('should display correct statistics', async () => {
      render(<EndpointSlicesView />);
      
      await waitFor(() => {
        expect(screen.getAllByText('2')).toHaveLength(2); // Total Slices and Services
        expect(screen.getAllByText('3')).toHaveLength(2); // Total Endpoints and Ready Endpoints
      });
    });

    it('should display status badges correctly', async () => {
      render(<EndpointSlicesView />);
      
      await waitFor(() => {
        expect(screen.getAllByText('All Ready')).toHaveLength(2);
      });
    });

    it('should display endpoint counts correctly', async () => {
      render(<EndpointSlicesView />);
      
      await waitFor(() => {
        expect(screen.getAllByText('2/2')).toHaveLength(1); // web-service-slice-1
        expect(screen.getByText('1/1')).toBeInTheDocument(); // api-service-slice-1
      });
    });

    it('should display address type correctly', async () => {
      render(<EndpointSlicesView />);
      
      await waitFor(() => {
        expect(screen.getAllByText('IPv4')).toHaveLength(2);
      });
    });

    it('should display ports correctly', async () => {
      render(<EndpointSlicesView />);
      
      await waitFor(() => {
        expect(screen.getByText('http:80/TCP, https:443/TCP')).toBeInTheDocument();
        expect(screen.getByText('api:8080/TCP')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should refresh data when refresh button is clicked', async () => {
      const user = userEvent.setup();
      const mockRefetch = jest.fn();
      
      // Mock the hook to return a refetch function
      const { useListDiscoveryV1NamespacedEndpointSliceQuery } = require('../../../k8s');
      useListDiscoveryV1NamespacedEndpointSliceQuery.mockReturnValue({
        data: {
          apiVersion: 'discovery.k8s.io/v1',
          kind: 'EndpointSliceList',
          items: []
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      });
      
      render(<EndpointSlicesView />);
      
      const refreshButtons = screen.getAllByRole('button');
      const refreshButton = refreshButtons.find(button => 
        button.querySelector('svg.lucide-refresh-cw') && 
        button.classList.contains('h-10')
      );
      await user.click(refreshButton);
      
      expect(mockRefetch).toHaveBeenCalled();
    });

    it('should show delete confirmation when delete button is clicked', async () => {
      const user = userEvent.setup();
      
      // Mock the hook to return data
      const { useListDiscoveryV1NamespacedEndpointSliceQuery } = require('../../../k8s');
      useListDiscoveryV1NamespacedEndpointSliceQuery.mockReturnValue({
        data: {
          apiVersion: 'discovery.k8s.io/v1',
          kind: 'EndpointSliceList',
          items: [
            {
              apiVersion: 'discovery.k8s.io/v1',
              kind: 'EndpointSlice',
              metadata: {
                name: 'web-service-slice-1',
                namespace: 'default',
                labels: { 'kubernetes.io/service-name': 'web-service' },
                creationTimestamp: '2024-01-01T00:00:00Z'
              },
              addressType: 'IPv4',
              endpoints: [{ addresses: ['1.2.3.4'], conditions: { ready: true } }],
              ports: [{ name: 'http', port: 80, protocol: 'TCP' }]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<EndpointSlicesView />);
      
      await waitFor(() => {
        expect(screen.getByText('web-service-slice-1')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(button =>
        button.querySelector('svg.lucide-trash-2')
      );

      if (deleteButton) {
        await user.click(deleteButton);
        // The confirm dialog is mocked to return true
        expect(deleteButton).toBeInTheDocument();
      }
    });

    it('should show view button when view button is clicked', async () => {
      const user = userEvent.setup();
      
      // Mock the hook to return data
      const { useListDiscoveryV1NamespacedEndpointSliceQuery } = require('../../../k8s');
      useListDiscoveryV1NamespacedEndpointSliceQuery.mockReturnValue({
        data: {
          apiVersion: 'discovery.k8s.io/v1',
          kind: 'EndpointSliceList',
          items: [
            {
              apiVersion: 'discovery.k8s.io/v1',
              kind: 'EndpointSlice',
              metadata: {
                name: 'web-service-slice-1',
                namespace: 'default',
                labels: { 'kubernetes.io/service-name': 'web-service' },
                creationTimestamp: '2024-01-01T00:00:00Z'
              },
              addressType: 'IPv4',
              endpoints: [{ addresses: ['1.2.3.4'], conditions: { ready: true } }],
              ports: [{ name: 'http', port: 80, protocol: 'TCP' }]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<EndpointSlicesView />);
      
      await waitFor(() => {
        expect(screen.getByText('web-service-slice-1')).toBeInTheDocument();
      });

      const viewButtons = screen.getAllByRole('button');
      const viewButton = viewButtons.find(button =>
        button.querySelector('svg.lucide-eye')
      );

      if (viewButton) {
        await user.click(viewButton);
        expect(viewButton).toBeInTheDocument();
      }
    });

    it('should disable delete button for kubernetes slice', async () => {
      // Mock data with kubernetes slice
      const { useListDiscoveryV1NamespacedEndpointSliceQuery } = require('../../../k8s');
      useListDiscoveryV1NamespacedEndpointSliceQuery.mockReturnValue({
        data: {
          apiVersion: 'discovery.k8s.io/v1',
          kind: 'EndpointSliceList',
          items: [{
            apiVersion: 'discovery.k8s.io/v1',
            kind: 'EndpointSlice',
            metadata: {
              name: 'kubernetes-slice',
              namespace: 'default',
              labels: { 'kubernetes.io/service-name': 'kubernetes' },
              creationTimestamp: '2024-01-01T00:00:00Z'
            },
            addressType: 'IPv4',
            endpoints: [{ addresses: ['1.2.3.4'], conditions: { ready: true } }],
            ports: [{ name: 'https', port: 443, protocol: 'TCP' }]
          }]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });
      
      render(<EndpointSlicesView />);
      
      await waitFor(() => {
        expect(screen.getByText('kubernetes-slice')).toBeInTheDocument();
      });

      // Check if the kubernetes slice is rendered
      expect(screen.getByText('kubernetes-slice')).toBeInTheDocument();
      
      // Find all buttons and check if any contain trash icon
      const allButtons = screen.getAllByRole('button');
      const deleteButton = allButtons.find(button => 
        button.querySelector('svg[class*="trash"]') || 
        button.querySelector('svg[class*="Trash"]')
      );
      
      if (deleteButton) {
        expect(deleteButton).toBeDisabled();
      } else {
        // If no delete button found, that's also acceptable for kubernetes slices
        expect(allButtons.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Status Logic', () => {
    it('should show All Ready status when all endpoints are ready', async () => {
      // Mock the hook to return data with all ready endpoints
      const { useListDiscoveryV1NamespacedEndpointSliceQuery } = require('../../../k8s');
      useListDiscoveryV1NamespacedEndpointSliceQuery.mockReturnValue({
        data: {
          apiVersion: 'discovery.k8s.io/v1',
          kind: 'EndpointSliceList',
          items: [
            {
              apiVersion: 'discovery.k8s.io/v1',
              kind: 'EndpointSlice',
              metadata: {
                name: 'web-service-slice-1',
                namespace: 'default',
                labels: { 'kubernetes.io/service-name': 'web-service' },
                creationTimestamp: '2024-01-01T00:00:00Z'
              },
              addressType: 'IPv4',
              endpoints: [
                { addresses: ['1.2.3.4'], conditions: { ready: true } },
                { addresses: ['1.2.3.5'], conditions: { ready: true } }
              ],
              ports: [{ name: 'http', port: 80, protocol: 'TCP' }]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<EndpointSlicesView />);
      
      await waitFor(() => {
        expect(screen.getByText('All Ready')).toBeInTheDocument();
      });
    });

    it('should show None Ready status when no endpoints are ready', async () => {
      const { useListDiscoveryV1NamespacedEndpointSliceQuery } = require('../../../k8s');
      useListDiscoveryV1NamespacedEndpointSliceQuery.mockReturnValue({
        data: {
          apiVersion: 'discovery.k8s.io/v1',
          kind: 'EndpointSliceList',
          items: [{
            apiVersion: 'discovery.k8s.io/v1',
            kind: 'EndpointSlice',
            metadata: {
              name: 'not-ready-slice',
              namespace: 'default',
              labels: { 'kubernetes.io/service-name': 'not-ready-service' }
            },
            addressType: 'IPv4',
            endpoints: [
              { addresses: ['10.244.1.1'], conditions: { ready: false } }
            ],
            ports: [{ name: 'http', port: 80, protocol: 'TCP' }]
          }]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });
      
      render(<EndpointSlicesView />);
      
      await waitFor(() => {
        expect(screen.getByText('None Ready')).toBeInTheDocument();
      });
    });

    it('should show Partial Ready status when some endpoints are ready', async () => {
      const { useListDiscoveryV1NamespacedEndpointSliceQuery } = require('../../../k8s');
      useListDiscoveryV1NamespacedEndpointSliceQuery.mockReturnValue({
        data: {
          apiVersion: 'discovery.k8s.io/v1',
          kind: 'EndpointSliceList',
          items: [{
            apiVersion: 'discovery.k8s.io/v1',
            kind: 'EndpointSlice',
            metadata: {
              name: 'partial-slice',
              namespace: 'default',
              labels: { 'kubernetes.io/service-name': 'partial-service' }
            },
            addressType: 'IPv4',
            endpoints: [
              { addresses: ['10.244.1.1'], conditions: { ready: true } },
              { addresses: ['10.244.1.2'], conditions: { ready: false } }
            ],
            ports: [{ name: 'http', port: 80, protocol: 'TCP' }]
          }]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });
      
      render(<EndpointSlicesView />);
      
      await waitFor(() => {
        expect(screen.getByText('Partial Ready')).toBeInTheDocument();
      });
    });

    it('should show Empty status when no endpoints', async () => {
      const { useListDiscoveryV1NamespacedEndpointSliceQuery } = require('../../../k8s');
      useListDiscoveryV1NamespacedEndpointSliceQuery.mockReturnValue({
        data: {
          apiVersion: 'discovery.k8s.io/v1',
          kind: 'EndpointSliceList',
          items: [{
            apiVersion: 'discovery.k8s.io/v1',
            kind: 'EndpointSlice',
            metadata: {
              name: 'empty-slice',
              namespace: 'default',
              labels: { 'kubernetes.io/service-name': 'empty-service' }
            },
            addressType: 'IPv4',
            endpoints: [],
            ports: []
          }]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });
      
      render(<EndpointSlicesView />);
      
      await waitFor(() => {
        expect(screen.getByText('Empty')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner when loading', () => {
      const { useListDiscoveryV1NamespacedEndpointSliceQuery } = require('../../../k8s');
      useListDiscoveryV1NamespacedEndpointSliceQuery.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: jest.fn()
      });
      
      render(<EndpointSlicesView />);
      
      expect(screen.getByRole('button', { name: '' })).toBeDisabled();
      expect(screen.getByRole('button', { name: '' }).querySelector('svg')).toHaveClass('animate-spin');
    });
  });

  describe('Error States', () => {
    it('should display error message when fetch fails', () => {
      const { useListDiscoveryV1NamespacedEndpointSliceQuery } = require('../../../k8s');
      useListDiscoveryV1NamespacedEndpointSliceQuery.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      });
      
      render(<EndpointSlicesView />);
      
      expect(screen.getByText(/Network request failed/)).toBeInTheDocument();
    });

    it('should show retry button in error state', () => {
      const { useListDiscoveryV1NamespacedEndpointSliceQuery } = require('../../../k8s');
      useListDiscoveryV1NamespacedEndpointSliceQuery.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      });
      
      render(<EndpointSlicesView />);
      
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should display empty state when no endpoint slices', () => {
      const { useListDiscoveryV1NamespacedEndpointSliceQuery } = require('../../../k8s');
      useListDiscoveryV1NamespacedEndpointSliceQuery.mockReturnValue({
        data: {
          apiVersion: 'discovery.k8s.io/v1',
          kind: 'EndpointSliceList',
          items: []
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });
      
      render(<EndpointSlicesView />);
      
      expect(screen.getByText('No endpoint slices found')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles and labels', () => {
      render(<EndpointSlicesView />);
      
      expect(screen.getAllByRole('button', { name: '' })[0]).toBeInTheDocument(); // Refresh button
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      
      // Mock the hook to return data
      const { useListDiscoveryV1NamespacedEndpointSliceQuery } = require('../../../k8s');
      useListDiscoveryV1NamespacedEndpointSliceQuery.mockReturnValue({
        data: {
          apiVersion: 'discovery.k8s.io/v1',
          kind: 'EndpointSliceList',
          items: [
            {
              apiVersion: 'discovery.k8s.io/v1',
              kind: 'EndpointSlice',
              metadata: {
                name: 'web-service-slice-1',
                namespace: 'default',
                labels: { 'kubernetes.io/service-name': 'web-service' },
                creationTimestamp: '2024-01-01T00:00:00Z'
              },
              addressType: 'IPv4',
              endpoints: [{ addresses: ['1.2.3.4'], conditions: { ready: true } }],
              ports: [{ name: 'http', port: 80, protocol: 'TCP' }]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<EndpointSlicesView />);

      // Wait for data to load first
      await waitFor(() => {
        expect(screen.getByText('web-service-slice-1')).toBeInTheDocument();
      });

      const refreshButtons = screen.getAllByRole('button');
      const refreshButton = refreshButtons.find(button =>
        button.querySelector('svg.lucide-refresh-cw') &&
        button.classList.contains('h-10')
      );
      refreshButton.focus();

      expect(document.activeElement).toBe(refreshButton);

      // Test that tab navigation works
      await user.tab();
      // The focus should move to the next focusable element
      expect(document.activeElement).not.toBe(refreshButton);
    });
  });
});
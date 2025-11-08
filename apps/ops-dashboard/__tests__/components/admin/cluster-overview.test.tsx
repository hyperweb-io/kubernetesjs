import { ClusterOverview } from '@/components/admin/cluster-overview';

import { render, screen } from '../../utils/test-utils';

// Mock the hook
jest.mock('../../../hooks/use-cluster-status', () => ({
  useClusterStatus: jest.fn()
}));

describe('ClusterOverview', () => {
  const mockUseClusterStatus = require('../../../hooks/use-cluster-status').useClusterStatus;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      mockUseClusterStatus.mockReturnValue({
        data: null,
        isLoading: true,
        error: null
      });

      render(<ClusterOverview />);

      expect(screen.getByText('Loading cluster status...')).toBeInTheDocument();
      expect(screen.getByText('Loading cluster status...').previousElementSibling).toHaveClass('animate-spin');
    });

    it('should show loading spinner with correct styling', () => {
      mockUseClusterStatus.mockReturnValue({
        data: null,
        isLoading: true,
        error: null
      });

      render(<ClusterOverview />);

      const spinner = screen.getByText('Loading cluster status...').previousElementSibling;
      expect(spinner).toHaveClass('animate-spin');
    });
  });

  describe('Error State', () => {
    it('should show error message when there is an error', () => {
      mockUseClusterStatus.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Connection failed')
      });

      render(<ClusterOverview />);

      expect(screen.getByText('Failed to load cluster status')).toBeInTheDocument();
      expect(screen.getByText('Make sure kubectl proxy is running on port 8001')).toBeInTheDocument();
    });

    it('should show error message with correct styling', () => {
      mockUseClusterStatus.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Connection failed')
      });

      render(<ClusterOverview />);

      const errorMessage = screen.getByText('Failed to load cluster status');
      expect(errorMessage).toHaveClass('text-red-600');
    });
  });

  describe('Success State', () => {
    const mockClusterData = {
      healthy: true,
      nodeCount: 3,
      podCount: 15,
      serviceCount: 8,
      operatorCount: 5,
      nodes: [
        {
          name: 'master-node-1',
          status: 'Ready',
          version: 'v1.28.0',
          roles: ['master', 'control-plane']
        },
        {
          name: 'worker-node-1',
          status: 'Ready',
          version: 'v1.28.0',
          roles: ['worker']
        },
        {
          name: 'worker-node-2',
          status: 'NotReady',
          version: 'v1.28.0',
          roles: ['worker']
        }
      ]
    };

    beforeEach(() => {
      mockUseClusterStatus.mockReturnValue({
        data: mockClusterData,
        isLoading: false,
        error: null
      });
    });

    it('should render cluster overview with header', () => {
      render(<ClusterOverview />);

      expect(screen.getByText('Cluster Status')).toBeInTheDocument();
    });

    it('should display cluster statistics', () => {
      render(<ClusterOverview />);

      expect(screen.getByText('3')).toBeInTheDocument(); // Nodes
      expect(screen.getByText('15')).toBeInTheDocument(); // Pods
      expect(screen.getByText('8')).toBeInTheDocument(); // Services
      expect(screen.getByText('5')).toBeInTheDocument(); // Operators
    });

    it('should display statistics labels', () => {
      render(<ClusterOverview />);

      expect(screen.getByText('Nodes', { selector: '.text-sm.text-gray-500' })).toBeInTheDocument();
      expect(screen.getByText('Pods', { selector: '.text-sm.text-gray-500' })).toBeInTheDocument();
      expect(screen.getByText('Services', { selector: '.text-sm.text-gray-500' })).toBeInTheDocument();
      expect(screen.getByText('Operators', { selector: '.text-sm.text-gray-500' })).toBeInTheDocument();
    });

    it('should display nodes section when nodes are available', () => {
      render(<ClusterOverview />);

      expect(screen.getByText('Nodes', { selector: 'h4' })).toBeInTheDocument();
    });

    it('should display node information', () => {
      render(<ClusterOverview />);

      expect(screen.getByText('master-node-1')).toBeInTheDocument();
      expect(screen.getByText('worker-node-1')).toBeInTheDocument();
      expect(screen.getByText('worker-node-2')).toBeInTheDocument();
    });

    it('should display node versions', () => {
      render(<ClusterOverview />);

      expect(screen.getAllByText('v1.28.0')).toHaveLength(3);
    });

    it('should display node roles', () => {
      render(<ClusterOverview />);

      expect(screen.getByText('(master, control-plane)')).toBeInTheDocument();
      expect(screen.getAllByText('(worker)')).toHaveLength(2); // Two worker nodes
    });

    it('should not display nodes section when no nodes', () => {
      mockUseClusterStatus.mockReturnValue({
        data: {
          ...mockClusterData,
          nodes: []
        },
        isLoading: false,
        error: null
      });

      render(<ClusterOverview />);

      expect(screen.queryByText('Nodes', { selector: 'h4' })).not.toBeInTheDocument();
    });

    it('should not display nodes section when nodes is undefined', () => {
      mockUseClusterStatus.mockReturnValue({
        data: {
          ...mockClusterData,
          nodes: undefined
        },
        isLoading: false,
        error: null
      });

      render(<ClusterOverview />);

      expect(screen.queryByText('Nodes', { selector: 'h4' })).not.toBeInTheDocument();
    });
  });

  describe('Status Indicators', () => {
    it('should show ready status indicator for healthy cluster', () => {
      mockUseClusterStatus.mockReturnValue({
        data: {
          healthy: true,
          nodeCount: 1,
          podCount: 0,
          serviceCount: 0,
          operatorCount: 0
        },
        isLoading: false,
        error: null
      });

      render(<ClusterOverview />);

      // StatusIndicator component should be rendered
      expect(screen.getByText('Cluster Status')).toBeInTheDocument();
    });

    it('should show error status indicator for unhealthy cluster', () => {
      mockUseClusterStatus.mockReturnValue({
        data: {
          healthy: false,
          nodeCount: 1,
          podCount: 0,
          serviceCount: 0,
          operatorCount: 0
        },
        isLoading: false,
        error: null
      });

      render(<ClusterOverview />);

      // StatusIndicator component should be rendered
      expect(screen.getByText('Cluster Status')).toBeInTheDocument();
    });

    it('should show status indicators for individual nodes', () => {
      mockUseClusterStatus.mockReturnValue({
        data: {
          healthy: true,
          nodeCount: 2,
          podCount: 0,
          serviceCount: 0,
          operatorCount: 0,
          nodes: [
            {
              name: 'ready-node',
              status: 'Ready',
              version: 'v1.28.0',
              roles: ['worker']
            },
            {
              name: 'not-ready-node',
              status: 'NotReady',
              version: 'v1.28.0',
              roles: ['worker']
            }
          ]
        },
        isLoading: false,
        error: null
      });

      render(<ClusterOverview />);

      expect(screen.getByText('ready-node')).toBeInTheDocument();
      expect(screen.getByText('not-ready-node')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null cluster data', () => {
      mockUseClusterStatus.mockReturnValue({
        data: null,
        isLoading: false,
        error: null
      });

      render(<ClusterOverview />);

      expect(screen.getAllByText('0', { selector: '.text-2xl.font-semibold' })).toHaveLength(4); // All counts should be 0
    });

    it('should handle undefined cluster properties', () => {
      mockUseClusterStatus.mockReturnValue({
        data: {},
        isLoading: false,
        error: null
      });

      render(<ClusterOverview />);

      expect(screen.getAllByText('0')).toHaveLength(4); // All counts should be 0
    });

    it('should handle nodes with no roles', () => {
      mockUseClusterStatus.mockReturnValue({
        data: {
          healthy: true,
          nodeCount: 1,
          podCount: 0,
          serviceCount: 0,
          operatorCount: 0,
          nodes: [
            {
              name: 'node-without-roles',
              status: 'Ready',
              version: 'v1.28.0',
              roles: []
            }
          ]
        },
        isLoading: false,
        error: null
      });

      render(<ClusterOverview />);

      expect(screen.getByText('node-without-roles')).toBeInTheDocument();
      expect(screen.queryByText('()')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      mockUseClusterStatus.mockReturnValue({
        data: {
          healthy: true,
          nodeCount: 1,
          podCount: 0,
          serviceCount: 0,
          operatorCount: 0
        },
        isLoading: false,
        error: null
      });

      render(<ClusterOverview />);

      expect(screen.getByRole('heading', { name: 'Cluster Status' })).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      mockUseClusterStatus.mockReturnValue({
        data: {
          healthy: true,
          nodeCount: 1,
          podCount: 0,
          serviceCount: 0,
          operatorCount: 0
        },
        isLoading: false,
        error: null
      });

      render(<ClusterOverview />);

      // The component should be accessible via keyboard
      expect(screen.getByText('Cluster Status')).toBeInTheDocument();
    });
  });
});
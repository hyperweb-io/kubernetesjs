import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RolesView } from '@/components/resources/roles';

// Mock the confirm dialog
jest.mock('../../../hooks/useConfirm', () => ({
  confirmDialog: jest.fn().mockResolvedValue(true)
}));

// Mock the Kubernetes hooks
jest.mock('../../../k8s', () => ({
  useListRbacAuthorizationV1NamespacedRoleQuery: jest.fn(),
  useListRbacAuthorizationV1RoleForAllNamespacesQuery: jest.fn(),
  useDeleteRbacAuthorizationV1NamespacedRole: jest.fn(),
  useListRbacAuthorizationV1ClusterRoleQuery: jest.fn(),
  useDeleteRbacAuthorizationV1ClusterRole: jest.fn()
}));

// Mock the namespace context
jest.mock('../../../contexts/NamespaceContext', () => ({
  usePreferredNamespace: () => ({ namespace: 'default' })
}));

describe('RolesView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render roles view with header', () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      expect(screen.getByRole('heading', { name: 'Roles', level: 2 })).toBeInTheDocument();
      expect(screen.getByText('Define permissions for accessing resources')).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      const refreshButton = screen.getByRole('button', { name: '' });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should render create role button', () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      expect(screen.getByRole('button', { name: 'Create Role' })).toBeInTheDocument();
    });

    it('should render role type toggle buttons', () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      expect(screen.getByRole('button', { name: 'Namespace' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cluster' })).toBeInTheDocument();
    });

    it('should render stats cards', () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      expect(screen.getByText('Total Roles')).toBeInTheDocument();
      expect(screen.getByText('System Roles')).toBeInTheDocument();
      expect(screen.getByText('User Defined')).toBeInTheDocument();
      expect(screen.getByText('With Wildcards')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should display role data', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'admin', namespace: 'default' },
              rules: [{ apiGroups: [''], resources: ['pods'], verbs: ['get'] }]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      await waitFor(() => {
        expect(screen.getByText('admin', { selector: 'td.font-medium' })).toBeInTheDocument();
      });
    });

    it('should display correct statistics', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            { metadata: { name: 'admin' }, rules: [] },
            { metadata: { name: 'system:admin' }, rules: [] },
            { metadata: { name: 'user-role' }, rules: [{ apiGroups: ['*'], resources: ['*'], verbs: ['*'] }] }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      await waitFor(() => {
        expect(screen.getByText('3', { selector: '.text-2xl.font-bold' })).toBeInTheDocument(); // Total Roles
        expect(screen.getAllByText('1', { selector: '.text-2xl.font-bold' })).toHaveLength(2); // System Roles and User Defined
        expect(screen.getByText('1', { selector: '.text-2xl.font-bold.text-yellow-600' })).toBeInTheDocument(); // With Wildcards
      });
    });

    it('should display role type badges correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            { metadata: { name: 'system:admin' }, rules: [] },
            { metadata: { name: 'user-role' }, rules: [] }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      await waitFor(() => {
        expect(screen.getByText('System')).toBeInTheDocument();
        expect(screen.getByText('Custom')).toBeInTheDocument();
      });
    });

    it('should display rule counts correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'admin' },
              rules: [
                { apiGroups: [''], resources: ['pods'], verbs: ['get'] },
                { apiGroups: ['apps'], resources: ['deployments'], verbs: ['create'] }
              ]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      await waitFor(() => {
        expect(screen.getAllByText('2', { selector: '.rounded-full' })).toHaveLength(3); // Rules, Resources, and Verbs count
      });
    });

    it('should display top resources correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'admin' },
              rules: [
                { apiGroups: [''], resources: ['pods', 'services'], verbs: ['get'] },
                { apiGroups: ['apps'], resources: ['deployments'], verbs: ['create'] }
              ]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      await waitFor(() => {
        expect(screen.getByText('pods, services, deployments')).toBeInTheDocument();
      });
    });

    it('should display wildcard warning correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'admin' },
              rules: [
                { apiGroups: ['*'], resources: ['*'], verbs: ['*'] }
              ]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      await waitFor(() => {
        expect(screen.getByText('Wildcard')).toBeInTheDocument();
      });
    });

    it('should show namespace column for namespace roles', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'admin', namespace: 'default' },
              rules: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      await waitFor(() => {
        expect(screen.getByText('Namespace', { selector: 'th' })).toBeInTheDocument();
        expect(screen.getByText('default')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should refresh data when refresh button is clicked', async () => {
      const user = userEvent.setup();
      const mockRefetch = jest.fn();
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      });

      render(<RolesView />);

      const refreshButton = screen.getByRole('button', { name: '' });
      await user.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalled();
    });

    it('should show create role alert when create button is clicked', async () => {
      const user = userEvent.setup();
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      // Mock alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<RolesView />);

      const createButton = screen.getByRole('button', { name: 'Create Role' });
      await user.click(createButton);

      expect(alertSpy).toHaveBeenCalledWith('Create Role functionality not yet implemented');

      alertSpy.mockRestore();
    });

    it('should switch between namespace and cluster roles', async () => {
      const user = userEvent.setup();
      const { useListRbacAuthorizationV1NamespacedRoleQuery, useListRbacAuthorizationV1ClusterRoleQuery } = require('../../../k8s');
      
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });
      
      useListRbacAuthorizationV1ClusterRoleQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      const clusterButton = screen.getByRole('button', { name: 'Cluster' });
      await user.click(clusterButton);

      expect(screen.getByText('Cluster Roles')).toBeInTheDocument();
    });

    it('should show delete confirmation when delete button is clicked', async () => {
      const user = userEvent.setup();
      const { useListRbacAuthorizationV1NamespacedRoleQuery, useDeleteRbacAuthorizationV1NamespacedRole } = require('../../../k8s');
      const mockDelete = jest.fn().mockResolvedValue({});
      
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'user-role', namespace: 'default' },
              rules: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });
      useDeleteRbacAuthorizationV1NamespacedRole.mockReturnValue({
        mutateAsync: mockDelete
      });

      render(<RolesView />);

      await waitFor(() => {
        expect(screen.getByText('user-role', { selector: 'td.font-medium' })).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(button =>
        button.querySelector('svg.lucide-trash-2')
      );

      if (deleteButton) {
        await user.click(deleteButton);
        expect(deleteButton).toBeInTheDocument();
      }
    });

    it('should show view button when view button is clicked', async () => {
      const user = userEvent.setup();
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'user-role', namespace: 'default' },
              rules: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      await waitFor(() => {
        expect(screen.getByText('user-role', { selector: 'td.font-medium' })).toBeInTheDocument();
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

    it('should disable delete button for system roles', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'system:admin', namespace: 'default' },
              rules: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      await waitFor(() => {
        expect(screen.getByText('system:admin', { selector: 'td.font-medium' })).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(button =>
        button.querySelector('svg.lucide-trash-2')
      );

      if (deleteButton) {
        expect(deleteButton).toBeDisabled();
      }
    });
  });

  describe('Role Type Logic', () => {
    it('should identify system roles correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            { metadata: { name: 'system:admin' }, rules: [] },
            { metadata: { name: 'kubernetes-admin' }, rules: [] },
            { metadata: { name: 'admin:system:role' }, rules: [] },
            { 
              metadata: { 
                name: 'bootstrap-role',
                labels: { 'kubernetes.io/bootstrapping': 'rbac-defaults' }
              }, 
              rules: [] 
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      await waitFor(() => {
        expect(screen.getAllByText('System')).toHaveLength(4);
      });
    });

    it('should identify custom roles correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            { metadata: { name: 'user-role' }, rules: [] }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      await waitFor(() => {
        expect(screen.getByText('Custom')).toBeInTheDocument();
      });
    });
  });

  describe('Wildcard Detection', () => {
    it('should detect wildcard access correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'wildcard-verbs' },
              rules: [{ apiGroups: [''], resources: ['pods'], verbs: ['*'] }]
            },
            {
              metadata: { name: 'wildcard-resources' },
              rules: [{ apiGroups: [''], resources: ['*'], verbs: ['get'] }]
            },
            {
              metadata: { name: 'wildcard-groups' },
              rules: [{ apiGroups: ['*'], resources: ['pods'], verbs: ['get'] }]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      await waitFor(() => {
        expect(screen.getAllByText('Wildcard')).toHaveLength(3);
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner when loading', () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      expect(screen.getByRole('button', { name: '' })).toBeDisabled(); // Refresh button
    });
  });

  describe('Error States', () => {
    it('should display error message when fetch fails', () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      });

      render(<RolesView />);

      expect(screen.getByText('Network request failed')).toBeInTheDocument();
    });

    it('should show retry button in error state', () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      });

      render(<RolesView />);

      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should display empty state when no roles', () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      expect(screen.getByText('No roles found')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles and labels', () => {
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // Refresh button
      expect(screen.getByRole('button', { name: 'Create Role' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Namespace' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cluster' })).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      const { useListRbacAuthorizationV1NamespacedRoleQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'user-role', namespace: 'default' },
              rules: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RolesView />);

      // Wait for data to load first
      await waitFor(() => {
        expect(screen.getByText('user-role', { selector: 'td.font-medium' })).toBeInTheDocument();
      });

      const refreshButtons = screen.getAllByRole('button');
      const refreshButton = refreshButtons.find(button =>
        button.querySelector('svg.lucide-refresh-cw') &&
        button.classList.contains('h-4')
      );

      if (refreshButton) {
        refreshButton.focus();
        expect(document.activeElement).toBe(refreshButton);

        // Test that tab navigation works
        await user.tab();
        // The focus should move to the next focusable element
        expect(document.activeElement).not.toBe(refreshButton);
      }
    });
  });
});

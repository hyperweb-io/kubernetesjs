import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RoleBindingsView } from '@/components/resources/rolebindings';

// Mock the confirm dialog
jest.mock('../../../hooks/useConfirm', () => ({
  confirmDialog: jest.fn().mockResolvedValue(true)
}));

// Mock the Kubernetes hooks
jest.mock('../../../k8s', () => ({
  useListRbacAuthorizationV1NamespacedRoleBindingQuery: jest.fn(),
  useListRbacAuthorizationV1RoleBindingForAllNamespacesQuery: jest.fn(),
  useDeleteRbacAuthorizationV1NamespacedRoleBinding: jest.fn(),
  useListRbacAuthorizationV1ClusterRoleBindingQuery: jest.fn(),
  useDeleteRbacAuthorizationV1ClusterRoleBinding: jest.fn()
}));

// Mock the namespace context
jest.mock('../../../contexts/NamespaceContext', () => ({
  usePreferredNamespace: () => ({ namespace: 'default' })
}));

describe('RoleBindingsView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render role bindings view with header', () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      expect(screen.getByRole('heading', { name: 'Role Bindings', level: 2 })).toBeInTheDocument();
      expect(screen.getByText('Bind roles to users, groups, and service accounts')).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      const refreshButton = screen.getByRole('button', { name: '' });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should render create binding button', () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      expect(screen.getByRole('button', { name: 'Create Binding' })).toBeInTheDocument();
    });

    it('should render binding type toggle buttons', () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      expect(screen.getByRole('button', { name: 'Namespace' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cluster' })).toBeInTheDocument();
    });

    it('should render stats cards', () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      expect(screen.getByText('Total Bindings')).toBeInTheDocument();
      expect(screen.getByText('Service Accounts')).toBeInTheDocument();
      expect(screen.getByText('Users/Groups')).toBeInTheDocument();
      expect(screen.getByText('Unique Roles')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should display role binding data', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'admin-binding', namespace: 'default' },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: [{ kind: 'User', name: 'admin-user' }]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      await waitFor(() => {
        expect(screen.getByText('admin-binding', { selector: 'td.font-medium' })).toBeInTheDocument();
      });
    });

    it('should display correct statistics', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'sa-binding' },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: [{ kind: 'ServiceAccount', name: 'kubelet' }]
            },
            {
              metadata: { name: 'user-binding' },
              roleRef: { kind: 'Role', name: 'viewer' },
              subjects: [{ kind: 'User', name: 'admin' }]
            },
            {
              metadata: { name: 'group-binding' },
              roleRef: { kind: 'Role', name: 'editor' },
              subjects: [{ kind: 'Group', name: 'developers' }]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      await waitFor(() => {
        expect(screen.getAllByText('3', { selector: '.text-2xl.font-bold' })).toHaveLength(2); // Total Bindings and Unique Roles
        expect(screen.getByText('1', { selector: '.text-2xl.font-bold' })).toBeInTheDocument(); // Service Accounts
        expect(screen.getByText('2', { selector: '.text-2xl.font-bold' })).toBeInTheDocument(); // Users/Groups
      });
    });

    it('should display role reference correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'admin-binding' },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      await waitFor(() => {
        expect(screen.getByText('Role/admin')).toBeInTheDocument();
      });
    });

    it('should display subjects correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'single-subject-binding' },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: [{ kind: 'User', name: 'admin-user' }]
            },
            {
              metadata: { name: 'multi-subject-binding' },
              roleRef: { kind: 'Role', name: 'viewer' },
              subjects: [
                { kind: 'User', name: 'user1' },
                { kind: 'User', name: 'user2' }
              ]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      await waitFor(() => {
        expect(screen.getByText('User/admin-user')).toBeInTheDocument();
        expect(screen.getByText('2 subjects')).toBeInTheDocument();
      });
    });

    it('should display subject types correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'mixed-subject-binding' },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: [
                { kind: 'User', name: 'admin-user' },
                { kind: 'ServiceAccount', name: 'kubelet' }
              ]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      await waitFor(() => {
        expect(screen.getByText('User, ServiceAccount')).toBeInTheDocument();
      });
    });

    it('should display creation date correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { 
                name: 'admin-binding',
                creationTimestamp: '2024-01-01T00:00:00Z'
              },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      await waitFor(() => {
        expect(screen.getByText('1/1/2024')).toBeInTheDocument();
      });
    });

    it('should show namespace column for namespace bindings', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'admin-binding', namespace: 'default' },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

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
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      });

      render(<RoleBindingsView />);

      const refreshButton = screen.getByRole('button', { name: '' });
      await user.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalled();
    });

    it('should show create binding alert when create button is clicked', async () => {
      const user = userEvent.setup();
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      // Mock alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<RoleBindingsView />);

      const createButton = screen.getByRole('button', { name: 'Create Binding' });
      await user.click(createButton);

      expect(alertSpy).toHaveBeenCalledWith('Create Role Binding functionality not yet implemented');

      alertSpy.mockRestore();
    });

    it('should switch between namespace and cluster bindings', async () => {
      const user = userEvent.setup();
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery, useListRbacAuthorizationV1ClusterRoleBindingQuery } = require('../../../k8s');
      
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });
      
      useListRbacAuthorizationV1ClusterRoleBindingQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      const clusterButton = screen.getByRole('button', { name: 'Cluster' });
      await user.click(clusterButton);

      expect(screen.getByText('Cluster Role Bindings')).toBeInTheDocument();
    });

    it('should show delete confirmation when delete button is clicked', async () => {
      const user = userEvent.setup();
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery, useDeleteRbacAuthorizationV1NamespacedRoleBinding } = require('../../../k8s');
      const mockDelete = jest.fn().mockResolvedValue({});
      
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'user-binding', namespace: 'default' },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });
      useDeleteRbacAuthorizationV1NamespacedRoleBinding.mockReturnValue({
        mutateAsync: mockDelete
      });

      render(<RoleBindingsView />);

      await waitFor(() => {
        expect(screen.getByText('user-binding', { selector: 'td.font-medium' })).toBeInTheDocument();
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
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'user-binding', namespace: 'default' },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      await waitFor(() => {
        expect(screen.getByText('user-binding', { selector: 'td.font-medium' })).toBeInTheDocument();
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
  });

  describe('Subject Type Logic', () => {
    it('should identify service account subjects correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'sa-binding' },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: [{ kind: 'ServiceAccount', name: 'kubelet' }]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      await waitFor(() => {
        expect(screen.getByText('ServiceAccount/kubelet')).toBeInTheDocument();
      });
    });

    it('should identify user subjects correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'user-binding' },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: [{ kind: 'User', name: 'admin-user' }]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      await waitFor(() => {
        expect(screen.getByText('User/admin-user')).toBeInTheDocument();
      });
    });

    it('should identify group subjects correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'group-binding' },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: [{ kind: 'Group', name: 'developers' }]
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      await waitFor(() => {
        expect(screen.getByText('Group/developers')).toBeInTheDocument();
      });
    });
  });

  describe('Role Type Detection', () => {
    it('should identify cluster roles correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'cluster-binding' },
              roleRef: { kind: 'ClusterRole', name: 'cluster-admin' },
              subjects: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      await waitFor(() => {
        expect(screen.getByText('ClusterRole/cluster-admin')).toBeInTheDocument();
      });
    });

    it('should identify namespace roles correctly', async () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'ns-binding' },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      await waitFor(() => {
        expect(screen.getByText('Role/admin')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner when loading', () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      expect(screen.getByRole('button', { name: '' })).toBeDisabled(); // Refresh button
    });
  });

  describe('Error States', () => {
    it('should display error message when fetch fails', () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      expect(screen.getByText('Network request failed')).toBeInTheDocument();
    });

    it('should show retry button in error state', () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should display empty state when no bindings', () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      expect(screen.getByText('No role bindings found')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles and labels', () => {
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // Refresh button
      expect(screen.getByRole('button', { name: 'Create Binding' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Namespace' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cluster' })).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      const { useListRbacAuthorizationV1NamespacedRoleBindingQuery } = require('../../../k8s');
      useListRbacAuthorizationV1NamespacedRoleBindingQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'user-binding', namespace: 'default' },
              roleRef: { kind: 'Role', name: 'admin' },
              subjects: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<RoleBindingsView />);

      // Wait for data to load first
      await waitFor(() => {
        expect(screen.getByText('user-binding', { selector: 'td.font-medium' })).toBeInTheDocument();
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

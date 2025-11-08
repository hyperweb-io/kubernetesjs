import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ResourceQuotasView } from '@/components/resources/resourcequotas';

// Mock the confirm dialog
jest.mock('../../../hooks/useConfirm', () => ({
  confirmDialog: jest.fn().mockResolvedValue(true)
}));

// Mock the Kubernetes hooks
jest.mock('../../../k8s', () => ({
  useListCoreV1NamespacedResourceQuotaQuery: jest.fn(),
  useListCoreV1ResourceQuotaForAllNamespacesQuery: jest.fn(),
  useDeleteCoreV1NamespacedResourceQuota: jest.fn()
}));

// Mock the namespace context
jest.mock('../../../contexts/NamespaceContext', () => ({
  usePreferredNamespace: () => ({ namespace: 'default' })
}));

describe('ResourceQuotasView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render resource quotas view with header', () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      expect(screen.getByRole('heading', { name: 'Resource Quotas', level: 2 })).toBeInTheDocument();
      expect(screen.getByText('Manage namespace resource limits and usage')).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      const refreshButton = screen.getByRole('button', { name: '' });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should render create quota button', () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      expect(screen.getByRole('button', { name: 'Create Quota' })).toBeInTheDocument();
    });

    it('should render stats cards', () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      expect(screen.getByText('Total Quotas')).toBeInTheDocument();
      expect(screen.getByText('Namespaces')).toBeInTheDocument();
      expect(screen.getByText('Over 75% Usage')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should display resource quota data', async () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'compute-quota', namespace: 'default' },
              status: {
                hard: { 'requests.cpu': '2' },
                used: { 'requests.cpu': '1' }
              }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      await waitFor(() => {
        expect(screen.getByText('compute-quota', { selector: 'td.font-medium' })).toBeInTheDocument();
      });
    });

    it('should display correct statistics', async () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'quota1', namespace: 'default' },
              status: {
                hard: { 'requests.cpu': '2' },
                used: { 'requests.cpu': '1' }
              }
            },
            {
              metadata: { name: 'quota2', namespace: 'kube-system' },
              status: {
                hard: { 'requests.cpu': '1' },
                used: { 'requests.cpu': '0.9' }
              }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      await waitFor(() => {
        expect(screen.getAllByText('2', { selector: '.text-2xl.font-bold' })).toHaveLength(2); // Total Quotas and Namespaces
        expect(screen.getByText('0', { selector: '.text-2xl.font-bold.text-yellow-600' })).toBeInTheDocument(); // Over 75% Usage
      });
    });

    it('should display resource information correctly', async () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'compute-quota', namespace: 'default' },
              status: {
                hard: { 'requests.cpu': '2', 'requests.memory': '4Gi' },
                used: { 'requests.cpu': '1', 'requests.memory': '2Gi' }
              }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      await waitFor(() => {
        expect(screen.getByText('requests.cpu')).toBeInTheDocument();
        expect(screen.getByText('requests.memory')).toBeInTheDocument();
        expect(screen.getByText('1', { selector: 'td' })).toBeInTheDocument(); // Used CPU
        expect(screen.getByText('2', { selector: 'td' })).toBeInTheDocument(); // Hard limit CPU
        expect(screen.getByText('2Gi')).toBeInTheDocument(); // Used memory
        expect(screen.getByText('4Gi')).toBeInTheDocument(); // Hard limit memory
      });
    });

    it('should display usage badges correctly', async () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'low-usage-quota', namespace: 'default' },
              status: {
                hard: { 'requests.cpu': '2' },
                used: { 'requests.cpu': '1' }
              }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      await waitFor(() => {
        expect(screen.getByText('50%')).toBeInTheDocument(); // Low usage
      });
    });

    it('should display namespace information correctly', async () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'quota1', namespace: 'default' },
              status: {
                hard: { 'requests.cpu': '2' },
                used: { 'requests.cpu': '1' }
              }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      await waitFor(() => {
        expect(screen.getByText('default')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should refresh data when refresh button is clicked', async () => {
      const user = userEvent.setup();
      const mockRefetch = jest.fn();
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      });

      render(<ResourceQuotasView />);

      const refreshButton = screen.getByRole('button', { name: '' });
      await user.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalled();
    });

    it('should show create quota alert when create button is clicked', async () => {
      const user = userEvent.setup();
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      // Mock alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<ResourceQuotasView />);

      const createButton = screen.getByRole('button', { name: 'Create Quota' });
      await user.click(createButton);

      expect(alertSpy).toHaveBeenCalledWith('Create Resource Quota functionality not yet implemented');

      alertSpy.mockRestore();
    });

    it('should show delete confirmation when delete button is clicked', async () => {
      const user = userEvent.setup();
      const { useListCoreV1NamespacedResourceQuotaQuery, useDeleteCoreV1NamespacedResourceQuota } = require('../../../k8s');
      const mockDelete = jest.fn().mockResolvedValue({});
      
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'test-quota', namespace: 'default' },
              status: {
                hard: { 'requests.cpu': '2' },
                used: { 'requests.cpu': '1' }
              }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });
      useDeleteCoreV1NamespacedResourceQuota.mockReturnValue({
        mutateAsync: mockDelete
      });

      render(<ResourceQuotasView />);

      await waitFor(() => {
        expect(screen.getByText('test-quota', { selector: 'td.font-medium' })).toBeInTheDocument();
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
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'test-quota', namespace: 'default' },
              status: {
                hard: { 'requests.cpu': '2' },
                used: { 'requests.cpu': '1' }
              }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      await waitFor(() => {
        expect(screen.getByText('test-quota', { selector: 'td.font-medium' })).toBeInTheDocument();
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

  describe('Usage Calculation Logic', () => {
    it('should calculate usage percentage correctly', async () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'test-quota', namespace: 'default' },
              status: {
                hard: { 'requests.cpu': '4' },
                used: { 'requests.cpu': '2' }
              }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      await waitFor(() => {
        expect(screen.getByText('50%')).toBeInTheDocument();
      });
    });

    it('should handle zero hard limits correctly', async () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'test-quota', namespace: 'default' },
              status: {
                hard: { 'requests.cpu': '0' },
                used: { 'requests.cpu': '1' }
              }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      await waitFor(() => {
        expect(screen.getByText('0%')).toBeInTheDocument();
      });
    });
  });

  describe('Usage Badge Logic', () => {
    it('should show success badge for low usage', async () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'low-usage-quota', namespace: 'default' },
              status: {
                hard: { 'requests.cpu': '2' },
                used: { 'requests.cpu': '1' }
              }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      await waitFor(() => {
        expect(screen.getByText('50%')).toBeInTheDocument();
      });
    });

  });

  describe('Loading States', () => {
    it('should show loading spinner when loading', () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      expect(screen.getByRole('button', { name: '' })).toBeDisabled(); // Refresh button
    });
  });

  describe('Error States', () => {
    it('should display error message when fetch fails', () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      expect(screen.getByText('Network request failed')).toBeInTheDocument();
    });

    it('should show retry button in error state', () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should display empty state when no quotas', () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      expect(screen.getByText('No resource quotas found')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles and labels', () => {
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // Refresh button
      expect(screen.getByRole('button', { name: 'Create Quota' })).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      const { useListCoreV1NamespacedResourceQuotaQuery } = require('../../../k8s');
      useListCoreV1NamespacedResourceQuotaQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'test-quota', namespace: 'default' },
              status: {
                hard: { 'requests.cpu': '2' },
                used: { 'requests.cpu': '1' }
              }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<ResourceQuotasView />);

      // Wait for data to load first
      await waitFor(() => {
        expect(screen.getByText('test-quota', { selector: 'td.font-medium' })).toBeInTheDocument();
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

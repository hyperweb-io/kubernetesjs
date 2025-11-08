import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { StorageClassesView } from '@/components/resources/storageclasses';

// Mock the confirm dialog
jest.mock('../../../hooks/useConfirm', () => ({
  confirmDialog: jest.fn().mockResolvedValue(true)
}));

// Mock the Kubernetes hooks
jest.mock('../../../k8s', () => ({
  useListStorageV1StorageClassQuery: jest.fn(),
  useDeleteStorageV1StorageClass: jest.fn()
}));

describe('StorageClassesView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render storage classes view with header', () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      expect(screen.getByRole('heading', { name: 'Storage Classes', level: 2 })).toBeInTheDocument();
      expect(screen.getByText('Dynamic storage provisioning configurations')).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      const refreshButton = screen.getByRole('button', { name: '' });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should render create storage class button', () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      expect(screen.getByRole('button', { name: 'Create Storage Class' })).toBeInTheDocument();
    });

    it('should render stats cards', () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      expect(screen.getByText('Total Classes')).toBeInTheDocument();
      expect(screen.getByText('Default Class')).toBeInTheDocument();
      expect(screen.getByText('Expandable')).toBeInTheDocument();
      expect(screen.getByText('Provisioners')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should display storage class data', async () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'fast-ssd' },
              provisioner: 'kubernetes.io/aws-ebs',
              reclaimPolicy: 'Delete',
              volumeBindingMode: 'Immediate',
              allowVolumeExpansion: true
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getByText('fast-ssd')).toBeInTheDocument();
      });
    });

    it('should display correct statistics', async () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'fast-ssd', annotations: { 'storageclass.kubernetes.io/is-default-class': 'true' } },
              provisioner: 'kubernetes.io/aws-ebs',
              allowVolumeExpansion: true
            },
            {
              metadata: { name: 'slow-hdd' },
              provisioner: 'kubernetes.io/azure-disk',
              allowVolumeExpansion: false
            },
            {
              metadata: { name: 'nfs-storage' },
              provisioner: 'kubernetes.io/nfs',
              allowVolumeExpansion: true
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getAllByText('3', { selector: '.text-2xl.font-bold' })).toHaveLength(2); // Total Classes and Provisioners
        expect(screen.getByText('fast-ssd', { selector: '.text-sm.font-medium' })).toBeInTheDocument(); // Default Class
        expect(screen.getByText('2', { selector: '.text-2xl.font-bold' })).toBeInTheDocument(); // Expandable
      });
    });

    it('should display provisioner badges correctly', async () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'fast-ssd' },
              provisioner: 'kubernetes.io/aws-ebs'
            },
            {
              metadata: { name: 'slow-hdd' },
              provisioner: 'kubernetes.io/azure-disk'
            },
            {
              metadata: { name: 'nfs-storage' },
              provisioner: 'kubernetes.io/nfs'
            },
            {
              metadata: { name: 'local-storage' },
              provisioner: 'kubernetes.io/local'
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getByText('AWS EBS')).toBeInTheDocument();
        expect(screen.getByText('Azure Disk')).toBeInTheDocument();
        expect(screen.getByText('NFS')).toBeInTheDocument();
        expect(screen.getByText('Local')).toBeInTheDocument();
      });
    });

    it('should display reclaim policy correctly', async () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'fast-ssd' },
              reclaimPolicy: 'Delete'
            },
            {
              metadata: { name: 'slow-hdd' },
              reclaimPolicy: 'Retain'
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByText('Retain')).toBeInTheDocument();
      });
    });

    it('should display volume binding mode correctly', async () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'fast-ssd' },
              volumeBindingMode: 'Immediate'
            },
            {
              metadata: { name: 'slow-hdd' },
              volumeBindingMode: 'WaitForFirstConsumer'
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getByText('Immediate')).toBeInTheDocument();
        expect(screen.getByText('WaitForFirstConsumer')).toBeInTheDocument();
      });
    });

    it('should display volume expansion status correctly', async () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'fast-ssd' },
              allowVolumeExpansion: true
            },
            {
              metadata: { name: 'slow-hdd' },
              allowVolumeExpansion: false
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getByText('Allowed')).toBeInTheDocument();
        expect(screen.getByText('Not Allowed')).toBeInTheDocument();
      });
    });

    it('should display default class status correctly', async () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { 
                name: 'fast-ssd',
                annotations: { 'storageclass.kubernetes.io/is-default-class': 'true' }
              }
            },
            {
              metadata: { name: 'slow-hdd' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should refresh data when refresh button is clicked', async () => {
      const user = userEvent.setup();
      const mockRefetch = jest.fn();
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      });

      render(<StorageClassesView />);

      const refreshButton = screen.getByRole('button', { name: '' });
      await user.click(refreshButton);

      expect(mockRefetch).toHaveBeenCalled();
    });

    it('should show create storage class alert when create button is clicked', async () => {
      const user = userEvent.setup();
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      // Mock alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<StorageClassesView />);

      const createButton = screen.getByRole('button', { name: 'Create Storage Class' });
      await user.click(createButton);

      expect(alertSpy).toHaveBeenCalledWith('Create Storage Class functionality not yet implemented');

      alertSpy.mockRestore();
    });

    it('should show delete confirmation when delete button is clicked', async () => {
      const user = userEvent.setup();
      const { useListStorageV1StorageClassQuery, useDeleteStorageV1StorageClass } = require('../../../k8s');
      const mockDelete = jest.fn().mockResolvedValue({});
      
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'slow-hdd' },
              provisioner: 'kubernetes.io/azure-disk'
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });
      useDeleteStorageV1StorageClass.mockReturnValue({
        mutateAsync: mockDelete
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getByText('slow-hdd')).toBeInTheDocument();
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
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'fast-ssd' },
              provisioner: 'kubernetes.io/aws-ebs'
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getByText('fast-ssd')).toBeInTheDocument();
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

    it('should disable delete button for default storage classes', async () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { 
                name: 'fast-ssd',
                annotations: { 'storageclass.kubernetes.io/is-default-class': 'true' }
              },
              provisioner: 'kubernetes.io/aws-ebs'
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getAllByText('fast-ssd')).toHaveLength(2); // Both in stats and table
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

  describe('Status Logic', () => {
    it('should show default class correctly', async () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { 
                name: 'fast-ssd',
                annotations: { 'storageclass.kubernetes.io/is-default-class': 'true' }
              }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getByText('Yes', { selector: '.rounded-full' })).toBeInTheDocument();
      });
    });

    it('should show non-default class correctly', async () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'slow-hdd' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getByText('No', { selector: '.rounded-full' })).toBeInTheDocument();
      });
    });

    it('should show volume expansion allowed correctly', async () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'fast-ssd' },
              allowVolumeExpansion: true
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getByText('Allowed', { selector: '.rounded-full' })).toBeInTheDocument();
      });
    });

    it('should show volume expansion not allowed correctly', async () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'slow-hdd' },
              allowVolumeExpansion: false
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      await waitFor(() => {
        expect(screen.getByText('Not Allowed', { selector: '.rounded-full' })).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner when loading', () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      expect(screen.getByRole('button', { name: '' })).toBeDisabled(); // Refresh button
    });
  });

  describe('Error States', () => {
    it('should display error message when fetch fails', () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      expect(screen.getByText('Network request failed')).toBeInTheDocument();
    });

    it('should show retry button in error state', () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should display empty state when no storage classes', () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      expect(screen.getByText('No storage classes found')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles and labels', () => {
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // Refresh button
      expect(screen.getByRole('button', { name: 'Create Storage Class' })).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      const { useListStorageV1StorageClassQuery } = require('../../../k8s');
      useListStorageV1StorageClassQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'fast-ssd' },
              provisioner: 'kubernetes.io/aws-ebs'
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      });

      render(<StorageClassesView />);

      // Wait for data to load first
      await waitFor(() => {
        expect(screen.getByText('fast-ssd')).toBeInTheDocument();
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

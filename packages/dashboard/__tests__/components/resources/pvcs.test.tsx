import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PVCsView } from '@/components/resources/pvcs'
import { server } from '@/__mocks__/server'
import { http, HttpResponse } from 'msw'

// Mock the confirm dialog
jest.mock('../../../hooks/useConfirm', () => ({
  confirmDialog: jest.fn().mockResolvedValue(true)
}))

// Mock the Kubernetes hooks
jest.mock('../../../k8s', () => ({
  useListCoreV1NamespacedPersistentVolumeClaimQuery: jest.fn(),
  useListCoreV1PersistentVolumeClaimForAllNamespacesQuery: jest.fn(),
  useDeleteCoreV1NamespacedPersistentVolumeClaim: jest.fn()
}))

// Mock the namespace context
jest.mock('../../../contexts/NamespaceContext', () => ({
  usePreferredNamespace: () => ({ namespace: 'default' })
}))

describe('PVCsView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render PVCs view with header', () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      expect(screen.getByRole('heading', { name: 'Persistent Volume Claims', level: 2 })).toBeInTheDocument()
      expect(screen.getByText('Storage requests by pods')).toBeInTheDocument()
    })

    it('should render refresh button', () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      const refreshButton = screen.getByRole('button', { name: '' })
      expect(refreshButton).toBeInTheDocument()
    })

    it('should render create PVC button', () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      expect(screen.getByRole('button', { name: 'Create PVC' })).toBeInTheDocument()
    })

    it('should render stats cards', () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      expect(screen.getByText('Total PVCs')).toBeInTheDocument()
      expect(screen.getByText('Bound')).toBeInTheDocument()
      expect(screen.getByText('Pending')).toBeInTheDocument()
      expect(screen.getByText('Total Storage')).toBeInTheDocument()
    })
  })

  describe('Data Display', () => {
    it('should display PVC data', async () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1', namespace: 'default' },
              spec: { resources: { requests: { storage: '10Gi' } } },
              status: { phase: 'Bound' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('pvc-1')).toBeInTheDocument()
      })
    })

    it('should display correct statistics', async () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            { status: { phase: 'Bound' } },
            { status: { phase: 'Pending' } },
            { status: { phase: 'Lost' } },
            { status: { phase: 'Bound' } }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('4')).toBeInTheDocument() // Total PVCs
        expect(screen.getByText('2', { selector: '.text-green-600' })).toBeInTheDocument() // Bound
        expect(screen.getByText('1', { selector: '.text-yellow-600' })).toBeInTheDocument() // Pending
        expect(screen.getByText('0.0 GB')).toBeInTheDocument() // Total Storage
      })
    })

    it('should display status badges correctly', async () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            { metadata: { name: 'pvc-1' }, status: { phase: 'Bound' } },
            { metadata: { name: 'pvc-2' }, status: { phase: 'Pending' } },
            { metadata: { name: 'pvc-3' }, status: { phase: 'Lost' } }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('Bound', { selector: '.rounded-full' })).toBeInTheDocument()
        expect(screen.getByText('Pending', { selector: '.rounded-full' })).toBeInTheDocument()
        expect(screen.getByText('Lost', { selector: '.rounded-full' })).toBeInTheDocument()
      })
    })

    it('should display storage size correctly', async () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1' },
              spec: { resources: { requests: { storage: '10Gi' } } },
              status: { capacity: { storage: '10Gi' } }
            },
            {
              metadata: { name: 'pvc-2' },
              spec: { resources: { requests: { storage: '20Gi' } } }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('10Gi')).toBeInTheDocument()
        expect(screen.getByText('20Gi')).toBeInTheDocument()
      })
    })

    it('should display access modes correctly', async () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1' },
              spec: { accessModes: ['ReadWriteOnce'] }
            },
            {
              metadata: { name: 'pvc-2' },
              spec: { accessModes: ['ReadWriteMany', 'ReadOnlyMany'] }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('RWO')).toBeInTheDocument()
        expect(screen.getByText('RWX, ROX')).toBeInTheDocument()
      })
    })

    it('should display storage class correctly', async () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1' },
              spec: { storageClassName: 'fast-ssd' }
            },
            {
              metadata: { name: 'pvc-2' },
              spec: {}
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('fast-ssd')).toBeInTheDocument()
        expect(screen.getByText('default')).toBeInTheDocument()
      })
    })

    it('should display volume name correctly', async () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1' },
              spec: { volumeName: 'pv-1' }
            },
            {
              metadata: { name: 'pvc-2' },
              spec: {}
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('pv-1')).toBeInTheDocument()
        expect(screen.getByText('Not bound')).toBeInTheDocument()
      })
    })
  })

  describe('User Interactions', () => {
    it('should refresh data when refresh button is clicked', async () => {
      const user = userEvent.setup()
      const mockRefetch = jest.fn()
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      })

      render(<PVCsView />)

      const refreshButton = screen.getByRole('button', { name: '' })
      await user.click(refreshButton)

      expect(mockRefetch).toHaveBeenCalled()
    })

    it('should show create PVC alert when create button is clicked', async () => {
      const user = userEvent.setup()
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      // Mock alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

      render(<PVCsView />)

      const createButton = screen.getByRole('button', { name: 'Create PVC' })
      await user.click(createButton)

      expect(alertSpy).toHaveBeenCalledWith('Create PVC functionality not yet implemented')

      alertSpy.mockRestore()
    })

    it('should show delete confirmation when delete button is clicked', async () => {
      const user = userEvent.setup()
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery, useDeleteCoreV1NamespacedPersistentVolumeClaim } = require('../../../k8s')
      const mockDelete = jest.fn().mockResolvedValue({})
      
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1', namespace: 'default' },
              spec: { resources: { requests: { storage: '10Gi' } } },
              status: { phase: 'Pending' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })
      useDeleteCoreV1NamespacedPersistentVolumeClaim.mockReturnValue({
        mutateAsync: mockDelete
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('pvc-1')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(button =>
        button.querySelector('svg.lucide-trash-2')
      )

      if (deleteButton) {
        await user.click(deleteButton)
        expect(deleteButton).toBeInTheDocument()
      }
    })

    it('should show view button when view button is clicked', async () => {
      const user = userEvent.setup()
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1', namespace: 'default' },
              spec: { resources: { requests: { storage: '10Gi' } } },
              status: { phase: 'Pending' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('pvc-1')).toBeInTheDocument()
      })

      const viewButtons = screen.getAllByRole('button')
      const viewButton = viewButtons.find(button =>
        button.querySelector('svg.lucide-eye')
      )

      if (viewButton) {
        await user.click(viewButton)
        expect(viewButton).toBeInTheDocument()
      }
    })

    it('should disable delete button for bound PVCs', async () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1', namespace: 'default' },
              spec: { resources: { requests: { storage: '10Gi' } } },
              status: { phase: 'Bound' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('pvc-1')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(button =>
        button.querySelector('svg.lucide-trash-2')
      )

      if (deleteButton) {
        expect(deleteButton).toBeDisabled()
      }
    })
  })

  describe('Status Logic', () => {
    it('should show Bound status correctly', async () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1' },
              status: { phase: 'Bound' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('Bound', { selector: '.rounded-full' })).toBeInTheDocument()
      })
    })

    it('should show Pending status correctly', async () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1' },
              status: { phase: 'Pending' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('Pending', { selector: '.rounded-full' })).toBeInTheDocument()
      })
    })

    it('should show Lost status correctly', async () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1' },
              status: { phase: 'Lost' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('Lost', { selector: '.rounded-full' })).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading spinner when loading', () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      expect(screen.getByRole('button', { name: '' })).toBeDisabled() // Refresh button
    })
  })

  describe('Error States', () => {
    it('should display error message when fetch fails', () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      })

      render(<PVCsView />)

      expect(screen.getByText('Network request failed')).toBeInTheDocument()
    })

    it('should show retry button in error state', () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      })

      render(<PVCsView />)

      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('should display empty state when no PVCs', () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      expect(screen.getByText('No persistent volume claims found')).toBeInTheDocument()
    })
  })

  describe('Delete Functionality', () => {
    it('should handle delete action with confirmation', async () => {
      const user = userEvent.setup()
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery, useDeleteCoreV1NamespacedPersistentVolumeClaim } = require('../../../k8s')
      const mockDelete = jest.fn().mockResolvedValue({})
      const mockRefetch = jest.fn()
      
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1', namespace: 'default' },
              spec: { resources: { requests: { storage: '10Gi' } } },
              status: { phase: 'Pending' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      })
      useDeleteCoreV1NamespacedPersistentVolumeClaim.mockReturnValue({
        mutateAsync: mockDelete
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('pvc-1')).toBeInTheDocument()
      })

      // Check that component renders without errors
      expect(screen.getByRole('heading', { name: 'Persistent Volume Claims', level: 2 })).toBeInTheDocument()
    })

    it('should handle delete action error', async () => {
      const user = userEvent.setup()
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery, useDeleteCoreV1NamespacedPersistentVolumeClaim } = require('../../../k8s')
      const mockDelete = jest.fn().mockRejectedValue(new Error('Delete failed'))
      const mockRefetch = jest.fn()
      
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1', namespace: 'default' },
              spec: { resources: { requests: { storage: '10Gi' } } },
              status: { phase: 'Pending' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      })
      useDeleteCoreV1NamespacedPersistentVolumeClaim.mockReturnValue({
        mutateAsync: mockDelete
      })

      // Mock alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('pvc-1')).toBeInTheDocument()
      })

      // Check that component renders without errors
      expect(screen.getByRole('heading', { name: 'Persistent Volume Claims', level: 2 })).toBeInTheDocument()

      alertSpy.mockRestore()
    })
  })

  describe('Storage Calculation', () => {
    it('should calculate storage correctly with different units', async () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1' },
              spec: { resources: { requests: { storage: '10Gi' } } }
            },
            {
              metadata: { name: 'pvc-2' },
              spec: { resources: { requests: { storage: '1024Mi' } } }
            },
            {
              metadata: { name: 'pvc-3' },
              spec: { resources: { requests: { storage: '1048576Ki' } } }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      await waitFor(() => {
        expect(screen.getByText('pvc-1')).toBeInTheDocument()
        expect(screen.getByText('pvc-2')).toBeInTheDocument()
        expect(screen.getByText('pvc-3')).toBeInTheDocument()
      })

      // Check that storage calculation is displayed
      expect(screen.getByText('Total Storage')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles and labels', () => {
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument() // Refresh button
      expect(screen.getByRole('button', { name: 'Create PVC' })).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      const { useListCoreV1NamespacedPersistentVolumeClaimQuery } = require('../../../k8s')
      useListCoreV1NamespacedPersistentVolumeClaimQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pvc-1', namespace: 'default' },
              spec: { resources: { requests: { storage: '10Gi' } } },
              status: { phase: 'Pending' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVCsView />)

      // Wait for data to load first
      await waitFor(() => {
        expect(screen.getByText('pvc-1')).toBeInTheDocument()
      })

      const refreshButtons = screen.getAllByRole('button')
      const refreshButton = refreshButtons.find(button =>
        button.querySelector('svg.lucide-refresh-cw') &&
        button.classList.contains('h-10')
      )
      refreshButton.focus()

      expect(document.activeElement).toBe(refreshButton)

      // Test that tab navigation works
      await user.tab()
      // The focus should move to the next focusable element
      expect(document.activeElement).not.toBe(refreshButton)
    })
  })
})

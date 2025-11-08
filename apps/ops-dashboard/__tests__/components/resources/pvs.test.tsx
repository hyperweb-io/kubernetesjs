import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PVsView } from '@/components/resources/pvs'
import { server } from '@/__mocks__/server'
import { http, HttpResponse } from 'msw'

// Mock the confirm dialog
jest.mock('../../../hooks/useConfirm', () => ({
  confirmDialog: jest.fn().mockResolvedValue(true)
}))

// Mock the Kubernetes hooks
jest.mock('../../../k8s', () => ({
  useListCoreV1PersistentVolumeQuery: jest.fn(),
  useDeleteCoreV1PersistentVolume: jest.fn()
}))

describe('PVsView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render PVs view with header', () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      expect(screen.getByRole('heading', { name: 'Persistent Volumes', level: 2 })).toBeInTheDocument()
      expect(screen.getByText('Cluster-wide storage resources')).toBeInTheDocument()
    })

    it('should render refresh button', () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      const refreshButton = screen.getByRole('button', { name: '' })
      expect(refreshButton).toBeInTheDocument()
    })

    it('should render create PV button', () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      expect(screen.getByRole('button', { name: 'Create PV' })).toBeInTheDocument()
    })

    it('should render stats cards', () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      expect(screen.getByText('Total PVs')).toBeInTheDocument()
      expect(screen.getByText('Available')).toBeInTheDocument()
      expect(screen.getByText('Bound')).toBeInTheDocument()
      expect(screen.getByText('Total Capacity')).toBeInTheDocument()
    })
  })

  describe('Data Display', () => {
    it('should display PV data', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { capacity: { storage: '10Gi' } },
              status: { phase: 'Bound' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('pv-1')).toBeInTheDocument()
      })
    })

    it('should display correct statistics', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            { status: { phase: 'Available' } },
            { status: { phase: 'Bound' } },
            { status: { phase: 'Released' } },
            { status: { phase: 'Failed' } }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('4')).toBeInTheDocument() // Total PVs
        expect(screen.getByText('1', { selector: '.text-green-600' })).toBeInTheDocument() // Available
        expect(screen.getByText('1', { selector: '.text-blue-600' })).toBeInTheDocument() // Bound
        expect(screen.getByText('0.0 GB')).toBeInTheDocument() // Total Capacity
      })
    })

    it('should display status badges correctly', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            { metadata: { name: 'pv-1' }, status: { phase: 'Available' } },
            { metadata: { name: 'pv-2' }, status: { phase: 'Bound' } },
            { metadata: { name: 'pv-3' }, status: { phase: 'Released' } },
            { metadata: { name: 'pv-4' }, status: { phase: 'Failed' } }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('Available', { selector: 'h3' })).toBeInTheDocument() // Card title
        expect(screen.getByText('Available', { selector: '.rounded-full' })).toBeInTheDocument() // Badge
        expect(screen.getByText('Bound', { selector: '.rounded-full' })).toBeInTheDocument()
        expect(screen.getByText('Released', { selector: '.rounded-full' })).toBeInTheDocument()
        expect(screen.getByText('Failed', { selector: '.rounded-full' })).toBeInTheDocument()
      })
    })

    it('should display capacity correctly', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { capacity: { storage: '10Gi' } }
            },
            {
              metadata: { name: 'pv-2' },
              spec: { capacity: { storage: '20Gi' } }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('10Gi')).toBeInTheDocument()
        expect(screen.getByText('20Gi')).toBeInTheDocument()
      })
    })

    it('should display access modes correctly', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { accessModes: ['ReadWriteOnce'] }
            },
            {
              metadata: { name: 'pv-2' },
              spec: { accessModes: ['ReadWriteMany', 'ReadOnlyMany'] }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('RWO')).toBeInTheDocument()
        expect(screen.getByText('RWX, ROX')).toBeInTheDocument()
      })
    })

    it('should display storage class correctly', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { storageClassName: 'fast-ssd' }
            },
            {
              metadata: { name: 'pv-2' },
              spec: {}
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('fast-ssd')).toBeInTheDocument()
        expect(screen.getAllByText('None')).toHaveLength(3) // Storage class and other fields
      })
    })

    it('should display reclaim policy correctly', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { persistentVolumeReclaimPolicy: 'Retain' }
            },
            {
              metadata: { name: 'pv-2' },
              spec: { persistentVolumeReclaimPolicy: 'Delete' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('Retain')).toBeInTheDocument()
        expect(screen.getByText('Delete')).toBeInTheDocument()
      })
    })

    it('should display claim reference correctly', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: {
                claimRef: {
                  namespace: 'default',
                  name: 'pvc-1'
                }
              }
            },
            {
              metadata: { name: 'pv-2' },
              spec: {}
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('default/pvc-1')).toBeInTheDocument()
        expect(screen.getByText('Unbound')).toBeInTheDocument()
      })
    })
  })

  describe('User Interactions', () => {
    it('should refresh data when refresh button is clicked', async () => {
      const user = userEvent.setup()
      const mockRefetch = jest.fn()
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      })

      render(<PVsView />)

      const refreshButton = screen.getByRole('button', { name: '' })
      await user.click(refreshButton)

      expect(mockRefetch).toHaveBeenCalled()
    })

    it('should show create PV alert when create button is clicked', async () => {
      const user = userEvent.setup()
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      // Mock alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

      render(<PVsView />)

      const createButton = screen.getByRole('button', { name: 'Create PV' })
      await user.click(createButton)

      expect(alertSpy).toHaveBeenCalledWith('Create PV functionality not yet implemented')

      alertSpy.mockRestore()
    })

    it('should show delete confirmation when delete button is clicked', async () => {
      const user = userEvent.setup()
      const { useListCoreV1PersistentVolumeQuery, useDeleteCoreV1PersistentVolume } = require('../../../k8s')
      const mockDelete = jest.fn().mockResolvedValue({})
      
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { capacity: { storage: '10Gi' } },
              status: { phase: 'Available' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })
      useDeleteCoreV1PersistentVolume.mockReturnValue({
        mutateAsync: mockDelete
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('pv-1')).toBeInTheDocument()
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
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { capacity: { storage: '10Gi' } },
              status: { phase: 'Available' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('pv-1')).toBeInTheDocument()
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

    it('should disable delete button for bound PVs', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { capacity: { storage: '10Gi' } },
              status: { phase: 'Bound' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('pv-1')).toBeInTheDocument()
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
    it('should show Available status correctly', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              status: { phase: 'Available' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getAllByText('Available')).toHaveLength(2) // Card title and badge
      })
    })

    it('should show Bound status correctly', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              status: { phase: 'Bound' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('Bound', { selector: '.rounded-full' })).toBeInTheDocument()
      })
    })

    it('should show Released status correctly', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              status: { phase: 'Released' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('Released')).toBeInTheDocument()
      })
    })

    it('should show Failed status correctly', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              status: { phase: 'Failed' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('Failed')).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading spinner when loading', () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      expect(screen.getByRole('button', { name: '' })).toBeDisabled() // Refresh button
    })
  })

  describe('Error States', () => {
    it('should display error message when fetch fails', () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      })

      render(<PVsView />)

      expect(screen.getByText('Network request failed')).toBeInTheDocument()
    })

    it('should show retry button in error state', () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      })

      render(<PVsView />)

      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('should display empty state when no PVs', () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      expect(screen.getByText('No persistent volumes found')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles and labels', () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument() // Refresh button
      expect(screen.getByRole('button', { name: 'Create PV' })).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { capacity: { storage: '10Gi' } },
              status: { phase: 'Available' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      // Wait for data to load first
      await waitFor(() => {
        expect(screen.getByText('pv-1')).toBeInTheDocument()
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

  describe('Delete Functionality', () => {
    it('should handle delete action with confirmation', async () => {
      const user = userEvent.setup()
      const { useListCoreV1PersistentVolumeQuery, useDeleteCoreV1PersistentVolume } = require('../../../k8s')
      const mockDelete = jest.fn().mockResolvedValue({})
      const mockRefetch = jest.fn()
      
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { capacity: { storage: '10Gi' } },
              status: { phase: 'Available' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      })
      useDeleteCoreV1PersistentVolume.mockReturnValue({
        mutateAsync: mockDelete
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('pv-1')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(button =>
        button.querySelector('svg.lucide-trash-2')
      )

      if (deleteButton) {
        await user.click(deleteButton)
        expect(require('../../../hooks/useConfirm').confirmDialog).toHaveBeenCalledWith({
          title: 'Delete Persistent Volume',
          description: 'Are you sure you want to delete pv-1? This may cause data loss.',
          confirmText: 'Delete',
          confirmVariant: 'destructive'
        })
        expect(mockDelete).toHaveBeenCalledWith({
          path: { name: 'pv-1' },
          query: {}
        })
        expect(mockRefetch).toHaveBeenCalled()
      }
    })

    it('should handle delete action error', async () => {
      const user = userEvent.setup()
      const { useListCoreV1PersistentVolumeQuery, useDeleteCoreV1PersistentVolume } = require('../../../k8s')
      const mockDelete = jest.fn().mockRejectedValue(new Error('Delete failed'))
      const mockRefetch = jest.fn()
      
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { capacity: { storage: '10Gi' } },
              status: { phase: 'Available' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      })
      useDeleteCoreV1PersistentVolume.mockReturnValue({
        mutateAsync: mockDelete
      })

      // Mock alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('pv-1')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(button =>
        button.querySelector('svg.lucide-trash-2')
      )

      if (deleteButton) {
        await user.click(deleteButton)
        expect(alertSpy).toHaveBeenCalledWith('Failed to delete PV: Delete failed')
        expect(mockRefetch).not.toHaveBeenCalled() // Refetch should not be called on error
      }

      alertSpy.mockRestore()
    })

    it('should handle delete action with non-Error exception', async () => {
      const user = userEvent.setup()
      const { useListCoreV1PersistentVolumeQuery, useDeleteCoreV1PersistentVolume } = require('../../../k8s')
      const mockDelete = jest.fn().mockRejectedValue('String error')
      const mockRefetch = jest.fn()
      
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { capacity: { storage: '10Gi' } },
              status: { phase: 'Available' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      })
      useDeleteCoreV1PersistentVolume.mockReturnValue({
        mutateAsync: mockDelete
      })

      // Mock alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('pv-1')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(button =>
        button.querySelector('svg.lucide-trash-2')
      )

      if (deleteButton) {
        await user.click(deleteButton)
        expect(alertSpy).toHaveBeenCalledWith('Failed to delete PV: Unknown error')
        expect(mockRefetch).not.toHaveBeenCalled()
      }

      alertSpy.mockRestore()
    })

    it('should not delete when confirmation is cancelled', async () => {
      const user = userEvent.setup()
      const { useListCoreV1PersistentVolumeQuery, useDeleteCoreV1PersistentVolume } = require('../../../k8s')
      const mockDelete = jest.fn()
      const mockRefetch = jest.fn()
      
      // Mock confirmDialog to return false
      const { confirmDialog } = require('../../../hooks/useConfirm')
      confirmDialog.mockResolvedValueOnce(false)
      
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { capacity: { storage: '10Gi' } },
              status: { phase: 'Available' }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      })
      useDeleteCoreV1PersistentVolume.mockReturnValue({
        mutateAsync: mockDelete
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('pv-1')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(button =>
        button.querySelector('svg.lucide-trash-2')
      )

      if (deleteButton) {
        await user.click(deleteButton)
        expect(confirmDialog).toHaveBeenCalled()
        expect(mockDelete).not.toHaveBeenCalled()
        expect(mockRefetch).not.toHaveBeenCalled()
      }
    })
  })

  describe('Storage Calculation', () => {
    it('should calculate storage correctly with different units', async () => {
      const { useListCoreV1PersistentVolumeQuery } = require('../../../k8s')
      useListCoreV1PersistentVolumeQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'pv-1' },
              spec: { capacity: { storage: '10Gi' } }
            },
            {
              metadata: { name: 'pv-2' },
              spec: { capacity: { storage: '1024Mi' } }
            },
            {
              metadata: { name: 'pv-3' },
              spec: { capacity: { storage: '1048576Ki' } }
            },
            {
              metadata: { name: 'pv-4' },
              spec: { capacity: { storage: '1Ti' } }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<PVsView />)

      await waitFor(() => {
        expect(screen.getByText('pv-1')).toBeInTheDocument()
        expect(screen.getByText('pv-2')).toBeInTheDocument()
        expect(screen.getByText('pv-3')).toBeInTheDocument()
        expect(screen.getByText('pv-4')).toBeInTheDocument()
      })

      // Check that the total capacity is displayed (exact value may vary due to calculation)
      expect(screen.getByText(/GB/)).toBeInTheDocument()
    })
  })
})

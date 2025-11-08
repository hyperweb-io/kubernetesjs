import React from 'react'
import { render, screen, waitFor } from '../utils/test-utils'
import userEvent from '@testing-library/user-event'
import { CreateBackupDialog } from '@/components/create-backup-dialog'

// Mock AgentProvider
jest.mock('agentic-kit', () => ({
  AgentProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

describe('CreateBackupDialog', () => {
  const user = userEvent.setup()
  const mockOnOpenChange = jest.fn()
  const mockOnSubmit = jest.fn()

  const mockBackups = {
    isFetched: true,
    data: {
      configured: true,
      methodConfigured: 'barmanObjectStore',
      snapshotSupported: true
    }
  }

  const mockDatabaseStatus = {
    backups: {
      configured: true,
      scheduledCount: 3,
      lastBackupTime: '2024-01-01T10:00:00Z'
    },
    streaming: {
      configured: true,
      replicas: 2
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render dialog when open', () => {
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      expect(screen.getByRole('heading', { name: 'Create Backup' })).toBeInTheDocument()
      expect(screen.getByText('Protection')).toBeInTheDocument()
      expect(screen.getByText('Continuous Backup')).toBeInTheDocument()
      expect(screen.getByText('Streaming Replication')).toBeInTheDocument()
    })

    it('should not render when closed', () => {
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={false}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      expect(screen.queryByRole('heading', { name: 'Create Backup' })).not.toBeInTheDocument()
    })

    it('should display backup status information', () => {
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      expect(screen.getByText('Scheduled: 3, last: 2024-01-01T10:00:00Z')).toBeInTheDocument()
      expect(screen.getByText('2 replica(s)')).toBeInTheDocument()
    })

    it('should display not configured status when data is missing', () => {
      const emptyDatabaseStatus = {
        backups: { configured: false },
        streaming: { configured: false }
      }
      
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={emptyDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      expect(screen.getAllByText('Not configured')).toHaveLength(2)
    })
  })

  describe('Method Selection', () => {
    it('should render method selection dropdown', () => {
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should show all method options', async () => {
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      const select = screen.getByRole('combobox')
      await user.click(select)
      
      expect(screen.getAllByText('Auto')).toHaveLength(2) // Button and option
      expect(screen.getByText('BarmanObjectStore')).toBeInTheDocument()
      expect(screen.getByText('VolumeSnapshot')).toBeInTheDocument()
    })

    it('should disable options based on backup configuration', async () => {
      const limitedBackups = {
        isFetched: true,
        data: {
          configured: false,
          methodConfigured: 'volumeSnapshot',
          snapshotSupported: false
        }
      }
      
      render(
        <CreateBackupDialog
          backups={limitedBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      const select = screen.getByRole('combobox')
      await user.click(select)
      
      // BarmanObjectStore should be disabled
      const barmanOption = screen.getByText('BarmanObjectStore')
      expect(barmanOption.closest('[data-disabled]')).toBeInTheDocument()
      
      // VolumeSnapshot should be disabled
      const volumeOption = screen.getByText('VolumeSnapshot')
      expect(volumeOption.closest('[data-disabled]')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should change method selection', async () => {
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      const select = screen.getByRole('combobox')
      await user.click(select)
      
      const barmanOption = screen.getByText('BarmanObjectStore')
      await user.click(barmanOption)
      
      expect(select).toHaveTextContent('BarmanObjectStore')
    })

    it('should submit with selected method', async () => {
      mockOnSubmit.mockResolvedValue(undefined)
      
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      const select = screen.getByRole('combobox')
      await user.click(select)
      
      const barmanOption = screen.getByText('BarmanObjectStore')
      await user.click(barmanOption)
      
      const createButton = screen.getByRole('button', { name: 'Create Backup' })
      await user.click(createButton)
      
      expect(mockOnSubmit).toHaveBeenCalledWith('barmanObjectStore')
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })

    it('should submit with auto method (undefined)', async () => {
      mockOnSubmit.mockResolvedValue(undefined)
      
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      const createButton = screen.getByRole('button', { name: 'Create Backup' })
      await user.click(createButton)
      
      expect(mockOnSubmit).toHaveBeenCalledWith(undefined)
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })

    it('should cancel when cancel button is clicked', async () => {
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)
      
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Loading States', () => {
    it('should show loading state when submitting', async () => {
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      const createButton = screen.getByRole('button', { name: 'Create Backup' })
      await user.click(createButton)
      
      expect(screen.getByText('Creating…')).toBeInTheDocument()
      expect(createButton).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    })
  })

  describe('Error Handling', () => {
    it('should show error when submission fails', async () => {
      const errorMessage = 'Failed to create backup'
      mockOnSubmit.mockRejectedValue(new Error(errorMessage))
      
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      const createButton = screen.getByRole('button', { name: 'Create Backup' })
      await user.click(createButton)
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
      
      expect(mockOnOpenChange).not.toHaveBeenCalled()
    })

    it('should show generic error for non-Error exceptions', async () => {
      mockOnSubmit.mockRejectedValue('String error')
      
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      const createButton = screen.getByRole('button', { name: 'Create Backup' })
      await user.click(createButton)
      
      await waitFor(() => {
        expect(screen.getByText('Failed to create backup')).toBeInTheDocument()
      })
    })
  })

  describe('Button States', () => {
    it('should disable create button when no valid method is available', () => {
      const noBackups = {
        isFetched: true,
        data: {
          configured: false,
          methodConfigured: 'none',
          snapshotSupported: false
        }
      }
      
      render(
        <CreateBackupDialog
          backups={noBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      const createButton = screen.getByRole('button', { name: 'Create Backup' })
      expect(createButton).toBeDisabled()
    })

    it('should show appropriate tooltip for disabled button', () => {
      const noBackups = {
        isFetched: true,
        data: {
          configured: false,
          methodConfigured: 'none',
          snapshotSupported: false
        }
      }
      
      render(
        <CreateBackupDialog
          backups={noBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      const createButton = screen.getByRole('button', { name: 'Create Backup' })
      expect(createButton).toHaveAttribute('title', 'Configure backups (barman) or install VolumeSnapshot CRDs')
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels and roles', () => {
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create Backup' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      render(
        <CreateBackupDialog
          backups={mockBackups}
          open={true}
          databaseStatus={mockDatabaseStatus}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      )
      
      const select = screen.getByRole('combobox')
      select.focus()
      
      expect(document.activeElement).toBe(select)
      
      await user.keyboard('{Tab}')
      expect(document.activeElement).not.toBe(select)
    })
  })
})

import React from 'react'
import { render, screen, waitFor } from '../utils/test-utils'
import userEvent from '@testing-library/user-event'
import { CreateDatabasesDialog } from '../../components/create-databases-dialog'

describe('CreateDatabasesDialog', () => {
  const mockOnOpenChange = jest.fn()
  const mockOnSubmit = jest.fn()

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onSubmit: mockOnSubmit,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render dialog when open', () => {
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Create PostgreSQL (CloudNativePG)' })).toBeInTheDocument()
    })

    it('should not render when closed', () => {
      render(<CreateDatabasesDialog {...defaultProps} open={false} />)
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should display all form fields with default values', () => {
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      // Check instances field - use getAllByRole and select first one
      const instancesInputs = screen.getAllByRole('spinbutton')
      const instancesInput = instancesInputs[0] // First one is "Instances"
      expect(instancesInput).toBeInTheDocument()
      expect(instancesInput).toHaveValue(1)
      
      // Check storage field
      const storageInput = screen.getByDisplayValue('1Gi')
      expect(storageInput).toBeInTheDocument()
      
      // Check app username field
      const appUsernameInput = screen.getByDisplayValue('appuser')
      expect(appUsernameInput).toBeInTheDocument()
      
      // Check app password field
      const appPasswordInput = screen.getByDisplayValue('appuser123!')
      expect(appPasswordInput).toBeInTheDocument()
      expect(appPasswordInput).toHaveAttribute('type', 'password')
      
      // Check superuser password field
      const superuserPasswordInput = screen.getByDisplayValue('postgres123!')
      expect(superuserPasswordInput).toBeInTheDocument()
      expect(superuserPasswordInput).toHaveAttribute('type', 'password')
      
      // Check pooler checkbox
      const poolerCheckbox = screen.getByRole('checkbox', { name: /enable pgbouncer pooler/i })
      expect(poolerCheckbox).toBeInTheDocument()
      expect(poolerCheckbox).toBeChecked()
    })

    it('should show pooler fields when pooler is enabled', () => {
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      // Pooler fields should be visible when checkbox is checked
      expect(screen.getByDisplayValue('postgres-pooler')).toBeInTheDocument()
      const poolerInstancesInputs = screen.getAllByRole('spinbutton')
      expect(poolerInstancesInputs[1]).toBeInTheDocument() // Second spinbutton is "Pooler Instances"
    })
  })

  describe('Form Interactions', () => {
    it('should update instances field', async () => {
      const user = userEvent.setup()
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      const instancesInputs = screen.getAllByRole('spinbutton')
      const instancesInput = instancesInputs[0] // First one is "Instances"
      
      // Triple click to select all, then type to replace
      await user.tripleClick(instancesInput)
      await user.keyboard('3')
      
      expect(instancesInput).toHaveValue(3)
    })

    it('should update storage field', async () => {
      const user = userEvent.setup()
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      const storageInput = screen.getByDisplayValue('1Gi')
      await user.clear(storageInput)
      await user.type(storageInput, '10Gi')
      
      expect(storageInput).toHaveValue('10Gi')
    })

    it('should toggle pooler checkbox', async () => {
      const user = userEvent.setup()
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      const poolerCheckbox = screen.getByRole('checkbox', { name: /enable pgbouncer pooler/i })
      
      // Initially checked
      expect(poolerCheckbox).toBeChecked()
      
      // Uncheck
      await user.click(poolerCheckbox)
      expect(poolerCheckbox).not.toBeChecked()
      
      // Check again
      await user.click(poolerCheckbox)
      expect(poolerCheckbox).toBeChecked()
    })
  })

  describe('Form Submission', () => {
    it('should submit with valid data', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockResolvedValue(undefined)
      
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      const createButton = screen.getByRole('button', { name: /create/i })
      await user.click(createButton)
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        instances: 1,
        storage: '1Gi',
        storageClass: '',
        appUsername: 'appuser',
        appPassword: 'appuser123!',
        superuserPassword: 'postgres123!',
        enablePooler: true,
        poolerName: 'postgres-pooler',
        poolerInstances: 1,
      })
    })

    it('should show loading state during submission', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      const createButton = screen.getByRole('button', { name: /create/i })
      await user.click(createButton)
      
      expect(screen.getByRole('button', { name: /creating/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
    })

    it('should close dialog after successful submission', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockResolvedValue(undefined)
      
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      const createButton = screen.getByRole('button', { name: /create/i })
      await user.click(createButton)
      
      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('Validation', () => {
    it('should show error for empty app username', async () => {
      const user = userEvent.setup()
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      const appUsernameInput = screen.getByDisplayValue('appuser')
      await user.clear(appUsernameInput)
      
      const createButton = screen.getByRole('button', { name: /create/i })
      await user.click(createButton)
      
      expect(screen.getByText('App username is required')).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should show error when submission fails', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockRejectedValue(new Error('Database creation failed'))
      
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      const createButton = screen.getByRole('button', { name: /create/i })
      await user.click(createButton)
      
      await waitFor(() => {
        expect(screen.getByText('Database creation failed')).toBeInTheDocument()
      })
    })

    it('should show generic error for non-Error exceptions', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockRejectedValue('String error')
      
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      const createButton = screen.getByRole('button', { name: /create/i })
      await user.click(createButton)
      
      await waitFor(() => {
        expect(screen.getByText('Failed to create database')).toBeInTheDocument()
      })
    })
  })

  describe('Cancel Functionality', () => {
    it('should close dialog when cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)
      
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels and roles', () => {
      render(<CreateDatabasesDialog {...defaultProps} />)
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Create PostgreSQL (CloudNativePG)' })).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: /enable pgbouncer pooler/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
    })
  })
})
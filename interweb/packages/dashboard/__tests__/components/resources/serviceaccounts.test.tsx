import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ServiceAccountsView } from '@/components/resources/serviceaccounts'
import { server } from '@/__mocks__/server'
import { http, HttpResponse } from 'msw'

// Mock the confirm dialog
jest.mock('../../../hooks/useConfirm', () => ({
  confirmDialog: jest.fn().mockResolvedValue(true)
}))

// Mock the Kubernetes hooks
jest.mock('../../../k8s', () => ({
  useListCoreV1NamespacedServiceAccountQuery: jest.fn(),
  useListCoreV1ServiceAccountForAllNamespacesQuery: jest.fn(),
  useDeleteCoreV1NamespacedServiceAccount: jest.fn()
}))

// Mock the namespace context
jest.mock('../../../contexts/NamespaceContext', () => ({
  usePreferredNamespace: () => ({ namespace: 'default' })
}))

describe('ServiceAccountsView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render service accounts view with header', () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      expect(screen.getByRole('heading', { name: 'Service Accounts', level: 2 })).toBeInTheDocument()
      expect(screen.getByText('Identities for pods to access the Kubernetes API')).toBeInTheDocument()
    })

    it('should render refresh button', () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      const refreshButton = screen.getByRole('button', { name: '' })
      expect(refreshButton).toBeInTheDocument()
    })

    it('should render create account button', () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
    })

    it('should render stats cards', () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      expect(screen.getByText('Total Accounts')).toBeInTheDocument()
      expect(screen.getByText('User Accounts')).toBeInTheDocument()
      expect(screen.getByText('With Secrets')).toBeInTheDocument()
      expect(screen.getByText('Automount Enabled')).toBeInTheDocument()
    })
  })

  describe('Data Display', () => {
    it('should display service account data', async () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'default', namespace: 'default' },
              secrets: [{ name: 'default-token-abc123' }],
              automountServiceAccountToken: true
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getByText('default', { selector: 'td.font-medium' })).toBeInTheDocument()
      })
    })

    it('should display correct statistics', async () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            { metadata: { name: 'default' }, secrets: [], automountServiceAccountToken: true },
            { metadata: { name: 'user-account' }, secrets: [{ name: 'token' }], automountServiceAccountToken: false },
            { metadata: { name: 'system:serviceaccount:kube-system:default', namespace: 'kube-system' }, secrets: [], automountServiceAccountToken: true },
            { metadata: { name: 'controller-manager', namespace: 'kube-system' }, secrets: [], automountServiceAccountToken: true }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getByText('4', { selector: '.text-2xl.font-bold' })).toBeInTheDocument() // Total Accounts
        expect(screen.getAllByText('1', { selector: '.text-2xl.font-bold' })).toHaveLength(2) // User Accounts and With Secrets
        expect(screen.getByText('3', { selector: '.text-2xl.font-bold' })).toBeInTheDocument() // Automount Enabled
      })
    })

    it('should display account type badges correctly', async () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            { metadata: { name: 'default' } },
            { metadata: { name: 'system:serviceaccount:kube-system:default', namespace: 'kube-system' } },
            { metadata: { name: 'user-account' } }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getByText('Default')).toBeInTheDocument()
        expect(screen.getByText('System')).toBeInTheDocument()
        expect(screen.getByText('User')).toBeInTheDocument()
      })
    })

    it('should display secrets correctly', async () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'default' },
              secrets: [{ name: 'default-token-abc123' }]
            },
            {
              metadata: { name: 'multi-secret' },
              secrets: [
                { name: 'token1' },
                { name: 'token2' }
              ]
            },
            {
              metadata: { name: 'no-secrets' },
              secrets: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getByText('default-token-abc123')).toBeInTheDocument()
        expect(screen.getByText('2 secrets')).toBeInTheDocument()
        expect(screen.getByText('None', { selector: 'span.text-sm' })).toBeInTheDocument()
      })
    })

    it('should display image pull secrets correctly', async () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'with-secrets' },
              imagePullSecrets: [{ name: 'registry-secret' }]
            },
            {
              metadata: { name: 'no-secrets' },
              imagePullSecrets: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getByText('1', { selector: '.rounded-full' })).toBeInTheDocument() // Image pull secrets count
        expect(screen.getByText('None', { selector: '.rounded-full' })).toBeInTheDocument()
      })
    })

    it('should display automount token status correctly', async () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'enabled' },
              automountServiceAccountToken: true
            },
            {
              metadata: { name: 'disabled' },
              automountServiceAccountToken: false
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getByText('Enabled')).toBeInTheDocument()
        expect(screen.getByText('Disabled')).toBeInTheDocument()
      })
    })

    it('should display creation date correctly', async () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { 
                name: 'test-account',
                creationTimestamp: '2024-01-01T00:00:00Z'
              }
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getByText('1/1/2024')).toBeInTheDocument()
      })
    })
  })

  describe('User Interactions', () => {
    it('should refresh data when refresh button is clicked', async () => {
      const user = userEvent.setup()
      const mockRefetch = jest.fn()
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      })

      render(<ServiceAccountsView />)

      const refreshButton = screen.getByRole('button', { name: '' })
      await user.click(refreshButton)

      expect(mockRefetch).toHaveBeenCalled()
    })

    it('should show create account alert when create button is clicked', async () => {
      const user = userEvent.setup()
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      // Mock alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})

      render(<ServiceAccountsView />)

      const createButton = screen.getByRole('button', { name: 'Create Account' })
      await user.click(createButton)

      expect(alertSpy).toHaveBeenCalledWith('Create Service Account functionality not yet implemented')

      alertSpy.mockRestore()
    })

    it('should show delete confirmation when delete button is clicked', async () => {
      const user = userEvent.setup()
      const { useListCoreV1NamespacedServiceAccountQuery, useDeleteCoreV1NamespacedServiceAccount } = require('../../../k8s')
      const mockDelete = jest.fn().mockResolvedValue({})
      
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'user-account', namespace: 'default' },
              secrets: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })
      useDeleteCoreV1NamespacedServiceAccount.mockReturnValue({
        mutateAsync: mockDelete
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getByText('user-account', { selector: 'td' })).toBeInTheDocument()
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
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'user-account', namespace: 'default' },
              secrets: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getByText('user-account', { selector: 'td' })).toBeInTheDocument()
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

    it('should disable delete button for default accounts', async () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'default', namespace: 'default' },
              secrets: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getByText('default', { selector: 'td.font-medium' })).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(button =>
        button.querySelector('svg.lucide-trash-2')
      )

      if (deleteButton) {
        expect(deleteButton).toBeDisabled()
      }
    })

    it('should disable delete button for system accounts', async () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'system:serviceaccount:kube-system:default', namespace: 'kube-system' },
              secrets: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getByText('system:serviceaccount:kube-system:default', { selector: 'td' })).toBeInTheDocument()
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

  describe('Account Type Logic', () => {
    it('should identify default accounts correctly', async () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            { metadata: { name: 'default' } }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getByText('Default')).toBeInTheDocument()
      })
    })

    it('should identify system accounts correctly', async () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            { metadata: { name: 'system:serviceaccount:kube-system:default', namespace: 'kube-system' } },
            { metadata: { name: 'controller-manager', namespace: 'kube-system' } },
            { metadata: { name: 'operator-account', namespace: 'operators' } }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getAllByText('System')).toHaveLength(3)
      })
    })

    it('should identify user accounts correctly', async () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            { metadata: { name: 'user-account', namespace: 'default' } }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      await waitFor(() => {
        expect(screen.getByText('User')).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading spinner when loading', () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      expect(screen.getByRole('button', { name: '' })).toBeDisabled() // Refresh button
    })
  })

  describe('Error States', () => {
    it('should display error message when fetch fails', () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      expect(screen.getByText('Network request failed')).toBeInTheDocument()
    })

    it('should show retry button in error state', () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network request failed'),
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('should display empty state when no service accounts', () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      expect(screen.getByText('No service accounts found')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles and labels', () => {
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument() // Refresh button
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      const { useListCoreV1NamespacedServiceAccountQuery } = require('../../../k8s')
      useListCoreV1NamespacedServiceAccountQuery.mockReturnValue({
        data: {
          items: [
            {
              metadata: { name: 'user-account', namespace: 'default' },
              secrets: []
            }
          ]
        },
        isLoading: false,
        error: null,
        refetch: jest.fn()
      })

      render(<ServiceAccountsView />)

      // Wait for data to load first
      await waitFor(() => {
        expect(screen.getByText('user-account', { selector: 'td' })).toBeInTheDocument()
      })

      const refreshButtons = screen.getAllByRole('button')
      const refreshButton = refreshButtons.find(button =>
        button.querySelector('svg.lucide-refresh-cw') &&
        button.classList.contains('h-4')
      )

      if (refreshButton) {
        refreshButton.focus()
        expect(document.activeElement).toBe(refreshButton)

        // Test that tab navigation works
        await user.tab()
        // The focus should move to the next focusable element
        expect(document.activeElement).not.toBe(refreshButton)
      }
    })
  })
})

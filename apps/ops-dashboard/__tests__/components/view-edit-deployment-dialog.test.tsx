import React from 'react'
import { render, screen, waitFor, cleanup } from '../utils/test-utils'
import userEvent from '@testing-library/user-event'
import { ViewEditDeploymentDialog } from '@/components/view-edit-deployment-dialog'
import type { AppsV1Deployment as Deployment } from '@kubernetesjs/ops'

// Mock the YAMLEditor component
jest.mock('../../components/yaml-editor', () => ({
  YAMLEditor: ({ value, onChange, height, readOnly }: { 
    value: string; 
    onChange: (value: string) => void; 
    height: string; 
    readOnly?: boolean;
  }) => (
    <textarea
      data-testid="yaml-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ height }}
      readOnly={readOnly}
      placeholder="YAML content"
    />
  )
}))

// Mock js-yaml
jest.mock('js-yaml', () => ({
  dump: jest.fn((obj) => 'mocked yaml content'),
  load: jest.fn((yaml) => ({ apiVersion: 'apps/v1', kind: 'Deployment' }))
}))

// Mock the React Query hook
jest.mock('../../k8s', () => ({
  useReadAppsV1NamespacedDeploymentQuery: jest.fn(() => ({
    data: {
      metadata: { name: 'test-deployment', namespace: 'default' },
      spec: { replicas: 3 },
      status: { readyReplicas: 3 }
    },
    isLoading: false,
    error: null
  }))
}))

const mockDeployment: Deployment = {
  metadata: {
    name: 'test-deployment',
    namespace: 'default',
    uid: 'test-uid'
  },
  spec: {
    replicas: 3,
    selector: { matchLabels: { app: 'test' } },
    template: {
      metadata: { labels: { app: 'test' } },
      spec: { containers: [{ name: 'test', image: 'nginx:latest' }] }
    }
  },
  status: {
    replicas: 3,
    readyReplicas: 3,
    availableReplicas: 3
  }
}

describe('ViewEditDeploymentDialog', () => {
  const mockOnOpenChange = jest.fn()
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    cleanup()
    
    // Reset fetch mock
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          metadata: { name: 'test-deployment', namespace: 'default' },
          spec: { replicas: 3 },
          status: { readyReplicas: 3 }
        }),
      })
    ) as jest.Mock
  })

  describe('Basic Rendering', () => {
    it('should render dialog when open with deployment', () => {
      render(
        <ViewEditDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          mode="view"
        />
      )

      expect(screen.getByText('View Deployment: test-deployment')).toBeInTheDocument()
      expect(screen.getByText('Viewing deployment configuration in YAML format')).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /view/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /edit/i })).toBeInTheDocument()
    })

    it('should not render dialog when closed', () => {
      render(
        <ViewEditDeploymentDialog
          deployment={mockDeployment}
          open={false}
          onOpenChange={mockOnOpenChange}
          mode="view"
        />
      )

      expect(screen.queryByText('View Deployment: test-deployment')).not.toBeInTheDocument()
    })

    it('should not render when deployment is null', () => {
      render(
        <ViewEditDeploymentDialog
          deployment={null}
          open={true}
          onOpenChange={mockOnOpenChange}
          mode="view"
        />
      )

      expect(screen.queryByText('View Deployment:')).not.toBeInTheDocument()
    })

    it('should show edit mode when initial mode is edit', () => {
      render(
        <ViewEditDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          mode="edit"
          onSubmit={mockOnSubmit}
        />
      )

      expect(screen.getByText('Edit Deployment: test-deployment')).toBeInTheDocument()
      expect(screen.getByText('Edit deployment configuration using YAML')).toBeInTheDocument()
    })
  })

  describe('Data Loading', () => {
    it('should fetch deployment data when opened', async () => {
      render(
        <ViewEditDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          mode="view"
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('yaml-editor')).toBeInTheDocument()
      })
    })

    it('should show loading state while fetching data', () => {
      // Mock loading state
      const { useReadAppsV1NamespacedDeploymentQuery } = require('../../k8s')
      useReadAppsV1NamespacedDeploymentQuery.mockReturnValue({
        data: null,
        isLoading: true,
        error: null
      })

      render(
        <ViewEditDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          mode="view"
        />
      )

      expect(screen.getByText('Loading deployment...')).toBeInTheDocument()
    })

    it('should show error when fetch fails', async () => {
      // Mock error state
      const { useReadAppsV1NamespacedDeploymentQuery } = require('../../k8s')
      useReadAppsV1NamespacedDeploymentQuery.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Network error')
      })

      render(
        <ViewEditDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          mode="view"
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Failed to load deployment data')).toBeInTheDocument()
      })
    })
  })

  describe('Tab Switching', () => {
    it('should switch between view and edit tabs', async () => {
      const user = userEvent.setup()
      render(
        <ViewEditDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          mode="view"
          onSubmit={mockOnSubmit}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('yaml-editor')).toBeInTheDocument()
      })

      // Switch to edit tab
      const editTab = screen.getByRole('tab', { name: /edit/i })
      await user.click(editTab)

      expect(screen.getByText('Edit Deployment: test-deployment')).toBeInTheDocument()
      expect(screen.getByText('Edit deployment configuration using YAML')).toBeInTheDocument()
    })

    it('should show save button only in edit mode', async () => {
      const user = userEvent.setup()
      render(
        <ViewEditDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          mode="view"
          onSubmit={mockOnSubmit}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('yaml-editor')).toBeInTheDocument()
      })

      // In view mode, no save button
      expect(screen.queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument()

      // Switch to edit mode
      const editTab = screen.getByRole('tab', { name: /edit/i })
      await user.click(editTab)

      // Now save button should appear
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should handle cancel button click', async () => {
      const user = userEvent.setup()
      render(
        <ViewEditDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          mode="view"
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('yaml-editor')).toBeInTheDocument()
      })

      // Use getAllByRole to get all close buttons and click the first one
      const cancelButtons = screen.getAllByRole('button', { name: /close/i })
      await user.click(cancelButtons[0])

      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })

    it('should handle successful submission in edit mode', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockResolvedValue(undefined)

      render(
        <ViewEditDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          mode="edit"
          onSubmit={mockOnSubmit}
        />
      )

      // Wait for YAML editor to be rendered
      await waitFor(() => {
        expect(screen.getByTestId('yaml-editor')).toBeInTheDocument()
      })

      // Type some content in the YAML editor
      const yamlEditor = screen.getByTestId('yaml-editor')
      await user.type(yamlEditor, 'test yaml content')

      const saveButton = screen.getByRole('button', { name: /save changes/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('test yaml content')
        expect(mockOnOpenChange).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('YAML Editor Behavior', () => {
    it('should make YAML editor read-only in view mode', async () => {
      render(
        <ViewEditDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          mode="view"
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('yaml-editor')).toBeInTheDocument()
      })

      const yamlEditor = screen.getByTestId('yaml-editor')
      expect(yamlEditor).toHaveAttribute('readOnly')
    })

    it('should make YAML editor editable in edit mode', async () => {
      render(
        <ViewEditDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          mode="edit"
          onSubmit={mockOnSubmit}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('yaml-editor')).toBeInTheDocument()
      })

      const yamlEditor = screen.getByTestId('yaml-editor')
      expect(yamlEditor).not.toHaveAttribute('readOnly')
    })

    it('should handle YAML content changes in edit mode', async () => {
      const user = userEvent.setup()
      render(
        <ViewEditDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          mode="edit"
          onSubmit={mockOnSubmit}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('yaml-editor')).toBeInTheDocument()
      })

      const yamlEditor = screen.getByTestId('yaml-editor')
      // Clear the existing content and type new content
      await user.clear(yamlEditor)
      await user.type(yamlEditor, 'new yaml content')

      // The value should be updated through the onChange handler
      expect(yamlEditor.value).toBe('new yaml content')
    })
  })
})
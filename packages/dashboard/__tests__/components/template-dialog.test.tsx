import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TemplateDialog } from '../../components/templates/template-dialog'

// Mock the Kubernetes hooks
jest.mock('../../k8s', () => ({
  useCreateAppsV1NamespacedDeployment: () => ({
    mutateAsync: jest.fn().mockResolvedValue({})
  }),
  useCreateCoreV1NamespacedService: () => ({
    mutateAsync: jest.fn().mockResolvedValue({})
  })
}))

// Mock the namespace context
jest.mock('../../contexts/NamespaceContext', () => ({
  usePreferredNamespace: () => ({
    namespace: 'default'
  })
}))

const mockTemplate = {
  id: 'postgres',
  name: 'PostgreSQL',
  description: 'PostgreSQL database with pgvector extension',
  icon: () => <div data-testid="postgres-icon">Database</div>,
  details: {
    image: 'pyramation/pgvector:13.3-alpine',
    ports: [5432],
    environment: {
      POSTGRES_USER: 'postgres',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_DB: 'postgres'
    }
  }
}

const mockTemplateWithoutEnv = {
  id: 'ollama',
  name: 'Ollama',
  description: 'Run large language models locally',
  icon: () => <div data-testid="ollama-icon">CPU</div>,
  details: {
    image: 'ollama/ollama:latest',
    ports: [11434]
  }
}

describe('TemplateDialog', () => {
  const mockOnOpenChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render dialog when open', () => {
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Deploy PostgreSQL' })).toBeInTheDocument()
    })

    it('should not render when closed', () => {
      render(
        <TemplateDialog
          template={mockTemplate}
          open={false}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should display template details', () => {
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      expect(screen.getByText('Configure and deploy the PostgreSQL template to your Kubernetes cluster.')).toBeInTheDocument()
      expect(screen.getByText('pyramation/pgvector:13.3-alpine')).toBeInTheDocument()
      expect(screen.getByText('5432')).toBeInTheDocument()
    })

    it('should display environment variables when present', () => {
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      expect(screen.getByText('POSTGRES_USER: postgres')).toBeInTheDocument()
      expect(screen.getByText('POSTGRES_PASSWORD: ••••••••')).toBeInTheDocument()
      expect(screen.getByText('POSTGRES_DB: postgres')).toBeInTheDocument()
    })

    it('should not display environment section when not present', () => {
      render(
        <TemplateDialog
          template={mockTemplateWithoutEnv}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      expect(screen.queryByText('Environment:')).not.toBeInTheDocument()
    })

    it('should initialize form with default values', () => {
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      expect(screen.getByDisplayValue('postgres-deployment')).toBeInTheDocument()
      expect(screen.getByDisplayValue('default')).toBeInTheDocument()
    })
  })

  describe('Form Interactions', () => {
    it('should update deployment name', async () => {
      const user = userEvent.setup()
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      const nameInput = screen.getByDisplayValue('postgres-deployment')
      await user.clear(nameInput)
      await user.type(nameInput, 'my-postgres')
      
      expect(nameInput).toHaveValue('my-postgres')
    })

    it('should update namespace', async () => {
      const user = userEvent.setup()
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      const namespaceInput = screen.getByDisplayValue('default')
      await user.clear(namespaceInput)
      await user.type(namespaceInput, 'my-namespace')
      
      expect(namespaceInput).toHaveValue('my-namespace')
    })
  })

  describe('Deployment Process', () => {
    it('should show success message after deployment', async () => {
      const user = userEvent.setup()
      const { mutateAsync: createDeployment } = require('../../k8s').useCreateAppsV1NamespacedDeployment()
      const { mutateAsync: createService } = require('../../k8s').useCreateCoreV1NamespacedService()
      
      createDeployment.mockResolvedValue({})
      createService.mockResolvedValue({})
      
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      const deployButton = screen.getByRole('button', { name: /deploy/i })
      await user.click(deployButton)
      
      await waitFor(() => {
        expect(screen.getByText('PostgreSQL deployed successfully!')).toBeInTheDocument()
      })
    })

  })

  describe('Form Validation', () => {
    it('should disable deploy button when name is empty', async () => {
      const user = userEvent.setup()
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      const nameInput = screen.getByDisplayValue('postgres-deployment')
      await user.clear(nameInput)
      
      expect(screen.getByRole('button', { name: /deploy/i })).toBeDisabled()
    })

    it('should disable deploy button when namespace is empty', async () => {
      const user = userEvent.setup()
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      const namespaceInput = screen.getByDisplayValue('default')
      await user.clear(namespaceInput)
      
      expect(screen.getByRole('button', { name: /deploy/i })).toBeDisabled()
    })
  })

  describe('Cancel Functionality', () => {
    it('should close dialog when cancel is clicked', async () => {
      const user = userEvent.setup()
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)
      
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Template-specific Behavior', () => {
    it('should render MinIO template correctly', () => {
      const minioTemplate = {
        ...mockTemplate,
        id: 'minio',
        name: 'MinIO',
        details: {
          image: 'minio/minio:latest',
          ports: [9000],
          environment: {
            MINIO_ROOT_USER: 'admin',
            MINIO_ROOT_PASSWORD: 'password'
          }
        }
      }
      
      render(
        <TemplateDialog
          template={minioTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      expect(screen.getByRole('heading', { name: 'Deploy MinIO' })).toBeInTheDocument()
      expect(screen.getByText('minio/minio:latest')).toBeInTheDocument()
      expect(screen.getByText('9000')).toBeInTheDocument()
      expect(screen.getByText('MINIO_ROOT_USER: admin')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels and roles', () => {
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Deploy PostgreSQL' })).toBeInTheDocument()
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Namespace')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /deploy/i })).toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      )
      
      const nameInput = screen.getByLabelText('Name')
      nameInput.focus()
      
      expect(document.activeElement).toBe(nameInput)
      
      await user.tab()
      expect(document.activeElement).toBe(screen.getByLabelText('Namespace'))
      
      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /cancel/i }))
      
      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /deploy/i }))
    })
  })
})
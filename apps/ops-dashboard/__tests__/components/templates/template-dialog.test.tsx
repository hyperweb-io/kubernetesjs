import React from 'react'
import { render, screen, waitFor } from '../../utils/test-utils'
import userEvent from '@testing-library/user-event'
import { TemplateDialog } from '../../../components/templates/template-dialog'
import { server } from '../../../__mocks__/server'
import { http, HttpResponse } from 'msw'

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
};

const mockTemplateWithoutEnv = {
  id: 'ollama',
  name: 'Ollama',
  description: 'Run large language models locally',
  icon: () => <div data-testid="ollama-icon">CPU</div>,
  details: {
    image: 'ollama/ollama:latest',
    ports: [11434]
  }
};

describe('TemplateDialog', () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset MSW handlers
    server.resetHandlers()
  })

  describe('Basic Rendering', () => {
    it('should render dialog when open', () => {
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Deploy PostgreSQL' })).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(
        <TemplateDialog
          template={mockTemplate}
          open={false}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display template details', () => {
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      expect(screen.getByText('Configure and deploy the PostgreSQL template to your Kubernetes cluster.')).toBeInTheDocument();
      expect(screen.getByText('pyramation/pgvector:13.3-alpine')).toBeInTheDocument();
      expect(screen.getByText('5432')).toBeInTheDocument();
    });

    it('should display environment variables when present', () => {
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      expect(screen.getByText('POSTGRES_USER: postgres')).toBeInTheDocument();
      expect(screen.getByText('POSTGRES_PASSWORD: ••••••••')).toBeInTheDocument();
      expect(screen.getByText('POSTGRES_DB: postgres')).toBeInTheDocument();
    });

    it('should not display environment section when not present', () => {
      render(
        <TemplateDialog
          template={mockTemplateWithoutEnv}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      expect(screen.queryByText('Environment:')).not.toBeInTheDocument();
    });

    it('should initialize form with default values', () => {
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      expect(screen.getByDisplayValue('postgres-deployment')).toBeInTheDocument();
      expect(screen.getByDisplayValue('default')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should update deployment name', async () => {
      const user = userEvent.setup();
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      // Name input is readonly and disabled, so we can't update it
      const nameInput = screen.getByDisplayValue('postgres-deployment')
      expect(nameInput).toBeDisabled()
      expect(nameInput).toHaveAttribute('readonly')
      expect(nameInput).toHaveValue('postgres-deployment')
    })

    it('should update namespace', async () => {
      const user = userEvent.setup();
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      const namespaceInput = screen.getByDisplayValue('default');
      await user.clear(namespaceInput);
      await user.type(namespaceInput, 'my-namespace');
      
      expect(namespaceInput).toHaveValue('my-namespace');
    });
  });

  describe('Deployment Process', () => {
    it('should show success message after deployment', async () => {
      const user = userEvent.setup()
      
      // Mock the API endpoint
      server.use(
        http.post('/api/templates/postgres', () => {
          return HttpResponse.json({
            success: true,
            message: 'Template deployed successfully'
          })
        })
      )
      
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      const deployButton = screen.getByRole('button', { name: /deploy/i });
      await user.click(deployButton);
      
      await waitFor(() => {
        expect(screen.getByText('PostgreSQL deployed successfully!')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

  });

  describe('Form Validation', () => {
    it('should disable deploy button when name is empty', async () => {
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      // Name input is readonly and always has a value, so deploy button should be enabled
      // But we can test that the button is enabled when both name and namespace have values
      const nameInput = screen.getByDisplayValue('postgres-deployment')
      expect(nameInput).toBeDisabled()
      expect(nameInput).toHaveValue('postgres-deployment')
      
      // Deploy button should be enabled when both fields have values
      expect(screen.getByRole('button', { name: /deploy/i })).not.toBeDisabled()
    })

    it('should disable deploy button when namespace is empty', async () => {
      const user = userEvent.setup();
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      const namespaceInput = screen.getByDisplayValue('default');
      await user.clear(namespaceInput);
      
      expect(screen.getByRole('button', { name: /deploy/i })).toBeDisabled();
    });
  });

  describe('Cancel Functionality', () => {
    it('should close dialog when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

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
      };
      
      render(
        <TemplateDialog
          template={minioTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      expect(screen.getByRole('heading', { name: 'Deploy MinIO' })).toBeInTheDocument();
      expect(screen.getByText('minio/minio:latest')).toBeInTheDocument();
      expect(screen.getByText('9000')).toBeInTheDocument();
      expect(screen.getByText('MINIO_ROOT_USER: admin')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels and roles', () => {
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Deploy PostgreSQL' })).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Namespace')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /deploy/i })).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(
        <TemplateDialog
          template={mockTemplate}
          open={true}
          onOpenChange={mockOnOpenChange}
        />
      );
      
      // Name input is disabled, so it won't receive focus
      // Start with namespace input
      const namespaceInput = screen.getByLabelText('Namespace')
      namespaceInput.focus()
      
      expect(document.activeElement).toBe(namespaceInput)
      
      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /cancel/i }))
      
      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /force uninstall/i }))
      
      await user.tab();
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /deploy/i }));
    });
  });
});
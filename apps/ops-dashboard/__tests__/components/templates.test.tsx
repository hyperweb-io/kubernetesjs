import userEvent from '@testing-library/user-event';
import React from 'react';

import { TemplatesView } from '../../components/templates/templates';
import { render, screen, waitFor } from '../utils/test-utils';

// Mock the TemplateDialog component
jest.mock('../../components/templates/template-dialog', () => ({
  TemplateDialog: ({ template, open, onOpenChange }: any) => (
    <div data-testid="template-dialog" data-open={open}>
      <div>Deploy {template.name}</div>
      <button onClick={() => onOpenChange(false)}>Close</button>
    </div>
  )
}));

describe('TemplatesView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render templates view with header', () => {
      render(<TemplatesView />);
      
      expect(screen.getByText('Application Templates')).toBeInTheDocument();
      expect(screen.getByText(/Deploy pre-configured applications with a single click/)).toBeInTheDocument();
    });

    it('should render all template cards', () => {
      render(<TemplatesView />);
      
      // Check for all three templates
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
      expect(screen.getByText('MinIO')).toBeInTheDocument();
      expect(screen.getByText('Ollama')).toBeInTheDocument();
    });

    it('should render template descriptions', () => {
      render(<TemplatesView />);
      
      expect(screen.getByText('PostgreSQL database with pgvector extension for vector storage')).toBeInTheDocument();
      expect(screen.getByText('High-performance object storage compatible with S3 API')).toBeInTheDocument();
      expect(screen.getByText('Run large language models locally with a simple API')).toBeInTheDocument();
    });

    it('should render template details', () => {
      render(<TemplatesView />);
      
      // Check PostgreSQL details
      expect(screen.getByText('pyramation/pgvector:13.3-alpine')).toBeInTheDocument();
      expect(screen.getByText('5432')).toBeInTheDocument();
      
      // Check MinIO details
      expect(screen.getByText('minio/minio:latest')).toBeInTheDocument();
      expect(screen.getByText('9000')).toBeInTheDocument();
      
      // Check Ollama details
      expect(screen.getByText('ollama/ollama:latest')).toBeInTheDocument();
      expect(screen.getByText('11434')).toBeInTheDocument();
    });

    it('should render environment variables for templates that have them', () => {
      render(<TemplatesView />);
      
      // PostgreSQL environment variables
      expect(screen.getByText('POSTGRES_USER: postgres')).toBeInTheDocument();
      expect(screen.getByText('POSTGRES_PASSWORD: ••••••••')).toBeInTheDocument();
      expect(screen.getByText('POSTGRES_DB: postgres')).toBeInTheDocument();
      
      // MinIO environment variables
      expect(screen.getByText('MINIO_ROOT_USER: minioadmin')).toBeInTheDocument();
      expect(screen.getByText('MINIO_ROOT_PASSWORD: ••••••••')).toBeInTheDocument();
    });

    it('should render deploy buttons for all templates', () => {
      render(<TemplatesView />);
      
      expect(screen.getByRole('button', { name: 'Deploy PostgreSQL' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Deploy MinIO' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Deploy Ollama' })).toBeInTheDocument();
    });

    it('should render template badges', () => {
      render(<TemplatesView />);
      
      const badges = screen.getAllByText('Template');
      expect(badges).toHaveLength(3);
    });
  });

  describe('User Interactions', () => {
    it('should open template dialog when deploy button is clicked', async () => {
      const user = userEvent.setup();
      render(<TemplatesView />);
      
      const deployButton = screen.getByRole('button', { name: 'Deploy PostgreSQL' });
      await user.click(deployButton);
      
      expect(screen.getByTestId('template-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('template-dialog')).toHaveTextContent('Deploy PostgreSQL');
    });

    it('should open dialog for different templates', async () => {
      const user = userEvent.setup();
      render(<TemplatesView />);
      
      // Click MinIO deploy button
      const minioButton = screen.getByRole('button', { name: 'Deploy MinIO' });
      await user.click(minioButton);
      
      expect(screen.getByTestId('template-dialog')).toHaveTextContent('Deploy MinIO');
      
      // Close dialog
      const closeButton = screen.getByRole('button', { name: 'Close' });
      await user.click(closeButton);
      
      // Click Ollama deploy button
      const ollamaButton = screen.getByRole('button', { name: 'Deploy Ollama' });
      await user.click(ollamaButton);
      
      expect(screen.getByTestId('template-dialog')).toHaveTextContent('Deploy Ollama');
    });

    it('should close dialog when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<TemplatesView />);
      
      // Open dialog
      const deployButton = screen.getByRole('button', { name: 'Deploy PostgreSQL' });
      await user.click(deployButton);
      
      expect(screen.getByTestId('template-dialog')).toBeInTheDocument();
      
      // Close dialog
      const closeButton = screen.getByRole('button', { name: 'Close' });
      await user.click(closeButton);
      
      await waitFor(() => {
        const dialog = screen.queryByTestId('template-dialog');
        expect(dialog).toHaveAttribute('data-open', 'false');
      });
    });
  });

  describe('Template Data', () => {
    it('should display correct PostgreSQL template data', () => {
      render(<TemplatesView />);
      
      const postgresCard = screen.getByText('PostgreSQL').closest('.hover\\:shadow-lg');
      expect(postgresCard).toBeInTheDocument();
      
      // Check image
      expect(screen.getByText('pyramation/pgvector:13.3-alpine')).toBeInTheDocument();
      
      // Check ports
      expect(screen.getByText('5432')).toBeInTheDocument();
      
      // Check environment variables
      expect(screen.getByText('POSTGRES_USER: postgres')).toBeInTheDocument();
      expect(screen.getByText('POSTGRES_PASSWORD: ••••••••')).toBeInTheDocument();
      expect(screen.getByText('POSTGRES_DB: postgres')).toBeInTheDocument();
    });

    it('should display correct MinIO template data', () => {
      render(<TemplatesView />);
      
      // Check image
      expect(screen.getByText('minio/minio:latest')).toBeInTheDocument();
      
      // Check ports
      expect(screen.getByText('9000')).toBeInTheDocument();
      
      // Check environment variables
      expect(screen.getByText('MINIO_ROOT_USER: minioadmin')).toBeInTheDocument();
      expect(screen.getByText('MINIO_ROOT_PASSWORD: ••••••••')).toBeInTheDocument();
    });

    it('should display correct Ollama template data', () => {
      render(<TemplatesView />);
      
      // Check image
      expect(screen.getByText('ollama/ollama:latest')).toBeInTheDocument();
      
      // Check ports
      expect(screen.getByText('11434')).toBeInTheDocument();
      
      // Ollama should not have environment variables - check that there are only 2 "Environment Variables:" texts (PostgreSQL and MinIO)
      const envVars = screen.queryAllByText('Environment Variables:');
      expect(envVars).toHaveLength(2); // Only PostgreSQL and MinIO have them
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles and labels', () => {
      render(<TemplatesView />);
      
      expect(screen.getByRole('button', { name: 'Deploy PostgreSQL' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Deploy MinIO' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Deploy Ollama' })).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      render(<TemplatesView />);
      
      expect(screen.getByRole('heading', { name: 'Application Templates' })).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<TemplatesView />);
      
      const firstButton = screen.getByRole('button', { name: 'Deploy PostgreSQL' });
      firstButton.focus();
      
      expect(document.activeElement).toBe(firstButton);
      
      await user.tab();
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Deploy MinIO' }));
      
      await user.tab();
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Deploy Ollama' }));
    });
  });
});

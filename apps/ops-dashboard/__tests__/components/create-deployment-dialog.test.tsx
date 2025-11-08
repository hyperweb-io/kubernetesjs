import userEvent from '@testing-library/user-event';
import React from 'react';

import { CreateDeploymentDialog } from '@/components/create-deployment-dialog';

import { cleanup,render, screen, waitFor } from '../utils/test-utils';

// Mock the YAMLEditor component
jest.mock('../../components/yaml-editor', () => ({
  YAMLEditor: ({ value, onChange, height }: { value: string; onChange: (value: string) => void; height: string }) => (
    <textarea
      data-testid="yaml-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ height }}
      placeholder="YAML content"
    />
  )
}));

describe('CreateDeploymentDialog', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('Basic Rendering', () => {
    it('should render dialog when open', () => {
      render(
        <CreateDeploymentDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('Create Deployment')).toBeInTheDocument();
      expect(screen.getByText('Define your deployment using YAML. The editor below provides a template to get you started.')).toBeInTheDocument();
      expect(screen.getByTestId('yaml-editor')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    it('should not render dialog when closed', () => {
      render(
        <CreateDeploymentDialog
          open={false}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.queryByText('Create Deployment')).not.toBeInTheDocument();
    });

    it('should display default YAML template', () => {
      render(
        <CreateDeploymentDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const yamlEditor = screen.getByTestId('yaml-editor');
      expect(yamlEditor.value).toContain('apiVersion: apps/v1');
      expect(yamlEditor.value).toContain('kind: Deployment');
      expect(yamlEditor.value).toContain('name: my-app');
    });
  });

  describe('User Interactions', () => {
    it('should handle YAML content changes', async () => {
      const user = userEvent.setup();
      render(
        <CreateDeploymentDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const yamlEditor = screen.getByTestId('yaml-editor');
      await user.clear(yamlEditor);
      await user.type(yamlEditor, 'new yaml content');

      expect(yamlEditor).toHaveValue('new yaml content');
    });

    it('should handle cancel button click', async () => {
      const user = userEvent.setup();
      render(
        <CreateDeploymentDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should handle successful submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(
        <CreateDeploymentDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const continueButton = screen.getByRole('button', { name: /continue/i });
      await user.click(continueButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.stringContaining('apiVersion: apps/v1'));
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(
        <CreateDeploymentDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const continueButton = screen.getByRole('button', { name: /continue/i });
      await user.click(continueButton);

      expect(screen.getByText('Creating...')).toBeInTheDocument();
      expect(continueButton).toBeDisabled();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when submission fails', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Failed to create deployment';
      mockOnSubmit.mockRejectedValue(new Error(errorMessage));

      render(
        <CreateDeploymentDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const continueButton = screen.getByRole('button', { name: /continue/i });
      await user.click(continueButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });

      expect(mockOnOpenChange).not.toHaveBeenCalled();
    });

    it('should display error for empty YAML content', async () => {
      const user = userEvent.setup();
      render(
        <CreateDeploymentDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const yamlEditor = screen.getByTestId('yaml-editor');
      await user.clear(yamlEditor);

      const continueButton = screen.getByRole('button', { name: /continue/i });
      await user.click(continueButton);

      await waitFor(() => {
        expect(screen.getByText('YAML content cannot be empty')).toBeInTheDocument();
      });
    });

    it('should clear error when canceling', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Test error'));

      render(
        <CreateDeploymentDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      // Trigger an error first
      const continueButton = screen.getByRole('button', { name: /continue/i });
      await user.click(continueButton);

      await waitFor(() => {
        expect(screen.getByText('Test error')).toBeInTheDocument();
      });

      // Cancel should clear the error
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(screen.queryByText('Test error')).not.toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should reset YAML to template after successful submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      const { rerender } = render(
        <CreateDeploymentDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const yamlEditor = screen.getByTestId('yaml-editor');
      await user.clear(yamlEditor);
      await user.type(yamlEditor, 'custom yaml');

      const continueButton = screen.getByRole('button', { name: /continue/i });
      await user.click(continueButton);

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });

      // Re-open dialog should show template again
      rerender(
        <CreateDeploymentDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const newYamlEditor = screen.getByTestId('yaml-editor');
      expect(newYamlEditor.value).toContain('apiVersion: apps/v1');
    });

    it('should reset YAML to template when canceling', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <CreateDeploymentDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const yamlEditor = screen.getByTestId('yaml-editor');
      await user.clear(yamlEditor);
      await user.type(yamlEditor, 'custom yaml');

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Re-open dialog should show template again
      rerender(
        <CreateDeploymentDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSubmit={mockOnSubmit}
        />
      );

      const newYamlEditor = screen.getByTestId('yaml-editor');
      expect(newYamlEditor.value).toContain('apiVersion: apps/v1');
    });
  });
});

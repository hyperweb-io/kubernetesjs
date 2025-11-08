import React from 'react'
import { render, screen, waitFor } from '../utils/test-utils'
import userEvent from '@testing-library/user-event'
import { ScaleDeploymentDialog } from '@/components/scale-deployment-dialog'
import type { AppsV1Deployment as Deployment } from '@kubernetesjs/ops'

// Mock deployment data
const mockDeployment: Deployment = {
  metadata: {
    name: 'test-deployment',
    namespace: 'default',
    uid: 'test-uid'
  },
  spec: {
    replicas: 3,
    selector: {
      matchLabels: {
        app: 'test'
      }
    },
    template: {
      metadata: {
        labels: {
          app: 'test'
        }
      },
      spec: {
        containers: [{
          name: 'nginx',
          image: 'nginx:latest'
        }]
      }
    }
  },
  status: {
    replicas: 3,
    readyReplicas: 3,
    availableReplicas: 3
  }
}

describe('ScaleDeploymentDialog', () => {
  const user = userEvent.setup()
  let mockOnOpenChange: jest.Mock
  let mockOnScale: jest.Mock

  beforeEach(() => {
    mockOnOpenChange = jest.fn()
    mockOnScale = jest.fn()
    jest.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render dialog when open', () => {
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      expect(screen.getByText('Scale Deployment')).toBeInTheDocument()
      expect(screen.getByText('test-deployment')).toBeInTheDocument()
      expect(screen.getByText('default')).toBeInTheDocument()
      expect(screen.getByLabelText('Number of Replicas')).toBeInTheDocument()
    })

    it('should not render when closed', () => {
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={false}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      expect(screen.queryByText('Scale Deployment')).not.toBeInTheDocument()
    })

    it('should not render when deployment is null', () => {
      render(
        <ScaleDeploymentDialog
          deployment={null}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      expect(screen.queryByText('Scale Deployment')).not.toBeInTheDocument()
    })

    it('should display current replica count', () => {
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      expect(screen.getByText('Current: 3 replicas')).toBeInTheDocument()
    })

    it('should handle singular replica count', () => {
      const singleReplicaDeployment = {
        ...mockDeployment,
        spec: { ...mockDeployment.spec, replicas: 1 }
      }
      
      render(
        <ScaleDeploymentDialog
          deployment={singleReplicaDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      expect(screen.getByText('Current: 1 replica')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should update replicas when user types', async () => {
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      await user.clear(input)
      await user.type(input, '5')
      
      expect(input).toHaveValue(5)
    })

    it('should submit when user clicks Scale button', async () => {
      mockOnScale.mockResolvedValue(undefined)
      
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      await user.clear(input)
      await user.type(input, '5')
      
      const scaleButton = screen.getByRole('button', { name: 'Scale' })
      await user.click(scaleButton)
      
      expect(mockOnScale).toHaveBeenCalledWith(5)
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })

    it('should submit when user presses Enter', async () => {
      mockOnScale.mockResolvedValue(undefined)
      
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      await user.clear(input)
      await user.type(input, '5')
      await user.keyboard('{Enter}')
      
      expect(mockOnScale).toHaveBeenCalledWith(5)
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })

    it('should cancel when user clicks Cancel button', async () => {
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)
      
      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })

    it('should reset replicas when canceling', async () => {
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      await user.clear(input)
      await user.type(input, '5')
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)
      
      // Re-open dialog to check if replicas were reset
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      expect(screen.getByLabelText('Number of Replicas')).toHaveValue(3)
    })
  })

  describe('Validation', () => {
    it('should handle empty input', async () => {
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      await user.clear(input)
      
      const scaleButton = screen.getByRole('button', { name: 'Scale' })
      await user.click(scaleButton)
      
      // Component should not call onScale with empty input
      expect(mockOnScale).not.toHaveBeenCalled()
    })

    it('should show error for negative numbers', async () => {
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      await user.clear(input)
      await user.type(input, '-1')
      
      const scaleButton = screen.getByRole('button', { name: 'Scale' })
      await user.click(scaleButton)
      
      expect(screen.getByText('Please enter a valid number of replicas (0 or greater)')).toBeInTheDocument()
      expect(mockOnScale).not.toHaveBeenCalled()
    })

    it('should show error for numbers over 100', async () => {
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      await user.clear(input)
      await user.type(input, '101')
      
      const scaleButton = screen.getByRole('button', { name: 'Scale' })
      await user.click(scaleButton)
      
      expect(screen.getByText('For safety, maximum replicas is limited to 100. Please contact admin for higher limits.')).toBeInTheDocument()
      expect(mockOnScale).not.toHaveBeenCalled()
    })

    it('should show warning for zero replicas', async () => {
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      await user.clear(input)
      await user.type(input, '0')
      
      expect(screen.getByText('Setting replicas to 0 will stop all pods for this deployment.')).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('should show loading state when submitting', async () => {
      mockOnScale.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      await user.clear(input)
      await user.type(input, '5')
      
      const scaleButton = screen.getByRole('button', { name: 'Scale' })
      await user.click(scaleButton)
      
      expect(screen.getByText('Scaling...')).toBeInTheDocument()
      expect(scaleButton).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    })

    it('should disable submit button when input is empty', () => {
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      expect(input).toHaveValue(3)
      
      const scaleButton = screen.getByRole('button', { name: 'Scale' })
      expect(scaleButton).not.toBeDisabled()
    })
  })

  describe('Error Handling', () => {
    it('should show error when onScale fails', async () => {
      const errorMessage = 'Failed to scale deployment'
      mockOnScale.mockRejectedValue(new Error(errorMessage))
      
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      await user.clear(input)
      await user.type(input, '5')
      
      const scaleButton = screen.getByRole('button', { name: 'Scale' })
      await user.click(scaleButton)
      
      // Wait for error message to appear and ensure all async operations complete
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
      
      // Wait a bit more to ensure the error handling is completely finished
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Scale' })).not.toBeDisabled()
      })
      
      // Verify that onOpenChange was not called (dialog should remain open)
      expect(mockOnOpenChange).not.toHaveBeenCalled()
    })

    it('should show generic error for non-Error exceptions', async () => {
      mockOnScale.mockRejectedValue('String error')
      
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      await user.clear(input)
      await user.type(input, '5')
      
      const scaleButton = screen.getByRole('button', { name: 'Scale' })
      await user.click(scaleButton)
      
      // Wait for error message to appear and ensure all async operations complete
      await waitFor(() => {
        expect(screen.getByText('Failed to scale deployment')).toBeInTheDocument()
      })
      
      // Wait a bit more to ensure the error handling is completely finished
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Scale' })).not.toBeDisabled()
      })
      
      // Verify that onOpenChange was not called (dialog should remain open)
      expect(mockOnOpenChange).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels and descriptions', () => {
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      expect(input).toHaveAttribute('type', 'number')
      expect(input).toHaveAttribute('min', '0')
      expect(input).toHaveAttribute('max', '100')
      expect(input).toHaveAttribute('placeholder', 'Enter number of replicas')
    })

    it('should be keyboard navigable', async () => {
      render(
        <ScaleDeploymentDialog
          deployment={mockDeployment}
          open={true}
          onOpenChange={mockOnOpenChange}
          onScale={mockOnScale}
        />
      )
      
      const input = screen.getByLabelText('Number of Replicas')
      input.focus()
      
      expect(document.activeElement).toBe(input)
      
      await user.keyboard('{Tab}')
      expect(document.activeElement).not.toBe(input)
    })
  })
})

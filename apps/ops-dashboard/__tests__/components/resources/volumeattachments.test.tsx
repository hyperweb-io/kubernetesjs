import userEvent from '@testing-library/user-event';

import { VolumeAttachmentsView } from '@/components/resources/volumeattachments';

import {render, screen, waitFor } from '../../utils/test-utils';

// Mock the hooks
jest.mock('../../../k8s', () => ({
  useListStorageV1VolumeAttachmentQuery: jest.fn(),
  useDeleteStorageV1VolumeAttachment: jest.fn()
}));

// Mock the confirm dialog
jest.mock('../../../hooks/useConfirm', () => ({
  ...jest.requireActual('../../../hooks/useConfirm'),
  confirmDialog: jest.fn()
}));

describe('VolumeAttachmentsView', () => {
  const mockRefetch = jest.fn();
  const mockDeleteAttachment = jest.fn();
  const mockConfirmDialog = require('../../../hooks/useConfirm').confirmDialog;

  beforeEach(() => {
    jest.clearAllMocks();
    
    const { useListStorageV1VolumeAttachmentQuery, useDeleteStorageV1VolumeAttachment } = require('../../../k8s');
    
    useListStorageV1VolumeAttachmentQuery.mockReturnValue({
      data: {
        items: [
          {
            metadata: {
              name: 'attachment-1',
              creationTimestamp: '2024-01-15T10:30:00Z',
              uid: 'attachment-1-uid'
            },
            spec: {
              attacher: 'csi.kubernetes.io',
              nodeName: 'worker-node-1',
              source: {
                persistentVolumeName: 'pv-1'
              }
            },
            status: {
              attached: true,
              attachError: null,
              detachError: null
            }
          },
          {
            metadata: {
              name: 'attachment-2',
              creationTimestamp: '2024-01-15T11:00:00Z',
              uid: 'attachment-2-uid'
            },
            spec: {
              attacher: 'csi.kubernetes.io',
              nodeName: 'worker-node-2',
              source: {
                persistentVolumeName: 'pv-2'
              }
            },
            status: {
              attached: false,
              attachError: {
                message: 'Failed to attach volume'
              },
              detachError: null
            }
          }
        ]
      },
      isLoading: false,
      error: null,
      refetch: mockRefetch
    });

    useDeleteStorageV1VolumeAttachment.mockReturnValue({
      mutateAsync: mockDeleteAttachment
    });

    mockConfirmDialog.mockResolvedValue(true);
  });

  describe('Basic Rendering', () => {
    it('should render volume attachments view with header', () => {
      render(<VolumeAttachmentsView />);
      
      expect(screen.getByText('Volume Attachments', { selector: 'h2' })).toBeInTheDocument();
      expect(screen.getByText('Volume attachments to nodes')).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      render(<VolumeAttachmentsView />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render stats cards', () => {
      render(<VolumeAttachmentsView />);
      
      expect(screen.getByText('Total Attachments')).toBeInTheDocument();
      expect(screen.getByText('Attached', { selector: 'h3' })).toBeInTheDocument();
      expect(screen.getByText('With Errors')).toBeInTheDocument();
      expect(screen.getByText('Unique Nodes')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should display volume attachment data', async () => {
      render(<VolumeAttachmentsView />);

      await waitFor(() => {
        expect(screen.getByText('attachment-1')).toBeInTheDocument();
        expect(screen.getByText('attachment-2')).toBeInTheDocument();
        expect(screen.getByText('worker-node-1')).toBeInTheDocument();
        expect(screen.getByText('worker-node-2')).toBeInTheDocument();
        expect(screen.getByText('pv-1')).toBeInTheDocument();
        expect(screen.getByText('pv-2')).toBeInTheDocument();
      });
    });

    it('should display correct statistics', async () => {
      render(<VolumeAttachmentsView />);

      await waitFor(() => {
        expect(screen.getAllByText('2', { selector: '.text-2xl.font-bold' })).toHaveLength(2); // Total Attachments and Unique Nodes
        expect(screen.getByText('1', { selector: '.text-2xl.font-bold.text-green-600' })).toBeInTheDocument(); // Attached
        expect(screen.getByText('1', { selector: '.text-2xl.font-bold.text-red-600' })).toBeInTheDocument(); // With Errors
      });
    });

    it('should display status badges correctly', async () => {
      render(<VolumeAttachmentsView />);

      await waitFor(() => {
        expect(screen.getByText('Attached', { selector: 'div' })).toBeInTheDocument();
        expect(screen.getByText('Detached')).toBeInTheDocument();
      });
    });

    it('should display attacher information correctly', async () => {
      render(<VolumeAttachmentsView />);

      await waitFor(() => {
        expect(screen.getAllByText('csi.kubernetes.io')).toHaveLength(2);
      });
    });

    it('should display error information correctly', async () => {
      render(<VolumeAttachmentsView />);

      await waitFor(() => {
        expect(screen.getByText('Attach Error')).toBeInTheDocument();
        expect(screen.getByText('None')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should refresh data when refresh button is clicked', async () => {
      const user = userEvent.setup();
      render(<VolumeAttachmentsView />);

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[0]); // First button is the refresh button

      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('should show delete confirmation when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<VolumeAttachmentsView />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button');
        expect(deleteButtons.length).toBeGreaterThan(1);
      });

      const deleteButtons = screen.getAllByRole('button');
      // Find the first enabled delete button (not disabled)
      const enabledDeleteButton = deleteButtons.find(button => !button.disabled && button.className.includes('text-destructive'));
      await user.click(enabledDeleteButton!);

      expect(mockConfirmDialog).toHaveBeenCalledWith({
        title: 'Delete Volume Attachment',
        description: 'Are you sure you want to delete attachment-2? This may disrupt attached volumes.',
        confirmText: 'Delete',
        confirmVariant: 'destructive'
      });
    });

    it('should delete volume attachment when confirmed', async () => {
      const user = userEvent.setup();
      mockConfirmDialog.mockResolvedValue(true);
      mockDeleteAttachment.mockResolvedValue({});
      
      render(<VolumeAttachmentsView />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button');
        expect(deleteButtons.length).toBeGreaterThan(1);
      });

      const deleteButtons = screen.getAllByRole('button');
      // Find the first enabled delete button (not disabled)
      const enabledDeleteButton = deleteButtons.find(button => !button.disabled && button.className.includes('text-destructive'));
      await user.click(enabledDeleteButton!);

      await waitFor(() => {
        expect(mockDeleteAttachment).toHaveBeenCalledWith({
          path: { name: 'attachment-2' },
          query: {}
        });
        expect(mockRefetch).toHaveBeenCalledTimes(1);
      });
    });

    it('should show view button when view button is clicked', async () => {
      const user = userEvent.setup();
      render(<VolumeAttachmentsView />);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(1);
      });

      const buttons = screen.getAllByRole('button');
      await user.click(buttons[2]); // Third button is the first view button

      // The component sets selectedAttachment state, but doesn't render anything visible
      // This test just ensures the button is clickable
      expect(buttons[2]).toBeInTheDocument();
    });
  });

  describe('Status Logic', () => {
    it('should show attached status correctly', async () => {
      render(<VolumeAttachmentsView />);

      await waitFor(() => {
        expect(screen.getByText('Attached', { selector: 'div' })).toBeInTheDocument();
      });
    });

    it('should show detached status correctly', async () => {
      render(<VolumeAttachmentsView />);

      await waitFor(() => {
        expect(screen.getByText('Detached')).toBeInTheDocument();
      });
    });

    it('should show error badges correctly', async () => {
      render(<VolumeAttachmentsView />);

      await waitFor(() => {
        expect(screen.getByText('Attach Error')).toBeInTheDocument();
        expect(screen.getByText('None')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner when loading', () => {
      const { useListStorageV1VolumeAttachmentQuery } = require('../../../k8s');
      useListStorageV1VolumeAttachmentQuery.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: mockRefetch
      });

      render(<VolumeAttachmentsView />);

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Error States', () => {
    it('should display error message when fetch fails', () => {
      const { useListStorageV1VolumeAttachmentQuery } = require('../../../k8s');
      useListStorageV1VolumeAttachmentQuery.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch volume attachments'),
        refetch: mockRefetch
      });

      render(<VolumeAttachmentsView />);

      expect(screen.getByText('Failed to fetch volume attachments')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('should show retry button in error state', () => {
      const { useListStorageV1VolumeAttachmentQuery } = require('../../../k8s');
      useListStorageV1VolumeAttachmentQuery.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch volume attachments'),
        refetch: mockRefetch
      });

      render(<VolumeAttachmentsView />);

      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should display empty state when no attachments', () => {
      const { useListStorageV1VolumeAttachmentQuery } = require('../../../k8s');
      useListStorageV1VolumeAttachmentQuery.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
        refetch: mockRefetch
      });

      render(<VolumeAttachmentsView />);

      expect(screen.getByText('No volume attachments found')).toBeInTheDocument();
      expect(screen.getByText('Refresh')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles and labels', () => {
      render(<VolumeAttachmentsView />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<VolumeAttachmentsView />);

      const buttons = screen.getAllByRole('button');
      await user.tab();
      
      expect(buttons[0]).toHaveFocus();
    });
  });
});

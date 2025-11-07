import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import VolumeAttachmentsPage from '@/app/i/volumeattachments/page';

// Mock the VolumeAttachmentsView component
jest.mock('@/components/resources/volumeattachments', () => ({
  VolumeAttachmentsView: () => <div data-testid="volumeattachments-view">VolumeAttachmentsView</div>
}));

describe('VolumeAttachmentsPage', () => {
  it('should render the volumeattachments view', () => {
    render(<VolumeAttachmentsPage />);
    
    // Check that VolumeAttachmentsView is rendered
    expect(screen.getByTestId('volumeattachments-view')).toBeInTheDocument();
    expect(screen.getByText('VolumeAttachmentsView')).toBeInTheDocument();
  });
});

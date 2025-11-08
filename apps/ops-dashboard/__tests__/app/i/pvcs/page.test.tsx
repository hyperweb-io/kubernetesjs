import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import PVCsPage from '@/app/i/pvcs/page';

// Mock the PVCsView component
jest.mock('@/components/resources/pvcs', () => ({
  PVCsView: () => <div data-testid="pvcs-view">PVCsView</div>
}));

describe('PVCsPage', () => {
  it('should render the pvcs view', () => {
    render(<PVCsPage />);
    
    // Check that PVCsView is rendered
    expect(screen.getByTestId('pvcs-view')).toBeInTheDocument();
    expect(screen.getByText('PVCsView')).toBeInTheDocument();
  });
});

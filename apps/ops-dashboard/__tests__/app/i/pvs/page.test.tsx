import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import PVsPage from '@/app/i/pvs/page';

// Mock the PVsView component
jest.mock('@/components/resources/pvs', () => ({
  PVsView: () => <div data-testid="pvs-view">PVsView</div>
}));

describe('PVsPage', () => {
  it('should render the pvs view', () => {
    render(<PVsPage />);
    
    // Check that PVsView is rendered
    expect(screen.getByTestId('pvs-view')).toBeInTheDocument();
    expect(screen.getByText('PVsView')).toBeInTheDocument();
  });
});

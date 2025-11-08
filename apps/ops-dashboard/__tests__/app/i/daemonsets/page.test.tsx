import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import DaemonSetsPage from '@/app/i/daemonsets/page';

// Mock the DaemonSetsView component
jest.mock('@/components/resources/daemonsets', () => ({
  DaemonSetsView: () => <div data-testid="daemonsets-view">DaemonSetsView</div>
}));

describe('DaemonSetsPage', () => {
  it('should render the daemonsets view', () => {
    render(<DaemonSetsPage />);
    
    // Check that DaemonSetsView is rendered
    expect(screen.getByTestId('daemonsets-view')).toBeInTheDocument();
    expect(screen.getByText('DaemonSetsView')).toBeInTheDocument();
  });
});

import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import PodsPage from '@/app/i/pods/page';

// Mock the PodsView component
jest.mock('@/components/resources/pods', () => ({
  PodsView: () => <div data-testid="pods-view">Pods View</div>
}));

describe('Pods Page', () => {
  it('should render the pods view', () => {
    render(<PodsPage />);
    
    // Check that PodsView is rendered
    expect(screen.getByTestId('pods-view')).toBeInTheDocument();
    expect(screen.getByText('Pods View')).toBeInTheDocument();
  });
});


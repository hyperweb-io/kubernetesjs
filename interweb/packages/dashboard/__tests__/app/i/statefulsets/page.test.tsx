import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import StatefulSetsPage from '@/app/i/statefulsets/page';

// Mock the StatefulSetsView component
jest.mock('@/components/resources/statefulsets', () => ({
  StatefulSetsView: () => <div data-testid="statefulsets-view">StatefulSetsView</div>
}));

describe('StatefulSetsPage', () => {
  it('should render the statefulsets view', () => {
    render(<StatefulSetsPage />);
    
    // Check that StatefulSetsView is rendered
    expect(screen.getByTestId('statefulsets-view')).toBeInTheDocument();
    expect(screen.getByText('StatefulSetsView')).toBeInTheDocument();
  });
});

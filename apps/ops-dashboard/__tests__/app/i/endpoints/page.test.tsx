import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import EndpointsPage from '@/app/i/endpoints/page';

// Mock the EndpointsView component
jest.mock('@/components/resources/endpoints', () => ({
  EndpointsView: () => <div data-testid="endpoints-view">EndpointsView</div>
}));

describe('EndpointsPage', () => {
  it('should render the endpoints view', () => {
    render(<EndpointsPage />);
    
    // Check that EndpointsView is rendered
    expect(screen.getByTestId('endpoints-view')).toBeInTheDocument();
    expect(screen.getByText('EndpointsView')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import EndpointSlicesPage from '@/app/i/endpointslices/page';

// Mock the EndpointSlicesView component
jest.mock('@/components/resources/endpointslices', () => ({
  EndpointSlicesView: () => <div data-testid="endpointslices-view">EndpointSlicesView</div>
}));

describe('EndpointSlicesPage', () => {
  it('should render the endpointslices view', () => {
    render(<EndpointSlicesPage />);
    
    // Check that EndpointSlicesView is rendered
    expect(screen.getByTestId('endpointslices-view')).toBeInTheDocument();
    expect(screen.getByText('EndpointSlicesView')).toBeInTheDocument();
  });
});

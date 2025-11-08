import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import ServicesPage from '@/app/i/services/page';

// Mock the ServicesView component
jest.mock('@/components/resources/services', () => ({
  ServicesView: () => <div data-testid="services-view">Services View</div>
}));

describe('Services Page', () => {
  it('should render the services view', () => {
    render(<ServicesPage />);
    
    // Check that ServicesView is rendered
    expect(screen.getByTestId('services-view')).toBeInTheDocument();
    expect(screen.getByText('Services View')).toBeInTheDocument();
  });
});


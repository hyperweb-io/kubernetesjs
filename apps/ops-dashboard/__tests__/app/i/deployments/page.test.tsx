import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import DeploymentsPage from '@/app/i/deployments/page';

// Mock the DeploymentsView component
jest.mock('@/components/resources/deployments', () => ({
  DeploymentsView: () => <div data-testid="deployments-view">Deployments View</div>
}));

describe('Deployments Page', () => {
  it('should render the deployments view', () => {
    render(<DeploymentsPage />);
    
    // Check that DeploymentsView is rendered
    expect(screen.getByTestId('deployments-view')).toBeInTheDocument();
    expect(screen.getByText('Deployments View')).toBeInTheDocument();
  });
});


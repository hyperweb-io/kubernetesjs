import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import ServiceAccountsPage from '@/app/i/serviceaccounts/page';

// Mock the ServiceAccountsView component
jest.mock('@/components/resources/serviceaccounts', () => ({
  ServiceAccountsView: () => <div data-testid="serviceaccounts-view">ServiceAccountsView</div>
}));

describe('ServiceAccountsPage', () => {
  it('should render the serviceaccounts view', () => {
    render(<ServiceAccountsPage />);
    
    // Check that ServiceAccountsView is rendered
    expect(screen.getByTestId('serviceaccounts-view')).toBeInTheDocument();
    expect(screen.getByText('ServiceAccountsView')).toBeInTheDocument();
  });
});

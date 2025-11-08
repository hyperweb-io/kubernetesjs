import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import NetworkPoliciesPage from '@/app/i/networkpolicies/page';

// Mock the NetworkPoliciesView component
jest.mock('@/components/resources/networkpolicies', () => ({
  NetworkPoliciesView: () => <div data-testid="networkpolicies-view">NetworkPoliciesView</div>
}));

describe('NetworkPoliciesPage', () => {
  it('should render the networkpolicies view', () => {
    render(<NetworkPoliciesPage />);
    
    // Check that NetworkPoliciesView is rendered
    expect(screen.getByTestId('networkpolicies-view')).toBeInTheDocument();
    expect(screen.getByText('NetworkPoliciesView')).toBeInTheDocument();
  });
});

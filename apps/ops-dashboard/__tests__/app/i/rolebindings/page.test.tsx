import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import RoleBindingsPage from '@/app/i/rolebindings/page';

// Mock the RoleBindingsView component
jest.mock('@/components/resources/rolebindings', () => ({
  RoleBindingsView: () => <div data-testid="rolebindings-view">RoleBindingsView</div>
}));

describe('RoleBindingsPage', () => {
  it('should render the rolebindings view', () => {
    render(<RoleBindingsPage />);
    
    // Check that RoleBindingsView is rendered
    expect(screen.getByTestId('rolebindings-view')).toBeInTheDocument();
    expect(screen.getByText('RoleBindingsView')).toBeInTheDocument();
  });
});

import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import RolesPage from '@/app/i/roles/page';

// Mock the RolesView component
jest.mock('@/components/resources/roles', () => ({
  RolesView: () => <div data-testid="roles-view">RolesView</div>
}));

describe('RolesPage', () => {
  it('should render the roles view', () => {
    render(<RolesPage />);
    
    // Check that RolesView is rendered
    expect(screen.getByTestId('roles-view')).toBeInTheDocument();
    expect(screen.getByText('RolesView')).toBeInTheDocument();
  });
});

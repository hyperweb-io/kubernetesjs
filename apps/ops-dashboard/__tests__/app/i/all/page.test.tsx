import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import AllResourcesPage from '@/app/i/all/page';

// Mock the AllResourcesView component
jest.mock('@/components/resources/all-resources', () => ({
  AllResourcesView: () => <div data-testid="all-resources-view">All Resources View</div>
}));

describe('All Resources Page', () => {
  it('should render the all resources view', () => {
    render(<AllResourcesPage />);
    
    // Check that AllResourcesView is rendered
    expect(screen.getByTestId('all-resources-view')).toBeInTheDocument();
    expect(screen.getByText('All Resources View')).toBeInTheDocument();
  });
});


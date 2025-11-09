import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import PriorityClassesPage from '@/app/i/priorityclasses/page';

// Mock the PriorityClassesView component
jest.mock('@/components/resources/priorityclasses', () => ({
  PriorityClassesView: () => <div data-testid="priorityclasses-view">PriorityClassesView</div>
}));

describe('PriorityClassesPage', () => {
  it('should render the priorityclasses view', () => {
    render(<PriorityClassesPage />);
    
    // Check that PriorityClassesView is rendered
    expect(screen.getByTestId('priorityclasses-view')).toBeInTheDocument();
    expect(screen.getByText('PriorityClassesView')).toBeInTheDocument();
  });
});

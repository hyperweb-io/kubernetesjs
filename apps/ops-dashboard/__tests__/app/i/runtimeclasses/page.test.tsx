import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import RuntimeClassesPage from '@/app/i/runtimeclasses/page';

// Mock the RuntimeClassesView component
jest.mock('@/components/resources/runtimeclasses', () => ({
  RuntimeClassesView: () => <div data-testid="runtimeclasses-view">RuntimeClassesView</div>
}));

describe('RuntimeClassesPage', () => {
  it('should render the runtimeclasses view', () => {
    render(<RuntimeClassesPage />);
    
    // Check that RuntimeClassesView is rendered
    expect(screen.getByTestId('runtimeclasses-view')).toBeInTheDocument();
    expect(screen.getByText('RuntimeClassesView')).toBeInTheDocument();
  });
});

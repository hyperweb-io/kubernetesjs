import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import StorageClassesPage from '@/app/i/storageclasses/page';

// Mock the StorageClassesView component
jest.mock('@/components/resources/storageclasses', () => ({
  StorageClassesView: () => <div data-testid="storageclasses-view">StorageClassesView</div>
}));

describe('StorageClassesPage', () => {
  it('should render the storageclasses view', () => {
    render(<StorageClassesPage />);
    
    // Check that StorageClassesView is rendered
    expect(screen.getByTestId('storageclasses-view')).toBeInTheDocument();
    expect(screen.getByText('StorageClassesView')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import PDBsPage from '@/app/i/pdbs/page';

// Mock the PDBsView component
jest.mock('@/components/resources/pdbs', () => ({
  PDBsView: () => <div data-testid="pdbs-view">PDBsView</div>
}));

describe('PDBsPage', () => {
  it('should render the pdbs view', () => {
    render(<PDBsPage />);
    
    // Check that PDBsView is rendered
    expect(screen.getByTestId('pdbs-view')).toBeInTheDocument();
    expect(screen.getByText('PDBsView')).toBeInTheDocument();
  });
});

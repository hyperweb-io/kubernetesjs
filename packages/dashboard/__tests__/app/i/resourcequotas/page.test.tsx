import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import ResourceQuotasPage from '@/app/i/resourcequotas/page';

// Mock the ResourceQuotasView component
jest.mock('@/components/resources/resourcequotas', () => ({
  ResourceQuotasView: () => <div data-testid="resourcequotas-view">ResourceQuotasView</div>
}));

describe('ResourceQuotasPage', () => {
  it('should render the resourcequotas view', () => {
    render(<ResourceQuotasPage />);
    
    // Check that ResourceQuotasView is rendered
    expect(screen.getByTestId('resourcequotas-view')).toBeInTheDocument();
    expect(screen.getByText('ResourceQuotasView')).toBeInTheDocument();
  });
});

import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import IngressesPage from '@/app/i/ingresses/page';

// Mock the IngressesView component
jest.mock('@/components/resources/ingresses', () => ({
  IngressesView: () => <div data-testid="ingresses-view">IngressesView</div>
}));

describe('IngressesPage', () => {
  it('should render the ingresses view', () => {
    render(<IngressesPage />);
    
    // Check that IngressesView is rendered
    expect(screen.getByTestId('ingresses-view')).toBeInTheDocument();
    expect(screen.getByText('IngressesView')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import HPAsPage from '@/app/i/hpas/page';

// Mock the HPAsView component
jest.mock('@/components/resources/hpas', () => ({
  HPAsView: () => <div data-testid="hpas-view">HPAsView</div>
}));

describe('HPAsPage', () => {
  it('should render the hpas view', () => {
    render(<HPAsPage />);
    
    // Check that HPAsView is rendered
    expect(screen.getByTestId('hpas-view')).toBeInTheDocument();
    expect(screen.getByText('HPAsView')).toBeInTheDocument();
  });
});

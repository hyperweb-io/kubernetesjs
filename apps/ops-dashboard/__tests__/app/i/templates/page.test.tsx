import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import TemplatesPage from '@/app/i/templates/page';

// Mock the TemplatesView component
jest.mock('@/components/templates/templates', () => ({
  TemplatesView: () => <div data-testid="templates-view">Templates View</div>
}));

describe('Templates Page', () => {
  it('should render the templates view', () => {
    render(<TemplatesPage />);
    
    // Check that TemplatesView is rendered
    expect(screen.getByTestId('templates-view')).toBeInTheDocument();
    expect(screen.getByText('Templates View')).toBeInTheDocument();
  });
});


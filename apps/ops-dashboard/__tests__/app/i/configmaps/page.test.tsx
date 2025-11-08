import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import ConfigMapsPage from '@/app/i/configmaps/page';

// Mock the ConfigMapsView component
jest.mock('@/components/resources/configmaps', () => ({
  ConfigMapsView: () => <div data-testid="configmaps-view">ConfigMaps View</div>
}));

describe('ConfigMaps Page', () => {
  it('should render the configmaps view', () => {
    render(<ConfigMapsPage />);
    
    // Check that ConfigMapsView is rendered
    expect(screen.getByTestId('configmaps-view')).toBeInTheDocument();
    expect(screen.getByText('ConfigMaps View')).toBeInTheDocument();
  });
});


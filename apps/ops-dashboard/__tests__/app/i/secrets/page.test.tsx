import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import SecretsPage from '@/app/i/secrets/page';

// Mock the SecretsView component
jest.mock('@/components/resources/secrets', () => ({
  SecretsView: () => <div data-testid="secrets-view">Secrets View</div>
}));

describe('Secrets Page', () => {
  it('should render the secrets view', () => {
    render(<SecretsPage />);
    
    // Check that SecretsView is rendered
    expect(screen.getByTestId('secrets-view')).toBeInTheDocument();
    expect(screen.getByText('Secrets View')).toBeInTheDocument();
  });
});


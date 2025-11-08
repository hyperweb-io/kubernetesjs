import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import AdminServicesPage from '@/app/admin/services/page';

// Mock the ServicesView component
jest.mock('@/components/resources/services', () => ({
  ServicesView: ({ namespace }: { namespace: string }) => (
    <div data-testid="services-view">
      Services View for namespace: {namespace}
    </div>
  )
}));

describe('Admin Services Page', () => {
  it('should render the services view with correct namespace', () => {
    render(<AdminServicesPage />);
    
    // Check that ServicesView is rendered with correct namespace
    expect(screen.getByTestId('services-view')).toBeInTheDocument();
    expect(screen.getByText('Services View for namespace: postgres-db')).toBeInTheDocument();
  });
});
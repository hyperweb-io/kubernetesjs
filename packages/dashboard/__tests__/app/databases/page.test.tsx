import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import DatabasesPage from '@/app/databases/page';

describe('Databases Page', () => {
  it('should render the databases page', () => {
    render(<DatabasesPage />);
    
    // Check main title
    expect(screen.getByText('Databases')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Manage your cloud databases and data services/)).toBeInTheDocument();
  });

  it('should render cloud databases card', () => {
    render(<DatabasesPage />);
    
    // Check card title
    expect(screen.getByText('Cloud Databases')).toBeInTheDocument();
    
    // Check card description
    expect(screen.getByText('High-level database abstractions')).toBeInTheDocument();
    
    // Check coming soon message
    expect(screen.getByText(/Coming soon - manage your databases without infrastructure complexity/)).toBeInTheDocument();
  });
});


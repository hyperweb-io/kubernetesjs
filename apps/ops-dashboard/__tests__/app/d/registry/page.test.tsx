import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import RegistryPage from '@/app/d/registry/page';

describe('Registry Page', () => {
  it('should render the registry page', () => {
    render(<RegistryPage />);
    
    // Check main title
    expect(screen.getByText('Service Registry')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Central registry for services, contracts, and APIs/)).toBeInTheDocument();
  });

  it('should render register service button', () => {
    render(<RegistryPage />);
    
    expect(screen.getByRole('button', { name: /register service/i })).toBeInTheDocument();
  });

  it('should render stats cards', () => {
    render(<RegistryPage />);
    
    // Check stats cards
    expect(screen.getByText('Registered Services')).toBeInTheDocument();
    expect(screen.getByText('API Endpoints')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Schemas')).toBeInTheDocument();
  });

  it('should render service directory section', () => {
    render(<RegistryPage />);
    
    // Check section title
    expect(screen.getByText('Service Directory')).toBeInTheDocument();
    
    // Check placeholder content
    expect(screen.getByText(/Service registry interface coming soon/)).toBeInTheDocument();
  });
});


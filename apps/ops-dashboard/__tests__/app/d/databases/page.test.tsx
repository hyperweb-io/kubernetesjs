import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import DatabasesPage from '@/app/d/databases/page';

describe('Databases Page', () => {
  it('should render the databases page', () => {
    render(<DatabasesPage />);
    
    // Check main title
    expect(screen.getByText('Databases')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Manage your database instances and connections/)).toBeInTheDocument();
  });

  it('should render add database button', () => {
    render(<DatabasesPage />);
    
    expect(screen.getByRole('button', { name: /add database/i })).toBeInTheDocument();
  });

  it('should render stats cards', () => {
    render(<DatabasesPage />);
    
    // Check stats cards
    expect(screen.getByText('Total Databases')).toBeInTheDocument();
    expect(screen.getByText('Active Connections')).toBeInTheDocument();
    expect(screen.getByText('Connected Apps')).toBeInTheDocument();
    expect(screen.getByText('Storage Used')).toBeInTheDocument();
  });

  it('should render database instances section', () => {
    render(<DatabasesPage />);
    
    // Check section title
    expect(screen.getByText('Database Instances')).toBeInTheDocument();
    
    // Check placeholder content
    expect(screen.getByText(/Database management interface coming soon/)).toBeInTheDocument();
  });
});


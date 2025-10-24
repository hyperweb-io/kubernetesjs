import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import SmartObjectsDashboard from '@/app/d/page';

describe('Smart Objects Dashboard', () => {
  it('should render the main dashboard page', () => {
    render(<SmartObjectsDashboard />);
    
    // Check main title
    expect(screen.getByText('Smart Objects Dashboard')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/High-level management interface for your distributed applications/)).toBeInTheDocument();
  });

  it('should render quick stats cards', () => {
    render(<SmartObjectsDashboard />);
    
    // Check stats cards
    expect(screen.getByText('Active Services')).toBeInTheDocument();
    expect(screen.getByText('Database Connections')).toBeInTheDocument();
    expect(screen.getByText('Function Executions')).toBeInTheDocument();
    expect(screen.getByText('Connected Chains')).toBeInTheDocument();
  });

  it('should render cloud services section', () => {
    render(<SmartObjectsDashboard />);
    
    // Check section title
    expect(screen.getByText('Cloud Services')).toBeInTheDocument();
    
    // Check service cards
    expect(screen.getByText('Databases')).toBeInTheDocument();
    expect(screen.getByText('Cloud Functions')).toBeInTheDocument();
  });

  it('should render blockchain infrastructure section', () => {
    render(<SmartObjectsDashboard />);
    
    // Check section title
    expect(screen.getByText('Blockchain Infrastructure')).toBeInTheDocument();
    
    // Check blockchain service cards
    expect(screen.getByText('Blockchains')).toBeInTheDocument();
    expect(screen.getByText('Relayers')).toBeInTheDocument();
    expect(screen.getByText('Registry')).toBeInTheDocument();
  });

  it('should render quick actions section', () => {
    render(<SmartObjectsDashboard />);
    
    // Check section title
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    
    // Check action cards
    expect(screen.getByText('System Health')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });
});


import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import FunctionsPage from '@/app/d/functions/page';

describe('Functions Page', () => {
  it('should render the functions page', () => {
    render(<FunctionsPage />);
    
    // Check main title
    expect(screen.getByText('Cloud Functions')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Manage your serverless functions and microservices/)).toBeInTheDocument();
  });

  it('should render deploy function button', () => {
    render(<FunctionsPage />);
    
    expect(screen.getByRole('button', { name: /deploy function/i })).toBeInTheDocument();
  });

  it('should render stats cards', () => {
    render(<FunctionsPage />);
    
    // Check stats cards
    expect(screen.getByText('Functions')).toBeInTheDocument();
    expect(screen.getByText('Executions Today')).toBeInTheDocument();
    expect(screen.getByText('Avg Response Time')).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
  });

  it('should render function deployments section', () => {
    render(<FunctionsPage />);
    
    // Check section title
    expect(screen.getByText('Function Deployments')).toBeInTheDocument();
    
    // Check placeholder content
    expect(screen.getByText(/Function management interface coming soon/)).toBeInTheDocument();
  });
});


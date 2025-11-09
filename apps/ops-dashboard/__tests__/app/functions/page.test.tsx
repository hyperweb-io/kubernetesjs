import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import FunctionsPage from '@/app/functions/page';

describe('Functions Page', () => {
  it('should render the functions page', () => {
    render(<FunctionsPage />);
    
    // Check main title
    expect(screen.getByText('Cloud Functions')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Deploy and manage serverless functions/)).toBeInTheDocument();
  });

  it('should render serverless functions card', () => {
    render(<FunctionsPage />);
    
    // Check card title
    expect(screen.getByText('Serverless Functions')).toBeInTheDocument();
    
    // Check card description
    expect(screen.getByText('Auto-scaling compute functions')).toBeInTheDocument();
    
    // Check coming soon message
    expect(screen.getByText(/Coming soon - deploy functions without managing infrastructure/)).toBeInTheDocument();
  });
});


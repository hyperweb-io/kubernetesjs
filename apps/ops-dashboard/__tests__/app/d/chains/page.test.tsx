import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import ChainsPage from '@/app/d/chains/page';

describe('Chains Page', () => {
  it('should render the chains page', () => {
    render(<ChainsPage />);
    
    // Check main title
    expect(screen.getByText('Blockchains')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Manage your connected blockchain networks and nodes/)).toBeInTheDocument();
  });

  it('should render connect chain button', () => {
    render(<ChainsPage />);
    
    expect(screen.getByRole('button', { name: /connect chain/i })).toBeInTheDocument();
  });

  it('should render stats cards', () => {
    render(<ChainsPage />);
    
    // Check stats cards
    expect(screen.getByText('Connected Chains')).toBeInTheDocument();
    expect(screen.getByText('Active Nodes')).toBeInTheDocument();
    expect(screen.getByText('Networks')).toBeInTheDocument();
    expect(screen.getByText('Avg Block Time')).toBeInTheDocument();
  });

  it('should render chain connections section', () => {
    render(<ChainsPage />);
    
    // Check section title
    expect(screen.getByText('Chain Connections')).toBeInTheDocument();
    
    // Check placeholder content
    expect(screen.getByText(/Blockchain chain management interface coming soon/)).toBeInTheDocument();
  });
});


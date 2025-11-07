import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import RelayersPage from '@/app/d/relayers/page';

describe('Relayers Page', () => {
  it('should render the relayers page', () => {
    render(<RelayersPage />);
    
    // Check main title
    expect(screen.getByText('Cross-Chain Relayers')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Manage cross-chain communication and message relaying/)).toBeInTheDocument();
  });

  it('should render add relayer button', () => {
    render(<RelayersPage />);
    
    expect(screen.getByRole('button', { name: /add relayer/i })).toBeInTheDocument();
  });

  it('should render stats cards', () => {
    render(<RelayersPage />);
    
    // Check stats cards
    expect(screen.getByText('Active Relayers')).toBeInTheDocument();
    expect(screen.getByText('Messages Relayed')).toBeInTheDocument();
    expect(screen.getByText('Success Rate')).toBeInTheDocument();
    expect(screen.getByText('Avg Relay Time')).toBeInTheDocument();
  });

  it('should render relayer network section', () => {
    render(<RelayersPage />);
    
    // Check section title
    expect(screen.getByText('Relayer Network')).toBeInTheDocument();
    
    // Check placeholder content
    expect(screen.getByText(/Cross-chain relayer management interface coming soon/)).toBeInTheDocument();
  });
});


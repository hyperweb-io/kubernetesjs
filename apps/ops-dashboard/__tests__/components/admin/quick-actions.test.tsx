import React from 'react';

import { QuickActions } from '../../../components/admin/quick-actions';
import { render, screen } from '../../utils/test-utils';

describe('QuickActions', () => {
  it('renders header', () => {
    render(<QuickActions />);
    expect(screen.getByRole('heading', { name: 'Quick Actions' })).toBeInTheDocument();
  });

  it('renders all action buttons with correct labels and descriptions', () => {
    render(<QuickActions />);

    // Deploy Database
    expect(screen.getByText('Deploy Database')).toBeInTheDocument();
    expect(screen.getByText('Create a PostgreSQL cluster')).toBeInTheDocument();

    // Deploy Application
    expect(screen.getByText('Deploy Application')).toBeInTheDocument();
    expect(screen.getByText('Deploy a new application')).toBeInTheDocument();

    // Create Secret
    expect(screen.getByText('Create Secret')).toBeInTheDocument();
    expect(screen.getByText('Store credentials securely')).toBeInTheDocument();
  });

  it('links point to correct destinations', () => {
    render(<QuickActions />);

    expect(screen.getByRole('link', { name: /deploy database/i })).toHaveAttribute('href', '/databases/create');
    expect(screen.getByRole('link', { name: /deploy application/i })).toHaveAttribute('href', '/applications/create');
    expect(screen.getByRole('link', { name: /create secret/i })).toHaveAttribute('href', '/secrets/create');
  });

  it('renders color badge and icon containers for each action', () => {
    render(<QuickActions />);
    const colorBadges = document.querySelectorAll('div.p-2.rounded-md');
    expect(colorBadges.length).toBe(3);
    const icons = document.querySelectorAll('svg.lucide');
    expect(icons.length).toBeGreaterThanOrEqual(3);
  });
});

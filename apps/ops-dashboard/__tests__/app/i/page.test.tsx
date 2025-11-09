import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import InfrastructureOverviewPage from '@/app/i/page';

describe('Infrastructure Overview Page', () => {
  it('should render the infrastructure overview page', () => {
    render(<InfrastructureOverviewPage />);
    
    // Check main title
    expect(screen.getByText('Infrastructure Overview')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Manage your Kubernetes infrastructure resources/)).toBeInTheDocument();
  });

  it('should render all resource cards', () => {
    render(<InfrastructureOverviewPage />);
    
    // Check all resource cards are present (Templates card has been removed)
    expect(screen.getByText('View All')).toBeInTheDocument();
    expect(screen.getByText('Deployments')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Secrets')).toBeInTheDocument();
    expect(screen.getByText('ConfigMaps')).toBeInTheDocument();
    expect(screen.getByText('ReplicaSets')).toBeInTheDocument();
    expect(screen.getByText('Pods')).toBeInTheDocument();
  });

  it('should render resource descriptions', () => {
    render(<InfrastructureOverviewPage />);
    
    // Check resource descriptions (Templates card has been removed)
    expect(screen.getByText('See all resources in one dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manage and monitor your deployments')).toBeInTheDocument();
    expect(screen.getByText('Manage your services and networking')).toBeInTheDocument();
    expect(screen.getByText('Manage sensitive data and credentials')).toBeInTheDocument();
    expect(screen.getByText('Manage application configuration data')).toBeInTheDocument();
    expect(screen.getByText('Manage and monitor your replica sets')).toBeInTheDocument();
    expect(screen.getByText('Monitor and manage individual pods')).toBeInTheDocument();
  });

  it('should render quick stats section', () => {
    render(<InfrastructureOverviewPage />);
    
    // Check quick stats cards
    expect(screen.getByText('Quick Stats')).toBeInTheDocument();
    expect(screen.getByText('Namespace')).toBeInTheDocument();
    expect(screen.getByText('API Connection')).toBeInTheDocument();
  });

  it('should render quick stats descriptions', () => {
    render(<InfrastructureOverviewPage />);
    
    // Check quick stats descriptions
    expect(screen.getByText(/View detailed statistics for each resource type/)).toBeInTheDocument();
    expect(screen.getByText(/Use the namespace switcher in the header/)).toBeInTheDocument();
    expect(screen.getByText(/Connected to Kubernetes API/)).toBeInTheDocument();
  });

  it('should render resource cards as links', () => {
    render(<InfrastructureOverviewPage />);
    
    // Check that resource cards are wrapped in links
    const viewAllLink = screen.getByRole('link', { name: /view all/i });
    expect(viewAllLink).toHaveAttribute('href', '/i/all');
    
    const deploymentsLink = screen.getByRole('link', { name: /deployments/i });
    expect(deploymentsLink).toHaveAttribute('href', '/i/deployments');
    
    const servicesLink = screen.getByRole('link', { name: /services/i });
    expect(servicesLink).toHaveAttribute('href', '/i/services');
  });

  it('should render all resource links with correct hrefs', () => {
    render(<InfrastructureOverviewPage />);
    
    // Check all resource links have correct hrefs (Templates card has been removed)
    expect(screen.getByRole('link', { name: /view all/i })).toHaveAttribute('href', '/i/all');
    expect(screen.getByRole('link', { name: /deployments/i })).toHaveAttribute('href', '/i/deployments');
    expect(screen.getByRole('link', { name: /services/i })).toHaveAttribute('href', '/i/services');
    expect(screen.getByRole('link', { name: /secrets/i })).toHaveAttribute('href', '/i/secrets');
    expect(screen.getByRole('link', { name: /configmaps/i })).toHaveAttribute('href', '/i/configmaps');
    expect(screen.getByRole('link', { name: /replicasets/i })).toHaveAttribute('href', '/i/replicasets');
    expect(screen.getByRole('link', { name: /pods/i })).toHaveAttribute('href', '/i/pods');
  });
});


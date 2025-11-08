import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import DashboardPage from '@/app/admin/page';

// Mock the admin components
jest.mock('@/components/admin/cluster-overview', () => ({
  ClusterOverview: () => <div data-testid="cluster-overview">Cluster Overview</div>
}));

jest.mock('@/components/admin/operator-grid', () => ({
  OperatorGrid: () => <div data-testid="operator-grid">Operator Grid</div>
}));

jest.mock('@/components/admin/quick-actions', () => ({
  QuickActions: () => <div data-testid="quick-actions">Quick Actions</div>
}));

jest.mock('@/components/admin/recent-activity', () => ({
  RecentActivity: () => <div data-testid="recent-activity">Recent Activity</div>
}));

jest.mock('@/components/admin/resource-summary', () => ({
  ResourceSummary: () => <div data-testid="resource-summary">Resource Summary</div>
}));

describe('Admin Dashboard Page', () => {
  it('should render the admin dashboard page', () => {
    render(<DashboardPage />);
    
    // Check main title
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText(/Monitor your Kubernetes cluster and deployed operators/)).toBeInTheDocument();
  });

  it('should render refresh button', () => {
    render(<DashboardPage />);
    
    // Check refresh button
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });

  it('should render all admin components', () => {
    render(<DashboardPage />);
    
    // Check that all admin components are rendered
    expect(screen.getByTestId('cluster-overview')).toBeInTheDocument();
    expect(screen.getByTestId('operator-grid')).toBeInTheDocument();
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
    expect(screen.getByTestId('recent-activity')).toBeInTheDocument();
    expect(screen.getByTestId('resource-summary')).toBeInTheDocument();
  });
});
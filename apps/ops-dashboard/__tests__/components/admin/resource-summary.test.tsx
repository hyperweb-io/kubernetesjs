import React from 'react';

import { ResourceSummary } from '../../../components/admin/resource-summary';
import { render, screen } from '../../utils/test-utils';

// Mock useClusterStatus to control loading state
const mockUseClusterStatus = jest.fn();
jest.mock('../../../hooks/use-cluster-status', () => ({
  useClusterStatus: () => mockUseClusterStatus(),
}));

describe('ResourceSummary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton when loading', () => {
    mockUseClusterStatus.mockReturnValue({ data: undefined, isLoading: true });
    render(<ResourceSummary />);

    expect(screen.getByRole('heading', { name: 'Resource Summary' })).toBeInTheDocument();
    // Skeleton blocks present (based on animate-pulse class wrappers)
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders static resource summary when loaded', () => {
    mockUseClusterStatus.mockReturnValue({ data: { ok: true }, isLoading: false });
    render(<ResourceSummary />);

    expect(screen.getByRole('heading', { name: 'Resource Summary' })).toBeInTheDocument();

    // CPU
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('2.4 / 8.0 cores')).toBeInTheDocument();

    // Memory
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    expect(screen.getByText('4.2 / 16 GB')).toBeInTheDocument();

    // Storage
    expect(screen.getByText('Storage Usage')).toBeInTheDocument();
    expect(screen.getByText('45 / 100 GB')).toBeInTheDocument();

    // Progress bars exist
    const bars = document.querySelectorAll('div.bg-gray-200.rounded-full.h-2');
    expect(bars.length).toBe(3);
  });
});

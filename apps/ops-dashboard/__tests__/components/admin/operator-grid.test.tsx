import type { OperatorInfo } from '@kubernetesjs/client';
import React from 'react';

import { OperatorGrid } from '../../../components/admin/operator-grid';
import { render, screen } from '../../utils/test-utils';

// Mock useOperators hook
const mockUseOperators = jest.fn();
jest.mock('../../../hooks/use-operators', () => ({
  useOperators: () => mockUseOperators(),
}));

// Stub OperatorCard to avoid duplicating its logic; verify it receives props
jest.mock('../../../components/admin/operator-card', () => ({
  OperatorCard: ({ operator, compact }: { operator: OperatorInfo; compact?: boolean }) => (
    <div data-testid={`operator-card-${operator.name}`} data-compact={compact}>
      {operator.displayName}
    </div>
  )
}));

const makeOps = (n: number): OperatorInfo[] =>
  Array.from({ length: n }).map((_, i) => ({
    name: `op-${i + 1}`,
    displayName: `Operator ${i + 1}`,
    version: '1.0.0',
    description: 'desc',
    status: i % 2 === 0 ? 'installed' as const : 'not-installed' as const,
    docsUrl: 'https://example.com',
  }));

describe('OperatorGrid', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseOperators.mockReturnValue({ data: undefined, isLoading: true, error: null });
    render(<OperatorGrid />);
    expect(screen.getByText('Loading operators...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseOperators.mockReturnValue({ data: undefined, isLoading: false, error: new Error('boom') });
    render(<OperatorGrid />);
    expect(screen.getByText('Failed to load operators')).toBeInTheDocument();
    expect(screen.getByText('Check your cluster connection')).toBeInTheDocument();
  });

  it('renders installed count and total', () => {
    const ops = makeOps(5);
    mockUseOperators.mockReturnValue({ data: ops, isLoading: false, error: null });
    render(<OperatorGrid />);
    // Specific heading
    expect(screen.getByRole('heading', { name: 'Operators' })).toBeInTheDocument();
    expect(screen.getByText('3 of 5 operators installed')).toBeInTheDocument();
  });

  it('renders up to 6 compact OperatorCard items', () => {
    const ops = makeOps(8);
    mockUseOperators.mockReturnValue({ data: ops, isLoading: false, error: null });
    render(<OperatorGrid />);

    // Should render only first 6
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByTestId(`operator-card-op-${i}`)).toBeInTheDocument();
      expect(screen.getByTestId(`operator-card-op-${i}`)).toHaveAttribute('data-compact', 'true');
    }
    expect(screen.queryByTestId('operator-card-op-7')).not.toBeInTheDocument();
    expect(screen.queryByTestId('operator-card-op-8')).not.toBeInTheDocument();
  });

  it('renders "View all" links correctly when more than 6', () => {
    const ops = makeOps(8);
    mockUseOperators.mockReturnValue({ data: ops, isLoading: false, error: null });
    render(<OperatorGrid />);

    expect(screen.getByRole('link', { name: /^View all$/i })).toHaveAttribute('href', '/operators');
    expect(screen.getByRole('link', { name: /View all 8 operators/i })).toHaveAttribute('href', '/operators');
  });
});

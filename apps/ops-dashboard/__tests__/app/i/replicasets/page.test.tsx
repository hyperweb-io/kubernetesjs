import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import ReplicaSetsPage from '@/app/i/replicasets/page';

// Mock the ReplicaSetsView component
jest.mock('@/components/resources/replicasets', () => ({
  ReplicaSetsView: () => <div data-testid="replicasets-view">ReplicaSets View</div>
}));

describe('ReplicaSets Page', () => {
  it('should render the replicasets view', () => {
    render(<ReplicaSetsPage />);
    
    // Check that ReplicaSetsView is rendered
    expect(screen.getByTestId('replicasets-view')).toBeInTheDocument();
    expect(screen.getByText('ReplicaSets View')).toBeInTheDocument();
  });
});


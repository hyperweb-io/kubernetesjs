import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import JobsPage from '@/app/i/jobs/page';

// Mock the JobsView component
jest.mock('@/components/resources/jobs', () => ({
  JobsView: () => <div data-testid="jobs-view">JobsView</div>
}));

describe('JobsPage', () => {
  it('should render the jobs view', () => {
    render(<JobsPage />);
    
    // Check that JobsView is rendered
    expect(screen.getByTestId('jobs-view')).toBeInTheDocument();
    expect(screen.getByText('JobsView')).toBeInTheDocument();
  });
});

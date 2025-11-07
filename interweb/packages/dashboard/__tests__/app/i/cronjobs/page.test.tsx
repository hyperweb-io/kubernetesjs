import React from 'react';
import { render, screen } from '@/__tests__/utils/test-utils';
import CronJobsPage from '@/app/i/cronjobs/page';

// Mock the CronJobsView component
jest.mock('@/components/resources/cronjobs', () => ({
  CronJobsView: () => <div data-testid="cronjobs-view">CronJobsView</div>
}));

describe('CronJobsPage', () => {
  it('should render the cronjobs view', () => {
    render(<CronJobsPage />);
    
    // Check that CronJobsView is rendered
    expect(screen.getByTestId('cronjobs-view')).toBeInTheDocument();
    expect(screen.getByText('CronJobsView')).toBeInTheDocument();
  });
});

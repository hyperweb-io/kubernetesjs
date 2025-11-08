import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import EventsPage from '@/app/i/events/page';

// Mock the EventsView component
jest.mock('@/components/resources/events', () => ({
  EventsView: () => <div data-testid="events-view">EventsView</div>
}));

describe('EventsPage', () => {
  it('should render the events view', () => {
    render(<EventsPage />);
    
    // Check that EventsView is rendered
    expect(screen.getByTestId('events-view')).toBeInTheDocument();
    expect(screen.getByText('EventsView')).toBeInTheDocument();
  });
});

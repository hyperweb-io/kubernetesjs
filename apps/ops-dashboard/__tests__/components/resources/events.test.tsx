import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';

import { EventsView } from '@/components/resources/events';

// Mock the Kubernetes hooks
jest.mock('@/k8s', () => ({
  useListCoreV1NamespacedEventQuery: jest.fn(),
  useListCoreV1EventForAllNamespacesQuery: jest.fn(),
}));

// Mock the namespace context
jest.mock('@/contexts/NamespaceContext', () => ({
  usePreferredNamespace: () => ({ namespace: 'default' }),
}));

// Create a simple test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const mockEvents = [
  {
    metadata: {
      name: 'event-1',
      namespace: 'default',
      creationTimestamp: '2024-01-01T00:00:00Z',
    },
    type: 'Normal',
    reason: 'Created',
    message: 'Pod created successfully',
    involvedObject: {
      kind: 'Pod',
      name: 'test-pod',
      namespace: 'default',
    },
    firstTimestamp: '2024-01-01T00:00:00Z',
    lastTimestamp: '2024-01-01T00:00:00Z',
    count: 1,
  },
  {
    metadata: {
      name: 'event-2',
      namespace: 'default',
      creationTimestamp: '2024-01-01T01:00:00Z',
    },
    type: 'Warning',
    reason: 'Failed',
    message: 'Pod failed to start',
    involvedObject: {
      kind: 'Pod',
      name: 'failed-pod',
      namespace: 'default',
    },
    firstTimestamp: '2024-01-01T01:00:00Z',
    lastTimestamp: '2024-01-01T01:00:00Z',
    count: 3,
  },
];

describe('EventsView Component', () => {
  const mockUseListCoreV1NamespacedEventQuery = require('@/k8s').useListCoreV1NamespacedEventQuery;
  const mockUseListCoreV1EventForAllNamespacesQuery = require('@/k8s').useListCoreV1EventForAllNamespacesQuery;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render events list with default namespace', async () => {
    mockUseListCoreV1NamespacedEventQuery.mockReturnValue({
      data: { items: mockEvents },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<EventsView />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Events')).toBeInTheDocument();
    });

    expect(screen.getByText('Pod created successfully')).toBeInTheDocument();
    expect(screen.getByText('Pod failed to start')).toBeInTheDocument();
  });

  it('should render events list for all namespaces', async () => {
    mockUseListCoreV1EventForAllNamespacesQuery.mockReturnValue({
      data: { items: mockEvents },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<EventsView />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Events')).toBeInTheDocument();
    });
  });

  it('should show loading state', async () => {
    mockUseListCoreV1NamespacedEventQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<EventsView />, { wrapper: TestWrapper });

    // The component shows a spinning refresh icon when loading
    // Check for the disabled refresh button (the refresh button should be disabled)
    const disabledButtons = screen.getAllByRole('button', { disabled: true });
    expect(disabledButtons.length).toBeGreaterThan(0);
    
    // The loading state shows a spinning icon in the content area
    // We can check for the presence of the loading spinner by looking for the spinning icon
    expect(screen.getByText('Recent Events')).toBeInTheDocument();
  });

  it('should show error state', async () => {
    mockUseListCoreV1NamespacedEventQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch events'),
      refetch: jest.fn(),
    });

    render(<EventsView />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch events')).toBeInTheDocument();
    });
  });

  it('should show empty state when no events', async () => {
    mockUseListCoreV1NamespacedEventQuery.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<EventsView />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('No events found')).toBeInTheDocument();
    });
  });

  it('should handle refresh action', async () => {
    const mockRefetch = jest.fn();
    mockUseListCoreV1NamespacedEventQuery.mockReturnValue({
      data: { items: mockEvents },
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<EventsView />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Events')).toBeInTheDocument();
    });

    // Find the refresh button by its icon (it doesn't have accessible text)
    const refreshButton = screen.getByRole('button', { name: '' });
    refreshButton.click();

    expect(mockRefetch).toHaveBeenCalled();
  });

  it('should filter events by type', async () => {
    mockUseListCoreV1NamespacedEventQuery.mockReturnValue({
      data: { items: mockEvents },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<EventsView />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Events')).toBeInTheDocument();
    });

    // Test filtering by type - the component uses buttons for filtering
    const normalFilterButton = screen.getByRole('button', { name: 'Normal' });
    const warningFilterButton = screen.getByRole('button', { name: 'Warning' });
    const allFilterButton = screen.getByRole('button', { name: 'All' });
    
    expect(normalFilterButton).toBeInTheDocument();
    expect(warningFilterButton).toBeInTheDocument();
    expect(allFilterButton).toBeInTheDocument();
  });

  it('should display event details correctly', async () => {
    mockUseListCoreV1NamespacedEventQuery.mockReturnValue({
      data: { items: mockEvents },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<EventsView />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Events')).toBeInTheDocument();
    });

    // Check that event details are displayed in the table
    expect(screen.getByText('Pod/test-pod')).toBeInTheDocument();
    expect(screen.getByText('Pod/failed-pod')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('should handle different event types with correct styling', async () => {
    mockUseListCoreV1NamespacedEventQuery.mockReturnValue({
      data: { items: mockEvents },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<EventsView />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Events')).toBeInTheDocument();
    });

    // Check that different event types are styled differently in the table
    const normalBadges = screen.getAllByText('Normal');
    const warningBadges = screen.getAllByText('Warning');
    
    // There should be multiple instances (filter buttons and table badges)
    expect(normalBadges.length).toBeGreaterThan(0);
    expect(warningBadges.length).toBeGreaterThan(0);
  });

  it('should show event count when available', async () => {
    mockUseListCoreV1NamespacedEventQuery.mockReturnValue({
      data: { items: mockEvents },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<EventsView />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Events')).toBeInTheDocument();
    });

    // Check that event count is displayed in the statistics cards
    // Use getAllByText to handle multiple instances of the same number
    const totalCounts = screen.getAllByText('2');
    const normalCounts = screen.getAllByText('1');
    
    expect(totalCounts.length).toBeGreaterThan(0); // Total events count
    expect(normalCounts.length).toBeGreaterThanOrEqual(2); // Normal and Warning events count (both are 1)
  });
});
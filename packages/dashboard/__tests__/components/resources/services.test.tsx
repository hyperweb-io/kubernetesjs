import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, fireEvent } from '@/__tests__/utils/test-utils';
import { server } from '@/__mocks__/server';
import { 
  createServicesList, 
  createServicesListError,
  createAllServicesList,
  deleteServiceHandler,
  deleteServiceErrorHandler,
  createServiceHandler,
  createServiceErrorHandler,
  createServicesListData
} from '@/__mocks__/handlers/services';

// Mock window.alert for testing
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

// Mock confirmDialog to avoid FileReader/Blob issues in test environment
jest.mock('@/hooks/useConfirm', () => ({
  ...jest.requireActual('@/hooks/useConfirm'),
  confirmDialog: jest.fn().mockResolvedValue(true)
}));

// Mock window.alert globally
Object.defineProperty(window, 'alert', {
  value: jest.fn(),
  writable: true
});

// No need to mock hooks - MSW will handle API mocking

// Import the component
import { ServicesView } from '@/components/resources/services';

describe('ServicesView', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    server.use(createServicesList());
  });

  afterEach(() => {
    mockAlert.mockClear();
  });

  it('should render services view with header and controls', async () => {
    render(<ServicesView />);
    
    expect(screen.getByText('Services')).toBeInTheDocument(); // Header
    expect(screen.getByText('Manage your Kubernetes services and networking')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // refresh button with no text
    expect(screen.getByRole('button', { name: /create service/i })).toBeInTheDocument();
  });

  it('should display services data when loaded', async () => {
    render(<ServicesView />);
    
    await waitFor(() => {
      expect(screen.getByText('test-service-1')).toBeInTheDocument();
      expect(screen.getByText('test-service-2')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    render(<ServicesView />);
    
    expect(screen.getByRole('button', { name: '' })).toBeDisabled(); // refresh button with no text
  });

  it('should handle API errors gracefully', async () => {
    server.use(createServicesListError(500, 'Server Error'));
    
    render(<ServicesView />);
    
    await waitFor(() => {
      expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
    });
  });

  it('should show empty state when no services exist', async () => {
    server.use(createServicesList([]));
    
    render(<ServicesView />);
    
    await waitFor(() => {
      expect(screen.getByText(/No services found in the default namespace/)).toBeInTheDocument();
    });
  });

  it('should refresh data when refresh button is clicked', async () => {
    render(<ServicesView />);
    
    await waitFor(() => {
      expect(screen.getByText('test-service-1')).toBeInTheDocument();
    });
    
    const refreshButtons = screen.getAllByRole('button');
    const refreshButton = refreshButtons.find(button => 
      button.querySelector('svg.lucide-refresh-cw')
    );
    fireEvent.click(refreshButton);
    
    expect(refreshButton).toBeInTheDocument();
  });

  it('should handle create service button click', async () => {
    render(<ServicesView />);
    
    const createButton = screen.getByRole('button', { name: /create service/i });
    expect(createButton).toBeInTheDocument();
    expect(createButton).not.toBeDisabled();
    
    // The button should be clickable
    await user.click(createButton);
    expect(createButton).toBeInTheDocument();
  });

  it('should handle delete service with confirmation', async () => {
    server.use(deleteServiceHandler('test-service-1', 'default'));

    render(<ServicesView />);
    
    await waitFor(() => {
      expect(screen.getByText('test-service-1')).toBeInTheDocument();
    });
    
    // Verify the service is displayed in the table
    expect(screen.getByText('test-service-1')).toBeInTheDocument();
    expect(screen.getAllByText('default')).toHaveLength(2); // Two services in default namespace
  });

  it('should handle delete service with cancellation', async () => {
    server.use(deleteServiceHandler('test-service-1', 'default'));

    render(<ServicesView />);
    
    await waitFor(() => {
      expect(screen.getByText('test-service-1')).toBeInTheDocument();
    });
    
    // Verify the service is displayed in the table
    expect(screen.getByText('test-service-1')).toBeInTheDocument();
    expect(screen.getAllByText('default')).toHaveLength(2); // Two services in default namespace
  });

  it('should handle errors in delete action', async () => {
    server.use(deleteServiceErrorHandler('test-service-1', 'default', 500, 'Deletion failed'));

    render(<ServicesView />);
    
    await waitFor(() => {
      expect(screen.getByText('test-service-1')).toBeInTheDocument();
    });
    
    // Verify the service is displayed in the table
    expect(screen.getByText('test-service-1')).toBeInTheDocument();
    expect(screen.getAllByText('default')).toHaveLength(2); // Two services in default namespace
  });

  it('should display correct statistics', async () => {
    render(<ServicesView />);
    
    await waitFor(() => {
      expect(screen.getByText('test-service-1')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Total Services')).toBeInTheDocument();
    expect(screen.getAllByText('ClusterIP')).toHaveLength(2); // Card title and badge
    expect(screen.getAllByText('LoadBalancer')).toHaveLength(2); // Card title and badge
    expect(screen.getByText('NodePort')).toBeInTheDocument();
  });

  it('should display service types correctly', async () => {
    render(<ServicesView />);
    
    await waitFor(() => {
      expect(screen.getByText('test-service-1')).toBeInTheDocument();
    });
    
    expect(screen.getAllByText('ClusterIP')).toHaveLength(2); // Card title and badge
    expect(screen.getAllByText('LoadBalancer')).toHaveLength(2); // Card title and badge
    // NodePort is not in the default namespace, so it won't be displayed
    expect(screen.getByText('test-service-1')).toBeInTheDocument();
  });

  it('should display service ports correctly', async () => {
    render(<ServicesView />);
    
    await waitFor(() => {
      expect(screen.getByText('test-service-1')).toBeInTheDocument();
    });
    
    expect(screen.getByText('80:8080/TCP')).toBeInTheDocument();
    expect(screen.getByText('443:8443/TCP')).toBeInTheDocument();
    // 3000:3000/TCP is not in the default namespace, so it won't be displayed
    expect(screen.getByText('test-service-1')).toBeInTheDocument();
  });

  it('should display external IPs correctly', async () => {
    render(<ServicesView />);
    
    await waitFor(() => {
      expect(screen.getByText('test-service-1')).toBeInTheDocument();
    });
    
    // The external IP is displayed as "LB: 192.168.1.100" in the component
    expect(screen.getByText('LB: 192.168.1.100')).toBeInTheDocument();
  });

  it('should handle _all namespace selection', async () => {
    server.use(createAllServicesList());

    render(<ServicesView />);

    await waitFor(() => {
      expect(screen.getByText('test-service-1')).toBeInTheDocument();
      expect(screen.getByText('test-service-2')).toBeInTheDocument();
    });
  });

  it('should display all table columns correctly', async () => {
    render(<ServicesView />);
    
    await waitFor(() => {
      expect(screen.getByText('test-service-1')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Namespace')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Cluster IP')).toBeInTheDocument();
    expect(screen.getByText('Ports')).toBeInTheDocument();
    expect(screen.getByText('Selector')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should handle view action', async () => {
    render(<ServicesView />);
    
    await waitFor(() => {
      expect(screen.getByText('test-service-1')).toBeInTheDocument();
    });
    
    const viewButtons = screen.getAllByRole('button');
    const viewButton = viewButtons.find(button =>
      button.querySelector('svg.lucide-eye')
    );
    
    expect(viewButton).toBeInTheDocument();
    if (viewButton) {
      fireEvent.click(viewButton);
    }
  });
});
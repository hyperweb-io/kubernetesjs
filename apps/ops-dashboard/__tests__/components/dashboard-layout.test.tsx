import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createNamespacesList } from '@/__mocks__/handlers/namespaces';
import { server } from '@/__mocks__/server';
import { DashboardLayout } from '@/components/dashboard-layout';

import { render } from '../utils/test-utils';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/i/deployments'),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));



describe('DashboardLayout', () => {
  const defaultProps = {
    children: <div data-testid="main-content">Main Content</div>,
    onChatToggle: jest.fn(),
    chatVisible: false,
    chatLayoutMode: 'floating' as const,
    chatWidth: 400,
    mode: 'infra' as const,
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();

    // Create a real localStorage mock that actually works
    const localStorageMock = (() => {
      let store: Record<string, string> = {};

      return {
        getItem: (key: string) => {
          return store[key] || null;
        },
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
        get length() {
          return Object.keys(store).length;
        },
        key: (index: number) => {
          const keys = Object.keys(store);
          return keys[index] || null;
        }
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    server.use(createNamespacesList());
  });

  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      render(<DashboardLayout {...defaultProps} />);
      
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });

    it('should render different headers based on mode', () => {
      render(<DashboardLayout {...defaultProps} mode="smart-objects" />);
      expect(screen.getByText('Cloud')).toBeInTheDocument();

      render(<DashboardLayout {...defaultProps} mode="infra" />);
      expect(screen.getByText('All Resources')).toBeInTheDocument();

      render(<DashboardLayout {...defaultProps} mode="admin" />);
      expect(screen.getByText('Cluster Summary')).toBeInTheDocument();
    });

    it('should render sidebar with correct initial state', () => {
      render(<DashboardLayout {...defaultProps} />);
      
      // Sidebar should be open by default
      const sidebar = screen.getByRole('complementary', { hidden: true });
      expect(sidebar).toHaveClass('w-64'); // Full width when open
    });
  });

  describe('Sidebar Functionality', () => {
    it('should toggle sidebar open/close', async () => {
      const user = userEvent.setup();
      render(<DashboardLayout {...defaultProps} />);
      
      // Find the sidebar toggle button (hamburger menu in header)
      const toggleButton = screen.getByRole('button', { name: /close sidebar/i });
      
      // Initially sidebar should be open
      const sidebar = screen.getByRole('complementary', { hidden: true });
      expect(sidebar).toHaveClass('w-64');
      
      // Click to close
      await user.click(toggleButton);
      await waitFor(() => {
        expect(sidebar).toHaveClass('w-0');
      });
      
      // Click to open again
      await user.click(toggleButton);
      await waitFor(() => {
        expect(sidebar).toHaveClass('w-64');
      });
    });

    it('should toggle compact mode', async () => {
      const user = userEvent.setup();
      render(<DashboardLayout {...defaultProps} />);
      
      // Find the compact toggle button
      const compactToggle = screen.getByRole('button', { name: /collapse sidebar/i });
      
      // Initially should be in full mode
      const sidebar = screen.getByRole('complementary', { hidden: true });
      expect(sidebar).toHaveClass('w-64');
      
      // Click to make compact
      await user.click(compactToggle);
      await waitFor(() => {
        expect(sidebar).toHaveClass('w-16');
      });
      
      // Sidebar should be in compact mode (w-16)
      expect(sidebar).toHaveClass('w-16');
    });

    it('should persist sidebar state in localStorage', async () => {
      const user = userEvent.setup();
      render(<DashboardLayout {...defaultProps} />);
      
      // Toggle sidebar closed
      const toggleButton = screen.getByRole('button', { name: /close sidebar/i });
      await user.click(toggleButton);
      
      // Check localStorage was updated
      expect(localStorage.getItem('hyperweb-sidebar-open')).toBe('false');
      
      // Toggle compact mode
      const compactToggle = screen.getByRole('button', { name: /collapse sidebar/i });
      await user.click(compactToggle);
      
      expect(localStorage.getItem('hyperweb-sidebar-compact')).toBe('true');
    });

    it('should load saved preferences from localStorage', () => {
      // Set some saved preferences in localStorage
      localStorage.setItem('hyperweb-sidebar-open', 'false');
      localStorage.setItem('hyperweb-sidebar-compact', 'true');
      localStorage.setItem('hyperweb-expanded-sections', '["workloads"]');
      
      render(<DashboardLayout {...defaultProps} />);
      
      const sidebar = screen.getByRole('complementary', { hidden: true });
      // When sidebar is closed (w-0) and compact (w-16), it should be w-0
      expect(sidebar).toHaveClass('w-0');
    });
  });

  describe('Navigation Items', () => {
    it('should render infrastructure navigation items', () => {
      render(<DashboardLayout {...defaultProps} mode="infra" />);
      
      // Check for some key infrastructure items
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('All Resources')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /deployments/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /pods/i })).toBeInTheDocument();
    });

    it('should render smart objects navigation items', () => {
      render(<DashboardLayout {...defaultProps} mode="smart-objects" />);
      
      // Check for smart objects items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Databases')).toBeInTheDocument();
      expect(screen.getByText('Cloud Functions')).toBeInTheDocument();
    });

    it('should render admin navigation items', () => {
      render(<DashboardLayout {...defaultProps} mode="admin" />);
      
      // Check for admin items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Operators')).toBeInTheDocument();
      expect(screen.getByText('Cluster Summary')).toBeInTheDocument();
    });

    it('should highlight active navigation item', () => {
      // mockUsePathname is already set to return '/i/deployments' at the top
      render(<DashboardLayout {...defaultProps} mode="infra" />);
      
      const deploymentsLink = screen.getByRole('link', { name: /deployments/i });
      expect(deploymentsLink).toHaveClass('bg-accent', 'border-l-4', 'border-primary');
    });
  });

  describe('Section Expansion', () => {
    it('should toggle section expansion', async () => {
      const user = userEvent.setup();
      render(<DashboardLayout {...defaultProps} mode="infra" />);
      
      // Find a collapsible section header
      const workloadsHeader = screen.getByText('Workloads');
      expect(workloadsHeader).toBeInTheDocument();
      
      // Click to collapse
      await user.click(workloadsHeader);
      
      // Section items should be hidden (check for specific navigation link)
      await waitFor(() => {
        const deploymentsLink = screen.queryByRole('link', { name: /deployments/i });
        expect(deploymentsLink).not.toBeInTheDocument();
      });
      
      // Click to expand again
      await user.click(workloadsHeader);
      
      // Section items should be visible again
      await waitFor(() => {
        const deploymentsLink = screen.getByRole('link', { name: /deployments/i });
        expect(deploymentsLink).toBeInTheDocument();
      });
    });

    it('should persist section expansion state', async () => {
      const user = userEvent.setup();
      render(<DashboardLayout {...defaultProps} mode="infra" />);
      
      // Collapse a section
      const workloadsHeader = screen.getByText('Workloads');
      await user.click(workloadsHeader);
      
      // Check localStorage
      const savedSections = JSON.parse(localStorage.getItem('hyperweb-expanded-sections') || '[]');
      expect(savedSections).not.toContain('workloads');
    });
  });

  describe('Chat Integration', () => {
    it('should adjust layout for snapped chat mode', () => {
      render(
        <DashboardLayout
          {...defaultProps}
          chatVisible={true}
          chatLayoutMode="snapped"
          chatWidth={400}
        />
      );
      
      // Find the main content container (the div that contains the header and main)
      const mainContentContainer = screen.getByRole('main').closest('div');
      expect(mainContentContainer).toHaveStyle({ marginRight: '400px' });
    });

    it('should not adjust layout for floating chat mode', () => {
      render(
        <DashboardLayout 
          {...defaultProps} 
          chatVisible={true}
          chatLayoutMode="floating"
          chatWidth={400}
        />
      );
      
      const mainContent = screen.getByTestId('main-content').closest('div');
      expect(mainContent).not.toHaveStyle({ marginRight: '400px' });
    });
  });

  describe('Responsive Behavior', () => {
    it('should hide section headers in compact mode', async () => {
      const user = userEvent.setup();
      render(<DashboardLayout {...defaultProps} mode="infra" />);
      
      // Switch to compact mode
      const compactToggle = screen.getByRole('button', { name: /collapse sidebar/i });
      await user.click(compactToggle);
      
      // Section headers should be hidden
      expect(screen.queryByText('Workloads')).not.toBeInTheDocument();
      expect(screen.queryByText('Config & Storage')).not.toBeInTheDocument();
    });

    it('should show tooltips in compact mode', () => {
      render(<DashboardLayout {...defaultProps} mode="infra" />);
      
      // Switch to compact mode
      const compactToggle = screen.getByRole('button', { name: /collapse sidebar/i });
      fireEvent.click(compactToggle);
      
      // Navigation items should have title attributes
      const deploymentsLink = screen.getByTitle('Deployments');
      expect(deploymentsLink).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing localStorage gracefully', () => {
      // Mock localStorage to throw errors
      const originalLocalStorage = global.localStorage;
      global.localStorage = {
        ...originalLocalStorage,
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
      };
      
      expect(() => {
        render(<DashboardLayout {...defaultProps} />);
      }).not.toThrow();
      
      global.localStorage = originalLocalStorage;
    });

    it('should handle invalid localStorage data gracefully', () => {
      // Set invalid JSON in localStorage
      localStorage.setItem('hyperweb-expanded-sections', 'invalid-json');
      
      expect(() => {
        render(<DashboardLayout {...defaultProps} />);
      }).not.toThrow();
    });
  });
});

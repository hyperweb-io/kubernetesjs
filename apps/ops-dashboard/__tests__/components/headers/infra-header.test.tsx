import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { server } from '@/__mocks__/server';

import { InfraHeader } from '../../../components/headers/infra-header';
import { render, screen } from '../../utils/test-utils';

describe('InfraHeader', () => {
  const defaultProps = {
    sidebarOpen: false,
    onSidebarToggle: jest.fn(),
    activeSection: 'Deployments',
    onChatToggle: jest.fn(),
    chatVisible: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the Kubernetes API calls that the InfraHeader component makes
    server.use(
      http.get('http://localhost:8001/api/v1/namespaces', () => {
        return HttpResponse.json({
          apiVersion: 'v1',
          kind: 'NamespaceList',
          items: [
            {
              metadata: { 
                name: 'default', 
                uid: 'ns-1',
                labels: { 'kubernetes.io/metadata.name': 'default' },
                creationTimestamp: new Date('2023-01-01T00:00:00Z')
              },
              spec: {},
              status: { phase: 'Active' }
            },
            {
              metadata: { 
                name: 'kube-system', 
                uid: 'ns-2',
                labels: { 'kubernetes.io/metadata.name': 'kube-system' },
                creationTimestamp: new Date('2023-01-01T00:00:00Z')
              },
              spec: {},
              status: { phase: 'Active' }
            }
          ]
        });
      })
    );
  });

  describe('Basic Rendering', () => {
    it('should render header with all elements', () => {
      render(<InfraHeader {...defaultProps} />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('Deployments')).toBeInTheDocument();
      expect(screen.getByText(/Cluster:/)).toBeInTheDocument();
    });

    it('should render sidebar toggle button', () => {
      render(<InfraHeader {...defaultProps} />);
      
      const sidebarButton = screen.getByRole('button', { name: /open sidebar/i });
      expect(sidebarButton).toBeInTheDocument();
    });

    it('should render chat toggle button', () => {
      render(<InfraHeader {...defaultProps} />);
      
      // Find chat button by its message-square icon
      const buttons = screen.getAllByRole('button');
      const chatButton = buttons.find(button => button.querySelector('.lucide-message-square'));
      expect(chatButton).toBeInTheDocument();
    });

    it('should render namespace switcher', () => {
      render(<InfraHeader {...defaultProps} />);
      
      expect(screen.getByText('Namespace:')).toBeInTheDocument();
    });

    it('should render theme toggle', () => {
      render(<InfraHeader {...defaultProps} />);
      
      const themeButton = screen.getByRole('button', { name: /toggle theme/i });
      expect(themeButton).toBeInTheDocument();
    });
  });

  describe('Sidebar Toggle', () => {
    it('should show close icon when sidebar is open', () => {
      render(<InfraHeader {...defaultProps} sidebarOpen={true} />);
      
      const sidebarButton = screen.getByRole('button', { name: /close sidebar/i });
      expect(sidebarButton).toBeInTheDocument();
    });

    it('should show menu icon when sidebar is closed', () => {
      render(<InfraHeader {...defaultProps} sidebarOpen={false} />);
      
      const sidebarButton = screen.getByRole('button', { name: /open sidebar/i });
      expect(sidebarButton).toBeInTheDocument();
    });

    it('should call onSidebarToggle when clicked', async () => {
      const user = userEvent.setup();
      const mockToggle = jest.fn();
      
      render(<InfraHeader {...defaultProps} onSidebarToggle={mockToggle} />);
      
      const sidebarButton = screen.getByRole('button', { name: /open sidebar/i });
      await user.click(sidebarButton);
      
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Chat Toggle', () => {
    it('should show chat button', () => {
      render(<InfraHeader {...defaultProps} />);
      
      // Find chat button by its message-square icon
      const buttons = screen.getAllByRole('button');
      const chatButton = buttons.find(button => button.querySelector('.lucide-message-square'));
      expect(chatButton).toBeInTheDocument();
    });

    it('should call onChatToggle when clicked', async () => {
      const user = userEvent.setup();
      const mockChatToggle = jest.fn();
      
      render(<InfraHeader {...defaultProps} onChatToggle={mockChatToggle} />);
      
      // Find chat button by its message-square icon
      const buttons = screen.getAllByRole('button');
      const chatButton = buttons.find(button => button.querySelector('.lucide-message-square'));
      expect(chatButton).toBeInTheDocument();
      
      if (chatButton) {
        await user.click(chatButton);
        expect(mockChatToggle).toHaveBeenCalledTimes(1);
      }
    });

    it('should apply accent class when chat is visible', () => {
      render(<InfraHeader {...defaultProps} chatVisible={true} />);
      
      // Find chat button by its message-square icon
      const buttons = screen.getAllByRole('button');
      const chatButton = buttons.find(button => button.querySelector('.lucide-message-square'));
      expect(chatButton).toBeInTheDocument();
      expect(chatButton).toHaveClass('bg-accent');
    });

    it('should not apply accent class when chat is not visible', () => {
      render(<InfraHeader {...defaultProps} chatVisible={false} />);
      
      // Find chat button by its message-square icon
      const buttons = screen.getAllByRole('button');
      const chatButton = buttons.find(button => button.querySelector('.lucide-message-square'));
      expect(chatButton).toBeInTheDocument();
      expect(chatButton).not.toHaveClass('bg-accent');
    });
  });

  describe('Active Section Display', () => {
    it('should display the active section', () => {
      render(<InfraHeader {...defaultProps} activeSection="Pods" />);
      
      expect(screen.getByText('Pods')).toBeInTheDocument();
    });

    it('should update when active section changes', () => {
      const { rerender } = render(<InfraHeader {...defaultProps} activeSection="Deployments" />);
      
      expect(screen.getByText('Deployments')).toBeInTheDocument();
      
      rerender(<InfraHeader {...defaultProps} activeSection="Services" />);
      
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.queryByText('Deployments')).not.toBeInTheDocument();
    });
  });

  describe('Cluster Information', () => {
    it('should display cluster endpoint', () => {
      render(<InfraHeader {...defaultProps} />);
      
      expect(screen.getByText(/Cluster:/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper header role', () => {
      render(<InfraHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should have proper button labels', () => {
      render(<InfraHeader {...defaultProps} />);
      
      const sidebarButton = screen.getByRole('button', { name: /open sidebar/i });
      expect(sidebarButton).toHaveAttribute('aria-label', 'Open sidebar');
    });

    it('should have proper heading structure', () => {
      render(<InfraHeader {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Deployments');
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct header classes', () => {
      render(<InfraHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-card', 'border-b', 'px-6', 'py-4');
    });

    it('should have flex layout', () => {
      render(<InfraHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('flex', 'items-center', 'justify-between');
    });
  });
});

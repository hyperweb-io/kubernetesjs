import userEvent from '@testing-library/user-event';

import { AdminHeader } from '../../../components/headers/admin-header';
import { render, screen } from '../../utils/test-utils';

describe('AdminHeader', () => {
  const defaultProps = {
    sidebarOpen: false,
    onSidebarToggle: jest.fn(),
    activeSection: 'Admin',
    onChatToggle: jest.fn(),
    chatVisible: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render header with all elements', () => {
      render(<AdminHeader {...defaultProps} />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('should render sidebar toggle button', () => {
      render(<AdminHeader {...defaultProps} />);
      
      const sidebarButton = screen.getByRole('button', { name: /open sidebar/i });
      expect(sidebarButton).toBeInTheDocument();
    });

    it('should render chat toggle button', () => {
      render(<AdminHeader {...defaultProps} />);
      
      // Find chat button by its message-square icon
      const buttons = screen.getAllByRole('button');
      const chatButton = buttons.find(button => button.querySelector('.lucide-message-square'));
      expect(chatButton).toBeInTheDocument();
    });

    it('should render theme toggle', () => {
      render(<AdminHeader {...defaultProps} />);
      
      const themeButton = screen.getByRole('button', { name: /toggle theme/i });
      expect(themeButton).toBeInTheDocument();
    });
  });

  describe('Sidebar Toggle', () => {
    it('should show close icon when sidebar is open', () => {
      render(<AdminHeader {...defaultProps} sidebarOpen={true} />);
      
      const sidebarButton = screen.getByRole('button', { name: /close sidebar/i });
      expect(sidebarButton).toBeInTheDocument();
    });

    it('should show menu icon when sidebar is closed', () => {
      render(<AdminHeader {...defaultProps} sidebarOpen={false} />);
      
      const sidebarButton = screen.getByRole('button', { name: /open sidebar/i });
      expect(sidebarButton).toBeInTheDocument();
    });

    it('should call onSidebarToggle when clicked', async () => {
      const user = userEvent.setup();
      const mockToggle = jest.fn();
      
      render(<AdminHeader {...defaultProps} onSidebarToggle={mockToggle} />);
      
      const sidebarButton = screen.getByRole('button', { name: /open sidebar/i });
      await user.click(sidebarButton);
      
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Chat Toggle', () => {
    it('should show chat button', () => {
      render(<AdminHeader {...defaultProps} />);
      
      // Find chat button by its message-square icon
      const buttons = screen.getAllByRole('button');
      const chatButton = buttons.find(button => button.querySelector('.lucide-message-square'));
      expect(chatButton).toBeInTheDocument();
    });

    it('should call onChatToggle when clicked', async () => {
      const user = userEvent.setup();
      const mockChatToggle = jest.fn();
      
      render(<AdminHeader {...defaultProps} onChatToggle={mockChatToggle} />);
      
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
      render(<AdminHeader {...defaultProps} chatVisible={true} />);
      
      // Find chat button by its message-square icon
      const buttons = screen.getAllByRole('button');
      const chatButton = buttons.find(button => button.querySelector('.lucide-message-square'));
      expect(chatButton).toBeInTheDocument();
      expect(chatButton).toHaveClass('bg-accent');
    });

    it('should not apply accent class when chat is not visible', () => {
      render(<AdminHeader {...defaultProps} chatVisible={false} />);
      
      // Find chat button by its message-square icon
      const buttons = screen.getAllByRole('button');
      const chatButton = buttons.find(button => button.querySelector('.lucide-message-square'));
      expect(chatButton).toBeInTheDocument();
      expect(chatButton).not.toHaveClass('bg-accent');
    });
  });

  describe('Active Section Display', () => {
    it('should display the active section', () => {
      render(<AdminHeader {...defaultProps} activeSection="Admin" />);
      
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('should update when active section changes', () => {
      const { rerender } = render(<AdminHeader {...defaultProps} activeSection="Admin" />);
      
      expect(screen.getByText('Admin')).toBeInTheDocument();
      
      rerender(<AdminHeader {...defaultProps} activeSection="Users" />);
      
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper header role', () => {
      render(<AdminHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should have proper button labels', () => {
      render(<AdminHeader {...defaultProps} />);
      
      const sidebarButton = screen.getByRole('button', { name: /open sidebar/i });
      expect(sidebarButton).toHaveAttribute('aria-label', 'Open sidebar');
    });

    it('should have proper heading structure', () => {
      render(<AdminHeader {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Admin');
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct header classes', () => {
      render(<AdminHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-card', 'border-b', 'px-6', 'py-4');
    });

    it('should have flex layout', () => {
      render(<AdminHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('flex', 'items-center', 'justify-between');
    });
  });
});

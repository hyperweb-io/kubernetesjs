import userEvent from '@testing-library/user-event';
import { SmartObjectsHeader } from '../../../components/headers/smart-objects-header';
import { render, screen } from '../../utils/test-utils';

describe('SmartObjectsHeader', () => {
  const defaultProps = {
    sidebarOpen: false,
    onSidebarToggle: jest.fn(),
    activeSection: 'Smart Objects',
    onChatToggle: jest.fn(),
    chatVisible: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render header with all elements', () => {
      render(<SmartObjectsHeader {...defaultProps} />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('Smart Objects')).toBeInTheDocument();
    });

    it('should render sidebar toggle button', () => {
      render(<SmartObjectsHeader {...defaultProps} />);
      
      const sidebarButton = screen.getByRole('button', { name: /open sidebar/i });
      expect(sidebarButton).toBeInTheDocument();
    });

    it('should render chat toggle button', () => {
      render(<SmartObjectsHeader {...defaultProps} />);
      
      // Find chat button by its message-square icon
      const buttons = screen.getAllByRole('button');
      const chatButton = buttons.find(button => button.querySelector('.lucide-message-square'));
      expect(chatButton).toBeInTheDocument();
    });

    it('should render theme toggle', () => {
      render(<SmartObjectsHeader {...defaultProps} />);
      
      const themeButton = screen.getByRole('button', { name: /toggle theme/i });
      expect(themeButton).toBeInTheDocument();
    });
  });

  describe('Sidebar Toggle', () => {
    it('should show close icon when sidebar is open', () => {
      render(<SmartObjectsHeader {...defaultProps} sidebarOpen={true} />);
      
      const sidebarButton = screen.getByRole('button', { name: /close sidebar/i });
      expect(sidebarButton).toBeInTheDocument();
    });

    it('should show menu icon when sidebar is closed', () => {
      render(<SmartObjectsHeader {...defaultProps} sidebarOpen={false} />);
      
      const sidebarButton = screen.getByRole('button', { name: /open sidebar/i });
      expect(sidebarButton).toBeInTheDocument();
    });

    it('should call onSidebarToggle when clicked', async () => {
      const user = userEvent.setup();
      const mockToggle = jest.fn();
      
      render(<SmartObjectsHeader {...defaultProps} onSidebarToggle={mockToggle} />);
      
      const sidebarButton = screen.getByRole('button', { name: /open sidebar/i });
      await user.click(sidebarButton);
      
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Chat Toggle', () => {
    it('should show chat button', () => {
      render(<SmartObjectsHeader {...defaultProps} />);
      
      // Find chat button by its message-square icon
      const buttons = screen.getAllByRole('button');
      const chatButton = buttons.find(button => button.querySelector('.lucide-message-square'));
      expect(chatButton).toBeInTheDocument();
    });

    it('should call onChatToggle when clicked', async () => {
      const user = userEvent.setup();
      const mockChatToggle = jest.fn();
      
      render(<SmartObjectsHeader {...defaultProps} onChatToggle={mockChatToggle} />);
      
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
      render(<SmartObjectsHeader {...defaultProps} chatVisible={true} />);
      
      // Find chat button by its message-square icon
      const buttons = screen.getAllByRole('button');
      const chatButton = buttons.find(button => button.querySelector('.lucide-message-square'));
      expect(chatButton).toBeInTheDocument();
      expect(chatButton).toHaveClass('bg-accent');
    });

    it('should not apply accent class when chat is not visible', () => {
      render(<SmartObjectsHeader {...defaultProps} chatVisible={false} />);
      
      // Find chat button by its message-square icon
      const buttons = screen.getAllByRole('button');
      const chatButton = buttons.find(button => button.querySelector('.lucide-message-square'));
      expect(chatButton).toBeInTheDocument();
      expect(chatButton).not.toHaveClass('bg-accent');
    });
  });

  describe('Active Section Display', () => {
    it('should display the active section', () => {
      render(<SmartObjectsHeader {...defaultProps} activeSection="Smart Objects" />);
      
      expect(screen.getByText('Smart Objects')).toBeInTheDocument();
    });

    it('should update when active section changes', () => {
      const { rerender } = render(<SmartObjectsHeader {...defaultProps} activeSection="Smart Objects" />);
      
      expect(screen.getByText('Smart Objects')).toBeInTheDocument();
      
      rerender(<SmartObjectsHeader {...defaultProps} activeSection="Devices" />);
      
      expect(screen.getByText('Devices')).toBeInTheDocument();
      expect(screen.queryByText('Smart Objects')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper header role', () => {
      render(<SmartObjectsHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should have proper button labels', () => {
      render(<SmartObjectsHeader {...defaultProps} />);
      
      const sidebarButton = screen.getByRole('button', { name: /open sidebar/i });
      expect(sidebarButton).toHaveAttribute('aria-label', 'Open sidebar');
    });

    it('should have proper heading structure', () => {
      render(<SmartObjectsHeader {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Smart Objects');
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct header classes', () => {
      render(<SmartObjectsHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-card', 'border-b', 'px-6', 'py-4');
    });

    it('should have flex layout', () => {
      render(<SmartObjectsHeader {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('flex', 'items-center', 'justify-between');
    });
  });
});

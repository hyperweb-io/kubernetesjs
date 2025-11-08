import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppLayout } from '../../components/app-layout';
import { render as customRender } from '../utils/test-utils';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/i'),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock AIChatAgentic component
jest.mock('../../components/ai-chat-agentic', () => ({
  AIChatAgentic: ({ isOpen, onToggle, width, onWidthChange, layoutMode, onLayoutModeChange }: any) => (
    <div data-testid="ai-chat-agentic">
      <div>Chat is {isOpen ? 'open' : 'closed'}</div>
      <div>Width: {width}px</div>
      <div>Layout Mode: {layoutMode}</div>
      <button onClick={onToggle}>Toggle Chat</button>
      <button onClick={() => onWidthChange(500)}>Change Width</button>
      <button onClick={() => onLayoutModeChange('snapped')}>Change to Snapped</button>
    </div>
  ),
}));

describe('AppLayout', () => {
  const defaultProps = {
    children: <div data-testid="main-content">Main Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render with children', () => {
      customRender(<AppLayout {...defaultProps} />);
      
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByText('Main Content')).toBeInTheDocument();
    });

    it('should render AIChatAgentic component', () => {
      customRender(<AppLayout {...defaultProps} />);
      
      expect(screen.getByTestId('ai-chat-agentic')).toBeInTheDocument();
      expect(screen.getByText('Chat is closed')).toBeInTheDocument();
      expect(screen.getByText('Width: 400px')).toBeInTheDocument();
      expect(screen.getByText('Layout Mode: floating')).toBeInTheDocument();
    });
  });

  describe('Chat State Management', () => {
    it('should initialize with chat closed', () => {
      customRender(<AppLayout {...defaultProps} />);
      
      expect(screen.getByText('Chat is closed')).toBeInTheDocument();
    });

    it('should toggle chat state when toggle button is clicked', async () => {
      const user = userEvent.setup();
      customRender(<AppLayout {...defaultProps} />);
      
      const toggleButton = screen.getByText('Toggle Chat');
      await user.click(toggleButton);
      
      expect(screen.getByText('Chat is open')).toBeInTheDocument();
    });

    it('should change chat width when width change button is clicked', async () => {
      const user = userEvent.setup();
      customRender(<AppLayout {...defaultProps} />);
      
      const widthButton = screen.getByText('Change Width');
      await user.click(widthButton);
      
      expect(screen.getByText('Width: 500px')).toBeInTheDocument();
    });

    it('should change layout mode when layout mode button is clicked', async () => {
      const user = userEvent.setup();
      customRender(<AppLayout {...defaultProps} />);
      
      const layoutButton = screen.getByText('Change to Snapped');
      await user.click(layoutButton);
      
      expect(screen.getByText('Layout Mode: snapped')).toBeInTheDocument();
    });
  });

  describe('Props Passing', () => {
    it('should pass correct props to AdaptiveLayout', () => {
      customRender(<AppLayout {...defaultProps} />);
      
      // Check that the main content is rendered (indicating AdaptiveLayout is working)
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
    });

    it('should pass correct props to AIChatAgentic', () => {
      customRender(<AppLayout {...defaultProps} />);
      
      // Check initial state
      expect(screen.getByText('Chat is closed')).toBeInTheDocument();
      expect(screen.getByText('Width: 400px')).toBeInTheDocument();
      expect(screen.getByText('Layout Mode: floating')).toBeInTheDocument();
    });
  });

  describe('State Synchronization', () => {
    it('should sync chat state between AdaptiveLayout and AIChatAgentic', async () => {
      const user = userEvent.setup();
      customRender(<AppLayout {...defaultProps} />);
      
      // Initially closed
      expect(screen.getByText('Chat is closed')).toBeInTheDocument();
      
      // Toggle to open
      const toggleButton = screen.getByText('Toggle Chat');
      await user.click(toggleButton);
      
      // Should be open
      expect(screen.getByText('Chat is open')).toBeInTheDocument();
      
      // Toggle to close
      await user.click(toggleButton);
      
      // Should be closed again
      expect(screen.getByText('Chat is closed')).toBeInTheDocument();
    });
  });
});

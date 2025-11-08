import { render, screen } from '@testing-library/react';
import { AdaptiveLayout } from '../../components/adaptive-layout';
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

// Mock DashboardLayout component
jest.mock('../../components/dashboard-layout', () => ({
  DashboardLayout: ({ children, mode, ...props }: any) => (
    <div data-testid="dashboard-layout" data-mode={mode}>
      <div>Mode: {mode}</div>
      <div>Chat Visible: {props.chatVisible ? 'true' : 'false'}</div>
      <div>Chat Layout Mode: {props.chatLayoutMode}</div>
      <div>Chat Width: {props.chatWidth}px</div>
      <button onClick={props.onChatToggle}>Toggle Chat</button>
      {children}
    </div>
  ),
}));

describe('AdaptiveLayout', () => {
  const defaultProps = {
    children: <div data-testid="main-content">Main Content</div>,
    onChatToggle: jest.fn(),
    chatVisible: false,
    chatLayoutMode: 'floating' as const,
    chatWidth: 400,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Route-based Mode Detection', () => {
    it('should detect smart-objects mode for /d routes', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/d');
      render(<AdaptiveLayout {...defaultProps} />);
      
      expect(screen.getByTestId('dashboard-layout')).toHaveAttribute('data-mode', 'smart-objects');
      expect(screen.getByText('Mode: smart-objects')).toBeInTheDocument();
    });

    it('should detect smart-objects mode for /d/ sub-routes', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/d/some-page');
      render(<AdaptiveLayout {...defaultProps} />);
      
      expect(screen.getByTestId('dashboard-layout')).toHaveAttribute('data-mode', 'smart-objects');
      expect(screen.getByText('Mode: smart-objects')).toBeInTheDocument();
    });

    it('should detect infra mode for /i routes', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/i');
      render(<AdaptiveLayout {...defaultProps} />);
      
      expect(screen.getByTestId('dashboard-layout')).toHaveAttribute('data-mode', 'infra');
      expect(screen.getByText('Mode: infra')).toBeInTheDocument();
    });

    it('should detect infra mode for /i/ sub-routes', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/i/deployments');
      render(<AdaptiveLayout {...defaultProps} />);
      
      expect(screen.getByTestId('dashboard-layout')).toHaveAttribute('data-mode', 'infra');
      expect(screen.getByText('Mode: infra')).toBeInTheDocument();
    });

    it('should detect admin mode for /admin routes', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/admin');
      render(<AdaptiveLayout {...defaultProps} />);
      
      expect(screen.getByTestId('dashboard-layout')).toHaveAttribute('data-mode', 'admin');
      expect(screen.getByText('Mode: admin')).toBeInTheDocument();
    });

    it('should detect admin mode for /admin/ sub-routes', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/admin/settings');
      render(<AdaptiveLayout {...defaultProps} />);
      
      expect(screen.getByTestId('dashboard-layout')).toHaveAttribute('data-mode', 'admin');
      expect(screen.getByText('Mode: admin')).toBeInTheDocument();
    });

    it('should default to infra mode for unknown routes', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/unknown-route');
      render(<AdaptiveLayout {...defaultProps} />);
      
      expect(screen.getByTestId('dashboard-layout')).toHaveAttribute('data-mode', 'infra');
      expect(screen.getByText('Mode: infra')).toBeInTheDocument();
    });

    it('should default to infra mode for root route', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/');
      render(<AdaptiveLayout {...defaultProps} />);
      
      expect(screen.getByTestId('dashboard-layout')).toHaveAttribute('data-mode', 'infra');
      expect(screen.getByText('Mode: infra')).toBeInTheDocument();
    });
  });

  describe('Props Passing', () => {
    it('should pass all props to DashboardLayout', () => {
      const props = {
        ...defaultProps,
        chatVisible: true,
        chatLayoutMode: 'snapped' as const,
        chatWidth: 500,
      };
      
      render(<AdaptiveLayout {...props} />);
      
      expect(screen.getByText('Chat Visible: true')).toBeInTheDocument();
      expect(screen.getByText('Chat Layout Mode: snapped')).toBeInTheDocument();
      expect(screen.getByText('Chat Width: 500px')).toBeInTheDocument();
    });

    it('should pass children to DashboardLayout', () => {
      render(<AdaptiveLayout {...defaultProps} />);
      
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByText('Main Content')).toBeInTheDocument();
    });

    it('should pass onChatToggle callback to DashboardLayout', () => {
      const mockOnChatToggle = jest.fn();
      const props = {
        ...defaultProps,
        onChatToggle: mockOnChatToggle,
      };
      
      render(<AdaptiveLayout {...props} />);
      
      const toggleButton = screen.getByText('Toggle Chat');
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe('Mode Detection Edge Cases', () => {
    it('should handle empty pathname', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('');
      render(<AdaptiveLayout {...defaultProps} />);
      
      expect(screen.getByTestId('dashboard-layout')).toHaveAttribute('data-mode', 'infra');
    });

    it('should handle pathname with query parameters', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/i/deployments?filter=active');
      render(<AdaptiveLayout {...defaultProps} />);
      
      expect(screen.getByTestId('dashboard-layout')).toHaveAttribute('data-mode', 'infra');
    });

    it('should handle pathname with hash', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/d/settings#general');
      render(<AdaptiveLayout {...defaultProps} />);
      
      expect(screen.getByTestId('dashboard-layout')).toHaveAttribute('data-mode', 'smart-objects');
    });
  });
});
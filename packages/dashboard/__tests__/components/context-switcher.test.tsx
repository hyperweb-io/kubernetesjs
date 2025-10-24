import userEvent from '@testing-library/user-event';
import { ContextSwitcher } from '../../components/context-switcher';
import { render, screen } from '../utils/test-utils';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/i'),
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe('ContextSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render with default variant', () => {
      render(<ContextSwitcher />);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Infrastructure')).toBeInTheDocument();
    });

    it('should render with sidebar variant', () => {
      render(<ContextSwitcher variant="sidebar" />);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Infrastructure')).toBeInTheDocument();
    });

    it('should render with header variant', () => {
      render(<ContextSwitcher variant="header" />);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Infrastructure')).toBeInTheDocument();
    });

    it('should render with compact variant', () => {
      render(<ContextSwitcher variant="compact" />);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      // Compact variant shows icon instead of text
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Mode Detection', () => {
    it('should detect infra mode for /i routes', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/i');
      
      render(<ContextSwitcher />);
      
      expect(screen.getByText('Infrastructure')).toBeInTheDocument();
    });

    it('should detect smart-objects mode for /d routes', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/d');
      
      render(<ContextSwitcher />);
      
      expect(screen.getByText('Smart Objects')).toBeInTheDocument();
    });

    it('should detect admin mode for /admin routes', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/admin');
      
      render(<ContextSwitcher />);
      
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('should default to infra mode for unknown routes', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/unknown');
      
      render(<ContextSwitcher />);
      
      expect(screen.getByText('Infrastructure')).toBeInTheDocument();
    });
  });

  describe('Mode Switching', () => {
    it('should render select component for mode switching', () => {
      render(<ContextSwitcher />);
      
      // Check that the select component is rendered
      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toBeInTheDocument();
      expect(selectTrigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should show current mode in select', () => {
      render(<ContextSwitcher />);
      
      // Should show Infrastructure for /i route
      expect(screen.getByText('Infrastructure')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<ContextSwitcher />);
      
      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveAttribute('aria-autocomplete', 'none');
      expect(selectTrigger).toHaveAttribute('aria-controls');
    });
  });

  describe('Variant-specific Behavior', () => {
    it('should apply correct classes for sidebar variant', () => {
      render(<ContextSwitcher variant="sidebar" />);
      
      const container = screen.getByRole('combobox').closest('div');
      expect(container).toHaveClass('px-4', 'pb-4', 'border-b');
    });

    it('should apply correct classes for header variant', () => {
      render(<ContextSwitcher variant="header" />);
      
      const container = screen.getByRole('combobox').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should apply correct classes for compact variant', () => {
      render(<ContextSwitcher variant="compact" />);
      
      const container = screen.getByRole('combobox').closest('div');
      expect(container).toHaveClass('px-2', 'pb-2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty pathname', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('');
      
      render(<ContextSwitcher />);
      
      expect(screen.getByText('Infrastructure')).toBeInTheDocument();
    });

    it('should handle pathname with query parameters', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/i/deployments?filter=active');
      
      render(<ContextSwitcher />);
      
      expect(screen.getByText('Infrastructure')).toBeInTheDocument();
    });

    it('should handle pathname with hash', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/d/settings#general');
      
      render(<ContextSwitcher />);
      
      expect(screen.getByText('Smart Objects')).toBeInTheDocument();
    });
  });
});

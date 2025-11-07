import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../../components/ui/theme-toggle';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock document.documentElement.classList
const mockClassList = {
  add: jest.fn(),
  remove: jest.fn(),
  contains: jest.fn(),
};

Object.defineProperty(document, 'documentElement', {
  value: {
    classList: mockClassList,
  },
});

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('light');
    mockClassList.contains.mockReturnValue(false);
  });

  describe('Basic Rendering', () => {
    it('should render theme toggle button', () => {
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toBeInTheDocument();
    });

    it('should show moon icon for light theme', () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      render(<ThemeToggle />);
      
      // Should show moon icon for light theme
      const moonIcon = screen.getByRole('button').querySelector('.lucide-moon');
      expect(moonIcon).toBeInTheDocument();
    });

    it('should show sun icon for dark theme', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      render(<ThemeToggle />);
      
      // Should show sun icon for dark theme
      const sunIcon = screen.getByRole('button').querySelector('.lucide-sun');
      expect(sunIcon).toBeInTheDocument();
    });
  });

  describe('Theme Toggle Functionality', () => {
    it('should toggle from light to dark theme', async () => {
      const user = userEvent.setup();
      mockLocalStorage.getItem.mockReturnValue('light');
      
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      // Should save dark theme to localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      
      // Should add dark class to document
      expect(mockClassList.add).toHaveBeenCalledWith('dark');
    });

    it('should toggle from dark to light theme', async () => {
      const user = userEvent.setup();
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      // Should save light theme to localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'light');
      
      // Should remove dark class from document
      expect(mockClassList.remove).toHaveBeenCalledWith('dark');
    });
  });

  describe('Initialization', () => {
    it('should initialize with light theme by default', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      render(<ThemeToggle />);
      
      // Should show moon icon for light theme
      const moonIcon = screen.getByRole('button').querySelector('.lucide-moon');
      expect(moonIcon).toBeInTheDocument();
    });

    it('should apply dark theme on initialization if saved', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      render(<ThemeToggle />);
      
      // Should add dark class to document
      expect(mockClassList.add).toHaveBeenCalledWith('dark');
    });

    it('should apply light theme on initialization if saved', () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      render(<ThemeToggle />);
      
      // Should remove dark class from document
      expect(mockClassList.remove).toHaveBeenCalledWith('dark');
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('w-9', 'h-9');
    });

    it('should have screen reader text', () => {
      render(<ThemeToggle />);
      
      const screenReaderText = screen.getByText('Toggle theme');
      expect(screenReaderText).toHaveClass('sr-only');
    });
  });

  describe('Button Styling', () => {
    it('should have correct button classes', () => {
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toHaveClass('w-9', 'h-9');
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid theme value in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-theme');
      render(<ThemeToggle />);
      
      // Should default to light theme - check that button renders
      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toBeInTheDocument();
    });

    it('should handle empty theme value in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('');
      render(<ThemeToggle />);
      
      // Should default to light theme
      const moonIcon = screen.getByRole('button').querySelector('.lucide-moon');
      expect(moonIcon).toBeInTheDocument();
    });
  });
});

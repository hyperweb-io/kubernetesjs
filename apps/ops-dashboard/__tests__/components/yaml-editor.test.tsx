import userEvent from '@testing-library/user-event';
import React from 'react';

import { YAMLEditor } from '@/components/yaml-editor';

import { render, screen, waitFor } from '../utils/test-utils';

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

describe('YAMLEditor', () => {
  const user = userEvent.setup();
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('light');
  });

  describe('Basic Rendering', () => {
    it('should render YAML editor with initial value', () => {
      const initialValue = 'apiVersion: v1\nkind: Pod';
      
      render(<YAMLEditor value={initialValue} onChange={mockOnChange} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveValue(initialValue);
    });

    it('should render with custom height', () => {
      render(<YAMLEditor value="test" onChange={mockOnChange} height="500px" />);
      
      const container = screen.getByRole('textbox').closest('div');
      expect(container).toHaveStyle({ height: '500px' });
    });

    it('should render in read-only mode when specified', () => {
      render(<YAMLEditor value="test" onChange={mockOnChange} readOnly={true} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('readOnly');
      expect(textarea).toHaveClass('cursor-not-allowed', 'opacity-90');
    });
  });

  describe('Theme Support', () => {
    it('should apply light theme by default', () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      
      render(<YAMLEditor value="test" onChange={mockOnChange} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('bg-white', 'text-slate-900');
    });

    it('should apply dark theme when localStorage has dark theme', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      render(<YAMLEditor value="test" onChange={mockOnChange} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('bg-slate-900', 'text-slate-100');
    });

    it('should listen for theme changes from localStorage', async () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      
      render(<YAMLEditor value="test" onChange={mockOnChange} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('bg-white', 'text-slate-900');
      
      // Simulate theme change
      mockLocalStorage.getItem.mockReturnValue('dark');
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'dark' }));
      
      await waitFor(() => {
        expect(textarea).toHaveClass('bg-slate-900', 'text-slate-100');
      });
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when user types', async () => {
      render(<YAMLEditor value="" onChange={mockOnChange} />);
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'test');
      
      // user.type triggers onChange for each character
      expect(mockOnChange).toHaveBeenCalledTimes(4); // 't', 'e', 's', 't'
    });

    it('should not call onChange when in read-only mode', async () => {
      render(<YAMLEditor value="test" onChange={mockOnChange} readOnly={true} />);
      
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'new content');
      
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should handle complex YAML content', () => {
      const complexYaml = `apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest`;
      
      render(<YAMLEditor value={complexYaml} onChange={mockOnChange} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(complexYaml);
    });
  });

  describe('Accessibility', () => {
    it('should have proper textarea attributes', () => {
      render(<YAMLEditor value="test" onChange={mockOnChange} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('spellCheck', 'false');
      expect(textarea).toHaveClass('font-mono', 'text-sm');
    });

    it('should be keyboard navigable', async () => {
      render(<YAMLEditor value="test" onChange={mockOnChange} />);
      
      const textarea = screen.getByRole('textbox');
      textarea.focus();
      
      expect(document.activeElement).toBe(textarea);
      
      await user.keyboard('{ArrowRight}');
      expect(document.activeElement).toBe(textarea);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty value', () => {
      render(<YAMLEditor value="" onChange={mockOnChange} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue('');
    });

    it('should handle undefined onChange', () => {
      render(<YAMLEditor value="test" onChange={undefined as any} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('should handle very long content', () => {
      const longContent = 'a'.repeat(10000);
      
      render(<YAMLEditor value={longContent} onChange={mockOnChange} />);
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveValue(longContent);
    });
  });
});

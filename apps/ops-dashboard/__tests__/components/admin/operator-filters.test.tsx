import userEvent from '@testing-library/user-event';

import { OperatorFilters } from '@/components/admin/operator-filters';

import {render, screen } from '../../utils/test-utils';

describe('OperatorFilters', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnStatusFilterChange = jest.fn();

  const defaultProps = {
    searchTerm: '',
    onSearchChange: mockOnSearchChange,
    statusFilter: 'all',
    onStatusFilterChange: mockOnStatusFilterChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render search input with placeholder', () => {
      render(<OperatorFilters {...defaultProps} />);

      expect(screen.getByPlaceholderText('Search operators...')).toBeInTheDocument();
    });

    it('should render status filter select', () => {
      render(<OperatorFilters {...defaultProps} />);

      expect(screen.getByText('All Status')).toBeInTheDocument();
    });

    it('should render help text and documentation link', () => {
      render(<OperatorFilters {...defaultProps} />);

      expect(screen.getByText('Need help?')).toBeInTheDocument();
      expect(screen.getByText('View operator docs')).toBeInTheDocument();
    });

    it('should render search icon', () => {
      render(<OperatorFilters {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search operators...');
      const searchIcon = searchInput.parentElement?.querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });

    it('should render filter icon', () => {
      render(<OperatorFilters {...defaultProps} />);

      const selectButton = screen.getByRole('combobox');
      const filterIcon = selectButton.querySelector('svg');
      expect(filterIcon).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should display current search term', () => {
      render(<OperatorFilters {...defaultProps} searchTerm="test search" />);

      const searchInput = screen.getByPlaceholderText('Search operators...');
      expect(searchInput).toHaveValue('test search');
    });

    it('should call onSearchChange when typing in search input', async () => {
      const user = userEvent.setup();
      render(<OperatorFilters {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search operators...');
      await user.type(searchInput, 'test');

      expect(mockOnSearchChange).toHaveBeenCalledTimes(4); // Called for each character
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(1, 't');
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(2, 'e');
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(3, 's');
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(4, 't');
    });

    it('should clear search input when cleared', async () => {
      const user = userEvent.setup();
      render(<OperatorFilters {...defaultProps} searchTerm="test" />);

      const searchInput = screen.getByPlaceholderText('Search operators...');
      await user.clear(searchInput);

      expect(mockOnSearchChange).toHaveBeenCalledWith('');
    });

    it('should handle rapid typing', async () => {
      const user = userEvent.setup();
      render(<OperatorFilters {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search operators...');
      await user.type(searchInput, 'kubernetes');

      expect(mockOnSearchChange).toHaveBeenCalledTimes(10); // Called for each character
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(1, 'k');
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(2, 'u');
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(3, 'b');
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(4, 'e');
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(5, 'r');
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(6, 'n');
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(7, 'e');
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(8, 't');
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(9, 'e');
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(10, 's');
    });
  });

  describe('Status Filter Functionality', () => {
    it('should display current status filter', () => {
      render(<OperatorFilters {...defaultProps} statusFilter="installed" />);

      expect(screen.getByText('Installed')).toBeInTheDocument();
    });

    it('should show all status options when opened', async () => {
      const user = userEvent.setup();
      render(<OperatorFilters {...defaultProps} />);

      const selectTrigger = screen.getByRole('combobox');
      await user.click(selectTrigger);

      expect(screen.getAllByText('All Status')).toHaveLength(2); // One in trigger, one in dropdown
      expect(screen.getByText('Installed')).toBeInTheDocument();
      expect(screen.getByText('Not Installed')).toBeInTheDocument();
      expect(screen.getByText('Installing')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should call onStatusFilterChange when selecting a status', async () => {
      const user = userEvent.setup();
      render(<OperatorFilters {...defaultProps} />);

      const selectTrigger = screen.getByRole('combobox');
      await user.click(selectTrigger);

      const installedOption = screen.getByText('Installed');
      await user.click(installedOption);

      expect(mockOnStatusFilterChange).toHaveBeenCalledWith('installed');
    });

    it('should handle all status filter selection', async () => {
      const user = userEvent.setup();
      render(<OperatorFilters {...defaultProps} statusFilter="installed" />);

      const selectTrigger = screen.getByRole('combobox');
      await user.click(selectTrigger);

      const allStatusOption = screen.getByText('All Status');
      await user.click(allStatusOption);

      expect(mockOnStatusFilterChange).toHaveBeenCalledWith('all');
    });

    it('should handle error status filter selection', async () => {
      const user = userEvent.setup();
      render(<OperatorFilters {...defaultProps} />);

      const selectTrigger = screen.getByRole('combobox');
      await user.click(selectTrigger);

      const errorOption = screen.getByText('Error');
      await user.click(errorOption);

      expect(mockOnStatusFilterChange).toHaveBeenCalledWith('error');
    });
  });

  describe('Documentation Link', () => {
    it('should have correct href and target attributes', () => {
      render(<OperatorFilters {...defaultProps} />);

      const docLink = screen.getByText('View operator docs');
      expect(docLink).toHaveAttribute('href', 'https://docs.interweb.io/operators');
      expect(docLink).toHaveAttribute('target', '_blank');
      expect(docLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should have correct styling classes', () => {
      render(<OperatorFilters {...defaultProps} />);

      const docLink = screen.getByText('View operator docs');
      expect(docLink).toHaveClass('text-primary');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive layout classes', () => {
      render(<OperatorFilters {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search operators...');
      const container = searchInput.closest('.flex.flex-col.sm\\:flex-row');
      expect(container).toBeInTheDocument();
    });

    it('should have responsive width classes', () => {
      render(<OperatorFilters {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search operators...');
      const searchContainer = searchInput.closest('.flex-1.max-w-sm');
      expect(searchContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper input attributes', () => {
      render(<OperatorFilters {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search operators...');
      expect(searchInput).toHaveAttribute('placeholder', 'Search operators...');
    });

    it('should have proper select attributes', () => {
      render(<OperatorFilters {...defaultProps} />);

      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<OperatorFilters {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search operators...');
      await user.tab();

      expect(searchInput).toHaveFocus();
    });

    it('should support keyboard navigation for select', async () => {
      const user = userEvent.setup();
      render(<OperatorFilters {...defaultProps} />);

      const selectTrigger = screen.getByRole('combobox');
      await user.tab();
      await user.tab();

      expect(selectTrigger).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty search term', () => {
      render(<OperatorFilters {...defaultProps} searchTerm="" />);

      const searchInput = screen.getByPlaceholderText('Search operators...');
      expect(searchInput).toHaveValue('');
    });

    it('should handle special characters in search', async () => {
      const user = userEvent.setup();
      render(<OperatorFilters {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search operators...');
      await user.type(searchInput, 'test@#$%^&*()');

      expect(mockOnSearchChange).toHaveBeenCalledTimes(13); // Called for each character
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(13, ')');
    });

    it('should handle very long search terms', async () => {
      const user = userEvent.setup();
      const longSearchTerm = 'a'.repeat(1000);
      render(<OperatorFilters {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText('Search operators...');
      await user.type(searchInput, longSearchTerm);

      expect(mockOnSearchChange).toHaveBeenCalledTimes(1000); // Called for each character
      expect(mockOnSearchChange).toHaveBeenNthCalledWith(1000, 'a');
    });

    it('should handle rapid status filter changes', async () => {
      const user = userEvent.setup();
      render(<OperatorFilters {...defaultProps} />);

      const selectTrigger = screen.getByRole('combobox');
      
      // Open select
      await user.click(selectTrigger);
      await user.click(screen.getByText('Installed'));
      
      // Open select again
      await user.click(selectTrigger);
      await user.click(screen.getByText('Error'));

      expect(mockOnStatusFilterChange).toHaveBeenCalledTimes(2);
      expect(mockOnStatusFilterChange).toHaveBeenNthCalledWith(1, 'installed');
      expect(mockOnStatusFilterChange).toHaveBeenNthCalledWith(2, 'error');
    });
  });

  describe('Integration', () => {
    it('should work with both search and filter simultaneously', async () => {
      const user = userEvent.setup();
      render(<OperatorFilters {...defaultProps} searchTerm="test" statusFilter="installed" />);

      // Verify initial state
      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
      expect(screen.getByText('Installed')).toBeInTheDocument();

      // Change search
      const searchInput = screen.getByDisplayValue('test');
      await user.clear(searchInput);
      await user.type(searchInput, 'new search');

      // Change filter
      const selectTrigger = screen.getByRole('combobox');
      await user.click(selectTrigger);
      await user.click(screen.getByText('Error'));

      expect(mockOnSearchChange).toHaveBeenCalledTimes(11); // Called for clear + each character
      expect(mockOnStatusFilterChange).toHaveBeenCalledWith('error');
    });
  });
});
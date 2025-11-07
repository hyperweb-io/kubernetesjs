import React from 'react';
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { server } from '@/__mocks__/server';
import { http, HttpResponse } from 'msw';
import OperatorsPage from '@/app/admin/operators/page';

// Mock data
const mockOperators = [
  {
    name: 'cert-manager',
    displayName: 'Cert Manager',
    description: 'Certificate management for Kubernetes',
    status: 'installed',
    version: 'v1.13.0',
    docsUrl: 'https://cert-manager.io/docs'
  },
  {
    name: 'cloudnative-pg',
    displayName: 'CloudNativePG',
    description: 'CloudNative PostgreSQL operator',
    status: 'installed',
    version: 'v1.22.0',
    docsUrl: 'https://cloudnative-pg.io/docs'
  },
  {
    name: 'nginx-ingress',
    displayName: 'NGINX Ingress Controller',
    description: 'NGINX Ingress Controller',
    status: 'not-installed',
    docsUrl: 'https://kubernetes.github.io/ingress-nginx'
  }
];

// Setup MSW handlers
beforeEach(() => {
  server.use(
    http.get('/api/operators', () => {
      return HttpResponse.json(mockOperators);
    })
  );
});

afterEach(() => {
  server.resetHandlers();
});

describe('app/admin/operators/page', () => {
  describe('Basic Rendering', () => {
    it('should render the operators page with correct title and description', async () => {
      render(<OperatorsPage />);
      
      expect(screen.getByText('Operators')).toBeInTheDocument();
      expect(screen.getByText('Install and manage Kubernetes operators for your cluster')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<OperatorsPage />);
      
      const searchInput = screen.getByPlaceholderText(/search operators/i);
      expect(searchInput).toBeInTheDocument();
    });

    it('should render status filter', () => {
      render(<OperatorsPage />);
      
      const statusFilter = screen.getByRole('combobox');
      expect(statusFilter).toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    it('should load and display operator data', async () => {
      render(<OperatorsPage />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Cert Manager')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Cert Manager')).toBeInTheDocument();
      expect(screen.getByText('Certificate management for Kubernetes')).toBeInTheDocument();
      expect(screen.getByText('CloudNativePG')).toBeInTheDocument();
      expect(screen.getByText('CloudNative PostgreSQL operator')).toBeInTheDocument();
      expect(screen.getAllByText('NGINX Ingress Controller')).toHaveLength(2);
    });

    it('should show loading state', async () => {
      // Mock loading state by using a different handler
      server.use(
        http.get('/api/operators', () => {
          return new Promise(() => {}); // Never resolves, simulating loading
        })
      );

      render(<OperatorsPage />);
      
      // Should show loading indicator
      await waitFor(() => {
        expect(screen.getByText(/Loading operators/)).toBeInTheDocument();
      });
    });

    it('should show error state', async () => {
      server.use(
        http.get('/api/operators', () => {
          return HttpResponse.json(
            { error: 'Failed to fetch operators' },
            { status: 500 }
          );
        })
      );

      render(<OperatorsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load operators')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should filter operators by search term', async () => {
      const user = userEvent.setup();
      render(<OperatorsPage />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Cert Manager')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText(/search operators/i);
      await user.type(searchInput, 'postgres');
      
      // Should show only CloudNativePG operator (contains 'postgres' in description)
      expect(screen.getByText('CloudNativePG')).toBeInTheDocument();
      expect(screen.queryByText('Cert Manager')).not.toBeInTheDocument();
    });

    it('should filter operators by status', async () => {
      const user = userEvent.setup();
      render(<OperatorsPage />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Cert Manager')).toBeInTheDocument();
      });
      
      const statusFilter = screen.getByRole('combobox');
      await user.click(statusFilter);
      
      // Select installed status
      const installedOptions = screen.getAllByText('Installed');
      const installedOption = installedOptions.find(option => 
        option.closest('[role="option"]') || option.closest('[data-radix-collection-item]')
      ) || installedOptions[0];
      await user.click(installedOption);
      
      // Should show only installed operators
      expect(screen.getByText('Cert Manager')).toBeInTheDocument();
      expect(screen.getByText('CloudNativePG')).toBeInTheDocument();
      expect(screen.queryByText('NGINX Ingress Controller')).not.toBeInTheDocument();
    });

    it('should show no results message when no operators match filters', async () => {
      const user = userEvent.setup();
      render(<OperatorsPage />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Cert Manager')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText(/search operators/i);
      await user.type(searchInput, 'nonexistent');
      
      expect(screen.getByText(/No operators match your filters/)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty operators list', async () => {
      server.use(
        http.get('/api/operators', () => {
          return HttpResponse.json([]);
        })
      );

      render(<OperatorsPage />);
      
      // Should show empty state - when there are no operators at all, the grid should be empty
      await waitFor(() => {
        const gridContainer = document.querySelector('.grid');
        expect(gridContainer).toBeInTheDocument();
        expect(gridContainer?.children).toHaveLength(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<OperatorsPage />);
      
      const heading = screen.getByRole('heading', { name: 'Operators' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<OperatorsPage />);
      
      const searchInput = screen.getByPlaceholderText(/search operators/i);
      const statusFilter = screen.getByRole('combobox');
      
      // Focus should work
      searchInput.focus();
      expect(document.activeElement).toBe(searchInput);
      
      // Tab navigation should work
      await user.keyboard('{Tab}');
      expect(document.activeElement).toBe(statusFilter);
    });
  });
});
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { createNamespacesList } from '@/__mocks__/handlers/namespaces';
import { server } from '@/__mocks__/server';

import { NamespaceSwitcher } from '../../components/namespace-switcher';
import { render, screen, waitFor } from '../utils/test-utils';

// Mock usePreferredNamespace
const mockSetNamespace = jest.fn();
jest.mock('../../contexts/NamespaceContext', () => ({
  usePreferredNamespace: () => ({
    namespace: 'default',
    setNamespace: mockSetNamespace,
  }),
}));

// Mock the NamespaceProvider to avoid conflicts
jest.mock('../../contexts/NamespaceContext', () => ({
  usePreferredNamespace: () => ({
    namespace: 'default',
    setNamespace: mockSetNamespace,
  }),
  NamespaceProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('NamespaceSwitcher', () => {


  beforeEach(() => {
    jest.clearAllMocks();
    mockSetNamespace.mockClear();
    server.use(createNamespacesList());
  });

  describe('API Integration', () => {
    it('should load namespaces from API on mount', async () => {
      render(<NamespaceSwitcher />);
      
      // Wait for API call to complete
      await waitFor(() => {
        expect(screen.getByText('default')).toBeInTheDocument();
      });
    });

    it('should refresh namespaces when refresh button is clicked', async () => {
      let callCount = 0;
      
      // Track API calls using the correct API_BASE
      server.use(
        http.get('http://127.0.0.1:8001/api/v1/namespaces', () => {
          callCount++;
          return HttpResponse.json({
            apiVersion: 'v1',
            kind: 'NamespaceList',
            items: [
              { metadata: { name: 'default' } },
              { metadata: { name: 'kube-system' } }
            ]
          });
        })
      );

      render(<NamespaceSwitcher />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('default')).toBeInTheDocument();
      });
      
      expect(callCount).toBe(1);
      
      // Click refresh button
      const refreshButton = screen.getByRole('button', { name: '' });
      await userEvent.click(refreshButton);
      
      // Wait for refresh to complete
      await waitFor(() => {
        expect(callCount).toBe(2);
      });
    });

    it('should handle API errors gracefully', async () => {
      // Mock API error
      server.use(
        http.get('http://127.0.0.1:8001/api/v1/namespaces', () => {
          return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        })
      );

      render(<NamespaceSwitcher />);
      
      // Component should still render even with API error
      expect(screen.getByText('Namespace:')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should handle empty namespace list', async () => {
      // Mock empty response
      server.use(
        http.get('http://127.0.0.1:8001/api/v1/namespaces', () => {
          return HttpResponse.json({
            apiVersion: 'v1',
            kind: 'NamespaceList',
            items: []
          });
        })
      );

      render(<NamespaceSwitcher />);
      
      // Component should still render
      expect(screen.getByText('Namespace:')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should render refresh button', () => {
      render(<NamespaceSwitcher />);
      
      const refreshButton = screen.getByRole('button', { name: '' });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should handle refresh button click', async () => {
      render(<NamespaceSwitcher />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('default')).toBeInTheDocument();
      });
      
      // Click refresh button
      const refreshButton = screen.getByRole('button', { name: '' });
      await userEvent.click(refreshButton);
      
      // Button should be clickable
      expect(refreshButton).toBeInTheDocument();
    });

    it('should have setNamespace function available', () => {
      render(<NamespaceSwitcher />);
      
      // Verify that setNamespace is available (mocked)
      expect(mockSetNamespace).toBeDefined();
      expect(typeof mockSetNamespace).toBe('function');
    });

    it('should call setNamespace when Select value changes', async () => {
      render(<NamespaceSwitcher/>);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('default')).toBeInTheDocument();
      });
      
      // Test calling setNamespace with 'kube-system'
      // open select drop down
      const selectTrigger = screen.getByRole('combobox');
      await userEvent.click(selectTrigger);
      // select 'kube-system'
      await userEvent.click(screen.getByText('kube-system'));
      // verify setNamespace was called with 'kube-system'
      expect(mockSetNamespace).toHaveBeenCalledWith('kube-system');
      // close select drop down
      await userEvent.click(selectTrigger);
      // select '_all'
      await userEvent.click(screen.getByText('All Namespaces'));
      // verify setNamespace was called with '_all'
      expect(mockSetNamespace).toHaveBeenCalledWith('_all');
    });
  });

  describe('Component Rendering', () => {
    it('should render with proper structure', () => {
      render(<NamespaceSwitcher />);
      
      expect(screen.getByText('Namespace:')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<NamespaceSwitcher />);
      
      const selectTrigger = screen.getByRole('combobox');
      expect(selectTrigger).toHaveAttribute('aria-expanded', 'false');
      expect(selectTrigger).toHaveAttribute('role', 'combobox');
    });
  });
});

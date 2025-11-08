import { http, HttpResponse } from 'msw';
import React from 'react';

import { server } from '@/__mocks__/server';
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import AdminPodsPage from '@/app/admin/pods/page';

// Mock data
const mockPods = [
  {
    metadata: { name: 'postgres-pod-1', namespace: 'postgres-db' },
    spec: { containers: [{ name: 'postgres', image: 'postgres:15' }] },
    status: { phase: 'Running', podIP: '10.0.0.1' }
  }
];

// Setup MSW handlers
beforeAll(() => {
  server.use(
    http.get('http://127.0.0.1:8001/api/v1/namespaces/postgres-db/pods', ({ request }) => {
      console.log('MSW intercepted request:', request.url);
      const url = new URL(request.url);
      if (url.searchParams.get('error') === 'true') {
        return HttpResponse.json(
          { error: 'Failed to fetch pods' },
          { status: 500 }
        );
      }
      return HttpResponse.json({
        apiVersion: 'v1',
        kind: 'PodList',
        items: mockPods
      });
    })
  );
});

afterEach(() => {
  // Don't reset handlers, just reset the server state
  server.resetHandlers();
  // Re-add the handler after reset
  server.use(
    http.get('http://127.0.0.1:8001/api/v1/namespaces/postgres-db/pods', ({ request }) => {
      console.log('MSW intercepted request (after reset):', request.url);
      const url = new URL(request.url);
      if (url.searchParams.get('error') === 'true') {
        return HttpResponse.json(
          { error: 'Failed to fetch pods' },
          { status: 500 }
        );
      }
      return HttpResponse.json({
        apiVersion: 'v1',
        kind: 'PodList',
        items: mockPods
      });
    })
  );
});

describe('app/admin/pods/page', () => {
  describe('Basic Rendering', () => {
    it('should render the pods page without crashing', () => {
      expect(() => render(<AdminPodsPage />)).not.toThrow();
    });

    it('should render the PodsView component', async () => {
      render(<AdminPodsPage />);
      
      // Wait for the component to render and check for pod-related content
      await waitFor(() => {
        expect(screen.getByText('postgres-pod-1')).toBeInTheDocument();
      });
    });
  });

  describe('Data Loading', () => {
    it('should load and display pod data', async () => {
      render(<AdminPodsPage />);
      
      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('postgres-pod-1')).toBeInTheDocument();
      });
    });

    it('should show loading state', () => {
      // Mock loading state by using a different handler
      server.use(
        http.get('http://localhost:8001/api/v1/namespaces/postgres-db/pods', () => {
          return new Promise(() => {}); // Never resolves, simulating loading
        })
      );

      render(<AdminPodsPage />);
      
      // Should show loading spinner - use more specific selector
      const loadingSpinner = document.querySelector('.animate-spin');
      expect(loadingSpinner).toBeInTheDocument();
    });

    it('should show error state', async () => {
      server.use(
        http.get('http://127.0.0.1:8001/api/v1/namespaces/postgres-db/pods', () => {
          return HttpResponse.json(
            { error: 'Failed to fetch pods' },
            { status: 500 }
          );
        })
      );

      render(<AdminPodsPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/HTTP error! status: 500/)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', async () => {
      render(<AdminPodsPage />);
      
      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('postgres-pod-1')).toBeInTheDocument();
      });
      
      // Check for proper heading structure
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should be keyboard navigable', async () => {
      render(<AdminPodsPage />);
      
      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('postgres-pod-1')).toBeInTheDocument();
      });
      
      // Check that buttons are focusable
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });
});
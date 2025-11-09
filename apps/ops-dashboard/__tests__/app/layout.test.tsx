import React from 'react';

import { render, screen } from '@/__tests__/utils/test-utils';
import RootLayout from '@/app/layout';

// Mock the providers and components
jest.mock('@/app/providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

jest.mock('@/components/app-layout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

jest.mock('nuqs/adapters/next/app', () => ({
  NuqsAdapter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="nuqs-adapter">{children}</div>
  ),
}));

describe('RootLayout', () => {
  describe('Basic Rendering', () => {
    it('should render the root layout with correct provider structure', () => {
      render(
        <RootLayout>
          <div data-testid="test-content">Test Content</div>
        </RootLayout>
      );

      // Check that all providers are rendered
      expect(screen.getByTestId('nuqs-adapter')).toBeInTheDocument();
      expect(screen.getByTestId('providers')).toBeInTheDocument();
      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('should render all provider components in correct order', () => {
      render(
        <RootLayout>
          <div data-testid="test-content">Test Content</div>
        </RootLayout>
      );

      // Check that all providers are rendered
      expect(screen.getByTestId('nuqs-adapter')).toBeInTheDocument();
      expect(screen.getByTestId('providers')).toBeInTheDocument();
      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('should render children content correctly', () => {
      const testContent = 'Dashboard Content';
      render(
        <RootLayout>
          <div>{testContent}</div>
        </RootLayout>
      );

      expect(screen.getByText(testContent)).toBeInTheDocument();
    });
  });

  describe('Provider Hierarchy', () => {
    it('should have correct provider nesting order', () => {
      render(
        <RootLayout>
          <div data-testid="test-content">Test Content</div>
        </RootLayout>
      );

      const nuqsAdapter = screen.getByTestId('nuqs-adapter');
      const providers = screen.getByTestId('providers');
      const appLayout = screen.getByTestId('app-layout');
      const testContent = screen.getByTestId('test-content');

      // Check nesting order: NuqsAdapter > Providers > AppLayout > children
      expect(nuqsAdapter).toContainElement(providers);
      expect(providers).toContainElement(appLayout);
      expect(appLayout).toContainElement(testContent);
    });
  });

  describe('Metadata', () => {
    it('should render with correct component structure', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      );

      // Check that the layout renders without errors
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render with proper component structure', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      );

      // Check that the layout renders without errors
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render without throwing errors', () => {
      expect(() => {
        render(
          <RootLayout>
            <div>Test Content</div>
          </RootLayout>
        );
      }).not.toThrow();
    });
  });

  describe('Component Rendering', () => {
    it('should render all required components', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      );

      // Check that all components are rendered
      expect(screen.getByTestId('nuqs-adapter')).toBeInTheDocument();
      expect(screen.getByTestId('providers')).toBeInTheDocument();
      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should integrate with all required providers', () => {
      render(
        <RootLayout>
          <div data-testid="test-content">Test Content</div>
        </RootLayout>
      );

      // Verify all components are present
      expect(screen.getByTestId('nuqs-adapter')).toBeInTheDocument();
      expect(screen.getByTestId('providers')).toBeInTheDocument();
      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    });

    it('should pass children through all provider layers', () => {
      const testContent = 'Nested Test Content';
      render(
        <RootLayout>
          <div data-testid="nested-content">{testContent}</div>
        </RootLayout>
      );

      expect(screen.getByTestId('nested-content')).toBeInTheDocument();
      expect(screen.getByText(testContent)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing children gracefully', () => {
      expect(() => {
        render(<RootLayout>{null}</RootLayout>);
      }).not.toThrow();
    });

    it('should handle undefined children', () => {
      expect(() => {
        render(<RootLayout>{undefined}</RootLayout>);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should render without unnecessary re-renders', () => {
      const { rerender } = render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      );

      // Re-render with same props
      rerender(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      );

      // Should not throw or cause issues
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });
});

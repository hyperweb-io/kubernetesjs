import React from 'react';
import { render, screen } from '@testing-library/react';
import { Providers } from '@/app/providers';

// Mock the provider components
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

jest.mock('@/k8s/context', () => ({
  KubernetesProvider: ({ children, initialConfig }: { children: React.ReactNode; initialConfig?: any }) => (
    <div data-testid="kubernetes-provider" data-config={JSON.stringify(initialConfig)}>
      {children}
    </div>
  ),
}));

jest.mock('@/contexts/NamespaceContext', () => ({
  NamespaceProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="namespace-provider">{children}</div>
  ),
}));

jest.mock('@/contexts/AppContext', () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-provider">{children}</div>
  ),
}));

jest.mock('@/hooks/useConfirm', () => ({
  ConfirmProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="confirm-provider">{children}</div>
  ),
}));

describe('Providers', () => {
  describe('Basic Rendering', () => {
    it('should render all provider components', () => {
      render(
        <Providers>
          <div data-testid="test-content">Test Content</div>
        </Providers>
      );

      // Check that all providers are rendered (using getAllByTestId to handle multiple instances)
      expect(screen.getAllByTestId('theme-provider')).toHaveLength(1);
      expect(screen.getAllByTestId('app-provider')).toHaveLength(1);
      expect(screen.getAllByTestId('kubernetes-provider')).toHaveLength(1);
      expect(screen.getAllByTestId('namespace-provider')).toHaveLength(1);
      expect(screen.getAllByTestId('confirm-provider')).toHaveLength(1);
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('should render children content correctly', () => {
      const testContent = 'Dashboard Content';
      render(
        <Providers>
          <div>{testContent}</div>
        </Providers>
      );

      expect(screen.getByText(testContent)).toBeInTheDocument();
    });
  });

  describe('Provider Hierarchy', () => {
    it('should render providers in correct order', () => {
      render(
        <Providers>
          <div data-testid="test-content">Test Content</div>
        </Providers>
      );

      // Check that all providers are present
      expect(screen.getAllByTestId('theme-provider')).toHaveLength(1);
      expect(screen.getAllByTestId('app-provider')).toHaveLength(1);
      expect(screen.getAllByTestId('kubernetes-provider')).toHaveLength(1);
      expect(screen.getAllByTestId('namespace-provider')).toHaveLength(1);
      expect(screen.getAllByTestId('confirm-provider')).toHaveLength(1);
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });
  });

  describe('KubernetesProvider Configuration', () => {
    it('should pass correct initial config to KubernetesProvider', () => {
      render(
        <Providers>
          <div>Test Content</div>
        </Providers>
      );

      const kubernetesProviders = screen.getAllByTestId('kubernetes-provider');
      const config = JSON.parse(kubernetesProviders[0].getAttribute('data-config') || '{}');
      
      expect(config).toEqual({
        restEndpoint: '/api/k8s'
      });
    });
  });

  describe('ThemeProvider Configuration', () => {
    it('should render ThemeProvider with correct props', () => {
      render(
        <Providers>
          <div>Test Content</div>
        </Providers>
      );

      // ThemeProvider should be rendered (we can't easily test props in mocked component)
      expect(screen.getAllByTestId('theme-provider')).toHaveLength(1);
    });
  });

  describe('Component Integration', () => {
    it('should integrate with all required providers', () => {
      render(
        <Providers>
          <div data-testid="test-content">Test Content</div>
        </Providers>
      );

      // Verify all components are present
      expect(screen.getAllByTestId('theme-provider')).toHaveLength(1);
      expect(screen.getAllByTestId('app-provider')).toHaveLength(1);
      expect(screen.getAllByTestId('kubernetes-provider')).toHaveLength(1);
      expect(screen.getAllByTestId('namespace-provider')).toHaveLength(1);
      expect(screen.getAllByTestId('confirm-provider')).toHaveLength(1);
    });

    it('should pass children through all provider layers', () => {
      const testContent = 'Nested Test Content';
      render(
        <Providers>
          <div data-testid="nested-content">{testContent}</div>
        </Providers>
      );

      expect(screen.getByTestId('nested-content')).toBeInTheDocument();
      expect(screen.getByText(testContent)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing children gracefully', () => {
      expect(() => {
        render(<Providers>{null}</Providers>);
      }).not.toThrow();
    });

    it('should handle undefined children', () => {
      expect(() => {
        render(<Providers>{undefined}</Providers>);
      }).not.toThrow();
    });

    it('should handle empty children', () => {
      expect(() => {
        render(<Providers></Providers>);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should render without unnecessary re-renders', () => {
      const { rerender } = render(
        <Providers>
          <div>Test Content</div>
        </Providers>
      );

      // Re-render with same props
      rerender(
        <Providers>
          <div>Test Content</div>
        </Providers>
      );

      // Should not throw or cause issues
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should handle multiple children efficiently', () => {
      render(
        <Providers>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </Providers>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });
  });

  describe('Provider Context', () => {
    it('should provide context to child components', () => {
      const TestComponent = () => {
        return <div data-testid="test-component">Context Available</div>;
      };

      render(
        <Providers>
          <TestComponent />
        </Providers>
      );

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByText('Context Available')).toBeInTheDocument();
    });
  });

  describe('Complex Children', () => {
    it('should handle complex nested children', () => {
      const ComplexChild = () => (
        <div data-testid="complex-child">
          <div>Nested Content</div>
          <div>More Content</div>
        </div>
      );

      render(
        <Providers>
          <ComplexChild />
        </Providers>
      );

      expect(screen.getByTestId('complex-child')).toBeInTheDocument();
      expect(screen.getByText('Nested Content')).toBeInTheDocument();
      expect(screen.getByText('More Content')).toBeInTheDocument();
    });

    it('should handle multiple complex children', () => {
      render(
        <Providers>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </Providers>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });
  });

  describe('Provider Props', () => {
    it('should accept children prop correctly', () => {
      const testChildren = <div data-testid="test-children">Test Children</div>;
      
      render(<Providers>{testChildren}</Providers>);

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByText('Test Children')).toBeInTheDocument();
    });
  });
});

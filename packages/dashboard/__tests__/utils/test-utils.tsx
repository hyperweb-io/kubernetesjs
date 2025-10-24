import React, { ReactElement } from 'react'
import { render, renderHook, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { KubernetesProvider } from '../../k8s/context'
import { NamespaceProvider } from '../../contexts/NamespaceContext'
import { AppProvider } from '../../contexts/AppContext'
// import { ConfirmProvider } from '@/hooks'
import { ConfirmProvider } from '../../hooks/useConfirm'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <KubernetesProvider
            initialConfig={{
              restEndpoint: 'http://127.0.0.1:8001',
              queryClient,
            }}
          >
            <NamespaceProvider initialNamespace="default">
              <ConfirmProvider>
                {children}
              </ConfirmProvider>
            </NamespaceProvider>
          </KubernetesProvider>
        </ThemeProvider>
      </AppProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: RenderOptions,
) => render(ui, { wrapper: AllTheProviders, ...options })


const customRenderHook = <T,>(
  hook: () => T,
  options?: RenderOptions,
) => renderHook(hook, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { 
  customRender as render, 
  customRenderHook as renderHook,
}



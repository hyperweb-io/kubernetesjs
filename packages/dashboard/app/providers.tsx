'use client'

import { KubernetesProvider } from '../k8s/context'
import { NamespaceProvider } from '@/contexts/NamespaceContext'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <KubernetesProvider initialConfig={{
      restEndpoint: '/api/k8s'
    }}>
      <NamespaceProvider>
        {children}
      </NamespaceProvider>
    </KubernetesProvider>
  )
}
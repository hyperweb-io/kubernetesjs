'use client'

import { KubernetesProvider } from '../k8s/context'
import { NamespaceProvider } from '@/contexts/NamespaceContext'
import { ConfirmProvider } from '@/hooks/useConfirm'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <KubernetesProvider initialConfig={{
      restEndpoint: '/api/k8s'
    }}>
      <NamespaceProvider>
        <ConfirmProvider>
          {children}
        </ConfirmProvider>
      </NamespaceProvider>
    </KubernetesProvider>
  )
}
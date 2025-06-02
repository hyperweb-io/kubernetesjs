'use client'

import { KubernetesProvider } from '@kubernetesjs/react/context'
import { NamespaceProvider } from '@/contexts/NamespaceContext'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <KubernetesProvider>
      <NamespaceProvider>
        {children}
      </NamespaceProvider>
    </KubernetesProvider>
  )
}

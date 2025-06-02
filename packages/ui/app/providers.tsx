'use client'

import { KubernetesProvider } from '@/contexts/KubernetesContext'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <KubernetesProvider>
      {children}
    </KubernetesProvider>
  )
}
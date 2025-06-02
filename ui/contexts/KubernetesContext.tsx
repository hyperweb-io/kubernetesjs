'use client'

import React, { createContext, useContext, useState } from 'react'
import {
  KubernetesProvider as BaseKubernetesProvider,
  useKubernetes as useBaseKubernetes,
  queryClient
} from '@kubernetesjs/react'
import { KubernetesClient } from 'kubernetesjs'

// Configuration types
export interface KubernetesConfig {
  restEndpoint: string
  namespace?: string
  headers?: Record<string, string>
}

// Context types
interface KubernetesContextValue {
  client: KubernetesClient
  config: KubernetesConfig
  namespace: string
  setNamespace: (namespace: string) => void
  updateConfig: (config: Partial<KubernetesConfig>) => void
}

// Create context
const KubernetesContext = createContext<KubernetesContextValue | undefined>(undefined)



// Provider props
interface KubernetesProviderProps {
  children: React.ReactNode
  initialConfig?: Partial<KubernetesConfig>
}

// Provider component
export function KubernetesProvider({ children, initialConfig }: KubernetesProviderProps) {
  const [namespace, setNamespace] = useState(initialConfig?.namespace || 'default')

  return (
    <BaseKubernetesProvider
      initialConfig={{
        restEndpoint: initialConfig?.restEndpoint || process.env.NEXT_PUBLIC_K8S_API_URL || '/api/k8s',
        headers: initialConfig?.headers || {}
      }}
    >
      <InnerProvider namespace={namespace} setNamespace={setNamespace}>{children}</InnerProvider>
    </BaseKubernetesProvider>
  )
}

interface InnerProviderProps {
  children: React.ReactNode
  namespace: string
  setNamespace: (namespace: string) => void
}

function InnerProvider({ children, namespace, setNamespace }: InnerProviderProps) {
  const base = useBaseKubernetes()

  const updateConfig = (config: Partial<KubernetesConfig>) => {
    base.updateConfig(config)
    if (config.namespace) {
      setNamespace(config.namespace)
    }
  }

  const contextValue: KubernetesContextValue = {
    client: base.client as KubernetesClient,
    config: { ...base.config, namespace },
    namespace,
    setNamespace,
    updateConfig,
  }

  return <KubernetesContext.Provider value={contextValue}>{children}</KubernetesContext.Provider>
}

// Hook to use Kubernetes context
export function useKubernetes() {
  const context = useContext(KubernetesContext)
  if (!context) {
    throw new Error('useKubernetes must be used within a KubernetesProvider')
  }
  return context
}

// Export query client for use in hooks
export { queryClient }

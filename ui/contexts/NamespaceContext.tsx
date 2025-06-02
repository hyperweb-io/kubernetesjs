'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface NamespaceContextValue {
  namespace: string
  setNamespace: (namespace: string) => void
}

const NamespaceContext = createContext<NamespaceContextValue | undefined>(undefined)

interface NamespaceProviderProps {
  children: React.ReactNode
}

export function NamespaceProvider({ children }: NamespaceProviderProps) {
  const [namespace, setNamespace] = useState<string>('default')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNamespace = localStorage.getItem('kubernetes-namespace')
      if (savedNamespace) {
        setNamespace(savedNamespace)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kubernetes-namespace', namespace)
    }
  }, [namespace])

  const contextValue: NamespaceContextValue = {
    namespace,
    setNamespace,
  }

  return (
    <NamespaceContext.Provider value={contextValue}>
      {children}
    </NamespaceContext.Provider>
  )
}

export function usePreferredNamespace() {
  const context = useContext(NamespaceContext)
  if (!context) {
    throw new Error('usePreferredNamespace must be used within a NamespaceProvider')
  }
  return context
}

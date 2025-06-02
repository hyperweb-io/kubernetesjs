'use client'

import React, { createContext, useContext, useState } from 'react'

interface NamespaceContextValue {
  namespace: string
  setNamespace: (ns: string) => void
}

const NamespaceContext = createContext<NamespaceContextValue | undefined>(undefined)

interface NamespaceProviderProps {
  children: React.ReactNode
  initialNamespace?: string
}

export function NamespaceProvider({ children, initialNamespace = 'default' }: NamespaceProviderProps) {
  const [namespace, setNamespace] = useState<string>(initialNamespace)

  return (
    <NamespaceContext.Provider value={{ namespace, setNamespace }}>
      {children}
    </NamespaceContext.Provider>
  )
}

export function usePreferredNamespace(): NamespaceContextValue {
  const ctx = useContext(NamespaceContext)
  if (!ctx) throw new Error('usePreferredNamespace must be used within a NamespaceProvider')
  return ctx
}

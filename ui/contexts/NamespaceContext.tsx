'use client'

import React, { createContext, useContext, useState } from 'react'

interface NamespaceContextValue {
  namespace: string
  setNamespace: (namespace: string) => void
}

const NamespaceContext = createContext<NamespaceContextValue | undefined>(undefined)

interface NamespaceProviderProps {
  children: React.ReactNode
  initialNamespace?: string
}

export function NamespaceProvider({ children, initialNamespace = 'default' }: NamespaceProviderProps) {
  const [namespace, setNamespace] = useState(initialNamespace)
  return (
    <NamespaceContext.Provider value={{ namespace, setNamespace }}>
      {children}
    </NamespaceContext.Provider>
  )
}

export function usePreferredNamespace(): NamespaceContextValue {
  const context = useContext(NamespaceContext)
  if (!context) {
    throw new Error('usePreferredNamespace must be used within a NamespaceProvider')
  }
  return context
}

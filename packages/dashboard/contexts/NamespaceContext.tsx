'use client'

import React, { createContext, useContext, useState, startTransition } from 'react'

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

  // Wrap namespace changes in startTransition to prevent blocking UI
  const setNamespaceNonBlocking = (ns: string) => {
    startTransition(() => {
      setNamespace(ns)
    })
  }

  return (
    <NamespaceContext.Provider value={{ namespace, setNamespace: setNamespaceNonBlocking }}>
      {children}
    </NamespaceContext.Provider>
  )
}

export function usePreferredNamespace(): NamespaceContextValue {
  const ctx = useContext(NamespaceContext)
  if (!ctx) throw new Error('usePreferredNamespace must be used within a NamespaceProvider')
  return ctx
}

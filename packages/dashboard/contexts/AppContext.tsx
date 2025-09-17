'use client'

import React, { createContext, useContext, useState } from 'react'

export type AppMode = 'smart-objects' | 'infra' | 'ide'

interface AppContextValue {
  mode: AppMode
  setMode: (mode: AppMode) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

interface AppProviderProps {
  children: React.ReactNode
  initialMode?: AppMode
}

export function AppProvider({ children, initialMode = 'infra' }: AppProviderProps) {
  const [mode, setMode] = useState<AppMode>(initialMode)

  return (
    <AppContext.Provider value={{ mode, setMode }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppMode(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppMode must be used within an AppProvider')
  return ctx
}
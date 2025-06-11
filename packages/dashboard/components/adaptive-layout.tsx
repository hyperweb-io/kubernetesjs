'use client'

import { usePathname } from 'next/navigation'
import { DashboardLayout } from './dashboard-layout'
import { IDELayout } from './ide-layout'

interface AdaptiveLayoutProps {
  children: React.ReactNode
  onChatToggle: () => void
  chatVisible: boolean
  chatLayoutMode: 'floating' | 'snapped'
  chatWidth: number
  // IDE specific props (passed through when in editor mode)
  ideProps?: {
    activeFile?: string | null
    hasUnsavedChanges?: boolean
    onSaveFile?: () => void
    onSyncFiles?: () => void
    syncStatus?: 'idle' | 'syncing' | 'success' | 'error'
    modifiedFilesCount?: number
  }
}

// Determine layout mode purely from route
function getModeFromRoute(pathname: string): 'smart-objects' | 'infra' | 'editor' {
  if (pathname === '/editor') {
    return 'editor'
  }
  if (pathname === '/d' || pathname.startsWith('/d/')) {
    return 'smart-objects'
  }
  if (pathname === '/i' || pathname.startsWith('/i/')) {
    return 'infra'
  }
  // Legacy routes without prefix default to infra
  return 'infra'
}

export function AdaptiveLayout({ ideProps, ...props }: AdaptiveLayoutProps) {
  const pathname = usePathname()
  const mode = getModeFromRoute(pathname)

  // Use IDE layout for /editor route
  if (mode === 'editor') {
    return <IDELayout {...props} {...ideProps} />
  }

  // Use dashboard layout with mode for everything else
  return <DashboardLayout {...props} mode={mode} />
}
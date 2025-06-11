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

export function AdaptiveLayout(props: AdaptiveLayoutProps) {
  const pathname = usePathname()
  const mode = getModeFromRoute(pathname)

  // Use IDE layout for /editor route
  if (mode === 'editor') {
    return <IDELayout {...props} />
  }

  // Use dashboard layout with mode for everything else
  return <DashboardLayout {...props} mode={mode} />
}
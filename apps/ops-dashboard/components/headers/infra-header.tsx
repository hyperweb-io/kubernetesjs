'use client'

import { Button } from '@/components/ui/button'
import { NamespaceSwitcher } from '@/components/namespace-switcher'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useKubernetes } from '@/k8s/context'
import { Menu, PanelLeftClose, MessageSquare } from 'lucide-react'

interface InfraHeaderProps {
  sidebarOpen: boolean
  onSidebarToggle: () => void
  activeSection: string
  onChatToggle: () => void
  chatVisible: boolean
}

export function InfraHeader({ 
  sidebarOpen, 
  onSidebarToggle, 
  activeSection, 
  onChatToggle, 
  chatVisible 
}: InfraHeaderProps) {
  const { config } = useKubernetes()

  return (
    <header className="bg-card border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          type="button"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <h2 className="ml-4 text-xl font-semibold">
          {activeSection}
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground">Cluster: {config.restEndpoint}</span>
        <NamespaceSwitcher />
        <Button
          variant="ghost"
          size="icon"
          onClick={onChatToggle}
          className={chatVisible ? 'bg-accent' : ''}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
'use client'

import { Button } from '@/components/ui/button'
import { ContextSwitcher } from '@/components/context-switcher'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MessageSquare } from 'lucide-react'

interface IDELayoutProps {
  children: React.ReactNode
  onChatToggle: () => void
  chatVisible: boolean
  chatLayoutMode: 'floating' | 'snapped'
  chatWidth: number
}

export function IDELayout({ children, onChatToggle, chatVisible, chatLayoutMode, chatWidth }: IDELayoutProps) {
  const isSnappedAndOpen = chatVisible && chatLayoutMode === 'snapped'

  return (
    <div className="flex h-screen bg-background">
      <div 
        className="flex-1 flex flex-col overflow-hidden"
        style={isSnappedAndOpen ? { marginRight: `${chatWidth}px` } : {}}
      >
        {/* Minimal IDE Header */}
        <header className="bg-card border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Development Environment</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="border-r pr-4">
              <ContextSwitcher variant="header" />
            </div>
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
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
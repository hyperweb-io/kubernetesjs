'use client'

import { IDEHeader } from '@/components/headers/ide-header'

interface IDELayoutProps {
  children: React.ReactNode
  onChatToggle: () => void
  chatVisible: boolean
  chatLayoutMode: 'floating' | 'snapped'
  chatWidth: number
  // IDE specific props
  activeFile?: string | null
  hasUnsavedChanges?: boolean
  onSaveFile?: () => void
  onSyncFiles?: () => void
  syncStatus?: 'idle' | 'syncing' | 'success' | 'error'
  modifiedFilesCount?: number
}

export function IDELayout({ 
  children, 
  onChatToggle, 
  chatVisible, 
  chatLayoutMode, 
  chatWidth,
  activeFile = null,
  hasUnsavedChanges = false,
  onSaveFile = () => {},
  onSyncFiles = () => {},
  syncStatus = 'idle',
  modifiedFilesCount = 0
}: IDELayoutProps) {
  const isSnappedAndOpen = chatVisible && chatLayoutMode === 'snapped'

  return (
    <div className="flex h-screen bg-background">
      <div 
        className="flex-1 flex flex-col overflow-hidden"
        style={isSnappedAndOpen ? { marginRight: `${chatWidth}px` } : {}}
      >
        <IDEHeader
          activeFile={activeFile}
          hasUnsavedChanges={hasUnsavedChanges}
          onSaveFile={onSaveFile}
          onSyncFiles={onSyncFiles}
          syncStatus={syncStatus}
          modifiedFilesCount={modifiedFilesCount}
          onChatToggle={onChatToggle}
          chatVisible={chatVisible}
        />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
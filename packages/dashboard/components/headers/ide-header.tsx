'use client'

import { Button } from '@/components/ui/button'
import { ContextSwitcher } from '@/components/context-switcher'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  Play, 
  GitBranch, 
  GitCommit, 
  Upload, 
  Download,
  Save,
  RefreshCw,
  Check,
  X,
  MessageSquare
} from 'lucide-react'

interface IDEHeaderProps {
  activeFile: string | null
  hasUnsavedChanges: boolean
  onSaveFile: () => void
  onSyncFiles: () => void
  syncStatus: 'idle' | 'syncing' | 'success' | 'error'
  modifiedFilesCount: number
  onChatToggle: () => void
  chatVisible: boolean
}

export function IDEHeader({ 
  activeFile,
  hasUnsavedChanges,
  onSaveFile,
  onSyncFiles,
  syncStatus,
  modifiedFilesCount,
  onChatToggle,
  chatVisible
}: IDEHeaderProps) {
  return (
    <header className="bg-card border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold">Development Environment</h2>
        <span className="text-sm text-muted-foreground">
          {activeFile ? activeFile.split('/').pop() : 'No file selected'}
          {hasUnsavedChanges && ' •'}
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* IDE Controls */}
        <div className="flex items-center space-x-2 border-r pr-4">
          {/* Run Button */}
          <Button variant="default" size="sm" disabled>
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          
          {/* Git Controls */}
          <Button variant="outline" size="sm">
            <GitBranch className="w-4 h-4 mr-2" />
            main
          </Button>
          <Button variant="outline" size="sm">
            <GitCommit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
          </Button>
          
          {/* Save Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSaveFile}
            disabled={!hasUnsavedChanges}
          >
            <Save className="w-4 h-4" />
          </Button>
          
          {/* Sync Button */}
          <Button 
            variant={syncStatus === 'success' ? 'default' : syncStatus === 'error' ? 'destructive' : 'outline'} 
            size="sm"
            onClick={onSyncFiles}
            disabled={modifiedFilesCount === 0 || syncStatus === 'syncing'}
          >
            {syncStatus === 'syncing' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : syncStatus === 'success' ? (
              <Check className="w-4 h-4" />
            ) : syncStatus === 'error' ? (
              <X className="w-4 h-4" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span className="ml-2">
              {syncStatus === 'syncing' ? 'Syncing...' : 
               syncStatus === 'success' ? 'Synced' :
               syncStatus === 'error' ? 'Error' :
               `Sync (${modifiedFilesCount})`}
            </span>
          </Button>
        </div>
        
        {/* Context Switcher */}
        <div className="border-r pr-4">
          <ContextSwitcher variant="header" />
        </div>
        
        {/* Chat & Theme */}
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
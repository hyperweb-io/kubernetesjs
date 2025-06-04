'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { EnhancedFileExplorer } from '@/components/ide/enhanced-file-explorer'
import { Terminal } from '@/components/ide/terminal'
import { fs } from '@zenfs/core'
import { 
  Play, 
  GitBranch, 
  GitCommit, 
  Upload, 
  Download,
  Save,
  Terminal as TerminalIcon,
  Code,
  RefreshCw,
  Check,
  X
} from 'lucide-react'

// Dynamic imports to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function IDEPage() {
  const [activeFile, setActiveFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [terminalVisible, setTerminalVisible] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [fileLanguage, setFileLanguage] = useState('javascript')
  const [fileSource, setFileSource] = useState<'local' | 'zenfs'>('local')
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [modifiedFiles, setModifiedFiles] = useState<Set<string>>(new Set())

  // Handle file selection from FileExplorer
  const handleFileSelect = (path: string, content: string, source: 'local' | 'zenfs') => {
    setActiveFile(path)
    setFileContent(content)
    setFileSource(source)
    setHasUnsavedChanges(false)
    
    // Detect language from file extension
    const ext = path.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'js':
      case 'jsx':
        setFileLanguage('javascript')
        break
      case 'ts':
      case 'tsx':
        setFileLanguage('typescript')
        break
      case 'html':
        setFileLanguage('html')
        break
      case 'css':
        setFileLanguage('css')
        break
      case 'json':
        setFileLanguage('json')
        break
      case 'md':
        setFileLanguage('markdown')
        break
      case 'yaml':
      case 'yml':
        setFileLanguage('yaml')
        break
      default:
        setFileLanguage('plaintext')
    }
  }

  // Handle file content changes
  const handleContentChange = (value: string | undefined) => {
    setFileContent(value || '')
    setHasUnsavedChanges(true)
  }

  // Save file to ZenFS
  const saveFile = async () => {
    if (activeFile && hasUnsavedChanges) {
      try {
        await fs.promises.writeFile(`/project/${activeFile}`, fileContent)
        setHasUnsavedChanges(false)
        setFileSource('zenfs')
        // Track as modified for sync
        setModifiedFiles(prev => new Set(prev).add(activeFile))
      } catch (error) {
        console.error('Failed to save file:', error)
      }
    }
  }

  // Sync files from ZenFS to local file system
  const syncFiles = async () => {
    setSyncStatus('syncing')
    
    try {
      let successCount = 0
      let errorCount = 0
      
      for (const filePath of modifiedFiles) {
        try {
          // Read content from ZenFS
          const content = await fs.promises.readFile(`/project/${filePath}`, 'utf8')
          
          // Write to local file system
          const response = await fetch('/api/ide/fs/write', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filePath, content })
          })
          
          if (response.ok) {
            successCount++
          } else {
            errorCount++
            console.error(`Failed to sync ${filePath}`)
          }
        } catch (error) {
          errorCount++
          console.error(`Error syncing ${filePath}:`, error)
        }
      }
      
      if (errorCount === 0) {
        setSyncStatus('success')
        setModifiedFiles(new Set())
        setTimeout(() => setSyncStatus('idle'), 3000)
      } else {
        setSyncStatus('error')
        setTimeout(() => setSyncStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Sync failed:', error)
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        saveFile()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeFile, fileContent])

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border-b">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">Web IDE</h1>
          <span className="text-sm text-muted-foreground">
            {activeFile ? activeFile.split('/').pop() : 'No file selected'}
            {hasUnsavedChanges && ' •'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
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
            onClick={saveFile}
            disabled={!hasUnsavedChanges}
          >
            <Save className="w-4 h-4" />
          </Button>
          
          {/* Sync Button */}
          <Button 
            variant={syncStatus === 'success' ? 'default' : syncStatus === 'error' ? 'destructive' : 'outline'} 
            size="sm"
            onClick={syncFiles}
            disabled={modifiedFiles.size === 0 || syncStatus === 'syncing'}
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
               `Sync (${modifiedFiles.size})`}
            </span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer (Left Sidebar) */}
        <div className="w-64 bg-card border-r">
          <EnhancedFileExplorer onFileSelect={handleFileSelect} />
        </div>

        {/* Editor and Terminal Container */}
        <div className="flex-1 flex flex-col">
          {/* Code Editor */}
          <div className="flex-1 bg-[#1e1e1e]">
            {activeFile ? (
              <MonacoEditor
                height="100%"
                language={fileLanguage}
                theme="vs-dark"
                value={fileContent}
                onChange={handleContentChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Code className="w-12 h-12 mx-auto mb-4" />
                  <p>Select a file to start editing</p>
                </div>
              </div>
            )}
          </div>

          {/* Terminal */}
          {terminalVisible && (
            <div className="h-64 bg-card border-t">
              <div className="flex items-center justify-between px-2 py-1 bg-background border-b">
                <div className="flex items-center">
                  <TerminalIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Terminal</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTerminalVisible(false)}
                >
                  ×
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <Terminal className="h-full" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-card border-t text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>{fileLanguage}</span>
          <span>Ln 1, Col 1</span>
          <span className="flex items-center">
            {fileSource === 'zenfs' ? (
              <><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>ZenFS</>
            ) : (
              <><span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>Local</>
            )}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setTerminalVisible(!terminalVisible)}
            className="hover:text-foreground"
          >
            Terminal
          </button>
          <span>{hasUnsavedChanges ? 'Modified' : 'Ready'}</span>
        </div>
      </div>
    </div>
  )
}
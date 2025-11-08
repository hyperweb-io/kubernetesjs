'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Server,
  Brain,
  Sparkles,
  Plus,
  Trash2,
  FolderOpen,
  Globe
} from 'lucide-react'
import { OllamaClient, BradieClient, type Session } from '@/lib/agents'
import type { GlobalAgentConfig } from './ai-chat-global'

interface AgentManagerGlobalProps {
  isOpen: boolean
  onClose: () => void
  currentConfig: GlobalAgentConfig
  onConfigChange: (config: GlobalAgentConfig) => void
}

export function AgentManagerGlobal({ isOpen, onClose, currentConfig, onConfigChange }: AgentManagerGlobalProps) {
  // Session Management State
  const [sessions, setSessions] = useState<Session[]>([])
  const [showCreateSession, setShowCreateSession] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectPath, setProjectPath] = useState('')
  
  // Model Management State
  const [ollamaModels, setOllamaModels] = useState<string[]>(['llama2', 'mistral', 'mixtral'])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  
  // Endpoint State
  const [bradieDomain, setBradieDomain] = useState(currentConfig.bradieDomain || 'http://localhost:3001')
  const [ollamaEndpoint, setOllamaEndpoint] = useState(currentConfig.endpoint || 'http://localhost:11434')
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  
  // General State
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({})
  
  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('ai-chat-bradie-sessions')
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions)
        setSessions(parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt)
        })))
      } catch (err) {
        console.error('Failed to load sessions:', err)
      }
    }
  }, [])

  // Save sessions to localStorage
  const saveSessions = (newSessions: Session[]) => {
    setSessions(newSessions)
    localStorage.setItem('ai-chat-bradie-sessions', JSON.stringify(newSessions))
  }

  // Test Ollama connection and load models
  const testOllamaConnection = async () => {
    setIsTestingConnection(true)
    setError(null)
    
    try {
      const client = new OllamaClient(ollamaEndpoint)
      const models = await client.listModels()
      setOllamaModels(models)
      setConnectionStatus(prev => ({ ...prev, ollama: true }))
      setSuccess('Successfully connected to Ollama')
    } catch (err) {
      console.error('Ollama connection error:', err)
      setConnectionStatus(prev => ({ ...prev, ollama: false }))
      setError('Failed to connect to Ollama. Please ensure Ollama is running.')
    } finally {
      setIsTestingConnection(false)
    }
  }

  // Test Bradie connection
  const testBradieConnection = async () => {
    setIsTestingConnection(true)
    setError(null)
    
    try {
      const client = new BradieClient(bradieDomain)
      const isHealthy = await client.checkHealth()
      setConnectionStatus(prev => ({ ...prev, bradie: isHealthy }))
      if (isHealthy) {
        setSuccess('Successfully connected to Bradie')
      } else {
        setError('Bradie backend is not responding')
      }
    } catch (err) {
      console.error('Bradie connection error:', err)
      setConnectionStatus(prev => ({ ...prev, bradie: false }))
      setError('Failed to connect to Bradie backend')
    } finally {
      setIsTestingConnection(false)
    }
  }

  // Create new Bradie session
  const createSession = async () => {
    if (!projectName || !projectPath) {
      setError('Please provide both project name and path')
      return
    }

    try {
      const client = new BradieClient(bradieDomain)
      const session = await client.createSession(projectName, projectPath)
      const newSessions = [...sessions, session]
      saveSessions(newSessions)
      
      // Update config with new session
      onConfigChange({
        ...currentConfig,
        agent: 'bradie',
        bradieDomain,
        session
      })
      
      setShowCreateSession(false)
      setProjectName('')
      setProjectPath('')
      setSuccess('Session created successfully')
    } catch (err) {
      console.error('Failed to create session:', err)
      setError('Failed to create session')
    }
  }

  // Delete session
  const deleteSession = (sessionId: string) => {
    const newSessions = sessions.filter(s => s.id !== sessionId)
    saveSessions(newSessions)
    
    // If deleted session was active, clear it
    if (currentConfig.session?.id === sessionId) {
      onConfigChange({
        ...currentConfig,
        session: null
      })
    }
  }

  // Apply configuration
  const applyConfig = () => {
    const newConfig: GlobalAgentConfig = {
      agent: currentConfig.agent,
      endpoint: currentConfig.agent === 'ollama' ? ollamaEndpoint : currentConfig.endpoint,
      model: currentConfig.model,
      bradieDomain: bradieDomain,
      session: currentConfig.session
    }
    
    onConfigChange(newConfig)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agent Configuration</DialogTitle>
          <DialogDescription>
            Configure your AI agents and manage sessions
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentConfig.agent} onValueChange={(v) => onConfigChange({ ...currentConfig, agent: v as any })}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ollama" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Ollama
            </TabsTrigger>
            <TabsTrigger value="bradie" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Bradie
            </TabsTrigger>
          </TabsList>

          {/* Ollama Configuration */}
          <TabsContent value="ollama" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ollama-endpoint">Ollama Endpoint</Label>
              <div className="flex gap-2">
                <Input
                  id="ollama-endpoint"
                  value={ollamaEndpoint}
                  onChange={(e) => setOllamaEndpoint(e.target.value)}
                  placeholder="http://localhost:11434"
                />
                <Button
                  variant="outline"
                  onClick={testOllamaConnection}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Server className="w-4 h-4" />
                  )}
                  Test
                </Button>
              </div>
              {connectionStatus.ollama !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  {connectionStatus.ollama ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  {connectionStatus.ollama ? 'Connected' : 'Not connected'}
                </div>
              )}
            </div>

            {ollamaModels.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="ollama-model">Model</Label>
                <Select
                  value={currentConfig.model}
                  onValueChange={(model) => onConfigChange({ ...currentConfig, model })}
                >
                  <SelectTrigger id="ollama-model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {ollamaModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </TabsContent>

          {/* Bradie Configuration */}
          <TabsContent value="bradie" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bradie-domain">Bradie Backend Domain</Label>
              <div className="flex gap-2">
                <Input
                  id="bradie-domain"
                  value={bradieDomain}
                  onChange={(e) => setBradieDomain(e.target.value)}
                  placeholder="http://localhost:3001"
                />
                <Button
                  variant="outline"
                  onClick={testBradieConnection}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                  Test
                </Button>
              </div>
              {connectionStatus.bradie !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  {connectionStatus.bradie ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  {connectionStatus.bradie ? 'Connected' : 'Not connected'}
                </div>
              )}
            </div>

            {/* Sessions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Sessions</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateSession(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Session
                </Button>
              </div>
              
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No sessions yet. Create one to get started.
                </p>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        currentConfig.session?.id === session.id
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => onConfigChange({ ...currentConfig, session })}
                    >
                      <div className="flex items-center gap-3">
                        <FolderOpen className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{session.name}</p>
                          <p className="text-sm text-muted-foreground">{session.path}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession(session.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create Session Dialog */}
            {showCreateSession && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium">Create New Session</h4>
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My Project"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-path">Project Path</Label>
                  <Input
                    id="project-path"
                    value={projectPath}
                    onChange={(e) => setProjectPath(e.target.value)}
                    placeholder="/path/to/project"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={createSession} size="sm">
                    Create
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowCreateSession(false)
                      setProjectName('')
                      setProjectPath('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={applyConfig}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

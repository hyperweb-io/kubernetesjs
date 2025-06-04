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
  Loader2,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Server,
  Settings,
  Plus,
  FolderOpen
} from 'lucide-react'
import OllamaClient from '@/lib/agent/ollama'
import { Session } from './session-manager'

export interface AgentConfig {
  endpoint: string
  model: string
  session: Session | null
}

interface AgentManagerProps {
  isOpen: boolean
  onClose: () => void
  currentConfig: AgentConfig
  onConfigChange: (config: AgentConfig) => void
}

export function AgentManager({ isOpen, onClose, currentConfig, onConfigChange }: AgentManagerProps) {
  // Session Management State
  const [sessions, setSessions] = useState<Session[]>([])
  const [showCreateSession, setShowCreateSession] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectPath, setProjectPath] = useState('')
  const [instanceId, setInstanceId] = useState<string | null>(null)
  
  // Model Management State
  const [models, setModels] = useState<string[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [isPulling, setIsPulling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [pullModel, setPullModel] = useState('')
  
  // Endpoint State
  const [endpoint, setEndpoint] = useState(currentConfig.endpoint)
  const [tempEndpoint, setTempEndpoint] = useState(currentConfig.endpoint)
  const [isTestingEndpoint, setIsTestingEndpoint] = useState(false)
  
  // General State
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [ollamaClient, setOllamaClient] = useState(() => new OllamaClient(currentConfig.endpoint))

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('ai-chat-sessions')
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
    localStorage.setItem('ai-chat-sessions', JSON.stringify(newSessions))
  }

  // Get instance ID on mount
  useEffect(() => {
    if (isOpen && !instanceId) {
      fetchInstanceId()
    }
  }, [isOpen, instanceId])

  const fetchInstanceId = async () => {
    try {
      const response = await fetch('/api/instance-id')
      if (!response.ok) throw new Error('Failed to get instance ID')
      const data = await response.json()
      setInstanceId(data.instanceId)
    } catch (err) {
      console.error('Failed to get instance ID:', err)
    }
  }

  // Load models when dialog opens
  useEffect(() => {
    if (isOpen) {
      checkOllamaAndLoadModels()
    }
  }, [isOpen])

  const checkOllamaAndLoadModels = async () => {
    setIsLoadingModels(true)
    setError(null)
    try {
      const modelList = await ollamaClient.listModels()
      setModels(modelList || [])
      setOllamaStatus('online')
    } catch (err) {
      console.error('Failed to connect to Ollama:', err)
      setOllamaStatus('offline')
      setModels([]) // Ensure models is an empty array on error
      setError('Failed to connect to Ollama. Please ensure Ollama is running.')
    } finally {
      setIsLoadingModels(false)
    }
  }

  const createSession = async () => {
    if (!instanceId || !projectName.trim() || !projectPath.trim()) {
      setError('Please fill in all fields')
      return
    }

    setError(null)

    try {
      // Initialize project
      const response = await fetch('/api/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: projectName.trim(),
          projectPath: projectPath.trim(),
          instanceId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || 'Failed to initialize project')
      }

      const { sessionId, projectId } = await response.json()

      const newSession: Session = {
        sessionId,
        projectId,
        projectName: projectName.trim(),
        projectPath: projectPath.trim(),
        createdAt: new Date(),
        active: true,
      }

      // Deactivate other sessions and add new one
      const updatedSessions = sessions.map(s => ({ ...s, active: false }))
      updatedSessions.push(newSession)
      saveSessions(updatedSessions)

      // Update config with new session
      onConfigChange({
        ...currentConfig,
        session: newSession
      })

      // Reset form
      setProjectName('')
      setProjectPath('')
      setShowCreateSession(false)
      setSuccess('Session created successfully!')
    } catch (err) {
      console.error('Failed to create session:', err)
      setError(err instanceof Error ? err.message : 'Failed to create session')
    }
  }

  const switchSession = (session: Session) => {
    const updatedSessions = sessions.map(s => ({
      ...s,
      active: s.sessionId === session.sessionId
    }))
    saveSessions(updatedSessions)
    onConfigChange({
      ...currentConfig,
      session
    })
    setSuccess(`Switched to session: ${session.projectName}`)
  }

  const deleteSession = (sessionId: string) => {
    const filtered = sessions.filter(s => s.sessionId !== sessionId)
    saveSessions(filtered)
    
    // If deleting active session, switch to another or null
    if (currentConfig.session?.sessionId === sessionId) {
      const newActive = filtered.find(s => s.active) || filtered[0] || null
      if (newActive) {
        switchSession(newActive)
      } else {
        onConfigChange({
          ...currentConfig,
          session: null
        })
      }
    }
  }

  const handlePullModel = async () => {
    if (!pullModel.trim()) return

    setIsPulling(true)
    setError(null)
    setSuccess(null)

    try {
      await ollamaClient.pullModel(pullModel.trim())
      setSuccess(`Successfully pulled model: ${pullModel}`)
      setPullModel('')
      // Reload models
      await checkOllamaAndLoadModels()
    } catch (err) {
      console.error('Failed to pull model:', err)
      setError(err instanceof Error ? err.message : 'Failed to pull model')
    } finally {
      setIsPulling(false)
    }
  }

  const handleDeleteModel = async (model: string) => {
    if (!confirm(`Are you sure you want to delete the model "${model}"?`)) return

    setIsDeleting(true)
    setError(null)
    setSuccess(null)

    try {
      await ollamaClient.deleteModel(model)
      setSuccess(`Successfully deleted model: ${model}`)
      // If deleted model was current, switch to another
      if (model === currentConfig.model && models.length > 1) {
        const newModel = models.find(m => m !== model)
        if (newModel) {
          onConfigChange({
            ...currentConfig,
            model: newModel
          })
        }
      }
      // Reload models
      await checkOllamaAndLoadModels()
    } catch (err) {
      console.error('Failed to delete model:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete model')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSelectModel = (model: string) => {
    onConfigChange({
      ...currentConfig,
      model
    })
    setSuccess(`Selected model: ${model}`)
  }

  const handleTestEndpoint = async () => {
    setIsTestingEndpoint(true)
    setError(null)
    try {
      const testClient = new OllamaClient(tempEndpoint)
      await testClient.listModels()
      setEndpoint(tempEndpoint)
      setOllamaClient(new OllamaClient(tempEndpoint))
      onConfigChange({
        ...currentConfig,
        endpoint: tempEndpoint
      })
      setSuccess('Endpoint connected successfully!')
      await checkOllamaAndLoadModels()
    } catch (err) {
      setError('Failed to connect to endpoint. Please check the URL and ensure Ollama is running.')
    } finally {
      setIsTestingEndpoint(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Agent Configuration</DialogTitle>
          <DialogDescription>
            Configure your AI agent settings, sessions, models, and connection.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
                <AlertDescription className="text-green-600 dark:text-green-400">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {!showCreateSession && (
              <>
                <div className="space-y-2">
                  <Label>Active Sessions</Label>
                  {sessions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No sessions yet. Create your first session to get started.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {sessions.map((session) => (
                        <div
                          key={session.sessionId}
                          className={`flex items-center justify-between p-3 border rounded-lg ${
                            session.active ? 'bg-accent border-primary' : ''
                          }`}
                        >
                          <div className="flex-1">
                            <div className="font-medium">{session.projectName}</div>
                            <div className="text-sm text-muted-foreground">{session.projectPath}</div>
                            <div className="text-xs text-muted-foreground">
                              Created: {session.createdAt.toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!session.active && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => switchSession(session)}
                              >
                                Switch
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteSession(session.sessionId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setShowCreateSession(true)}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Session
                </Button>
              </>
            )}

            {showCreateSession && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="My Awesome Project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-path">Project Path</Label>
                  <div className="flex gap-2">
                    <Input
                      id="project-path"
                      placeholder="/path/to/project"
                      value={projectPath}
                      onChange={(e) => setProjectPath(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setProjectPath(window.location.pathname)}
                      title="Use current path"
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The path where your project files are located
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setShowCreateSession(false)
                      setProjectName('')
                      setProjectPath('')
                      setError(null)
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={createSession}
                    disabled={!projectName.trim() || !projectPath.trim()}
                    className="flex-1"
                  >
                    Create Session
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-4">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Ollama Status:</span>
              {ollamaStatus === 'checking' ? (
                <span className="text-muted-foreground">Checking...</span>
              ) : ollamaStatus === 'online' ? (
                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Online
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Offline
                </span>
              )}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
                <AlertDescription className="text-green-600 dark:text-green-400">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Model List */}
            <div className="space-y-2">
              <Label>Available Models</Label>
              {isLoadingModels ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : !models || models.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {ollamaStatus === 'offline' ? (
                    'Cannot connect to Ollama. Please ensure it is running.'
                  ) : (
                    'No models installed. Pull a model to get started.'
                  )}
                </div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {models.map((model) => (
                    <div
                      key={model}
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        model === currentConfig.model ? 'bg-accent border-primary' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{model}</div>
                        {model === currentConfig.model && (
                          <div className="text-xs text-muted-foreground">Currently selected</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {model !== currentConfig.model && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSelectModel(model)}
                          >
                            Select
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteModel(model)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pull Model */}
            <div className="space-y-2">
              <Label htmlFor="model-name">Pull New Model</Label>
              <div className="flex gap-2">
                <Input
                  id="model-name"
                  placeholder="e.g., llama2, codellama, mixtral"
                  value={pullModel}
                  onChange={(e) => setPullModel(e.target.value)}
                  disabled={isPulling || ollamaStatus !== 'online'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isPulling) {
                      handlePullModel()
                    }
                  }}
                />
                <Button
                  onClick={handlePullModel}
                  disabled={!pullModel.trim() || isPulling || ollamaStatus !== 'online'}
                >
                  {isPulling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Pulling...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Pull
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Popular models: llama2, mistral, codellama, mixtral, phi
              </p>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="endpoint">Ollama Endpoint URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="endpoint"
                    value={tempEndpoint}
                    onChange={(e) => setTempEndpoint(e.target.value)}
                    placeholder="http://localhost:11434"
                    disabled={isTestingEndpoint}
                  />
                  <Button
                    onClick={handleTestEndpoint}
                    disabled={isTestingEndpoint || tempEndpoint === endpoint}
                    variant="outline"
                  >
                    {isTestingEndpoint ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Server className="h-4 w-4 mr-2" />
                        Test & Apply
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Default: http://localhost:11434. Change this if Ollama is running on a different host or port.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Current Configuration</Label>
                <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Endpoint:</span>
                    <span className="font-mono">{endpoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Selected Model:</span>
                    <span className="font-medium">{currentConfig.model || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Session:</span>
                    <span className="font-medium">
                      {currentConfig.session?.projectName || 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={ollamaStatus === 'online' ? 'text-green-600' : 'text-red-600'}>
                      {ollamaStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
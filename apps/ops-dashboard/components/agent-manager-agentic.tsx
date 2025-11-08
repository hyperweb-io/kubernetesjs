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
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Server,
  Settings,
  Plus,
  FolderOpen,
  Brain,
  Sparkles
} from 'lucide-react'
import { AgentKit } from 'agentic-kit'
import OllamaClient from '@agentic-kit/ollama'
import type { AgentProvider } from './ai-chat-agentic'

interface AgentManagerAgenticProps {
  isOpen: boolean
  onClose: () => void
  agentKit: AgentKit
  currentProvider: AgentProvider
  onProviderChange: (provider: AgentProvider) => void
}

export function AgentManagerAgentic({ 
  isOpen, 
  onClose, 
  agentKit, 
  currentProvider, 
  onProviderChange 
}: AgentManagerAgenticProps) {
  // Connection states
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [bradieStatus, setBradieStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  
  // Model management
  const [ollamaModels, setOllamaModels] = useState<string[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [isPulling, setIsPulling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [pullModel, setPullModel] = useState('')
  
  // Endpoints
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434')
  const [bradieEndpoint, setBradieEndpoint] = useState('http://localhost:3001')
  
  // Bradie project management
  const [projectName, setProjectName] = useState('')
  const [projectPath, setProjectPath] = useState('')
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  
  // UI state
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)

  const ollamaClient = new OllamaClient(ollamaEndpoint)

  // Test connections when dialog opens
  useEffect(() => {
    if (isOpen) {
      testConnections()
      loadOllamaModels()
    }
  }, [isOpen])

  const testConnections = async () => {
    setOllamaStatus('checking')
    setBradieStatus('checking')
    
    try {
      await ollamaClient.listModels()
      setOllamaStatus('online')
    } catch {
      setOllamaStatus('offline')
    }

    try {
      const response = await fetch(`${bradieEndpoint}/api/health`)
      setBradieStatus(response.ok ? 'online' : 'offline')
    } catch {
      setBradieStatus('offline')
    }
  }

  const loadOllamaModels = async () => {
    if (ollamaStatus === 'offline') {
      setOllamaModels([])
      return
    }
    
    setIsLoadingModels(true)
    try {
      const models = await ollamaClient.listModels()
      setOllamaModels(models || [])
    } catch (err) {
      console.error('Failed to load Ollama models:', err)
      setOllamaModels([])
    } finally {
      setIsLoadingModels(false)
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
      await loadOllamaModels()
    } catch (err) {
      setError(`Failed to pull model: ${err}`)
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
      await loadOllamaModels()
    } catch (err) {
      setError(`Failed to delete model: ${err}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleTestConnection = async (provider: AgentProvider, endpoint: string) => {
    setIsTestingConnection(true)
    try {
      let isOnline = false
      if (provider === 'ollama') {
        const testClient = new OllamaClient(endpoint)
        await testClient.listModels()
        isOnline = true
        setOllamaStatus('online')
      } else {
        const response = await fetch(`${endpoint}/api/health`)
        isOnline = response.ok
        setBradieStatus(isOnline ? 'online' : 'offline')
      }
      setSuccess(`${provider} connection ${isOnline ? 'successful' : 'failed'}`)
    } catch (err) {
      if (provider === 'ollama') {
        setOllamaStatus('offline')
      } else {
        setBradieStatus('offline')
      }
      setError(`Failed to test ${provider} connection: ${err}`)
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleCreateBradieProject = async () => {
    if (!projectName.trim() || !projectPath.trim()) {
      setError('Please fill in all fields')
      return
    }

    setIsCreatingProject(true)
    setError(null)

    try {
      // This would need Bradie client implementation
      setSuccess(`Project creation not yet implemented`)
      setProjectName('')
      setProjectPath('')
    } catch (err) {
      setError(`Failed to create project: ${err}`)
    } finally {
      setIsCreatingProject(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agent Configuration</DialogTitle>
          <DialogDescription>
            Configure your AI agents using Agentic Kit - switch between Ollama and Bradie providers.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="providers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-4">
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

            {/* Current Provider */}
            <div className="space-y-2">
              <Label>Current Provider</Label>
              <Select
                value={currentProvider}
                onValueChange={(value: AgentProvider) => onProviderChange(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ollama">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-500" />
                      Ollama
                    </div>
                  </SelectItem>
                  <SelectItem value="bradie">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Bradie
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ollama Configuration */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Ollama Endpoint</Label>
                <div className={`flex items-center gap-1 text-xs ${
                  ollamaStatus === 'online' ? 'text-green-600' : 
                  ollamaStatus === 'offline' ? 'text-red-600' : 
                  'text-muted-foreground'
                }`}>
                  {ollamaStatus === 'checking' ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : ollamaStatus === 'online' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {ollamaStatus}
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={ollamaEndpoint}
                  onChange={(e) => setOllamaEndpoint(e.target.value)}
                  placeholder="http://localhost:11434"
                />
                <Button
                  variant="outline"
                  onClick={() => handleTestConnection('ollama', ollamaEndpoint)}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Server className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Bradie Configuration */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Bradie Endpoint</Label>
                <div className={`flex items-center gap-1 text-xs ${
                  bradieStatus === 'online' ? 'text-green-600' : 
                  bradieStatus === 'offline' ? 'text-red-600' : 
                  'text-muted-foreground'
                }`}>
                  {bradieStatus === 'checking' ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : bradieStatus === 'online' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {bradieStatus}
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  value={bradieEndpoint}
                  onChange={(e) => setBradieEndpoint(e.target.value)}
                  placeholder="http://localhost:3001"
                />
                <Button
                  variant="outline"
                  onClick={() => handleTestConnection('bradie', bradieEndpoint)}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Server className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <Label>Model</Label>
              <Input
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                placeholder="mistral"
              />
              <p className="text-xs text-muted-foreground">
                Model name to use (e.g., mistral, llama2, codellama)
              </p>
            </div>
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Ollama Models</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadOllamaModels}
                  disabled={isLoadingModels || ollamaStatus !== 'online'}
                >
                  {isLoadingModels ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </Button>
              </div>

              {/* Available Models */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {isLoadingModels ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : !ollamaModels || ollamaModels.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {ollamaStatus === 'offline' ? (
                      'Cannot connect to Ollama. Please ensure it is running.'
                    ) : (
                      'No models installed. Pull a model to get started.'
                    )}
                  </div>
                ) : (
                  (ollamaModels || []).map((model) => (
                    <div
                      key={model}
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        model === selectedModel ? 'bg-accent border-primary' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{model}</div>
                        {model === selectedModel && (
                          <div className="text-xs text-muted-foreground">Currently selected</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {model !== selectedModel && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedModel(model)}
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
                  ))
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
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Current Bradie Session</Label>
                <div className="p-3 bg-muted rounded-lg space-y-1 text-sm mt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session ID:</span>
                    <span className="font-mono">{sessionId || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project ID:</span>
                    <span className="font-mono">{projectId || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={bradieStatus === 'online' ? 'text-green-600' : 'text-red-600'}>
                      {bradieStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Create New Project */}
              <div className="space-y-4 pt-4 border-t">
                <Label>Create New Bradie Project</Label>
                
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
                </div>

                <Button
                  onClick={handleCreateBradieProject}
                  disabled={!projectName.trim() || !projectPath.trim() || isCreatingProject || bradieStatus !== 'online'}
                  className="w-full"
                >
                  {isCreatingProject ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </>
                  )}
                </Button>
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
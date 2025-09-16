'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit, 
  Eye,
  EyeOff,
  Key,
  FileText,
  Lock,
  Upload,
  AlertCircle
} from 'lucide-react'
import { type Secret as K8sSecret } from 'kubernetesjs'
import { useSecrets, useDeleteSecret, useCreateSecret } from '@/hooks'

import { confirmDialog } from '@/hooks/useConfirm'

interface Secret {
  name: string
  namespace: string
  type: string
  dataKeys: string[]
  createdAt: string
  immutable?: boolean
  k8sData?: K8sSecret
}

export function SecretsView() {
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null)
  const [showValues, setShowValues] = useState<Set<string>>(new Set())
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [secretName, setSecretName] = useState('')
  const [secretContent, setSecretContent] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'text' | 'file'>('text')
  const [creating, setCreating] = useState(false)
  
  // Use TanStack Query hooks
  const { data, isLoading, error, refetch } = useSecrets()
  const deleteSecretMutation = useDeleteSecret()
  const createSecretMutation = useCreateSecret()
  
  // Format secrets from query data
  const secrets: Secret[] = data?.items
    ?.filter(item => !item.metadata!.name!.includes('default-token-')) // Filter out default service account tokens
    .map(item => ({
      name: item.metadata!.name!,
      namespace: item.metadata!.namespace!,
      type: item.type!,
      dataKeys: Object.keys(item.data || {}),
      createdAt: item.metadata!.creationTimestamp!,
      immutable: item.immutable,
      k8sData: item
    })) || []

  const handleRefresh = () => {
    refetch()
  }

  const handleDelete = async (secret: Secret) => {
    const confirmed = await confirmDialog({
      title: 'Delete Secret',
      description: `Are you sure you want to delete ${secret.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deleteSecretMutation.mutateAsync({
          name: secret.name,
          namespace: secret.namespace
        })
      } catch (err) {
        console.error('Failed to delete secret:', err)
        alert(`Failed to delete secret: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const parseEnvContent = (content: string): Record<string, string> => {
    const result: Record<string, string> = {}
    const lines = content.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      
      const index = trimmed.indexOf('=')
      if (index > 0) {
        const key = trimmed.substring(0, index).trim()
        let value = trimmed.substring(index + 1).trim()
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        
        result[key] = value
      }
    }
    
    return result
  }

  const handleCreateSecret = async () => {
    if (!secretName.trim()) {
      alert('Please provide a secret name')
      return
    }
    
    if (!secretContent.trim()) {
      alert('Please provide secret content')
      return
    }
    
    setCreating(true)
    try {
      const parsedData = parseEnvContent(secretContent)
      
      if (Object.keys(parsedData).length === 0) {
        alert('No valid key-value pairs found in the content')
        return
      }
      
      // Convert to base64 for Kubernetes
      const data: Record<string, string> = {}
      for (const [key, value] of Object.entries(parsedData)) {
        data[key] = btoa(value) // Base64 encode
      }
      
      const secret: K8sSecret = {
        metadata: {
          name: secretName,
          namespace: 'default',
          creationTimestamp: new Date().toISOString()
        },
        type: 'Opaque',
        data
      }
      
      await createSecretMutation.mutateAsync({
        secret,
        namespace: 'default'
      })
      
      // Reset form and close dialog
      setSecretName('')
      setSecretContent('')
      setCreateDialogOpen(false)
    } catch (err) {
      console.error('Failed to create secret:', err)
      alert(`Failed to create secret: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setCreating(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setSecretContent(content)
      }
      reader.readAsText(file)
    }
  }

  const toggleShowValue = (secretName: string) => {
    const newShowValues = new Set(showValues)
    if (showValues.has(secretName)) {
      newShowValues.delete(secretName)
    } else {
      newShowValues.add(secretName)
    }
    setShowValues(newShowValues)
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Opaque':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Key className="w-3 h-3" />
          Generic
        </Badge>
      case 'kubernetes.io/tls':
        return <Badge variant="success" className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          TLS
        </Badge>
      case 'kubernetes.io/dockerconfigjson':
        return <Badge variant="outline" className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          Docker
        </Badge>
      case 'kubernetes.io/service-account-token':
        return <Badge className="flex items-center gap-1">
          <Key className="w-3 h-3" />
          Service Account
        </Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Secrets</h2>
          <p className="text-muted-foreground">
            Manage sensitive data and credentials
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Secret
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Create Secret from .env File</DialogTitle>
                <DialogDescription>
                  Upload a .env file or paste environment variables to create a Kubernetes secret
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="secret-name">Secret Name</Label>
                  <Input
                    id="secret-name"
                    placeholder="my-app-secrets"
                    value={secretName}
                    onChange={(e) => setSecretName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Method</Label>
                  <div className="flex gap-4">
                    <Button
                      variant={uploadMethod === 'text' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUploadMethod('text')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Paste Text
                    </Button>
                    <Button
                      variant={uploadMethod === 'file' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUploadMethod('file')}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </div>
                {uploadMethod === 'text' ? (
                  <div className="grid gap-2">
                    <Label htmlFor="secret-content">Environment Variables</Label>
                    <Textarea
                      id="secret-content"
                      placeholder="DATABASE_URL=postgres://user:pass@host:5432/db\nAPI_KEY=your-api-key\nSECRET_TOKEN=your-secret-token"
                      className="h-48 font-mono text-sm"
                      value={secretContent}
                      onChange={(e) => setSecretContent(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter key=value pairs, one per line. Comments starting with # are ignored.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="env-file">Upload .env File</Label>
                    <Input
                      id="env-file"
                      type="file"
                      accept=".env,.txt"
                      onChange={handleFileUpload}
                    />
                    {secretContent && (
                      <div className="mt-2">
                        <Label>Preview</Label>
                        <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                          {secretContent}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateSecret} disabled={creating}>
                  {creating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>Create Secret</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Secrets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{secrets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Generic Secrets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {secrets.filter(s => s.type === 'Opaque').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              TLS Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {secrets.filter(s => s.type === 'kubernetes.io/tls').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Immutable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {secrets.filter(s => s.immutable).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secrets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Secrets</CardTitle>
          <CardDescription>
            Secrets contain sensitive data such as passwords, tokens, and keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : secrets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No secrets found in the default namespace</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Namespace</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Data Keys</TableHead>
                  <TableHead>Immutable</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {secrets.map((secret) => (
                  <TableRow key={secret.name}>
                    <TableCell className="font-medium">{secret.name}</TableCell>
                    <TableCell>{secret.namespace}</TableCell>
                    <TableCell>{getTypeBadge(secret.type)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {secret.dataKeys.map(key => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {secret.immutable ? (
                        <Badge variant="secondary">Yes</Badge>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(secret.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleShowValue(secret.name)}
                        >
                          {showValues.has(secret.name) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => console.log('Edit', secret.name)}
                          disabled={secret.immutable}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(secret)}
                          disabled={secret.immutable}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
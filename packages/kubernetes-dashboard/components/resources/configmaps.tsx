'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit, 
  Eye,
  FileCode,
  FileText,
  Database,
  Save,
  AlertCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { type ConfigMap as K8sConfigMap } from 'kubernetesjs'
import { useConfigMaps, useDeleteConfigMap, useUpdateConfigMap } from '@/hooks'

interface ConfigMap {
  name: string
  namespace: string
  dataKeys: string[]
  binaryDataKeys: string[]
  createdAt: string
  immutable?: boolean
  k8sData?: K8sConfigMap
}

export function ConfigMapsView() {
  const [selectedConfigMap, setSelectedConfigMap] = useState<ConfigMap | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingConfigMap, setEditingConfigMap] = useState<ConfigMap | null>(null)
  const [editedData, setEditedData] = useState<Record<string, string>>({})
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  
  // Use TanStack Query hooks
  const { data, isLoading, error, refetch } = useConfigMaps()
  const deleteConfigMapMutation = useDeleteConfigMap()
  const updateConfigMapMutation = useUpdateConfigMap()
  
  // Format configmaps from query data
  const configMaps: ConfigMap[] = data?.items?.map(item => ({
    name: item.metadata!.name!,
    namespace: item.metadata!.namespace!,
    dataKeys: Object.keys(item.data || {}),
    binaryDataKeys: Object.keys(item.binaryData || {}),
    createdAt: item.metadata!.creationTimestamp!,
    immutable: item.immutable,
    k8sData: item
  })) || []

  const handleRefresh = () => {
    refetch()
  }

  const handleDelete = async (configMap: ConfigMap) => {
    if (confirm(`Are you sure you want to delete ${configMap.name}?`)) {
      try {
        await deleteConfigMapMutation.mutateAsync({
          name: configMap.name,
          namespace: configMap.namespace
        })
      } catch (err) {
        console.error('Failed to delete configmap:', err)
        alert(`Failed to delete configmap: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const handleEdit = (configMap: ConfigMap) => {
    setEditingConfigMap(configMap)
    setEditedData((configMap.k8sData?.data as Record<string, string>) || {})
    setExpandedKeys(new Set())
    setEditDialogOpen(true)
  }

  const toggleKeyExpansion = (key: string) => {
    const newExpanded = new Set(expandedKeys)
    if (expandedKeys.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedKeys(newExpanded)
  }

  const handleSaveConfigMap = async () => {
    if (!editingConfigMap || !editingConfigMap.k8sData) return
    
    setSaving(true)
    try {
      const updatedConfigMap: K8sConfigMap = {
        ...editingConfigMap.k8sData,
        data: editedData
      }
      
      await updateConfigMapMutation.mutateAsync({
        name: editingConfigMap.name,
        configMap: updatedConfigMap,
        namespace: editingConfigMap.namespace
      })
      
      setEditDialogOpen(false)
    } catch (err) {
      console.error('Failed to update configmap:', err)
      alert(`Failed to update configmap: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const getDataTypeBadge = (key: string, isBinary: boolean = false) => {
    if (isBinary) {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <Database className="w-3 h-3" />
        Binary
      </Badge>
    }
    
    const extension = key.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'yaml':
      case 'yml':
      case 'json':
      case 'xml':
        return <Badge variant="outline" className="flex items-center gap-1">
          <FileCode className="w-3 h-3" />
          Config
        </Badge>
      case 'conf':
      case 'properties':
      case 'ini':
        return <Badge className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          Settings
        </Badge>
      case 'sh':
      case 'bash':
        return <Badge variant="success" className="flex items-center gap-1">
          <FileCode className="w-3 h-3" />
          Script
        </Badge>
      default:
        return <Badge variant="secondary">Text</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ConfigMaps</h2>
          <p className="text-muted-foreground">
            Manage application configuration data
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
          <Button onClick={() => alert('Create ConfigMap functionality not yet implemented.\n\nTo create a ConfigMap, use kubectl:\nkubectl create configmap <name> --from-file=<path>')}>
            <Plus className="h-4 w-4 mr-2" />
            Create ConfigMap
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total ConfigMaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configMaps.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Keys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configMaps.reduce((sum, cm) => sum + cm.dataKeys.length + cm.binaryDataKeys.length, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              With Binary Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configMaps.filter(cm => cm.binaryDataKeys.length > 0).length}
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
              {configMaps.filter(cm => cm.immutable).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ConfigMaps Table */}
      <Card>
        <CardHeader>
          <CardTitle>All ConfigMaps</CardTitle>
          <CardDescription>
            ConfigMaps store non-sensitive configuration data as key-value pairs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch configmaps'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : configMaps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No configmaps found in the default namespace</p>
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
                  <TableHead>Data Keys</TableHead>
                  <TableHead>Binary Keys</TableHead>
                  <TableHead>Immutable</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configMaps.map((configMap) => (
                  <TableRow key={configMap.name}>
                    <TableCell className="font-medium">{configMap.name}</TableCell>
                    <TableCell>{configMap.namespace}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {configMap.dataKeys.map(key => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {configMap.binaryDataKeys.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {configMap.binaryDataKeys.map(key => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {key}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {configMap.immutable ? (
                        <Badge variant="secondary">Yes</Badge>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(configMap.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedConfigMap(configMap)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(configMap)}
                          disabled={configMap.immutable}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(configMap)}
                          disabled={configMap.immutable}
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit ConfigMap: {editingConfigMap?.name}</DialogTitle>
            <DialogDescription>
              Modify the configuration data below. Click on a key to expand/collapse its content.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto space-y-4 py-4">
            {editingConfigMap && Object.entries(editedData).map(([key, value]) => {
              const isExpanded = expandedKeys.has(key)
              const lines = value.split('\n').length
              const isLarge = lines > 3 || value.length > 200
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {isLarge && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-6 w-6"
                        onClick={() => toggleKeyExpansion(key)}
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    )}
                    <Label className="font-mono text-sm">{key}</Label>
                    {isLarge && !isExpanded && (
                      <span className="text-xs text-muted-foreground">
                        ({lines} lines, {value.length} chars)
                      </span>
                    )}
                  </div>
                  <Textarea
                    value={value}
                    onChange={(e) => {
                      setEditedData(prev => ({
                        ...prev,
                        [key]: e.target.value
                      }))
                    }}
                    className={`font-mono text-sm ${
                      isLarge && !isExpanded ? 'h-20' : 'min-h-[100px]'
                    }`}
                    style={{
                      height: isLarge && isExpanded ? `${Math.min(lines * 24 + 20, 400)}px` : undefined
                    }}
                  />
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveConfigMap}
              disabled={saving || editingConfigMap?.immutable}
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

  )
}
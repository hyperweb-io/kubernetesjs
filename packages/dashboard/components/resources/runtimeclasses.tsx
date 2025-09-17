'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  RefreshCw, 
  Plus, 
  Trash2, 
  Eye,
  AlertCircle,
  Cpu,
  Box
} from 'lucide-react'
import { 
  useListNodeV1RuntimeClassQuery,
  useDeleteNodeV1RuntimeClass
} from '@/k8s'
import type { RuntimeClass } from 'kubernetesjs'

import { confirmDialog } from '@/hooks/useConfirm'

export function RuntimeClassesView() {
  const [selectedRuntimeClass, setSelectedRuntimeClass] = useState<RuntimeClass | null>(null)
  
  const { data, isLoading, error, refetch } = useListNodeV1RuntimeClassQuery({ path: {}, query: {} })
  const deleteRuntimeClass = useDeleteNodeV1RuntimeClass()

  const runtimeClasses = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (rc: RuntimeClass) => {
    const name = rc.metadata!.name!
    
    const confirmed = await confirmDialog({
      title: 'Delete Runtime Class',
      description: `Are you sure you want to delete ${name}?`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deleteRuntimeClass.mutateAsync({
          path: { name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete runtime class:', err)
        alert(`Failed to delete runtime class: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getHandlerBadge = (handler: string) => {
    const knownHandlers = ['runc', 'nvidia', 'gvisor', 'kata-containers', 'crun']
    const isKnown = knownHandlers.some(h => handler.toLowerCase().includes(h))
    
    return (
      <Badge variant={isKnown ? 'default' : 'secondary'} className="flex items-center gap-1">
        <Box className="w-3 h-3" />
        {handler}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Runtime Classes</h2>
          <p className="text-muted-foreground">
            Container runtime configurations for pods
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
          <Button onClick={() => alert('Create Runtime Class functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Runtime Class
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runtime Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runtimeClasses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Handlers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(runtimeClasses.map(rc => rc.handler)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Scheduling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {runtimeClasses.filter(rc => rc.scheduling).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Runtime Classes</CardTitle>
          <CardDescription>
            Available container runtime configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch runtime classes'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : runtimeClasses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No runtime classes found</p>
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
                  <TableHead>Handler</TableHead>
                  <TableHead>Node Selector</TableHead>
                  <TableHead>Tolerations</TableHead>
                  <TableHead>Overhead</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runtimeClasses.map((rc) => (
                  <TableRow key={rc.metadata?.name}>
                    <TableCell className="font-medium">{rc.metadata?.name}</TableCell>
                    <TableCell>{getHandlerBadge(rc.handler)}</TableCell>
                    <TableCell>
                      {rc.scheduling?.nodeSelector ? (
                        <span className="text-sm font-mono">
                          {Object.entries(rc.scheduling.nodeSelector)
                            .map(([k, v]) => `${k}=${v}`)
                            .join(', ')}
                        </span>
                      ) : (
                        <Badge variant="secondary">None</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {rc.scheduling?.tolerations?.length ? (
                        <Badge>{rc.scheduling.tolerations.length} toleration(s)</Badge>
                      ) : (
                        <Badge variant="secondary">None</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {rc.overhead?.podFixed ? (
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Cpu className="w-3 h-3" />
                            CPU: {rc.overhead.podFixed.cpu || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Box className="w-3 h-3" />
                            Memory: {rc.overhead.podFixed.memory || 'N/A'}
                          </div>
                        </div>
                      ) : (
                        <Badge variant="secondary">None</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedRuntimeClass(rc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(rc)}
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

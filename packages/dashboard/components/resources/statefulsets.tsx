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
  Edit, 
  Scale, 
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { 
  useListAppsV1NamespacedStatefulSetQuery,
  useListAppsV1StatefulSetForAllNamespacesQuery,
  useDeleteAppsV1NamespacedStatefulSet,
  useReplaceAppsV1NamespacedStatefulSetScale
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { StatefulSet } from 'kubernetesjs'

import { confirmDialog } from '@/hooks/useConfirm'

export function StatefulSetsView() {
  const [selectedStatefulSet, setSelectedStatefulSet] = useState<StatefulSet | null>(null)
  const { namespace } = usePreferredNamespace()
  
  // Use k8s hooks directly
  const query = namespace === '_all' 
    ? useListAppsV1StatefulSetForAllNamespacesQuery({ path: {}, query: {} })
    : useListAppsV1NamespacedStatefulSetQuery({ path: { namespace }, query: {} })
    
  const { data, isLoading, error, refetch } = query
  const deleteStatefulSet = useDeleteAppsV1NamespacedStatefulSet()
  const scaleStatefulSet = useReplaceAppsV1NamespacedStatefulSetScale()

  const statefulsets = data?.items || []

  const handleRefresh = () => refetch()

  const handleScale = async (ss: StatefulSet) => {
    const name = ss.metadata!.name!
    const namespace = ss.metadata!.namespace!
    const currentReplicas = ss.spec!.replicas || 0
    
    const newReplicas = prompt(`Scale ${name} to how many replicas?`, currentReplicas.toString())
    if (newReplicas && !isNaN(Number(newReplicas))) {
      try {
        await scaleStatefulSet.mutateAsync({
          path: { namespace, name },
          body: {
            apiVersion: 'autoscaling/v1',
            kind: 'Scale',
            metadata: { name, namespace },
            spec: { replicas: Number(newReplicas) }
          }
        })
        refetch()
      } catch (err) {
        console.error('Failed to scale statefulset:', err)
        alert(`Failed to scale statefulset: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const handleDelete = async (ss: StatefulSet) => {
    const name = ss.metadata!.name!
    const namespace = ss.metadata!.namespace!
    
    const confirmed = await confirmDialog({
      title: 'Delete StatefulSet',
      description: `Are you sure you want to delete ${name}?`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deleteStatefulSet.mutateAsync({
          path: { namespace, name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete statefulset:', err)
        alert(`Failed to delete statefulset: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getStatus = (ss: StatefulSet) => {
    const replicas = ss.spec?.replicas || 0
    const readyReplicas = ss.status?.readyReplicas || 0
    
    if (readyReplicas === replicas && replicas > 0) {
      return 'Running'
    } else if (readyReplicas < replicas) {
      return 'Updating'
    } else {
      return 'Pending'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Running':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'Updating':
        return <Badge variant="warning" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {status}
        </Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">StatefulSets</h2>
          <p className="text-muted-foreground">
            Manage your Kubernetes stateful applications
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
          <Button onClick={() => alert('Create StatefulSet functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create StatefulSet
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total StatefulSets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statefulsets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statefulsets.filter(ss => getStatus(ss) === 'Running').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Replicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statefulsets.reduce((sum, ss) => sum + (ss.status?.readyReplicas || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* StatefulSets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All StatefulSets</CardTitle>
          <CardDescription>
            A list of all stateful sets in your cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch statefulsets'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : statefulsets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No statefulsets found</p>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Replicas</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statefulsets.map((ss) => (
                  <TableRow key={`${ss.metadata?.namespace}/${ss.metadata?.name}`}>
                    <TableCell className="font-medium">{ss.metadata?.name}</TableCell>
                    <TableCell>{ss.metadata?.namespace}</TableCell>
                    <TableCell>{getStatusBadge(getStatus(ss))}</TableCell>
                    <TableCell>
                      {ss.status?.readyReplicas || 0}/{ss.spec?.replicas || 0}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {ss.spec?.template?.spec?.containers?.[0]?.image || 'unknown'}
                    </TableCell>
                    <TableCell>
                      {ss.metadata?.creationTimestamp 
                        ? new Date(ss.metadata.creationTimestamp).toLocaleDateString()
                        : 'Unknown'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedStatefulSet(ss)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleScale(ss)}
                        >
                          <Scale className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => console.log('Edit', ss.metadata?.name)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(ss)}
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

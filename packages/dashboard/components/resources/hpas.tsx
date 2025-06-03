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
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { 
  useListAutoscalingV2beta2NamespacedHorizontalPodAutoscalerQuery,
  useListAutoscalingV2beta2HorizontalPodAutoscalerForAllNamespacesQuery,
  useDeleteAutoscalingV2beta2NamespacedHorizontalPodAutoscaler
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { HorizontalPodAutoscaler } from 'kubernetesjs'

import { confirmDialog } from '@/hooks/useConfirm'

export function HPAsView() {
  const [selectedHPA, setSelectedHPA] = useState<HorizontalPodAutoscaler | null>(null)
  const { namespace } = usePreferredNamespace()
  
  const query = namespace === '_all' 
    ? useListAutoscalingV2beta2HorizontalPodAutoscalerForAllNamespacesQuery({ path: {}, query: {} })
    : useListAutoscalingV2beta2NamespacedHorizontalPodAutoscalerQuery({ path: { namespace }, query: {} })
    
  const { data, isLoading, error, refetch } = query
  const deleteHPA = useDeleteAutoscalingV2beta2NamespacedHorizontalPodAutoscaler()

  const hpas = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (hpa: HorizontalPodAutoscaler) => {
    const name = hpa.metadata!.name!
    const namespace = hpa.metadata!.namespace!
    
    const confirmed = await confirmDialog({
      title: 'Delete Horizontal Pod Autoscaler',
      description: `Are you sure you want to delete ${name}?`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deleteHPA.mutateAsync({
          path: { namespace, name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete HPA:', err)
        alert(`Failed to delete HPA: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getScaleDirection = (current: number, desired: number) => {
    if (current < desired) return 'up'
    if (current > desired) return 'down'
    return 'stable'
  }

  const getScaleIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-blue-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatus = (hpa: HorizontalPodAutoscaler) => {
    const conditions = hpa.status?.conditions || []
    const ableToScale = conditions.find(c => c.type === 'AbleToScale')
    const scalingActive = conditions.find(c => c.type === 'ScalingActive')
    
    if (ableToScale?.status === 'False') return 'Unable to Scale'
    if (scalingActive?.status === 'True') return 'Active'
    return 'Idle'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'Unable to Scale':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {status}
        </Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getMetrics = (hpa: HorizontalPodAutoscaler) => {
    const metrics = hpa.spec?.metrics || []
    return metrics.map(m => {
      if (m.type === 'Resource' && m.resource) {
        return `${m.resource.name} (${m.resource.target?.averageUtilization || 'N/A'}%)`
      }
      return m.type || 'Unknown'
    }).join(', ') || 'No metrics'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Horizontal Pod Autoscalers</h2>
          <p className="text-muted-foreground">
            Automatically scale your workloads based on metrics
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
          <Button onClick={() => alert('Create HPA functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create HPA
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total HPAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hpas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {hpas.filter(h => getStatus(h) === 'Active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scaling Up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {hpas.filter(h => {
                const current = h.status?.currentReplicas || 0
                const desired = h.status?.desiredReplicas || 0
                return current < desired
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Replicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hpas.reduce((sum, h) => sum + (h.status?.currentReplicas || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Horizontal Pod Autoscalers</CardTitle>
          <CardDescription>
            Automatic scaling policies for your workloads
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch HPAs'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : hpas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No horizontal pod autoscalers found</p>
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
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Min/Max</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Metrics</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hpas.map((hpa) => {
                  const current = hpa.status?.currentReplicas || 0
                  const desired = hpa.status?.desiredReplicas || 0
                  const direction = getScaleDirection(current, desired)
                  
                  return (
                    <TableRow key={`${hpa.metadata?.namespace}/${hpa.metadata?.name}`}>
                      <TableCell className="font-medium">{hpa.metadata?.name}</TableCell>
                      <TableCell>{hpa.metadata?.namespace}</TableCell>
                      <TableCell>{hpa.spec?.scaleTargetRef?.name || 'Unknown'}</TableCell>
                      <TableCell>{getStatusBadge(getStatus(hpa))}</TableCell>
                      <TableCell>
                        {hpa.spec?.minReplicas || 1}/{hpa.spec?.maxReplicas || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {current}
                          {getScaleIcon(direction)}
                          {desired !== current && <span className="text-sm text-muted-foreground">→ {desired}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{getMetrics(hpa)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedHPA(hpa)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(hpa)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

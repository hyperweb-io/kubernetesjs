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
  Terminal,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { type Pod as K8sPod } from 'kubernetesjs'
import { usePods, useDeletePod, usePodLogs } from '@/hooks'

import { confirmDialog } from '@/hooks/useConfirm'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'

interface Pod {
  name: string
  namespace: string
  status: 'Running' | 'Pending' | 'Failed' | 'Succeeded' | 'Unknown'
  ready: string
  restarts: number
  age: string
  nodeName: string
  k8sData?: K8sPod
}

export function PodsView() {
  const [selectedPod, setSelectedPod] = useState<Pod | null>(null)
  
  // Use TanStack Query hooks
  const { namespace } = usePreferredNamespace()
  const { data, isLoading, error, refetch } = usePods()
  const deletePodMutation = useDeletePod()
  
  // Helper function to determine pod status
  function determinePodStatus(pod: K8sPod): Pod['status'] {
    const phase = pod.status?.phase
    if (phase === 'Running') return 'Running'
    if (phase === 'Pending') return 'Pending'
    if (phase === 'Failed') return 'Failed'
    if (phase === 'Succeeded') return 'Succeeded'
    return 'Unknown'
  }
  
  // Format pods from query data
  const pods: Pod[] = data?.items?.map(item => {
    const containerStatuses = item.status?.containerStatuses || []
    const readyContainers = containerStatuses.filter(cs => cs.ready).length
    const totalContainers = containerStatuses.length
    const totalRestarts = containerStatuses.reduce((sum, cs) => sum + (cs.restartCount || 0), 0)
    
    return {
      name: item.metadata!.name!,
      namespace: item.metadata!.namespace!,
      status: determinePodStatus(item),
      ready: `${readyContainers}/${totalContainers}`,
      restarts: totalRestarts,
      age: getAge(item.metadata!.creationTimestamp!),
      nodeName: item.spec?.nodeName || 'unassigned',
      k8sData: item
    }
  }) || []

  const handleRefresh = () => {
    refetch()
  }

  const handleDelete = async (pod: Pod) => {
    const confirmed = await confirmDialog({
      title: 'Delete Pod',
      description: `Are you sure you want to delete pod ${pod.name}?`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deletePodMutation.mutateAsync({
          name: pod.name,
          namespace: pod.namespace
        })
      } catch (err) {
        console.error('Failed to delete pod:', err)
        alert(`Failed to delete pod: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const handleViewLogs = (pod: Pod) => {
    // This would open a logs viewer - for now just alert
    alert(`View logs functionality for ${pod.name} coming soon!\n\nUse kubectl for now:\nkubectl logs ${pod.name} -n ${pod.namespace}`)
  }

  const getStatusBadge = (status: Pod['status']) => {
    switch (status) {
      case 'Running':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'Pending':
        return <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {status}
        </Badge>
      case 'Failed':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'Succeeded':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  function getAge(timestamp: string): string {
    const created = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - created.getTime()
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d${hours}h`
    if (hours > 0) return `${hours}h${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pods</h2>
          <p className="text-muted-foreground">
            Manage your Kubernetes pods
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
          <Button onClick={() => alert('Create Pod functionality not yet implemented.\n\nPods are typically created by Deployments, ReplicaSets, or Jobs.')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Pod
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pods.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Running
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pods.filter(p => p.status === 'Running').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pods.filter(p => p.status === 'Pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pods.filter(p => p.status === 'Failed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pods Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Pods</CardTitle>
          <CardDescription>
            A list of all pods in your cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch pods'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : pods.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No pods found {namespace === '_all' ? 'in any namespace' : `in the ${namespace} namespace`}</p>
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
                  <TableHead>Ready</TableHead>
                  <TableHead>Restarts</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Node</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pods.map((pod) => (
                  <TableRow key={`${pod.namespace}/${pod.name}`}>
                    <TableCell className="font-medium">{pod.name}</TableCell>
                    <TableCell>{pod.namespace}</TableCell>
                    <TableCell>{getStatusBadge(pod.status)}</TableCell>
                    <TableCell>{pod.ready}</TableCell>
                    <TableCell>{pod.restarts}</TableCell>
                    <TableCell>{pod.age}</TableCell>
                    <TableCell className="font-mono text-sm">{pod.nodeName}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedPod(pod)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewLogs(pod)}
                          title="View logs"
                        >
                          <Terminal className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(pod)}
                          title="Delete pod"
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

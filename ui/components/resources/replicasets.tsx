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
  CheckCircle,
  Copy
} from 'lucide-react'
import { type ReplicaSet as K8sReplicaSet } from 'kubernetesjs'
import { useReplicaSets, useDeleteReplicaSet, useScaleReplicaSet } from '@/hooks/useReplicaSets'

interface ReplicaSet {
  name: string
  namespace: string
  replicas: number
  availableReplicas: number
  readyReplicas: number
  image: string
  createdAt: string
  status: 'Ready' | 'Scaling' | 'NotReady'
  deployment?: string
  k8sData?: K8sReplicaSet
}

export function ReplicaSetsView() {
  const [selectedReplicaSet, setSelectedReplicaSet] = useState<ReplicaSet | null>(null)
  
  // Use TanStack Query hooks
  const { data, isLoading, error, refetch } = useReplicaSets()
  const deleteReplicaSetMutation = useDeleteReplicaSet()
  const scaleReplicaSetMutation = useScaleReplicaSet()
  
  // Helper function to determine replica set status
  function determineReplicaSetStatus(rs: K8sReplicaSet): ReplicaSet['status'] {
    const status = rs.status
    if (!status) return 'NotReady'
    
    const replicas = rs.spec?.replicas || 0
    const readyReplicas = status.readyReplicas || 0
    
    if (readyReplicas === replicas && replicas > 0) {
      return 'Ready'
    } else if (readyReplicas !== replicas) {
      return 'Scaling'
    } else {
      return 'NotReady'
    }
  }
  
  // Helper to extract deployment name from owner references
  function getDeploymentName(rs: K8sReplicaSet): string | undefined {
    const ownerRefs = rs.metadata?.ownerReferences || []
    const deploymentRef = ownerRefs.find(ref => ref.kind === 'Deployment')
    return deploymentRef?.name
  }
  
  // Format replica sets from query data
  const replicaSets: ReplicaSet[] = data?.items?.map(item => {
    return {
      name: item.metadata!.name!,
      namespace: item.metadata!.namespace!,
      replicas: item.spec?.replicas || 0,
      availableReplicas: item.status?.availableReplicas || 0,
      readyReplicas: item.status?.readyReplicas || 0,
      image: item.spec?.template?.spec?.containers[0]?.image || 'unknown',
      createdAt: item.metadata!.creationTimestamp!,
      status: determineReplicaSetStatus(item),
      deployment: getDeploymentName(item),
      k8sData: item
    }
  }) || []

  const handleRefresh = () => {
    refetch()
  }

  const handleScale = async (replicaSet: ReplicaSet) => {
    const newReplicas = prompt(`Scale ${replicaSet.name} to how many replicas?`, replicaSet.replicas.toString())
    if (newReplicas && !isNaN(Number(newReplicas))) {
      try {
        await scaleReplicaSetMutation.mutateAsync({
          name: replicaSet.name,
          replicas: Number(newReplicas),
          namespace: replicaSet.namespace
        })
      } catch (err) {
        console.error('Failed to scale replicaset:', err)
        alert(`Failed to scale replicaset: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const handleDelete = async (replicaSet: ReplicaSet) => {
    if (confirm(`Are you sure you want to delete ${replicaSet.name}?`)) {
      try {
        await deleteReplicaSetMutation.mutateAsync({
          name: replicaSet.name,
          namespace: replicaSet.namespace
        })
      } catch (err) {
        console.error('Failed to delete replicaset:', err)
        alert(`Failed to delete replicaset: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getStatusBadge = (status: ReplicaSet['status']) => {
    switch (status) {
      case 'Ready':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'Scaling':
        return <Badge variant="warning" className="flex items-center gap-1">
          <Scale className="w-3 h-3" />
          {status}
        </Badge>
      case 'NotReady':
        return <Badge variant="destructive" className="flex items-center gap-1">
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
          <h2 className="text-3xl font-bold tracking-tight">ReplicaSets</h2>
          <p className="text-muted-foreground">
            Manage your Kubernetes ReplicaSets
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
          <Button onClick={() => alert('Create ReplicaSet functionality not yet implemented.\n\nReplicaSets are typically created by Deployments.')}>
            <Plus className="h-4 w-4 mr-2" />
            Create ReplicaSet
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total ReplicaSets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{replicaSets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {replicaSets.filter(rs => rs.status === 'Ready').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Replicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {replicaSets.reduce((sum, rs) => sum + rs.replicas, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ReplicaSets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All ReplicaSets</CardTitle>
          <CardDescription>
            A list of all ReplicaSets in your cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch replicasets'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : replicaSets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No replicasets found in the default namespace</p>
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
                  <TableHead>Ready</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Deployment</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {replicaSets.map((replicaSet) => (
                  <TableRow key={`${replicaSet.namespace}/${replicaSet.name}`}>
                    <TableCell className="font-medium">{replicaSet.name}</TableCell>
                    <TableCell>{replicaSet.namespace}</TableCell>
                    <TableCell>{getStatusBadge(replicaSet.status)}</TableCell>
                    <TableCell>{replicaSet.replicas}</TableCell>
                    <TableCell>{replicaSet.readyReplicas}</TableCell>
                    <TableCell>{replicaSet.availableReplicas}</TableCell>
                    <TableCell>
                      {replicaSet.deployment ? (
                        <Badge variant="outline" className="font-mono">
                          {replicaSet.deployment}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm max-w-[200px] truncate">{replicaSet.image}</TableCell>
                    <TableCell>{new Date(replicaSet.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedReplicaSet(replicaSet)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleScale(replicaSet)}
                          title="Scale replicaset"
                        >
                          <Scale className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(replicaSet)}
                          title="Delete replicaset"
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

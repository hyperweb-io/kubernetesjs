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
  Server
} from 'lucide-react'
import { type DaemonSet as K8sDaemonSet } from 'kubernetesjs'
import { useDaemonSets, useDeleteDaemonSet } from '@/hooks/useDaemonSets'

import { confirmDialog } from '@/hooks/useConfirm'

interface DaemonSet {
  name: string
  namespace: string
  desiredNumberScheduled: number
  currentNumberScheduled: number
  numberReady: number
  numberAvailable: number
  image: string
  createdAt: string
  status: 'Ready' | 'NotReady' | 'Updating'
  k8sData?: K8sDaemonSet
}

export function DaemonSetsView() {
  const [selectedDaemonSet, setSelectedDaemonSet] = useState<DaemonSet | null>(null)
  
  // Use TanStack Query hooks
  const { data, isLoading, error, refetch } = useDaemonSets()
  const deleteDaemonSetMutation = useDeleteDaemonSet()
  
  // Helper function to determine daemon set status
  function determineDaemonSetStatus(ds: K8sDaemonSet): DaemonSet['status'] {
    const status = ds.status
    if (!status) return 'NotReady'
    
    if (status.desiredNumberScheduled === status.numberReady) {
      return 'Ready'
    } else if (status.updatedNumberScheduled && status.updatedNumberScheduled > 0) {
      return 'Updating'
    } else {
      return 'NotReady'
    }
  }
  
  // Format daemon sets from query data
  const daemonSets: DaemonSet[] = data?.items?.map(item => {
    return {
      name: item.metadata!.name!,
      namespace: item.metadata!.namespace!,
      desiredNumberScheduled: item.status?.desiredNumberScheduled || 0,
      currentNumberScheduled: item.status?.currentNumberScheduled || 0,
      numberReady: item.status?.numberReady || 0,
      numberAvailable: item.status?.numberAvailable || 0,
      image: item.spec?.template?.spec?.containers[0]?.image || 'unknown',
      createdAt: item.metadata!.creationTimestamp!,
      status: determineDaemonSetStatus(item),
      k8sData: item
    }
  }) || []

  const handleRefresh = () => {
    refetch()
  }

  const handleDelete = async (daemonSet: DaemonSet) => {
    const confirmed = await confirmDialog({
      title: 'Delete DaemonSet',
      description: `Are you sure you want to delete ${daemonSet.name}?`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deleteDaemonSetMutation.mutateAsync({
          name: daemonSet.name,
          namespace: daemonSet.namespace
        })
      } catch (err) {
        console.error('Failed to delete daemonset:', err)
        alert(`Failed to delete daemonset: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getStatusBadge = (status: DaemonSet['status']) => {
    switch (status) {
      case 'Ready':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'Updating':
        return <Badge variant="warning" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
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
          <h2 className="text-3xl font-bold tracking-tight">DaemonSets</h2>
          <p className="text-muted-foreground">
            Manage your Kubernetes DaemonSets
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
          <Button onClick={() => alert('Create DaemonSet functionality not yet implemented.\n\nTo create a daemonset, use kubectl:\nkubectl create -f daemonset.yaml')}>
            <Plus className="h-4 w-4 mr-2" />
            Create DaemonSet
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total DaemonSets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daemonSets.length}</div>
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
              {daemonSets.filter(ds => ds.status === 'Ready').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daemonSets.reduce((sum, ds) => sum + ds.currentNumberScheduled, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DaemonSets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All DaemonSets</CardTitle>
          <CardDescription>
            A list of all DaemonSets in your cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch daemonsets'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : daemonSets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No daemonsets found in the default namespace</p>
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
                  <TableHead>Desired</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Ready</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daemonSets.map((daemonSet) => (
                  <TableRow key={`${daemonSet.namespace}/${daemonSet.name}`}>
                    <TableCell className="font-medium">{daemonSet.name}</TableCell>
                    <TableCell>{daemonSet.namespace}</TableCell>
                    <TableCell>{getStatusBadge(daemonSet.status)}</TableCell>
                    <TableCell>{daemonSet.desiredNumberScheduled}</TableCell>
                    <TableCell>{daemonSet.currentNumberScheduled}</TableCell>
                    <TableCell>{daemonSet.numberReady}</TableCell>
                    <TableCell>{daemonSet.numberAvailable}</TableCell>
                    <TableCell className="font-mono text-sm max-w-[200px] truncate">{daemonSet.image}</TableCell>
                    <TableCell>{new Date(daemonSet.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedDaemonSet(daemonSet)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(daemonSet)}
                          title="Delete daemonset"
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

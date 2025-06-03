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
  HardDrive,
  Database
} from 'lucide-react'
import { 
  useListCoreV1NamespacedPersistentVolumeClaimQuery,
  useListCoreV1PersistentVolumeClaimForAllNamespacesQuery,
  useDeleteCoreV1NamespacedPersistentVolumeClaim
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { PersistentVolumeClaim } from 'kubernetesjs'

export function PVCsView() {
  const [selectedPVC, setSelectedPVC] = useState<PersistentVolumeClaim | null>(null)
  const { namespace } = usePreferredNamespace()
  
  const query = namespace === '_all' 
    ? useListCoreV1PersistentVolumeClaimForAllNamespacesQuery({ path: {}, query: {} })
    : useListCoreV1NamespacedPersistentVolumeClaimQuery({ path: { namespace }, query: {} })
    
  const { data, isLoading, error, refetch } = query
  const deletePVC = useDeleteCoreV1NamespacedPersistentVolumeClaim()

  const pvcs = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (pvc: PersistentVolumeClaim) => {
    const name = pvc.metadata!.name!
    const namespace = pvc.metadata!.namespace!
    
    if (confirm(`Are you sure you want to delete ${name}? This may cause data loss.`)) {
      try {
        await deletePVC.mutateAsync({
          path: { namespace, name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete PVC:', err)
        alert(`Failed to delete PVC: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getPhase = (pvc: PersistentVolumeClaim): string => {
    return pvc.status?.phase || 'Unknown'
  }

  const getStatusBadge = (phase: string) => {
    switch (phase) {
      case 'Bound':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {phase}
        </Badge>
      case 'Pending':
        return <Badge variant="warning" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {phase}
        </Badge>
      case 'Lost':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {phase}
        </Badge>
      default:
        return <Badge variant="secondary">{phase}</Badge>
    }
  }

  const getAccessModes = (pvc: PersistentVolumeClaim): string => {
    const modes = pvc.spec?.accessModes || []
    const modeMap: Record<string, string> = {
      'ReadWriteOnce': 'RWO',
      'ReadOnlyMany': 'ROX',
      'ReadWriteMany': 'RWX',
      'ReadWriteOncePod': 'RWOP'
    }
    return modes.map(m => modeMap[m] || m).join(', ') || 'None'
  }

  const getStorageSize = (pvc: PersistentVolumeClaim): string => {
    const storage = pvc.spec?.resources?.requests?.storage
    const capacity = pvc.status?.capacity?.storage
    return capacity || storage || 'Unknown'
  }

  const getStorageClass = (pvc: PersistentVolumeClaim): string => {
    return pvc.spec?.storageClassName || 'default'
  }

  const getVolumeName = (pvc: PersistentVolumeClaim): string => {
    return pvc.spec?.volumeName || 'Not bound'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Persistent Volume Claims</h2>
          <p className="text-muted-foreground">
            Storage requests by pods
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
          <Button onClick={() => alert('Create PVC functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create PVC
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PVCs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pvcs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bound</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pvcs.filter(pvc => getPhase(pvc) === 'Bound').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pvcs.filter(pvc => getPhase(pvc) === 'Pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pvcs.reduce((sum, pvc) => {
                const size = getStorageSize(pvc)
                const match = size.match(/(\d+)([GMK]i)?/)
                if (match) {
                  const value = parseInt(match[1])
                  const unit = match[2] || 'Gi'
                  if (unit === 'Gi') return sum + value
                  if (unit === 'Mi') return sum + value / 1024
                  if (unit === 'Ki') return sum + value / (1024 * 1024)
                }
                return sum
              }, 0).toFixed(1)} GB
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Persistent Volume Claims</CardTitle>
          <CardDescription>
            Storage volumes requested by applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch PVCs'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : pvcs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No persistent volume claims found</p>
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
                  <TableHead>Storage Class</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Access Modes</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pvcs.map((pvc) => (
                  <TableRow key={`${pvc.metadata?.namespace}/${pvc.metadata?.name}`}>
                    <TableCell className="font-medium">{pvc.metadata?.name}</TableCell>
                    <TableCell>{pvc.metadata?.namespace}</TableCell>
                    <TableCell>{getStatusBadge(getPhase(pvc))}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <Database className="w-3 h-3" />
                        {getStorageClass(pvc)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {getStorageSize(pvc)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getAccessModes(pvc)}</Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {getVolumeName(pvc)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedPVC(pvc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(pvc)}
                          disabled={getPhase(pvc) === 'Bound'}
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

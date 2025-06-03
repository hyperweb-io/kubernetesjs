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
  Link,
  Link2Off
} from 'lucide-react'
import { 
  useListCoreV1PersistentVolumeQuery,
  useDeleteCoreV1PersistentVolume
} from '@/k8s'
import type { PersistentVolume } from 'kubernetesjs'

export function PVsView() {
  const [selectedPV, setSelectedPV] = useState<PersistentVolume | null>(null)
  
  const { data, isLoading, error, refetch } = useListCoreV1PersistentVolumeQuery({ path: {}, query: {} })
  const deletePV = useDeleteCoreV1PersistentVolume()

  const pvs = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (pv: PersistentVolume) => {
    const name = pv.metadata!.name!
    
    if (confirm(`Are you sure you want to delete ${name}? This may cause data loss.`)) {
      try {
        await deletePV.mutateAsync({
          path: { name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete PV:', err)
        alert(`Failed to delete PV: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getPhase = (pv: PersistentVolume): string => {
    return pv.status?.phase || 'Unknown'
  }

  const getStatusBadge = (phase: string) => {
    switch (phase) {
      case 'Available':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {phase}
        </Badge>
      case 'Bound':
        return <Badge variant="default" className="flex items-center gap-1">
          <Link className="w-3 h-3" />
          {phase}
        </Badge>
      case 'Released':
        return <Badge variant="warning" className="flex items-center gap-1">
          <Link2Off className="w-3 h-3" />
          {phase}
        </Badge>
      case 'Failed':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {phase}
        </Badge>
      default:
        return <Badge variant="secondary">{phase}</Badge>
    }
  }

  const getAccessModes = (pv: PersistentVolume): string => {
    const modes = pv.spec?.accessModes || []
    const modeMap: Record<string, string> = {
      'ReadWriteOnce': 'RWO',
      'ReadOnlyMany': 'ROX',
      'ReadWriteMany': 'RWX',
      'ReadWriteOncePod': 'RWOP'
    }
    return modes.map(m => modeMap[m] || m).join(', ') || 'None'
  }

  const getCapacity = (pv: PersistentVolume): string => {
    return pv.spec?.capacity?.storage || 'Unknown'
  }

  const getStorageClass = (pv: PersistentVolume): string => {
    return pv.spec?.storageClassName || 'None'
  }

  const getReclaimPolicy = (pv: PersistentVolume): string => {
    return pv.spec?.persistentVolumeReclaimPolicy || 'Retain'
  }

  const getClaimRef = (pv: PersistentVolume): string => {
    const ref = pv.spec?.claimRef
    if (!ref) return 'Unbound'
    return `${ref.namespace}/${ref.name}`
  }

  const getVolumeMode = (pv: PersistentVolume): string => {
    return pv.spec?.volumeMode || 'Filesystem'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Persistent Volumes</h2>
          <p className="text-muted-foreground">
            Cluster-wide storage resources
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
          <Button onClick={() => alert('Create PV functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create PV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PVs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pvs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pvs.filter(pv => getPhase(pv) === 'Available').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bound</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {pvs.filter(pv => getPhase(pv) === 'Bound').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pvs.reduce((sum, pv) => {
                const size = getCapacity(pv)
                const match = size.match(/(\d+)([GMK]i)?/)
                if (match) {
                  const value = parseInt(match[1])
                  const unit = match[2] || 'Gi'
                  if (unit === 'Gi') return sum + value
                  if (unit === 'Mi') return sum + value / 1024
                  if (unit === 'Ki') return sum + value / (1024 * 1024)
                  if (unit === 'Ti') return sum + value * 1024
                }
                return sum
              }, 0).toFixed(1)} GB
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Persistent Volumes</CardTitle>
          <CardDescription>
            Physical storage volumes available in the cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch PVs'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : pvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No persistent volumes found</p>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Claim</TableHead>
                  <TableHead>Storage Class</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Access Modes</TableHead>
                  <TableHead>Reclaim Policy</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pvs.map((pv) => (
                  <TableRow key={pv.metadata?.name}>
                    <TableCell className="font-medium">{pv.metadata?.name}</TableCell>
                    <TableCell>{getStatusBadge(getPhase(pv))}</TableCell>
                    <TableCell className="text-sm">
                      {getClaimRef(pv) !== 'Unbound' ? (
                        <span className="font-mono">{getClaimRef(pv)}</span>
                      ) : (
                        <Badge variant="secondary">Unbound</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStorageClass(pv) !== 'None' ? (
                        <Badge variant="outline">{getStorageClass(pv)}</Badge>
                      ) : (
                        <Badge variant="secondary">None</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {getCapacity(pv)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getAccessModes(pv)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getReclaimPolicy(pv) === 'Delete' ? 'destructive' : 'default'}>
                        {getReclaimPolicy(pv)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getVolumeMode(pv)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedPV(pv)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(pv)}
                          disabled={getPhase(pv) === 'Bound'}
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

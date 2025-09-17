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
  Database,
  Zap,
  Archive
} from 'lucide-react'
import { 
  useListStorageV1StorageClassQuery,
  useDeleteStorageV1StorageClass
} from '@/k8s'
import type { StorageClass } from 'kubernetesjs'

import { confirmDialog } from '@/hooks/useConfirm'

export function StorageClassesView() {
  const [selectedClass, setSelectedClass] = useState<StorageClass | null>(null)
  
  const { data, isLoading, error, refetch } = useListStorageV1StorageClassQuery({ path: {}, query: {} })
  const deleteClass = useDeleteStorageV1StorageClass()

  const storageClasses = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (sc: StorageClass) => {
    const name = sc.metadata!.name!
    
    const confirmed = await confirmDialog({
      title: 'Delete Storage Class',
      description: `Are you sure you want to delete ${name}? PVs using this class won't be affected.`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deleteClass.mutateAsync({
          path: { name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete storage class:', err)
        alert(`Failed to delete storage class: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getProvisioner = (sc: StorageClass): string => {
    return sc.provisioner || 'Unknown'
  }

  const getReclaimPolicy = (sc: StorageClass): string => {
    return sc.reclaimPolicy || 'Delete'
  }

  const getVolumeBindingMode = (sc: StorageClass): string => {
    return sc.volumeBindingMode || 'Immediate'
  }

  const isDefaultClass = (sc: StorageClass): boolean => {
    const annotations = sc.metadata?.annotations || {}
    return annotations['storageclass.kubernetes.io/is-default-class'] === 'true' ||
           annotations['storageclass.beta.kubernetes.io/is-default-class'] === 'true'
  }

  const getAllowVolumeExpansion = (sc: StorageClass): boolean => {
    return sc.allowVolumeExpansion === true
  }

  const getProvisionerBadge = (provisioner: string) => {
    // Common provisioners
    if (provisioner.includes('aws-ebs')) {
      return <Badge variant="default" className="flex items-center gap-1">
        <Database className="w-3 h-3" />
        AWS EBS
      </Badge>
    } else if (provisioner.includes('azure-disk')) {
      return <Badge variant="default" className="flex items-center gap-1">
        <Database className="w-3 h-3" />
        Azure Disk
      </Badge>
    } else if (provisioner.includes('gce-pd')) {
      return <Badge variant="default" className="flex items-center gap-1">
        <Database className="w-3 h-3" />
        GCE PD
      </Badge>
    } else if (provisioner.includes('nfs')) {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <Archive className="w-3 h-3" />
        NFS
      </Badge>
    } else if (provisioner.includes('local')) {
      return <Badge variant="outline" className="flex items-center gap-1">
        <HardDrive className="w-3 h-3" />
        Local
      </Badge>
    }
    return <Badge variant="secondary">{provisioner}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Storage Classes</h2>
          <p className="text-muted-foreground">
            Dynamic storage provisioning configurations
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
          <Button onClick={() => alert('Create Storage Class functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Storage Class
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageClasses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Default Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {storageClasses.find(isDefaultClass)?.metadata?.name || 'None'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expandable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storageClasses.filter(getAllowVolumeExpansion).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provisioners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(storageClasses.map(getProvisioner)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Storage Classes</CardTitle>
          <CardDescription>
            Define different types of storage and their provisioners
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch storage classes'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : storageClasses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No storage classes found</p>
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
                  <TableHead>Provisioner</TableHead>
                  <TableHead>Reclaim Policy</TableHead>
                  <TableHead>Binding Mode</TableHead>
                  <TableHead>Volume Expansion</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storageClasses.map((sc) => (
                  <TableRow key={sc.metadata?.name}>
                    <TableCell className="font-medium">{sc.metadata?.name}</TableCell>
                    <TableCell>{getProvisionerBadge(getProvisioner(sc))}</TableCell>
                    <TableCell>
                      <Badge variant={getReclaimPolicy(sc) === 'Delete' ? 'destructive' : 'default'}>
                        {getReclaimPolicy(sc)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getVolumeBindingMode(sc) === 'WaitForFirstConsumer' && <Zap className="w-3 h-3" />}
                        {getVolumeBindingMode(sc)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getAllowVolumeExpansion(sc) ? (
                        <Badge variant="success">Allowed</Badge>
                      ) : (
                        <Badge variant="secondary">Not Allowed</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {isDefaultClass(sc) ? (
                        <Badge variant="success">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedClass(sc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(sc)}
                          disabled={isDefaultClass(sc)}
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

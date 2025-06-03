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
  Link,
  Link2Off,
  Server
} from 'lucide-react'
import { 
  useListStorageV1VolumeAttachmentQuery,
  useDeleteStorageV1VolumeAttachment
} from '@/k8s'
import type { VolumeAttachment } from 'kubernetesjs'

export function VolumeAttachmentsView() {
  const [selectedAttachment, setSelectedAttachment] = useState<VolumeAttachment | null>(null)
  
  const { data, isLoading, error, refetch } = useListStorageV1VolumeAttachmentQuery({ path: {}, query: {} })
  const deleteAttachment = useDeleteStorageV1VolumeAttachment()

  const attachments = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (va: VolumeAttachment) => {
    const name = va.metadata!.name!
    
    if (confirm(`Are you sure you want to delete ${name}? This may disrupt attached volumes.`)) {
      try {
        await deleteAttachment.mutateAsync({
          path: { name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete volume attachment:', err)
        alert(`Failed to delete volume attachment: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getAttachmentStatus = (va: VolumeAttachment): string => {
    return va.status?.attached ? 'Attached' : 'Detached'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Attached':
        return <Badge variant="success" className="flex items-center gap-1">
          <Link className="w-3 h-3" />
          {status}
        </Badge>
      case 'Detached':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Link2Off className="w-3 h-3" />
          {status}
        </Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getAttacher = (va: VolumeAttachment): string => {
    return va.spec?.attacher || 'Unknown'
  }

  const getNodeName = (va: VolumeAttachment): string => {
    return va.spec?.nodeName || 'Unknown'
  }

  const getPVName = (va: VolumeAttachment): string => {
    return va.spec?.source?.persistentVolumeName || 'Unknown'
  }

  const getAttachError = (va: VolumeAttachment): string | null => {
    const error = va.status?.attachError
    if (!error) return null
    return error.message || 'Unknown error'
  }

  const getDetachError = (va: VolumeAttachment): string | null => {
    const error = va.status?.detachError
    if (!error) return null
    return error.message || 'Unknown error'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Volume Attachments</h2>
          <p className="text-muted-foreground">
            Volume attachments to nodes
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
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attachments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attached</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {attachments.filter(va => va.status?.attached).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {attachments.filter(va => getAttachError(va) || getDetachError(va)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(attachments.map(getNodeName)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Volume Attachments</CardTitle>
          <CardDescription>
            Connections between persistent volumes and nodes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch volume attachments'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : attachments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No volume attachments found</p>
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
                  <TableHead>Node</TableHead>
                  <TableHead>PV Name</TableHead>
                  <TableHead>Attacher</TableHead>
                  <TableHead>Errors</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attachments.map((va) => {
                  const attachError = getAttachError(va)
                  const detachError = getDetachError(va)
                  const hasError = attachError || detachError
                  
                  return (
                    <TableRow key={va.metadata?.name}>
                      <TableCell className="font-medium">{va.metadata?.name}</TableCell>
                      <TableCell>{getStatusBadge(getAttachmentStatus(va))}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <Server className="w-3 h-3" />
                          <span className="font-mono text-sm">{getNodeName(va)}</span>
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{getPVName(va)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getAttacher(va)}</Badge>
                      </TableCell>
                      <TableCell>
                        {hasError ? (
                          <Badge variant="destructive" className="text-xs">
                            {attachError ? 'Attach Error' : 'Detach Error'}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">None</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {va.metadata?.creationTimestamp 
                          ? new Date(va.metadata.creationTimestamp).toLocaleDateString()
                          : 'Unknown'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedAttachment(va)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(va)}
                            disabled={va.status?.attached}
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

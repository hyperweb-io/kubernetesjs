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
  Network,
  Slice
} from 'lucide-react'
import { 
  useListDiscoveryV1NamespacedEndpointSliceQuery,
  useListDiscoveryV1EndpointSliceForAllNamespacesQuery,
  useDeleteDiscoveryV1NamespacedEndpointSlice
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { EndpointSlice } from 'kubernetesjs'

import { confirmDialog } from '@/hooks/useConfirm'

export function EndpointSlicesView() {
  const [selectedSlice, setSelectedSlice] = useState<EndpointSlice | null>(null)
  const { namespace } = usePreferredNamespace()
  
  const query = namespace === '_all' 
    ? useListDiscoveryV1EndpointSliceForAllNamespacesQuery({ path: {}, query: {} })
    : useListDiscoveryV1NamespacedEndpointSliceQuery({ path: { namespace }, query: {} })
    
  const { data, isLoading, error, refetch } = query
  const deleteSlice = useDeleteDiscoveryV1NamespacedEndpointSlice()

  const slices = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (slice: EndpointSlice) => {
    const name = slice.metadata!.name!
    const namespace = slice.metadata!.namespace!
    
    const confirmed = await confirmDialog({
      title: 'Delete Endpoint Slice',
      description: `Are you sure you want to delete ${name}?`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deleteSlice.mutateAsync({
          path: { namespace, name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete endpoint slice:', err)
        alert(`Failed to delete endpoint slice: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getEndpointCount = (slice: EndpointSlice): number => {
    return slice.endpoints?.length || 0
  }

  const getReadyEndpoints = (slice: EndpointSlice): number => {
    const endpoints = slice.endpoints || []
    return endpoints.filter(ep => ep.conditions?.ready === true).length
  }

  const getServiceName = (slice: EndpointSlice): string => {
    return slice.metadata?.labels?.['kubernetes.io/service-name'] || 'Unknown'
  }

  const getAddressType = (slice: EndpointSlice): string => {
    return slice.addressType || 'Unknown'
  }

  const getPorts = (slice: EndpointSlice): string => {
    const ports = slice.ports || []
    if (ports.length === 0) return 'None'
    return ports.map(p => `${p.name || 'unnamed'}:${p.port}/${p.protocol || 'TCP'}`).join(', ')
  }

  const getStatus = (slice: EndpointSlice) => {
    const total = getEndpointCount(slice)
    const ready = getReadyEndpoints(slice)
    
    if (total === 0) return 'Empty'
    if (ready === total) return 'All Ready'
    if (ready === 0) return 'None Ready'
    return 'Partial Ready'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'All Ready':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'Partial Ready':
        return <Badge variant="warning" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'None Ready':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {status}
        </Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Endpoint Slices</h2>
          <p className="text-muted-foreground">
            Scalable network endpoint groupings
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
            <CardTitle className="text-sm font-medium">Total Slices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{slices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {slices.reduce((sum, s) => sum + getEndpointCount(s), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {slices.reduce((sum, s) => sum + getReadyEndpoints(s), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(slices.map(s => getServiceName(s))).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Endpoint Slices</CardTitle>
          <CardDescription>
            Scalable collections of network endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch endpoint slices'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : slices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No endpoint slices found</p>
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
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Endpoints</TableHead>
                  <TableHead>Address Type</TableHead>
                  <TableHead>Ports</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slices.map((slice) => (
                  <TableRow key={`${slice.metadata?.namespace}/${slice.metadata?.name}`}>
                    <TableCell className="font-medium">{slice.metadata?.name}</TableCell>
                    <TableCell>{slice.metadata?.namespace}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <Network className="w-3 h-3" />
                        {getServiceName(slice)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(getStatus(slice))}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <Slice className="w-3 h-3" />
                        {getReadyEndpoints(slice)}/{getEndpointCount(slice)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getAddressType(slice)}</Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono">{getPorts(slice)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedSlice(slice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(slice)}
                          disabled={slice.metadata?.name?.includes('kubernetes')}
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

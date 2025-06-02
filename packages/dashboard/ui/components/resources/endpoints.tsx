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
  Server
} from 'lucide-react'
import { 
  useListCoreV1NamespacedEndpointsQuery,
  useListCoreV1EndpointsForAllNamespacesQuery,
  useDeleteCoreV1NamespacedEndpoints
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { Endpoints } from 'kubernetesjs'

export function EndpointsView() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoints | null>(null)
  const { namespace } = usePreferredNamespace()
  
  const query = namespace === '_all' 
    ? useListCoreV1EndpointsForAllNamespacesQuery({ path: {}, query: {} })
    : useListCoreV1NamespacedEndpointsQuery({ path: { namespace }, query: {} })
    
  const { data, isLoading, error, refetch } = query
  const deleteEndpoint = useDeleteCoreV1NamespacedEndpoints()

  const endpoints = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (endpoint: Endpoints) => {
    const name = endpoint.metadata!.name!
    const namespace = endpoint.metadata!.namespace!
    
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteEndpoint.mutateAsync({
          path: { namespace, name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete endpoint:', err)
        alert(`Failed to delete endpoint: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getAddressCount = (endpoint: Endpoints): number => {
    const subsets = endpoint.subsets || []
    return subsets.reduce((sum, subset) => {
      const addresses = subset.addresses || []
      return sum + addresses.length
    }, 0)
  }

  const getPortCount = (endpoint: Endpoints): number => {
    const subsets = endpoint.subsets || []
    const uniquePorts = new Set<string>()
    subsets.forEach(subset => {
      const ports = subset.ports || []
      ports.forEach(port => {
        uniquePorts.add(`${port.name || 'unnamed'}:${port.port}/${port.protocol || 'TCP'}`)
      })
    })
    return uniquePorts.size
  }

  const getStatus = (endpoint: Endpoints) => {
    const addressCount = getAddressCount(endpoint)
    if (addressCount === 0) {
      return 'No Endpoints'
    }
    return 'Ready'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ready':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'No Endpoints':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {status}
        </Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getEndpointAddresses = (endpoint: Endpoints): string => {
    const subsets = endpoint.subsets || []
    const addresses: string[] = []
    
    subsets.forEach(subset => {
      const addrs = subset.addresses || []
      addrs.forEach(addr => {
        addresses.push(addr.ip)
      })
    })
    
    if (addresses.length === 0) return 'None'
    if (addresses.length <= 3) return addresses.join(', ')
    return `${addresses.slice(0, 3).join(', ')} +${addresses.length - 3} more`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Endpoints</h2>
          <p className="text-muted-foreground">
            Network endpoints for services
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
            <CardTitle className="text-sm font-medium">Total Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{endpoints.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {endpoints.filter(e => getAddressCount(e) > 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {endpoints.reduce((sum, e) => sum + getAddressCount(e), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empty Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {endpoints.filter(e => getAddressCount(e) === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Endpoints</CardTitle>
          <CardDescription>
            IP addresses and ports that services route traffic to
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch endpoints'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : endpoints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No endpoints found</p>
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
                  <TableHead>Addresses</TableHead>
                  <TableHead>Ports</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpoints.map((endpoint) => (
                  <TableRow key={`${endpoint.metadata?.namespace}/${endpoint.metadata?.name}`}>
                    <TableCell className="font-medium">{endpoint.metadata?.name}</TableCell>
                    <TableCell>{endpoint.metadata?.namespace}</TableCell>
                    <TableCell>{getStatusBadge(getStatus(endpoint))}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Network className="w-3 h-3" />
                        <span className="text-sm font-mono">{getEndpointAddresses(endpoint)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getPortCount(endpoint)} port(s)</Badge>
                    </TableCell>
                    <TableCell>
                      {endpoint.metadata?.creationTimestamp 
                        ? new Date(endpoint.metadata.creationTimestamp).toLocaleDateString()
                        : 'Unknown'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedEndpoint(endpoint)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(endpoint)}
                          disabled={endpoint.metadata?.name === 'kubernetes'}
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

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
  Globe,
  Lock,
  Link
} from 'lucide-react'
import { 
  useListNetworkingV1NamespacedIngressQuery,
  useListNetworkingV1IngressForAllNamespacesQuery,
  useDeleteNetworkingV1NamespacedIngress
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { Ingress } from 'kubernetesjs'

import { confirmDialog } from '@/hooks/useConfirm'

export function IngressesView() {
  const [selectedIngress, setSelectedIngress] = useState<Ingress | null>(null)
  const { namespace } = usePreferredNamespace()
  
  const query = namespace === '_all' 
    ? useListNetworkingV1IngressForAllNamespacesQuery({ path: {}, query: {} })
    : useListNetworkingV1NamespacedIngressQuery({ path: { namespace }, query: {} })
    
  const { data, isLoading, error, refetch } = query
  const deleteIngress = useDeleteNetworkingV1NamespacedIngress()

  const ingresses = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (ingress: Ingress) => {
    const name = ingress.metadata!.name!
    const namespace = ingress.metadata!.namespace!
    
    const confirmed = await confirmDialog({
      title: 'Delete Ingress',
      description: `Are you sure you want to delete ${name}?`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deleteIngress.mutateAsync({
          path: { namespace, name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete ingress:', err)
        alert(`Failed to delete ingress: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getHosts = (ingress: Ingress): string[] => {
    const rules = ingress.spec?.rules || []
    return rules.map(rule => rule.host || '*').filter((v, i, a) => a.indexOf(v) === i)
  }

  const getPaths = (ingress: Ingress): number => {
    const rules = ingress.spec?.rules || []
    return rules.reduce((sum, rule) => {
      const paths = rule.http?.paths || []
      return sum + paths.length
    }, 0)
  }

  const getIngressClass = (ingress: Ingress): string => {
    return ingress.spec?.ingressClassName || ingress.metadata?.annotations?.['kubernetes.io/ingress.class'] || 'default'
  }

  const hasTLS = (ingress: Ingress): boolean => {
    return (ingress.spec?.tls?.length || 0) > 0
  }

  const getStatus = (ingress: Ingress) => {
    const loadBalancers = ingress.status?.loadBalancer?.ingress || []
    if (loadBalancers.length > 0) {
      return 'Active'
    }
    return 'Pending'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
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
          <h2 className="text-3xl font-bold tracking-tight">Ingresses</h2>
          <p className="text-muted-foreground">
            Manage external access to services
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
          <Button onClick={() => alert('Create Ingress functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Ingress
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingresses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ingresses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With TLS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {ingresses.filter(hasTLS).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hosts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(ingresses.flatMap(getHosts)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ingresses.reduce((sum, ing) => sum + getPaths(ing), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingresses</CardTitle>
          <CardDescription>
            HTTP(S) routes from outside the cluster to services within
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch ingresses'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : ingresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No ingresses found</p>
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
                  <TableHead>Class</TableHead>
                  <TableHead>Hosts</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>TLS</TableHead>
                  <TableHead>Load Balancer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingresses.map((ingress) => {
                  const hosts = getHosts(ingress)
                  const lbIngresses = ingress.status?.loadBalancer?.ingress || []
                  
                  return (
                    <TableRow key={`${ingress.metadata?.namespace}/${ingress.metadata?.name}`}>
                      <TableCell className="font-medium">{ingress.metadata?.name}</TableCell>
                      <TableCell>{ingress.metadata?.namespace}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getIngressClass(ingress)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {hosts.slice(0, 2).map((host, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              <span className="text-sm">{host}</span>
                            </div>
                          ))}
                          {hosts.length > 2 && (
                            <span className="text-sm text-muted-foreground">+{hosts.length - 2} more</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(getStatus(ingress))}</TableCell>
                      <TableCell>
                        {hasTLS(ingress) ? (
                          <Badge variant="success" className="flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Disabled</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {lbIngresses.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <Link className="w-3 h-3" />
                            <span className="text-sm font-mono">
                              {lbIngresses[0].ip || lbIngresses[0].hostname || 'Pending'}
                            </span>
                          </div>
                        ) : (
                          <Badge variant="secondary">None</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedIngress(ingress)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(ingress)}
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

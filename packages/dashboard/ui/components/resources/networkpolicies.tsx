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
  Shield,
  ArrowRight,
  ArrowLeft,
  ArrowUpDown
} from 'lucide-react'
import { 
  useListNetworkingV1NamespacedNetworkPolicyQuery,
  useListNetworkingV1NetworkPolicyForAllNamespacesQuery,
  useDeleteNetworkingV1NamespacedNetworkPolicy
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { NetworkPolicy } from 'kubernetesjs'

export function NetworkPoliciesView() {
  const [selectedPolicy, setSelectedPolicy] = useState<NetworkPolicy | null>(null)
  const { namespace } = usePreferredNamespace()
  
  const query = namespace === '_all' 
    ? useListNetworkingV1NetworkPolicyForAllNamespacesQuery({ path: {}, query: {} })
    : useListNetworkingV1NamespacedNetworkPolicyQuery({ path: { namespace }, query: {} })
    
  const { data, isLoading, error, refetch } = query
  const deletePolicy = useDeleteNetworkingV1NamespacedNetworkPolicy()

  const policies = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (policy: NetworkPolicy) => {
    const name = policy.metadata!.name!
    const namespace = policy.metadata!.namespace!
    
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deletePolicy.mutateAsync({
          path: { namespace, name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete network policy:', err)
        alert(`Failed to delete network policy: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getPolicyTypes = (policy: NetworkPolicy): string[] => {
    return policy.spec?.policyTypes || ['Ingress']
  }

  const getSelector = (policy: NetworkPolicy): string => {
    const selector = policy.spec?.podSelector
    if (!selector || !selector.matchLabels || Object.keys(selector.matchLabels).length === 0) {
      return 'All pods'
    }
    return Object.entries(selector.matchLabels)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ')
  }

  const getIngressRules = (policy: NetworkPolicy): number => {
    return policy.spec?.ingress?.length || 0
  }

  const getEgressRules = (policy: NetworkPolicy): number => {
    return policy.spec?.egress?.length || 0
  }

  const getPolicyDirection = (types: string[]) => {
    if (types.includes('Ingress') && types.includes('Egress')) {
      return { icon: ArrowUpDown, label: 'Both' }
    } else if (types.includes('Ingress')) {
      return { icon: ArrowLeft, label: 'Ingress' }
    } else if (types.includes('Egress')) {
      return { icon: ArrowRight, label: 'Egress' }
    }
    return { icon: Shield, label: 'Unknown' }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Network Policies</h2>
          <p className="text-muted-foreground">
            Control traffic flow between pods
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
          <Button onClick={() => alert('Create Network Policy functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Policy
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingress Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policies.reduce((sum, p) => sum + getIngressRules(p), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egress Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {policies.reduce((sum, p) => sum + getEgressRules(p), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Namespaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(policies.map(p => p.metadata?.namespace)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Network Policies</CardTitle>
          <CardDescription>
            Define how groups of pods are allowed to communicate
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch network policies'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : policies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No network policies found</p>
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
                  <TableHead>Pod Selector</TableHead>
                  <TableHead>Policy Types</TableHead>
                  <TableHead>Ingress Rules</TableHead>
                  <TableHead>Egress Rules</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => {
                  const types = getPolicyTypes(policy)
                  const direction = getPolicyDirection(types)
                  const DirectionIcon = direction.icon
                  
                  return (
                    <TableRow key={`${policy.metadata?.namespace}/${policy.metadata?.name}`}>
                      <TableCell className="font-medium">{policy.metadata?.name}</TableCell>
                      <TableCell>{policy.metadata?.namespace}</TableCell>
                      <TableCell className="font-mono text-sm">{getSelector(policy)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <DirectionIcon className="w-3 h-3" />
                          {direction.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getIngressRules(policy) > 0 ? 'default' : 'secondary'}>
                          {getIngressRules(policy)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEgressRules(policy) > 0 ? 'default' : 'secondary'}>
                          {getEgressRules(policy)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {policy.metadata?.creationTimestamp 
                          ? new Date(policy.metadata.creationTimestamp).toLocaleDateString()
                          : 'Unknown'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedPolicy(policy)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(policy)}
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

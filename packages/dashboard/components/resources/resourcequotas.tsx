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
  AlertTriangle
} from 'lucide-react'
import { 
  useListCoreV1NamespacedResourceQuotaQuery,
  useListCoreV1ResourceQuotaForAllNamespacesQuery,
  useDeleteCoreV1NamespacedResourceQuota
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { ResourceQuota } from 'kubernetesjs'

import { confirmDialog } from '@/hooks/useConfirm'

export function ResourceQuotasView() {
  const [selectedQuota, setSelectedQuota] = useState<ResourceQuota | null>(null)
  const { namespace } = usePreferredNamespace()
  
  const query = namespace === '_all' 
    ? useListCoreV1ResourceQuotaForAllNamespacesQuery({ path: {}, query: {} })
    : useListCoreV1NamespacedResourceQuotaQuery({ path: { namespace }, query: {} })
    
  const { data, isLoading, error, refetch } = query
  const deleteQuota = useDeleteCoreV1NamespacedResourceQuota()

  const quotas = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (quota: ResourceQuota) => {
    const name = quota.metadata!.name!
    const namespace = quota.metadata!.namespace!
    
    const confirmed = await confirmDialog({
      title: 'Delete Resource Quota',
      description: `Are you sure you want to delete ${name}?`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deleteQuota.mutateAsync({
          path: { namespace, name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete resource quota:', err)
        alert(`Failed to delete resource quota: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getUsagePercentage = (used: string, hard: string) => {
    const usedNum = parseInt(used) || 0
    const hardNum = parseInt(hard) || 0
    if (hardNum === 0) return 0
    return Math.round((usedNum / hardNum) * 100)
  }

  const getUsageBadge = (percentage: number) => {
    if (percentage >= 90) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {percentage}%
      </Badge>
    } else if (percentage >= 75) {
      return <Badge variant="warning" className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        {percentage}%
      </Badge>
    } else {
      return <Badge variant="success" className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        {percentage}%
      </Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Resource Quotas</h2>
          <p className="text-muted-foreground">
            Manage namespace resource limits and usage
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
          <Button onClick={() => alert('Create Resource Quota functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Quota
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Namespaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(quotas.map(q => q.metadata?.namespace)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Over 75% Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {quotas.filter(q => {
                const used = q.status?.used || {}
                const hard = q.status?.hard || {}
                return Object.keys(hard).some(key => 
                  getUsagePercentage(used[key] || '0', hard[key]) >= 75
                )
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Quotas</CardTitle>
          <CardDescription>
            Resource limits and current usage by namespace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch resource quotas'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : quotas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No resource quotas found</p>
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
                  <TableHead>Resource</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Hard Limit</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotas.map((quota) => {
                  const hard = quota.status?.hard || {}
                  const used = quota.status?.used || {}
                  const resources = Object.keys(hard)
                  
                  return resources.map((resource, idx) => (
                    <TableRow key={`${quota.metadata?.namespace}/${quota.metadata?.name}/${resource}`}>
                      {idx === 0 && (
                        <>
                          <TableCell rowSpan={resources.length} className="font-medium">
                            {quota.metadata?.name}
                          </TableCell>
                          <TableCell rowSpan={resources.length}>
                            {quota.metadata?.namespace}
                          </TableCell>
                        </>
                      )}
                      <TableCell className="font-mono text-sm">{resource}</TableCell>
                      <TableCell>{used[resource] || '0'}</TableCell>
                      <TableCell>{hard[resource]}</TableCell>
                      <TableCell>
                        {getUsageBadge(getUsagePercentage(used[resource] || '0', hard[resource]))}
                      </TableCell>
                      {idx === 0 && (
                        <TableCell rowSpan={resources.length} className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedQuota(quota)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDelete(quota)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

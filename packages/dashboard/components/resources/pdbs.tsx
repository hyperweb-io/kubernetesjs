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
  Shield,
  ShieldOff
} from 'lucide-react'
import { 
  useListPolicyV1NamespacedPodDisruptionBudgetQuery,
  useListPolicyV1PodDisruptionBudgetForAllNamespacesQuery,
  useDeletePolicyV1NamespacedPodDisruptionBudget
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { PodDisruptionBudget } from 'kubernetesjs'

import { confirmDialog } from '@/hooks/useConfirm'

export function PDBsView() {
  const [selectedPDB, setSelectedPDB] = useState<PodDisruptionBudget | null>(null)
  const { namespace } = usePreferredNamespace()
  
  const query = namespace === '_all' 
    ? useListPolicyV1PodDisruptionBudgetForAllNamespacesQuery({ path: {}, query: {} })
    : useListPolicyV1NamespacedPodDisruptionBudgetQuery({ path: { namespace }, query: {} })
    
  const { data, isLoading, error, refetch } = query
  const deletePDB = useDeletePolicyV1NamespacedPodDisruptionBudget()

  const pdbs = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (pdb: PodDisruptionBudget) => {
    const name = pdb.metadata!.name!
    const namespace = pdb.metadata!.namespace!
    
    const confirmed = await confirmDialog({
      title: 'Delete Pod Disruption Budget',
      description: `Are you sure you want to delete ${name}?`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deletePDB.mutateAsync({
          path: { namespace, name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete PDB:', err)
        alert(`Failed to delete PDB: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getStatus = (pdb: PodDisruptionBudget) => {
    const currentHealthy = pdb.status?.currentHealthy || 0
    const desiredHealthy = pdb.status?.desiredHealthy || 0
    const disruptionsAllowed = pdb.status?.disruptionsAllowed || 0
    
    if (currentHealthy >= desiredHealthy && disruptionsAllowed > 0) {
      return 'Ready'
    } else if (currentHealthy >= desiredHealthy) {
      return 'Protected'
    } else {
      return 'Not Ready'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ready':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'Protected':
        return <Badge variant="warning" className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          {status}
        </Badge>
      case 'Not Ready':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <ShieldOff className="w-3 h-3" />
          {status}
        </Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getSelector = (pdb: PodDisruptionBudget) => {
    const selector = pdb.spec?.selector
    if (!selector) return 'No selector'
    
    if (selector.matchLabels) {
      return Object.entries(selector.matchLabels)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ')
    }
    
    return 'Complex selector'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pod Disruption Budgets</h2>
          <p className="text-muted-foreground">
            Manage disruption policies for your pods
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
          <Button onClick={() => alert('Create PDB functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create PDB
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PDBs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pdbs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pdbs.filter(pdb => getStatus(pdb) === 'Ready').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protected Pods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pdbs.reduce((sum, pdb) => sum + (pdb.status?.currentHealthy || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disruptions Allowed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pdbs.reduce((sum, pdb) => sum + (pdb.status?.disruptionsAllowed || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pod Disruption Budgets</CardTitle>
          <CardDescription>
            Policies that limit the number of pods that can be down simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch PDBs'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : pdbs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No pod disruption budgets found</p>
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
                  <TableHead>Min Available</TableHead>
                  <TableHead>Max Unavailable</TableHead>
                  <TableHead>Current Healthy</TableHead>
                  <TableHead>Disruptions Allowed</TableHead>
                  <TableHead>Selector</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pdbs.map((pdb) => (
                  <TableRow key={`${pdb.metadata?.namespace}/${pdb.metadata?.name}`}>
                    <TableCell className="font-medium">{pdb.metadata?.name}</TableCell>
                    <TableCell>{pdb.metadata?.namespace}</TableCell>
                    <TableCell>{getStatusBadge(getStatus(pdb))}</TableCell>
                    <TableCell>
                      {pdb.spec?.minAvailable?.toString() || '-'}
                    </TableCell>
                    <TableCell>
                      {pdb.spec?.maxUnavailable?.toString() || '-'}
                    </TableCell>
                    <TableCell>
                      {pdb.status?.currentHealthy || 0}/{pdb.status?.desiredHealthy || 0}
                    </TableCell>
                    <TableCell>
                      <Badge variant={pdb.status?.disruptionsAllowed ? 'default' : 'secondary'}>
                        {pdb.status?.disruptionsAllowed || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {getSelector(pdb)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedPDB(pdb)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(pdb)}
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

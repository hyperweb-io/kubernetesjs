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
  Edit, 
  Scale, 
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { type Deployment as K8sDeployment } from 'kubernetesjs'
import { useDeployments, useDeleteDeployment, useScaleDeployment } from '@/hooks'

interface Deployment {
  name: string
  namespace: string
  replicas: number
  availableReplicas: number
  image: string
  createdAt: string
  status: 'Running' | 'Pending' | 'Failed'
  k8sData?: K8sDeployment
}

export function DeploymentsView() {
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null)
  
  // Use TanStack Query hooks
  const { data, isLoading, error, refetch } = useDeployments()
  const deleteDeploymentMutation = useDeleteDeployment()
  const scaleDeploymentMutation = useScaleDeployment()
  // Helper function to determine deployment status
  function determineStatus(deployment: K8sDeployment): 'Running' | 'Pending' | 'Failed' {
    const conditions = deployment.status!.conditions || []
    const progressingCondition = conditions.find(c => c.type === 'Progressing')
    const availableCondition = conditions.find(c => c.type === 'Available')
    
    if (availableCondition?.status === 'True' && 
        deployment.status!.availableReplicas === deployment.spec!.replicas!) {
      return 'Running'
    } else if (progressingCondition?.status === 'True') {
      return 'Pending'
    } else {
      return 'Failed'
    }
  }
  
  // Format deployments from query data
  const deployments: Deployment[] = data?.items?.map(item => {
    const status = determineStatus(item)
    return {
      name: item.metadata!.name!,
      namespace: item.metadata!.namespace!,
      replicas: item.spec!.replicas!,
      availableReplicas: item.status!.availableReplicas || 0,
      image: item.spec!.template!.spec!.containers[0]?.image || 'unknown',
      createdAt: item.metadata!.creationTimestamp!,
      status,
      k8sData: item
    }
  }) || []


  const handleRefresh = () => {
    refetch()
  }

  const handleScale = async (deployment: Deployment) => {
    const newReplicas = prompt(`Scale ${deployment.name} to how many replicas?`, deployment.replicas.toString())
    if (newReplicas && !isNaN(Number(newReplicas))) {
      try {
        await scaleDeploymentMutation.mutateAsync({
          name: deployment.name,
          replicas: Number(newReplicas),
          namespace: deployment.namespace
        })
      } catch (err) {
        console.error('Failed to scale deployment:', err)
        alert(`Failed to scale deployment: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const handleDelete = async (deployment: Deployment) => {
    if (confirm(`Are you sure you want to delete ${deployment.name}?`)) {
      try {
        await deleteDeploymentMutation.mutateAsync({
          name: deployment.name,
          namespace: deployment.namespace
        })
      } catch (err) {
        console.error('Failed to delete deployment:', err)
        alert(`Failed to delete deployment: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Running':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'Pending':
        return <Badge variant="warning" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'Failed':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {status}
        </Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Deployments</h2>
          <p className="text-muted-foreground">
            Manage your Kubernetes deployments
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
          <Button onClick={() => alert('Create Deployment functionality not yet implemented.\n\nTo create a deployment, use kubectl:\nkubectl create deployment <name> --image=<image>')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Deployment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deployments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deployments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Running
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {deployments.filter(d => d.status === 'Running').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Replicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deployments.reduce((sum, d) => sum + d.replicas, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deployments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Deployments</CardTitle>
          <CardDescription>
            A list of all deployments in your cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch deployments'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : deployments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No deployments found in the default namespace</p>
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
                  <TableHead>Replicas</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deployments.map((deployment) => (
                  <TableRow key={deployment.name}>
                    <TableCell className="font-medium">{deployment.name}</TableCell>
                    <TableCell>{deployment.namespace}</TableCell>
                    <TableCell>{getStatusBadge(deployment.status)}</TableCell>
                    <TableCell>
                      {deployment.availableReplicas}/{deployment.replicas}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{deployment.image}</TableCell>
                    <TableCell>
                      {new Date(deployment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedDeployment(deployment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleScale(deployment)}
                        >
                          <Scale className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => console.log('Edit', deployment.name)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(deployment)}
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
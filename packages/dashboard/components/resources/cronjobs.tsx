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
  Clock,
  Pause,
  Play
} from 'lucide-react'
import { 
  useListBatchV1NamespacedCronJobQuery,
  useListBatchV1CronJobForAllNamespacesQuery,
  useDeleteBatchV1NamespacedCronJob,
  usePatchBatchV1NamespacedCronJob
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { CronJob } from 'kubernetesjs'

import { confirmDialog } from '@/hooks/useConfirm'

export function CronJobsView() {
  const [selectedCronJob, setSelectedCronJob] = useState<CronJob | null>(null)
  const { namespace } = usePreferredNamespace()
  
  // Use k8s hooks directly
  const query = namespace === '_all' 
    ? useListBatchV1CronJobForAllNamespacesQuery({ path: {}, query: {} })
    : useListBatchV1NamespacedCronJobQuery({ path: { namespace }, query: {} })
    
  const { data, isLoading, error, refetch } = query
  const deleteCronJob = useDeleteBatchV1NamespacedCronJob()
  const patchCronJob = usePatchBatchV1NamespacedCronJob()

  const cronjobs = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (cronjob: CronJob) => {
    const name = cronjob.metadata!.name!
    const namespace = cronjob.metadata!.namespace!
    
    const confirmed = await confirmDialog({
      title: 'Delete CronJob',
      description: `Are you sure you want to delete ${name}?`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deleteCronJob.mutateAsync({
          path: { namespace, name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete cronjob:', err)
        alert(`Failed to delete cronjob: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const handleToggleSuspend = async (cronjob: CronJob) => {
    const name = cronjob.metadata!.name!
    const namespace = cronjob.metadata!.namespace!
    const suspend = !cronjob.spec?.suspend
    
    try {
      await patchCronJob.mutateAsync({
        path: { namespace, name },
        query: {},
        body: {
          spec: { suspend }
        }
      })
      refetch()
    } catch (err) {
      console.error('Failed to update cronjob:', err)
      alert(`Failed to update cronjob: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const getStatus = (cronjob: CronJob) => {
    if (cronjob.spec?.suspend) {
      return 'Suspended'
    }
    return cronjob.status?.active && cronjob.status.active.length > 0 ? 'Active' : 'Idle'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'Idle':
        return <Badge variant="default" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {status}
        </Badge>
      case 'Suspended':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Pause className="w-3 h-3" />
          {status}
        </Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getLastScheduleTime = (cronjob: CronJob) => {
    if (!cronjob.status?.lastScheduleTime) return 'Never'
    const lastTime = new Date(cronjob.status.lastScheduleTime)
    const now = new Date()
    const diff = now.getTime() - lastTime.getTime()
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return lastTime.toLocaleDateString()
  }

  const getNextScheduleTime = (cronjob: CronJob) => {
    if (cronjob.spec?.suspend) return 'Suspended'
    if (!cronjob.status?.lastScheduleTime && !cronjob.status?.lastSuccessfulTime) {
      return 'Soon'
    }
    // Note: Actual next schedule calculation would require cron parsing
    return 'Calculating...'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CronJobs</h2>
          <p className="text-muted-foreground">
            Manage your Kubernetes scheduled jobs
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
          <Button onClick={() => alert('Create CronJob functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create CronJob
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total CronJobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cronjobs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {cronjobs.filter(cj => getStatus(cj) === 'Active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {cronjobs.filter(cj => getStatus(cj) === 'Suspended').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cronjobs.reduce((sum, cj) => sum + (cj.status?.active?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CronJobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All CronJobs</CardTitle>
          <CardDescription>
            A list of all scheduled jobs in your cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch cronjobs'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : cronjobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No cronjobs found</p>
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
                  <TableHead>Schedule</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cronjobs.map((cronjob) => (
                  <TableRow key={`${cronjob.metadata?.namespace}/${cronjob.metadata?.name}`}>
                    <TableCell className="font-medium">{cronjob.metadata?.name}</TableCell>
                    <TableCell>{cronjob.metadata?.namespace}</TableCell>
                    <TableCell>{getStatusBadge(getStatus(cronjob))}</TableCell>
                    <TableCell className="font-mono text-sm">{cronjob.spec?.schedule}</TableCell>
                    <TableCell>{getLastScheduleTime(cronjob)}</TableCell>
                    <TableCell>{getNextScheduleTime(cronjob)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {cronjob.spec?.jobTemplate?.spec?.template?.spec?.containers?.[0]?.image || 'unknown'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedCronJob(cronjob)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleSuspend(cronjob)}
                        >
                          {cronjob.spec?.suspend ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(cronjob)}
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

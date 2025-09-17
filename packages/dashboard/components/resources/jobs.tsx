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
  XCircle
} from 'lucide-react'
import { 
  useListBatchV1NamespacedJobQuery,
  useListBatchV1JobForAllNamespacesQuery,
  useDeleteBatchV1NamespacedJob
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { Job } from 'kubernetesjs'

import { confirmDialog } from '@/hooks/useConfirm'

export function JobsView() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const { namespace } = usePreferredNamespace()
  
  // Use k8s hooks directly
  const query = namespace === '_all' 
    ? useListBatchV1JobForAllNamespacesQuery({ path: {}, query: {} })
    : useListBatchV1NamespacedJobQuery({ path: { namespace }, query: {} })
    
  const { data, isLoading, error, refetch } = query
  const deleteJob = useDeleteBatchV1NamespacedJob()

  const jobs = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (job: Job) => {
    const name = job.metadata!.name!
    const namespace = job.metadata!.namespace!
    
    const confirmed = await confirmDialog({
      title: 'Delete Job',
      description: `Are you sure you want to delete ${name}?`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deleteJob.mutateAsync({
          path: { namespace, name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete job:', err)
        alert(`Failed to delete job: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getStatus = (job: Job) => {
    const conditions = job.status?.conditions || []
    const succeeded = job.status?.succeeded || 0
    const failed = job.status?.failed || 0
    const active = job.status?.active || 0
    
    if (conditions.find(c => c.type === 'Complete' && c.status === 'True')) {
      return 'Completed'
    } else if (conditions.find(c => c.type === 'Failed' && c.status === 'True')) {
      return 'Failed'
    } else if (active > 0) {
      return 'Running'
    } else {
      return 'Pending'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {status}
        </Badge>
      case 'Running':
        return <Badge variant="default" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {status}
        </Badge>
      case 'Failed':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          {status}
        </Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDuration = (job: Job) => {
    if (!job.status?.startTime) return 'Not started'
    const start = new Date(job.status.startTime).getTime()
    const end = job.status.completionTime 
      ? new Date(job.status.completionTime).getTime() 
      : Date.now()
    const duration = Math.floor((end - start) / 1000)
    
    if (duration < 60) return `${duration}s`
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
          <p className="text-muted-foreground">
            Manage your Kubernetes batch jobs
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
          <Button onClick={() => alert('Create Job functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {jobs.filter(job => getStatus(job) === 'Running').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {jobs.filter(job => getStatus(job) === 'Completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {jobs.filter(job => getStatus(job) === 'Failed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
          <CardDescription>
            A list of all batch jobs in your cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch jobs'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No jobs found</p>
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
                  <TableHead>Completions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={`${job.metadata?.namespace}/${job.metadata?.name}`}>
                    <TableCell className="font-medium">{job.metadata?.name}</TableCell>
                    <TableCell>{job.metadata?.namespace}</TableCell>
                    <TableCell>{getStatusBadge(getStatus(job))}</TableCell>
                    <TableCell>
                      {job.status?.succeeded || 0}/{job.spec?.completions || 1}
                    </TableCell>
                    <TableCell>{getDuration(job)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {job.spec?.template?.spec?.containers?.[0]?.image || 'unknown'}
                    </TableCell>
                    <TableCell>
                      {job.metadata?.creationTimestamp 
                        ? new Date(job.metadata.creationTimestamp).toLocaleDateString()
                        : 'Unknown'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedJob(job)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(job)}
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

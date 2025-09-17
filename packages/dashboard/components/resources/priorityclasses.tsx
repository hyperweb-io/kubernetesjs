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
  Star,
  StarOff
} from 'lucide-react'
import { 
  useListSchedulingV1PriorityClassQuery,
  useDeleteSchedulingV1PriorityClass
} from '@/k8s'
import type { PriorityClass } from 'kubernetesjs'

import { confirmDialog } from '@/hooks/useConfirm'

export function PriorityClassesView() {
  const [selectedPriorityClass, setSelectedPriorityClass] = useState<PriorityClass | null>(null)
  
  const { data, isLoading, error, refetch } = useListSchedulingV1PriorityClassQuery({ path: {}, query: {} })
  const deletePriorityClass = useDeleteSchedulingV1PriorityClass()

  const priorityClasses = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (pc: PriorityClass) => {
    const name = pc.metadata!.name!
    
    const confirmed = await confirmDialog({
      title: 'Delete Priority Class',
      description: `Are you sure you want to delete ${name}?`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        await deletePriorityClass.mutateAsync({
          path: { name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete priority class:', err)
        alert(`Failed to delete priority class: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getPriorityBadge = (value: number) => {
    if (value >= 1000000000) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <Star className="w-3 h-3" />
        System Critical
      </Badge>
    } else if (value >= 900000000) {
      return <Badge variant="warning" className="flex items-center gap-1">
        <Star className="w-3 h-3" />
        Cluster Critical
      </Badge>
    } else if (value > 0) {
      return <Badge variant="default">
        Priority {value}
      </Badge>
    } else {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <StarOff className="w-3 h-3" />
        Default
      </Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Priority Classes</h2>
          <p className="text-muted-foreground">
            Manage pod scheduling priorities
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
          <Button onClick={() => alert('Create Priority Class functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Priority Class
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{priorityClasses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {priorityClasses.filter(pc => pc.value >= 1000000000).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {priorityClasses.filter(pc => pc.value < 900000000).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Priority Classes</CardTitle>
          <CardDescription>
            Classes that define the relative priority of pods
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch priority classes'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : priorityClasses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No priority classes found</p>
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
                  <TableHead>Value</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Global Default</TableHead>
                  <TableHead>Preemption Policy</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priorityClasses
                  .sort((a, b) => (b.value || 0) - (a.value || 0))
                  .map((pc) => (
                    <TableRow key={pc.metadata?.name}>
                      <TableCell className="font-medium">{pc.metadata?.name}</TableCell>
                      <TableCell>{pc.value}</TableCell>
                      <TableCell>{getPriorityBadge(pc.value || 0)}</TableCell>
                      <TableCell>
                        {pc.globalDefault ? (
                          <Badge variant="success">Yes</Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={pc.preemptionPolicy === 'Never' ? 'secondary' : 'default'}>
                          {pc.preemptionPolicy || 'PreemptLowerPriority'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {pc.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedPriorityClass(pc)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(pc)}
                            disabled={pc.value >= 1000000000}
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

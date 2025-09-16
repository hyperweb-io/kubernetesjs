'use client'

import { useState, useEffect, useDeferredValue } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Package,
  Server,
  Activity,
  Copy,
  Settings,
  AlertCircle
} from 'lucide-react'
import { useDeployments, useServices, usePods, useDaemonSets, useReplicaSets } from '@/hooks'

interface ResourceSectionProps {
  title: string
  icon: React.ElementType
  color: string
  count: number
  loading: boolean
  error: Error | null
  children: React.ReactNode
  onRefresh: () => void
}

function ResourceSection({ title, icon: Icon, color, count, loading, error, children, onRefresh }: ResourceSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card className="mb-4">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <div className={`p-2 rounded-lg bg-secondary ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="mt-1">
                {loading ? 'Loading...' : error ? 'Error loading data' : `${count} items`}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onRefresh()
            }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          {error ? (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error.message}</span>
            </div>
          ) : (
            children
          )}
        </CardContent>
      )}
    </Card>
  )
}

export function AllResourcesView() {
  // Always call all hooks, but control their enabled state
  const deployments = useDeployments()
  const services = useServices()
  const pods = usePods()
  const daemonSets = useDaemonSets()
  const replicaSets = useReplicaSets()

  const refreshAll = () => {
    deployments.refetch()
    services.refetch()
    pods.refetch()
    daemonSets.refetch()
    replicaSets.refetch()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">All Resources</h2>
          <p className="text-muted-foreground">
            Overview of all Kubernetes resources in your cluster
          </p>
        </div>
        <Button onClick={refreshAll} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deployments.data?.items?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.data?.items?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pods.data?.items?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">DaemonSets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daemonSets.data?.items?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ReplicaSets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{replicaSets.data?.items?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Sections */}
      <div>
        {/* Deployments */}
        <ResourceSection
          title="Deployments"
          icon={Package}
          color="text-blue-600"
          count={deployments.data?.items?.length || 0}
          loading={deployments.isLoading}
          error={deployments.error}
          onRefresh={() => deployments.refetch()}
        >
          <div className="space-y-2">
            {deployments.data?.items?.map((item) => {
              const replicas = item.spec?.replicas || 0
              const readyReplicas = item.status?.readyReplicas || 0
              const isReady = replicas === readyReplicas && replicas > 0
              
              return (
                <div key={item.metadata?.uid} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{item.metadata?.name}</div>
                    <Badge variant={isReady ? 'success' : 'warning'}>
                      {readyReplicas}/{replicas} Ready
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.spec?.template?.spec?.containers[0]?.image || 'unknown'}
                  </div>
                </div>
              )
            })}
          </div>
        </ResourceSection>

        {/* Services */}
        <ResourceSection
          title="Services"
          icon={Server}
          color="text-green-600"
          count={services.data?.items?.length || 0}
          loading={services.isLoading}
          error={services.error}
          onRefresh={() => services.refetch()}
        >
          <div className="space-y-2">
            {services.data?.items?.map((item) => {
              const type = item.spec?.type || 'Unknown'
              const ports = item.spec?.ports?.map(p => p.port).join(', ') || 'none'
              
              return (
                <div key={item.metadata?.uid} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{item.metadata?.name}</div>
                    <Badge variant="outline">{type}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ports: {ports}
                  </div>
                </div>
              )
            })}
          </div>
        </ResourceSection>

        {/* Pods */}
        <ResourceSection
          title="Pods"
          icon={Activity}
          color="text-orange-600"
          count={pods.data?.items?.length || 0}
          loading={pods.isLoading}
          error={pods.error}
          onRefresh={() => pods.refetch()}
        >
          <div className="space-y-2">
            {pods.data?.items?.map((item) => {
              const phase = item.status?.phase || 'Unknown'
              const containerStatuses = item.status?.containerStatuses || []
              const readyContainers = containerStatuses.filter(cs => cs.ready).length
              const totalContainers = containerStatuses.length
              
              return (
                <div key={item.metadata?.uid} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{item.metadata?.name}</div>
                    <Badge variant={phase === 'Running' ? 'success' : phase === 'Pending' ? 'warning' : 'destructive'}>
                      {phase}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {readyContainers}/{totalContainers} Ready
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Node: {item.spec?.nodeName || 'unassigned'}
                  </div>
                </div>
              )
            })}
          </div>
        </ResourceSection>

        {/* DaemonSets */}
        <ResourceSection
          title="DaemonSets"
          icon={Settings}
          color="text-purple-600"
          count={daemonSets.data?.items?.length || 0}
          loading={daemonSets.isLoading}
          error={daemonSets.error}
          onRefresh={() => daemonSets.refetch()}
        >
          <div className="space-y-2">
            {daemonSets.data?.items?.map((item) => {
              const desired = item.status?.desiredNumberScheduled || 0
              const ready = item.status?.numberReady || 0
              const isReady = desired === ready && desired > 0
              
              return (
                <div key={item.metadata?.uid} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{item.metadata?.name}</div>
                    <Badge variant={isReady ? 'success' : 'warning'}>
                      {ready}/{desired} Ready
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.spec?.template?.spec?.containers[0]?.image || 'unknown'}
                  </div>
                </div>
              )
            })}
          </div>
        </ResourceSection>

        {/* ReplicaSets */}
        <ResourceSection
          title="ReplicaSets"
          icon={Copy}
          color="text-pink-600"
          count={replicaSets.data?.items?.length || 0}
          loading={replicaSets.isLoading}
          error={replicaSets.error}
          onRefresh={() => replicaSets.refetch()}
        >
          <div className="space-y-2">
            {replicaSets.data?.items?.map((item) => {
              const replicas = item.spec?.replicas || 0
              const readyReplicas = item.status?.readyReplicas || 0
              const isReady = replicas === readyReplicas && replicas > 0
              
              // Check if owned by deployment
              const ownerRefs = item.metadata?.ownerReferences || []
              const deploymentRef = ownerRefs.find(ref => ref.kind === 'Deployment')
              
              return (
                <div key={item.metadata?.uid} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{item.metadata?.name}</div>
                    <Badge variant={isReady ? 'success' : 'warning'}>
                      {readyReplicas}/{replicas} Ready
                    </Badge>
                    {deploymentRef && (
                      <Badge variant="outline" className="text-xs">
                        {deploymentRef.name}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.spec?.template?.spec?.containers[0]?.image || 'unknown'}
                  </div>
                </div>
              )
            })}
          </div>
        </ResourceSection>
      </div>
    </div>
  )
}

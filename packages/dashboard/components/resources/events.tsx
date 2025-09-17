'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  RefreshCw, 
  AlertCircle,
  Info,
  AlertTriangle,
  Filter,
  Clock,
  Activity
} from 'lucide-react'
import { 
  useListCoreV1NamespacedEventQuery,
  useListEventsV1EventForAllNamespacesQuery
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { CoreV1Event } from 'kubernetesjs'

export function EventsView() {
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const { namespace } = usePreferredNamespace()
  
  // Note: Events API has changed in newer versions, using v1 events
  const query = namespace === '_all' 
    ? useListEventsV1EventForAllNamespacesQuery({ path: {}, query: {} })
    : useListCoreV1NamespacedEventQuery({ path: { namespace }, query: {} })
    
  const { data, isLoading, error, refetch } = query

  const events = data?.items || []

  const handleRefresh = () => refetch()

  const getEventType = (event: CoreV1Event): string => {
    return event.type || 'Normal'
  }

  const getEventReason = (event: CoreV1Event): string => {
    return event.reason || 'Unknown'
  }

  const getEventMessage = (event: CoreV1Event): string => {
    return event.message || 'No message'
  }

  const getEventObject = (event: CoreV1Event): string => {
    const obj = event.involvedObject
    if (!obj) return 'Unknown'
    return `${obj.kind}/${obj.name}`
  }

  const getEventTime = (event: CoreV1Event): string => {
    const timestamp = event.lastTimestamp || event.firstTimestamp
    if (!timestamp) return 'Unknown'
    
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  const getEventCount = (event: CoreV1Event): number => {
    return event.count || 1
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Normal':
        return <Badge variant="default" className="flex items-center gap-1">
          <Info className="w-3 h-3" />
          {type}
        </Badge>
      case 'Warning':
        return <Badge variant="warning" className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          {type}
        </Badge>
      case 'Error':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {type}
        </Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const filteredEvents = typeFilter === 'All' 
    ? events 
    : events.filter(e => getEventType(e) === typeFilter)

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const timeA = new Date(a.lastTimestamp || a.firstTimestamp || 0).getTime()
    const timeB = new Date(b.lastTimestamp || b.firstTimestamp || 0).getTime()
    return timeB - timeA // Most recent first
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">
            Cluster activity and notifications
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1">
            <Button
              variant={typeFilter === 'All' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('All')}
            >
              All
            </Button>
            <Button
              variant={typeFilter === 'Normal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('Normal')}
            >
              Normal
            </Button>
            <Button
              variant={typeFilter === 'Warning' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('Warning')}
            >
              Warning
            </Button>
          </div>
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
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Normal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => getEventType(e) === 'Normal').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {events.filter(e => getEventType(e) === 'Warning').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Objects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(events.map(getEventObject)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Events
            {typeFilter !== 'All' && (
              <Badge variant="secondary" className="ml-2">
                <Filter className="w-3 h-3 mr-1" />
                {typeFilter}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            System events and notifications from the cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch events'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">
                {typeFilter === 'All' ? 'No events found' : `No ${typeFilter} events found`}
              </p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Object</TableHead>
                  <TableHead>Namespace</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEvents.map((event, idx) => (
                  <TableRow key={`${event.metadata?.namespace}/${event.metadata?.name}/${idx}`}>
                    <TableCell className="whitespace-nowrap">
                      <span className="flex items-center gap-1 text-sm">
                        <Clock className="w-3 h-3" />
                        {getEventTime(event)}
                      </span>
                    </TableCell>
                    <TableCell>{getTypeBadge(getEventType(event))}</TableCell>
                    <TableCell className="font-mono text-sm">{getEventObject(event)}</TableCell>
                    <TableCell>{event.metadata?.namespace || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getEventReason(event)}</Badge>
                    </TableCell>
                    <TableCell className="max-w-md truncate" title={getEventMessage(event)}>
                      {getEventMessage(event)}
                    </TableCell>
                    <TableCell>
                      {getEventCount(event) > 1 && (
                        <Badge variant="secondary">{getEventCount(event)}</Badge>
                      )}
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

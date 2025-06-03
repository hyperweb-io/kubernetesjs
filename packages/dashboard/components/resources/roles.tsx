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
  Key,
  Globe
} from 'lucide-react'
import { 
  useListRbacAuthorizationV1NamespacedRoleQuery,
  useListRbacAuthorizationV1RoleForAllNamespacesQuery,
  useDeleteRbacAuthorizationV1NamespacedRole,
  useListRbacAuthorizationV1ClusterRoleQuery,
  useDeleteRbacAuthorizationV1ClusterRole
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { Role, ClusterRole } from 'kubernetesjs'

import { confirmDialog } from '@/hooks/useConfirm'

export function RolesView() {
  const [selectedRole, setSelectedRole] = useState<Role | ClusterRole | null>(null)
  const [showClusterRoles, setShowClusterRoles] = useState(false)
  const { namespace } = usePreferredNamespace()
  
  // Namespace roles
  const nsQuery = namespace === '_all' 
    ? useListRbacAuthorizationV1RoleForAllNamespacesQuery({ path: {}, query: {} })
    : useListRbacAuthorizationV1NamespacedRoleQuery({ path: { namespace }, query: {} })
  
  // Cluster roles
  const clusterQuery = useListRbacAuthorizationV1ClusterRoleQuery({ path: {}, query: {} })
  
  const query = showClusterRoles ? clusterQuery : nsQuery
  const { data, isLoading, error, refetch } = query
  
  const deleteNsRole = useDeleteRbacAuthorizationV1NamespacedRole()
  const deleteClusterRole = useDeleteRbacAuthorizationV1ClusterRole()

  const roles = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (role: Role | ClusterRole) => {
    const name = role.metadata!.name!
    
    const confirmed = await confirmDialog({
      title: 'Delete Role',
      description: `Are you sure you want to delete ${name}?`,
      confirmText: 'Delete',
      confirmVariant: 'destructive'
    })
    
    if (confirmed) {
      try {
        if (showClusterRoles) {
          await deleteClusterRole.mutateAsync({
            path: { name },
            query: {}
          })
        } else {
          const namespace = role.metadata!.namespace!
          await deleteNsRole.mutateAsync({
            path: { namespace, name },
            query: {}
          })
        }
        refetch()
      } catch (err) {
        console.error('Failed to delete role:', err)
        alert(`Failed to delete role: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getRuleCount = (role: Role | ClusterRole): number => {
    return role.rules?.length || 0
  }

  const getResourceCount = (role: Role | ClusterRole): number => {
    const rules = role.rules || []
    const resources = new Set<string>()
    rules.forEach(rule => {
      (rule.resources || []).forEach(resource => {
        resources.add(resource)
      })
    })
    return resources.size
  }

  const getVerbCount = (role: Role | ClusterRole): number => {
    const rules = role.rules || []
    const verbs = new Set<string>()
    rules.forEach(rule => {
      (rule.verbs || []).forEach(verb => {
        verbs.add(verb)
      })
    })
    return verbs.size
  }

  const hasWildcardAccess = (role: Role | ClusterRole): boolean => {
    const rules = role.rules || []
    return rules.some(rule => 
      rule.verbs?.includes('*') || 
      rule.resources?.includes('*') ||
      rule.apiGroups?.includes('*')
    )
  }

  const getTopResources = (role: Role | ClusterRole): string => {
    const rules = role.rules || []
    const resources: string[] = []
    
    rules.forEach(rule => {
      (rule.resources || []).forEach(resource => {
        if (!resources.includes(resource)) {
          resources.push(resource)
        }
      })
    })
    
    if (resources.length === 0) return 'None'
    if (resources.length <= 3) return resources.join(', ')
    return `${resources.slice(0, 3).join(', ')} +${resources.length - 3} more`
  }

  const isSystemRole = (role: Role | ClusterRole): boolean => {
    const name = role.metadata?.name || ''
    return name.startsWith('system:') || 
           name.startsWith('kubernetes-') ||
           name.includes(':system:') ||
           (role.metadata?.labels?.['kubernetes.io/bootstrapping'] === 'rbac-defaults')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
          <p className="text-muted-foreground">
            Define permissions for accessing resources
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1">
            <Button
              variant={!showClusterRoles ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowClusterRoles(false)}
            >
              Namespace
            </Button>
            <Button
              variant={showClusterRoles ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowClusterRoles(true)}
            >
              Cluster
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
          <Button onClick={() => alert('Create Role functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.filter(isSystemRole).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Defined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.filter(r => !isSystemRole(r)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Wildcards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {roles.filter(hasWildcardAccess).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{showClusterRoles ? 'Cluster Roles' : 'Namespace Roles'}</CardTitle>
          <CardDescription>
            {showClusterRoles 
              ? 'Cluster-wide permission sets' 
              : 'Namespace-scoped permission sets'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch roles'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : roles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No roles found</p>
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
                  {!showClusterRoles && <TableHead>Namespace</TableHead>}
                  <TableHead>Type</TableHead>
                  <TableHead>Rules</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead>Verbs</TableHead>
                  <TableHead>Top Resources</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => {
                  const isSystem = isSystemRole(role)
                  const hasWildcard = hasWildcardAccess(role)
                  
                  return (
                    <TableRow key={role.metadata?.uid || role.metadata?.name}>
                      <TableCell className="font-medium">{role.metadata?.name}</TableCell>
                      {!showClusterRoles && (
                        <TableCell>{role.metadata?.namespace}</TableCell>
                      )}
                      <TableCell>
                        {isSystem ? (
                          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            <Shield className="w-3 h-3" />
                            System
                          </Badge>
                        ) : (
                          <Badge variant="default" className="flex items-center gap-1 w-fit">
                            <Key className="w-3 h-3" />
                            Custom
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getRuleCount(role)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getResourceCount(role)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getVerbCount(role)}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {hasWildcard && (
                          <Badge variant="warning" className="mr-2">
                            <Globe className="w-3 h-3 mr-1" />
                            Wildcard
                          </Badge>
                        )}
                        {getTopResources(role)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedRole(role)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(role)}
                            disabled={isSystem}
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

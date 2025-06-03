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
  UserCheck,
  Users,
  User,
  Bot
} from 'lucide-react'
import { 
  useListRbacAuthorizationV1NamespacedRoleBindingQuery,
  useListRbacAuthorizationV1RoleBindingForAllNamespacesQuery,
  useDeleteRbacAuthorizationV1NamespacedRoleBinding,
  useListRbacAuthorizationV1ClusterRoleBindingQuery,
  useDeleteRbacAuthorizationV1ClusterRoleBinding
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { RoleBinding, ClusterRoleBinding } from 'kubernetesjs'

export function RoleBindingsView() {
  const [selectedBinding, setSelectedBinding] = useState<RoleBinding | ClusterRoleBinding | null>(null)
  const [showClusterBindings, setShowClusterBindings] = useState(false)
  const { namespace } = usePreferredNamespace()
  
  // Namespace role bindings
  const nsQuery = namespace === '_all' 
    ? useListRbacAuthorizationV1RoleBindingForAllNamespacesQuery({ path: {}, query: {} })
    : useListRbacAuthorizationV1NamespacedRoleBindingQuery({ path: { namespace }, query: {} })
  
  // Cluster role bindings
  const clusterQuery = useListRbacAuthorizationV1ClusterRoleBindingQuery({ path: {}, query: {} })
  
  const query = showClusterBindings ? clusterQuery : nsQuery
  const { data, isLoading, error, refetch } = query
  
  const deleteNsBinding = useDeleteRbacAuthorizationV1NamespacedRoleBinding()
  const deleteClusterBinding = useDeleteRbacAuthorizationV1ClusterRoleBinding()

  const bindings = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (binding: RoleBinding | ClusterRoleBinding) => {
    const name = binding.metadata!.name!
    
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        if (showClusterBindings) {
          await deleteClusterBinding.mutateAsync({
            path: { name },
            query: {}
          })
        } else {
          const namespace = binding.metadata!.namespace!
          await deleteNsBinding.mutateAsync({
            path: { namespace, name },
            query: {}
          })
        }
        refetch()
      } catch (err) {
        console.error('Failed to delete role binding:', err)
        alert(`Failed to delete role binding: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getRoleRef = (binding: RoleBinding | ClusterRoleBinding): string => {
    const ref = binding.roleRef
    return `${ref.kind}/${ref.name}`
  }

  const getSubjects = (binding: RoleBinding | ClusterRoleBinding): string => {
    const subjects = binding.subjects || []
    if (subjects.length === 0) return 'None'
    if (subjects.length === 1) {
      const s = subjects[0]
      return `${s.kind}/${s.name}`
    }
    return `${subjects.length} subjects`
  }

  const getSubjectTypes = (binding: RoleBinding | ClusterRoleBinding): string[] => {
    const subjects = binding.subjects || []
    const types = new Set(subjects.map(s => s.kind))
    return Array.from(types)
  }

  const getSubjectIcon = (types: string[]) => {
    if (types.includes('ServiceAccount')) return Bot
    if (types.includes('Group')) return Users
    if (types.includes('User')) return User
    return UserCheck
  }

  const isClusterRole = (binding: RoleBinding | ClusterRoleBinding): boolean => {
    return binding.roleRef.kind === 'ClusterRole'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Role Bindings</h2>
          <p className="text-muted-foreground">
            Bind roles to users, groups, and service accounts
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1">
            <Button
              variant={!showClusterBindings ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowClusterBindings(false)}
            >
              Namespace
            </Button>
            <Button
              variant={showClusterBindings ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowClusterBindings(true)}
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
          <Button onClick={() => alert('Create Role Binding functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Binding
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bindings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bindings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bindings.filter(b => b.subjects?.some(s => s.kind === 'ServiceAccount')).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users/Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bindings.filter(b => b.subjects?.some(s => s.kind === 'User' || s.kind === 'Group')).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(bindings.map(getRoleRef)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{showClusterBindings ? 'Cluster Role Bindings' : 'Namespace Role Bindings'}</CardTitle>
          <CardDescription>
            {showClusterBindings 
              ? 'Cluster-wide role assignments' 
              : 'Namespace-scoped role assignments'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch role bindings'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : bindings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No role bindings found</p>
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
                  {!showClusterBindings && <TableHead>Namespace</TableHead>}
                  <TableHead>Role</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Subject Types</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bindings.map((binding) => {
                  const subjectTypes = getSubjectTypes(binding)
                  const SubjectIcon = getSubjectIcon(subjectTypes)
                  
                  return (
                    <TableRow key={binding.metadata?.uid || binding.metadata?.name}>
                      <TableCell className="font-medium">{binding.metadata?.name}</TableCell>
                      {!showClusterBindings && (
                        <TableCell>{binding.metadata?.namespace}</TableCell>
                      )}
                      <TableCell>
                        <Badge variant={isClusterRole(binding) ? 'default' : 'outline'}>
                          {getRoleRef(binding)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{getSubjects(binding)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <SubjectIcon className="w-4 h-4" />
                          <span className="text-sm">{subjectTypes.join(', ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {binding.metadata?.creationTimestamp 
                          ? new Date(binding.metadata.creationTimestamp).toLocaleDateString()
                          : 'Unknown'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedBinding(binding)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(binding)}
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

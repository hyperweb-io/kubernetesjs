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
  Bot,
  Key,
  Lock,
  Unlock
} from 'lucide-react'
import { 
  useListCoreV1NamespacedServiceAccountQuery,
  useListCoreV1ServiceAccountForAllNamespacesQuery,
  useDeleteCoreV1NamespacedServiceAccount
} from '@/k8s'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'
import type { ServiceAccount } from 'kubernetesjs'

export function ServiceAccountsView() {
  const [selectedAccount, setSelectedAccount] = useState<ServiceAccount | null>(null)
  const { namespace } = usePreferredNamespace()
  
  const query = namespace === '_all' 
    ? useListCoreV1ServiceAccountForAllNamespacesQuery({ path: {}, query: {} })
    : useListCoreV1NamespacedServiceAccountQuery({ path: { namespace }, query: {} })
    
  const { data, isLoading, error, refetch } = query
  const deleteAccount = useDeleteCoreV1NamespacedServiceAccount()

  const accounts = data?.items || []

  const handleRefresh = () => refetch()

  const handleDelete = async (account: ServiceAccount) => {
    const name = account.metadata!.name!
    const namespace = account.metadata!.namespace!
    
    if (confirm(`Are you sure you want to delete ${name}? This may affect pods using this service account.`)) {
      try {
        await deleteAccount.mutateAsync({
          path: { namespace, name },
          query: {}
        })
        refetch()
      } catch (err) {
        console.error('Failed to delete service account:', err)
        alert(`Failed to delete service account: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }
  }

  const getSecretCount = (account: ServiceAccount): number => {
    return account.secrets?.length || 0
  }

  const getImagePullSecrets = (account: ServiceAccount): number => {
    return account.imagePullSecrets?.length || 0
  }

  const hasAutomountToken = (account: ServiceAccount): boolean => {
    return account.automountServiceAccountToken !== false
  }

  const isDefaultAccount = (account: ServiceAccount): boolean => {
    return account.metadata?.name === 'default'
  }

  const isSystemAccount = (account: ServiceAccount): boolean => {
    const name = account.metadata?.name || ''
    const namespace = account.metadata?.namespace || ''
    return namespace.startsWith('kube-') || 
           name.startsWith('system:') ||
           name.includes('controller') ||
           name.includes('operator')
  }

  const getSecretNames = (account: ServiceAccount): string => {
    const secrets = account.secrets || []
    if (secrets.length === 0) return 'None'
    if (secrets.length === 1) return secrets[0].name || 'Unknown'
    return `${secrets.length} secrets`
  }

  const getAccountType = (account: ServiceAccount) => {
    if (isDefaultAccount(account)) return 'Default'
    if (isSystemAccount(account)) return 'System'
    return 'User'
  }

  const getAccountBadge = (type: string) => {
    switch (type) {
      case 'Default':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Bot className="w-3 h-3" />
          {type}
        </Badge>
      case 'System':
        return <Badge variant="outline" className="flex items-center gap-1">
          <Bot className="w-3 h-3" />
          {type}
        </Badge>
      default:
        return <Badge variant="default" className="flex items-center gap-1">
          <Bot className="w-3 h-3" />
          {type}
        </Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Service Accounts</h2>
          <p className="text-muted-foreground">
            Identities for pods to access the Kubernetes API
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
          <Button onClick={() => alert('Create Service Account functionality not yet implemented')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Account
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.filter(a => getAccountType(a) === 'User').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Secrets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.filter(a => getSecretCount(a) > 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automount Enabled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.filter(hasAutomountToken).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Accounts</CardTitle>
          <CardDescription>
            Pod identities for accessing Kubernetes API and pulling images
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch service accounts'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No service accounts found</p>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Secrets</TableHead>
                  <TableHead>Image Pull Secrets</TableHead>
                  <TableHead>Automount Token</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => {
                  const accountType = getAccountType(account)
                  const isSystem = accountType === 'System'
                  const isDefault = accountType === 'Default'
                  
                  return (
                    <TableRow key={`${account.metadata?.namespace}/${account.metadata?.name}`}>
                      <TableCell className="font-medium">{account.metadata?.name}</TableCell>
                      <TableCell>{account.metadata?.namespace}</TableCell>
                      <TableCell>{getAccountBadge(accountType)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Key className="w-3 h-3" />
                          <span className="text-sm">{getSecretNames(account)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getImagePullSecrets(account) > 0 ? (
                          <Badge variant="outline">{getImagePullSecrets(account)}</Badge>
                        ) : (
                          <Badge variant="secondary">None</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {hasAutomountToken(account) ? (
                          <Badge variant="default" className="flex items-center gap-1 w-fit">
                            <Unlock className="w-3 h-3" />
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            <Lock className="w-3 h-3" />
                            Disabled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {account.metadata?.creationTimestamp 
                          ? new Date(account.metadata.creationTimestamp).toLocaleDateString()
                          : 'Unknown'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedAccount(account)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(account)}
                            disabled={isDefault || isSystem}
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

'use client';

import { useDatabaseStatus } from '@/hooks/use-database-status';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { CreateDatabasesDialog } from '@/components/create-databases-dialog';
import { CreateDatabaseParams, useCreateBackup, useCreateDatabases, useQueryBackups } from '@/hooks/useDatabases';
import { AlertCircle, CheckCircle, Eye, Plus, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TableHeader, TableRow, TableHead, TableBody, TableCell,Table } from '@/components/ui/table';
import { CreateBackupDialog } from '@/components/create-backup-dialog';

export default function DatabasesPage() {
  // For now default to the standard ns/name; later we can add list + picker
  const [ns, setNs] = useState('postgres-db');

  const [name, setName] = useState('postgres-cluster');

  const { data: status, isLoading, error, refetch } = useDatabaseStatus(ns, name) as any;

  const qc = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);

  const [showCreateBackup, setShowCreateBackup] = useState(false);

  const createDb = useCreateDatabases()

  const backups = useQueryBackups(ns, name)

  const createBackup = useCreateBackup()

  const handleCreateDb = async (data: CreateDatabaseParams) =>{
    return createDb.mutateAsync(data,{
      onSuccess(){
        refetch();
        qc.invalidateQueries({ queryKey: ['db-status', ns, name] });
      }
    })
  }

  const openBackupDialog = () => {
    setShowCreateBackup(true)
  }

  const handleCreateBackUp = (method?: string) =>{
    return createBackup.mutateAsync({
      name,
      ns,
      method
    },{
      onSuccess: () => qc.invalidateQueries({ queryKey: ['db-backups', ns, name] }),
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Cluster in healthy state':
        return <Badge variant="success" className="items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          running
        </Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleRefresh = () => {
    refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Databases</h1>
          <p className="text-gray-600">CloudNativePG clusters and status</p>
        </div>
        <div className="flex gap-2">
          {/* <Button onClick={() => setShowCreate((v) => !v)}>Create DB</Button> */}
          <Button 
            variant="outline" 
            size="icon"
            onClick={()=>backups.refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Database
          </Button>
        </div>
      </div> 

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status?.instances || 0}</div>
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
              {status?.readyInstances || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {status?.pendingInstances || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {status?.failedInstances || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clusters</CardTitle>
          <CardDescription>
            A list of all cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch database'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : status?.notFound ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">No database found in the {ns} namespace</p>
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
                  <TableHead>PostgreSQL Image</TableHead>
                  <TableHead>Primary instance</TableHead>
                  <TableHead>Primary start time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Instances</TableHead>
                  <TableHead>Ready instances</TableHead>
                  <TableHead>System ID</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{status?.name}</TableCell>
                  <TableCell className="font-medium">{status?.image || 'unknown'}</TableCell>
                  <TableCell className="font-medium">{status?.primary || 'unknown'}</TableCell>
                  <TableCell className="font-medium">{status?.primaryStartTime || 'unknown'}</TableCell>
                  <TableCell className="font-medium">{getStatusBadge(status.phase as any)}</TableCell>
                  <TableCell className="font-medium">{status?.instances}</TableCell>
                  <TableCell className="font-medium">{status?.readyInstances}</TableCell>
                  <TableCell className="font-medium">{status?.systemID || 'unknown'}</TableCell>
                  <TableCell className="font-medium break-all">rw: {status?.services?.rw} | ro: {status?.services?.ro} {status?.services?.poolerRw ? `| pooler-rw: ${status?.services?.poolerRw}` : ''}</TableCell>
                  <TableCell className="font-medium">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>openBackupDialog()}
                      title="View deployment"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateDatabasesDialog 
        open={showCreate} 
        onOpenChange={setShowCreate} 
        onSubmit={async (params) => handleCreateDb({...params,ns,name})} 
      />

      <CreateBackupDialog
        backups={backups}
        open={showCreateBackup}
        onOpenChange={setShowCreateBackup}
        onSubmit={async (method) => handleCreateBackUp(method)}
      />

    </div>
  );
}

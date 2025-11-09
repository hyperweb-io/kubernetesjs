'use client';

import { AlertCircle, Eye, RefreshCw, Table, Terminal, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription,CardHeader, CardTitle } from '@/components/ui/card';
import { TableBody, TableCell,TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQueryBackups } from '@/hooks/useDatabases';


export default function AdminBackupView() {
  const namespace = 'postgres-db';

  const { data, isLoading ,error, refetch } = useQueryBackups(namespace, 'postgres-cluster');
  const handleRefresh = () => {
    refetch();
  };

  const backups = data?.backups || [];

  const [selectedBackup, setSelectedBackup] = useState<any | null>(null);

  const handleViewLogs = (backup: any) => {
    console.log(backup);
  };

  const handleDelete = (backup: any) => {
    console.log(backup);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Backups</h2>
          <p className="text-muted-foreground">
            Manage your Backups
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Backups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backups.length}</div>
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
              {backups.filter((p:any) => p.status === 'Running').length}
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
              {backups.filter((p:any) => p.status === 'Pending').length}
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
              {backups.filter((p:any) => p.status === 'Failed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pods Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Backups</CardTitle>
          <CardDescription>
            A list of all backups in your cluster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">{error instanceof Error ? error.message : 'Failed to fetch pods'}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : backups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">
                No backups found {namespace && namespace.toString() === '_all' ? 'in any namespace' : `in the ${namespace} namespace`}
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
                  <TableHead>Name</TableHead>
                  <TableHead>Namespace</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ready</TableHead>
                  <TableHead>Restarts</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Node</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup:any) => (
                  <TableRow key={`${backup.namespace}/${backup.name}`}>
                    <TableCell className="font-medium">{backup.name}</TableCell>
                    <TableCell>{backup.namespace}</TableCell>
                    <TableCell>{''}</TableCell>
                    <TableCell>{backup.ready}</TableCell>
                    <TableCell>{backup.restarts}</TableCell>
                    <TableCell>{backup.age}</TableCell>
                    <TableCell className="font-mono text-sm">{backup.nodeName}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedBackup(backup)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewLogs(backup)}
                          title="View logs"
                        >
                          <Terminal className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(backup)}
                          title="Delete pod"
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
  );
}
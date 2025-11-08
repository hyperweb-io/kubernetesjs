'use client';

import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter,DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateDatabasesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (params: {
    instances: number;
    storage: string;
    storageClass: string;
    appUsername: string;
    appPassword: string;
    superuserPassword: string;
    enablePooler: boolean;
    poolerName: string;
    poolerInstances: number;
  }) => Promise<void>
}


export function CreateDatabasesDialog({ open, onOpenChange, onSubmit }: CreateDatabasesDialogProps) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create DB form state (required fields)

  const [instances, setInstances] = useState<number>(1);
  const [storage, setStorage] = useState<string>('1Gi');
  const [storageClass, setStorageClass] = useState<string>('');
  const [appUsername, setAppUsername] = useState<string>('appuser');
  const [appPassword, setAppPassword] = useState<string>('appuser123!');
  const [superuserPassword, setSuperuserPassword] = useState<string>('postgres123!');
  const [enablePooler, setEnablePooler] = useState<boolean>(true);
  const [poolerName, setPoolerName] = useState<string>('postgres-pooler');
  const [poolerInstances, setPoolerInstances] = useState<number>(1);


  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Basic validation
      if (!appUsername.trim()) {
        setError('App username is required');
        return;
      }
      if (!appPassword.trim()) {
        setError('App password is required');
        return;
      }
      if (!superuserPassword.trim()) {
        setError('Superuser password is required');
        return;
      }
      
      await onSubmit({
        instances,
        storage,
        storageClass,
        appUsername,
        appPassword,
        superuserPassword,
        enablePooler,
        poolerName,
        poolerInstances,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create database');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onOpenChange(false);
    // Reset form to defaults
    setInstances(1);
    setStorage('1Gi');
    setStorageClass('');
    setAppUsername('appuser');
    setAppPassword('appuser123!');
    setSuperuserPassword('postgres123!');
    setEnablePooler(true);
    setPoolerName('postgres-pooler');
    setPoolerInstances(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Create PostgreSQL (CloudNativePG)</DialogTitle>
        </DialogHeader>
        
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <Label htmlFor="instances" className="text-gray-600">Instances</Label>
            <Input
              id="instances"
              type="number"
              min={1}
              max={5}
              value={instances}
              onChange={(e) => setInstances(parseInt(e.target.value || '1', 10))}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <Label htmlFor="storage" className="text-gray-600">Storage</Label>
            <Input
              id="storage"
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              placeholder="10Gi"
            />
          </div>
          
          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="storageClass" className="text-gray-600">Storage Class (optional)</Label>
            <Input
              id="storageClass"
              value={storageClass}
              onChange={(e) => setStorageClass(e.target.value)}
              placeholder="standard"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <Label htmlFor="appUsername" className="text-gray-600">App Username</Label>
            <Input
              required={true}
              id="appUsername"
              value={appUsername}
              onChange={(e) => setAppUsername(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <Label htmlFor="appPassword" className="text-gray-600">App Password</Label>
            <Input
              required={true}
              id="appPassword"
              type="password"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="superuserPassword" className="text-gray-600">Superuser Password</Label>
            <Input
              required={true}
              id="superuserPassword"
              type="password"
              value={superuserPassword}
              onChange={(e) => setSuperuserPassword(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 sm:col-span-2">
            <Checkbox
              id="enablePooler"
              checked={enablePooler}
              onCheckedChange={(checked) => setEnablePooler(checked as boolean)}
            />
            <Label htmlFor="enablePooler" className="text-gray-700">Enable PgBouncer Pooler</Label>
          </div>

          {enablePooler && (
            <>
              <div className="flex flex-col gap-1">
                <Label htmlFor="poolerName" className="text-gray-600">Pooler Name</Label>
                <Input
                  id="poolerName"
                  value={poolerName}
                  onChange={(e) => setPoolerName(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <Label htmlFor="poolerInstances" className="text-gray-600">Pooler Instances</Label>
                <Input
                  id="poolerInstances"
                  type="number"
                  min={1}
                  max={5}
                  value={poolerInstances}
                  onChange={(e) => setPoolerInstances(parseInt(e.target.value || '1', 10))}
                />
              </div>
            </>
          )}
        </div>
    
   
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

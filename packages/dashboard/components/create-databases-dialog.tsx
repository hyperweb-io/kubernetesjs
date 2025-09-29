'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    setError(null)
    setIsSubmitting(true)
    
    try {
      // Basic validation
      if (!appUsername.trim()) {
        setError('App username is required')
      }
      if (!appPassword.trim()) {
        setError('App password is required')
      }
      if (!superuserPassword.trim()) {
        setError('Superuser password is required')
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
      })
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create database')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setError(null)
    onOpenChange(false)
    // Reset form to defaults
    setInstances(1)
    setStorage('1Gi')
    setStorageClass('')
    setAppUsername('appuser')
    setAppPassword('appuser123!')
    setSuperuserPassword('postgres123!')
    setEnablePooler(true)
    setPoolerName('postgres-pooler')
    setPoolerInstances(1)
  }

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
          <label className="flex flex-col gap-1">
            <span className="text-gray-600">Instances</span>
            <input type="number" min={1} max={5} value={instances} onChange={(e) => setInstances(parseInt(e.target.value || '1', 10))} className="border rounded px-2 py-1" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-600">Storage</span>
            <input value={storage} onChange={(e) => setStorage(e.target.value)} placeholder="10Gi" className="border rounded px-2 py-1" />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-gray-600">Storage Class (optional)</span>
            <input value={storageClass} onChange={(e) => setStorageClass(e.target.value)} placeholder="standard" className="border rounded px-2 py-1" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-600">App Username</span>
            <input value={appUsername} onChange={(e) => setAppUsername(e.target.value)} className="border rounded px-2 py-1" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-gray-600">App Password</span>
            <input type="password" value={appPassword} onChange={(e) => setAppPassword(e.target.value)} className="border rounded px-2 py-1" />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-gray-600">Superuser Password</span>
            <input type="password" value={superuserPassword} onChange={(e) => setSuperuserPassword(e.target.value)} className="border rounded px-2 py-1" />
          </label>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" checked={enablePooler} onChange={(e) => setEnablePooler(e.target.checked)} />
            <span className="text-gray-700">Enable PgBouncer Pooler</span>
          </label>

          {enablePooler && (
            <>
              <label className="flex flex-col gap-1">
                <span className="text-gray-600">Pooler Name</span>
                <input value={poolerName} onChange={(e) => setPoolerName(e.target.value)} className="border rounded px-2 py-1" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-gray-600">Pooler Instances</span>
                <input type="number" min={1} max={5} value={poolerInstances} onChange={(e) => setPoolerInstances(parseInt(e.target.value || '1', 10))} className="border rounded px-2 py-1" />
              </label>
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
  )
}

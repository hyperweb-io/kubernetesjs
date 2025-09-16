'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Scale } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Deployment } from 'kubernetesjs'

interface ScaleDeploymentDialogProps {
  deployment: Deployment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onScale: (replicas: number) => Promise<void>
}

export function ScaleDeploymentDialog({ 
  deployment, 
  open, 
  onOpenChange,
  onScale 
}: ScaleDeploymentDialogProps) {
  const currentReplicas = deployment?.spec?.replicas || 0
  const [replicas, setReplicas] = useState(currentReplicas.toString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (deployment && open) {
      setReplicas((deployment.spec?.replicas || 0).toString())
      setError(null)
    }
  }, [deployment, open])

  const handleSubmit = async () => {
    setError(null)
    
    const replicaCount = parseInt(replicas, 10)
    
    if (isNaN(replicaCount) || replicaCount < 0) {
      setError('Please enter a valid number of replicas (0 or greater)')
      return
    }
    
    if (replicaCount > 100) {
      setError('For safety, maximum replicas is limited to 100. Please contact admin for higher limits.')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await onScale(replicaCount)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scale deployment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setError(null)
    setReplicas(currentReplicas.toString())
    onOpenChange(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit()
    }
  }

  if (!deployment) return null

  const deploymentName = deployment.metadata?.name || 'Unknown'
  const namespace = deployment.metadata?.namespace || 'default'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Scale Deployment
          </DialogTitle>
          <DialogDescription>
            Adjust the number of replicas for <span className="font-semibold">{deploymentName}</span> in namespace <span className="font-semibold">{namespace}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="replicas">Number of Replicas</Label>
            <Input
              id="replicas"
              type="number"
              min="0"
              max="100"
              value={replicas}
              onChange={(e) => setReplicas(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter number of replicas"
              className="w-full"
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              Current: {currentReplicas} replica{currentReplicas !== 1 ? 's' : ''}
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {parseInt(replicas) === 0 && !error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Setting replicas to 0 will stop all pods for this deployment.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !replicas}>
            {isSubmitting ? 'Scaling...' : 'Scale'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

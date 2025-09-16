'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { YAMLEditor } from '@/components/yaml-editor'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CreateDeploymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (yaml: string) => Promise<void>
}

const DEFAULT_DEPLOYMENT_TEMPLATE = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-container
        image: nginx:latest
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: "100m"
            memory: "128Mi"
          requests:
            cpu: "50m"
            memory: "64Mi"`

export function CreateDeploymentDialog({ open, onOpenChange, onSubmit }: CreateDeploymentDialogProps) {
  const [yaml, setYaml] = useState(DEFAULT_DEPLOYMENT_TEMPLATE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)
    
    try {
      // Basic YAML validation
      if (!yaml.trim()) {
        throw new Error('YAML content cannot be empty')
      }
      
      await onSubmit(yaml)
      onOpenChange(false)
      // Reset to template for next time
      setYaml(DEFAULT_DEPLOYMENT_TEMPLATE)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deployment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setError(null)
    onOpenChange(false)
    // Reset to template
    setYaml(DEFAULT_DEPLOYMENT_TEMPLATE)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Deployment</DialogTitle>
          <DialogDescription>
            Define your deployment using YAML. The editor below provides a template to get you started.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <YAMLEditor
            value={yaml}
            onChange={(value) => setYaml(value || '')}
            height="100%"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { YAMLEditor } from '@/components/yaml-editor'
import { AlertCircle, Eye, Edit } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import yaml from 'js-yaml'
import type { Deployment } from 'kubernetesjs'

interface ViewEditDeploymentDialogProps {
  deployment: Deployment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'view' | 'edit'
  onSubmit?: (yaml: string) => Promise<void>
}

export function ViewEditDeploymentDialog({ 
  deployment, 
  open, 
  onOpenChange, 
  mode: initialMode,
  onSubmit 
}: ViewEditDeploymentDialogProps) {
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode)
  const [yamlContent, setYamlContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (deployment && open) {
      setIsLoading(true)
      setError(null)
      
      // Fetch the deployment YAML
      const namespace = deployment.metadata?.namespace || 'default'
      const name = deployment.metadata?.name
      
      if (name) {
        fetch(`/api/k8s/apis/apps/v1/namespaces/${namespace}/deployments/${name}`)
          .then(res => res.json())
          .then(data => {
            // Convert JSON to YAML
            const yamlStr = yaml.dump(data, {
              skipInvalid: true,
              noRefs: true,
              sortKeys: false
            })
            setYamlContent(yamlStr)
          })
          .catch(err => {
            console.error('Failed to fetch deployment:', err)
            setError('Failed to load deployment data')
          })
          .finally(() => {
            setIsLoading(false)
          })
      }
    }
  }, [deployment, open])

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  const handleSubmit = async () => {
    if (!onSubmit || mode !== 'edit') return
    
    setError(null)
    setIsSubmitting(true)
    
    try {
      // Basic YAML validation
      if (!yamlContent.trim()) {
        throw new Error('YAML content cannot be empty')
      }
      
      // Validate YAML syntax
      yaml.load(yamlContent)
      
      await onSubmit(yamlContent)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update deployment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setError(null)
    onOpenChange(false)
  }

  if (!deployment) return null

  const deploymentName = deployment.metadata?.name || 'Unknown'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === 'view' ? 'View' : 'Edit'} Deployment: {deploymentName}
          </DialogTitle>
          <DialogDescription>
            {mode === 'view' 
              ? 'Viewing deployment configuration in YAML format' 
              : 'Edit deployment configuration using YAML'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'view' | 'edit')} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 mt-4 overflow-hidden">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Loading deployment...</div>
              </div>
            ) : (
              <>
                <TabsContent value="view" className="h-full mt-0">
                  <YAMLEditor
                    value={yamlContent}
                    onChange={() => {}}
                    height="100%"
                    readOnly={true}
                  />
                </TabsContent>
                
                <TabsContent value="edit" className="h-full mt-0">
                  <YAMLEditor
                    value={yamlContent}
                    onChange={(value) => setYamlContent(value || '')}
                    height="100%"
                    readOnly={false}
                  />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {mode === 'edit' && onSubmit && (
            <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

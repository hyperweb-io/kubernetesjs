'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle, FileJson } from 'lucide-react'
import { usePreferredNamespace } from '@/contexts/NamespaceContext'

interface Template {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  details: {
    image: string
    ports: number[]
    environment?: { [key: string]: string }
  }
}

interface TemplateDialogProps {
  template: Template
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TemplateDialog({ template, open, onOpenChange }: TemplateDialogProps) {
  const { namespace: contextNamespace } = usePreferredNamespace()

  // Deploy template function using new API
  const deployTemplate = async (params: {
    templateId: string
    name: string
    namespace: string
    image: string
    ports: number[]
    environment?: Record<string, string>
  }) => {
    const { templateId, name, namespace, image, ports, environment } = params;

    const response = await fetch(`/api/templates/${templateId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        namespace,
        config: {
          image,
          ports,
          environment,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to deploy template');
    }

    const result = await response.json();
    return result;
  }

  // Force uninstall template function using API
  const forceUninstallTemplate = async (params: {
    templateId: string
    name: string
    namespace: string
  }) => {
    const { templateId, name, namespace } = params;

    const response = await fetch(`/api/templates/${templateId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        namespace,
        force: true,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to uninstall template';
      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  }
  const [deploymentName, setDeploymentName] = useState(template.id)
  const [namespace, setNamespace] = useState(contextNamespace === '_all' ? 'default' : contextNamespace)
  const [isDeploying, setIsDeploying] = useState(false)
  const [isUninstalling, setIsUninstalling] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Prevent double deploy/uninstall clicks
  const isDeployingRef = useRef(false)
  const isUninstallingRef = useRef(false)

  // Reset form state when dialog opens or template changes
  useEffect(() => {
    if (open) {
      setDeploymentName(`${template.id}-deployment`)
      setNamespace(contextNamespace === '_all' ? 'default' : contextNamespace)
      setDeploymentStatus('idle')
      setSuccessMessage('')
      setErrorMessage('')
    }
  }, [open, template.id])

  const handleDeploy = async () => {
    console.log(`[TemplateDialog] ${template.id} - Deploy button clicked`)
    if (isDeployingRef.current || isUninstallingRef.current) {
      console.log(`[TemplateDialog] ${template.id} - Another operation in progress, ignoring click`)
      return
    }
    isDeployingRef.current = true
    setIsDeploying(true)
    setDeploymentStatus('idle')
    setSuccessMessage('')
    setErrorMessage('')

    try {
      console.log(`[TemplateDialog] ${template.id} - Starting deployment with params:`, {
        templateId: template.id,
        name: deploymentName,
        namespace,
        image: template.details.image,
        ports: template.details.ports,
        environment: template.details.environment
      })
      
      await deployTemplate({
        templateId: template.id,
        name: deploymentName,
        namespace,
        image: template.details.image,
        ports: template.details.ports,
        environment: template.details.environment
      })
      
      console.log(`[TemplateDialog] ${template.id} - Deployment successful`)
      setDeploymentStatus('success')
      setSuccessMessage(`${template.name} deployed successfully!`)
      setTimeout(() => {
        onOpenChange(false)
        setDeploymentStatus('idle')
        setDeploymentName(`${template.id}-deployment`)
        setSuccessMessage('')
      }, 2000)
    } catch (error) {
      console.error(`[TemplateDialog] ${template.id} - Deployment failed:`, error)
      setDeploymentStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to deploy template')
    } finally {
      setIsDeploying(false)
      isDeployingRef.current = false
    }
  }

  const handleForceUninstall = async () => {
    console.log(`[TemplateDialog] ${template.id} - Force Uninstall button clicked`)
    if (isUninstallingRef.current || isDeployingRef.current) {
      console.log(`[TemplateDialog] ${template.id} - Another operation in progress, ignoring click`)
      return
    }
    isUninstallingRef.current = true
    setIsUninstalling(true)
    setDeploymentStatus('idle')
    setSuccessMessage('')
    setErrorMessage('')

    try {
      console.log(`[TemplateDialog] ${template.id} - Starting force uninstall with params:`, {
        templateId: template.id,
        name: deploymentName,
        namespace,
      })

      await forceUninstallTemplate({
        templateId: template.id,
        name: deploymentName,
        namespace,
      })

      console.log(`[TemplateDialog] ${template.id} - Force uninstall successful`)
      setDeploymentStatus('success')
      setSuccessMessage(`${template.name} force uninstalled successfully!`)
      setTimeout(() => {
        onOpenChange(false)
        setDeploymentStatus('idle')
        setDeploymentName(`${template.id}-deployment`)
        setSuccessMessage('')
      }, 2000)
    } catch (error) {
      console.error(`[TemplateDialog] ${template.id} - Force uninstall failed:`, error)
      setDeploymentStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to uninstall template')
    } finally {
      setIsUninstalling(false)
      isUninstallingRef.current = false
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Deploy {template.name}</DialogTitle>
          <DialogDescription>
            Configure and deploy the {template.name} template to your Kubernetes cluster.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={deploymentName}
              onChange={(e) => setDeploymentName(e.target.value)}
              className="col-span-3"
              disabled={true}
              readOnly={true}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="namespace" className="text-right">
              Namespace
            </Label>
            <Input
              id="namespace"
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
              className="col-span-3"
              disabled={isDeploying}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">Details</Label>
            <div className="col-span-3 space-y-2 text-sm">
              <div>
                <span className="font-medium">Image:</span>
                <span className="ml-2 text-muted-foreground">{template.details.image}</span>
              </div>
              <div>
                <span className="font-medium">Exposed Ports:</span>
                <span className="ml-2 text-muted-foreground">{template.details.ports.join(', ')}</span>
              </div>
              {template.details.environment && (
                <div>
                  <span className="font-medium">Environment:</span>
                  <ul className="mt-1 ml-4 text-muted-foreground">
                    {Object.entries(template.details.environment).map(([key, value]) => (
                      <li key={key}>
                        {key}: {key.includes('PASSWORD') ? '••••••••' : value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {deploymentStatus === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage || `${template.name} deployed successfully!`}
              </AlertDescription>
            </Alert>
          )}

          {deploymentStatus === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeploying || isUninstalling}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleForceUninstall}
            variant="destructive"
            disabled={isDeploying || isUninstalling || !deploymentName || !namespace}
          >
            {isUninstalling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUninstalling ? 'Force Uninstalling...' : 'Force Uninstall'}
          </Button>
          <Button
            type="button"
            onClick={handleDeploy}
            disabled={isDeploying || isUninstalling || !deploymentName || !namespace}
          >
            {isDeploying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeploying ? 'Deploying...' : 'Deploy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
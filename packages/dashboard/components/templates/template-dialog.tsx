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
import { type Deployment, type Service } from 'kubernetesjs'
import { useCreateAppsV1NamespacedDeployment, useCreateCoreV1NamespacedService } from '../../k8s'
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
  const { mutateAsync: createDeployment } = useCreateAppsV1NamespacedDeployment()
  const { mutateAsync: createService } = useCreateCoreV1NamespacedService()
  const { namespace: contextNamespace } = usePreferredNamespace()

  // Deploy template function
  const deployTemplate = async (params: {
    templateId: string
    name: string
    namespace: string
    image: string
    ports: number[]
    environment?: Record<string, string>
  }) => {
    const { templateId, name, namespace, image, ports, environment } = params;

    // Create deployment configuration
    const deployment: Deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: name,
        namespace: namespace,
        labels: {
          app: templateId,
          'deployed-by': 'k8s-dashboard'
        }
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: {
            app: templateId
          }
        },
        template: {
          metadata: {
            labels: {
              app: templateId
            }
          },
          spec: {
            containers: [{
              name: templateId,
              image: image,
              ports: ports.map(port => ({ containerPort: port, name: `port-${port}` })),
              env: environment ? Object.entries(environment).map(([key, value]) => ({ name: key, value })) : undefined
            }]
          }
        }
      }
    }

    // Handle specific args for minio
    if (templateId === 'minio') {
      deployment.spec!.template.spec!.containers[0].args = ['server', '/data']
    }

    // Create service configuration
    const service: Service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: `${name}-service`,
        namespace: namespace,
        labels: {
          app: templateId,
          'deployed-by': 'k8s-dashboard'
        }
      },
      spec: {
        selector: {
          app: templateId
        },
        ports: ports.map(port => ({
          port: port,
          targetPort: `port-${port}`,
          name: `port-${port}`
        })),
        type: 'ClusterIP'
      }
    }

    // Create deployment first using typed client
    await createDeployment({
      path: { namespace },
      query: {},
      body: deployment,
    })

    // Then create service using typed client
    await createService({
      path: { namespace },
      query: {},
      body: service,
    })

    return {
      deployment: name,
      service: `${name}-service`,
      namespace: namespace
    }
  }
  const [deploymentName, setDeploymentName] = useState(`${template.id}-deployment`)
  const [namespace, setNamespace] = useState(contextNamespace === '_all' ? 'default' : contextNamespace)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Prevent double deploy clicks
  const isDeployingRef = useRef(false)

  // Reset form state when dialog opens or template changes
  useEffect(() => {
    if (open) {
      setDeploymentName(`${template.id}-deployment`)
      setNamespace(contextNamespace === '_all' ? 'default' : contextNamespace)
      setDeploymentStatus('idle')
      setErrorMessage('')
    }
  }, [open, template.id])

  const handleDeploy = async () => {
    if (isDeployingRef.current) return
    isDeployingRef.current = true
    setIsDeploying(true)
    setDeploymentStatus('idle')
    setErrorMessage('')

    try {
      await deployTemplate({
        templateId: template.id,
        name: deploymentName,
        namespace,
        image: template.details.image,
        ports: template.details.ports,
        environment: template.details.environment
      })
      
      setDeploymentStatus('success')
      setTimeout(() => {
        onOpenChange(false)
        setDeploymentStatus('idle')
        setDeploymentName(`${template.id}-deployment`)
      }, 2000)
    } catch (error) {
      setDeploymentStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to deploy template')
    } finally {
      setIsDeploying(false)
      isDeployingRef.current = false
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
              disabled={isDeploying}
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
                {template.name} deployed successfully!
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
            disabled={isDeploying}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDeploy}
            disabled={isDeploying || !deploymentName || !namespace}
          >
            {isDeploying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeploying ? 'Deploying...' : 'Deploy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Loader2, Settings, ExternalLink, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusIndicator } from './status-indicator'
import { TemplateDialog } from '@/components/templates/template-dialog'
import { useTemplateInstalled } from '@/hooks/use-templates'
import type { Template } from '@/components/templates/templates'

type TemplateStatus = 'all' | 'installed' | 'not-installed' | 'installing' | 'error'

interface TemplateCardProps {
  template: Template
  onStatusChange?: (templateId: string, status: TemplateStatus) => void
}

export function TemplateCard({ template, onStatusChange }: TemplateCardProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const { isInstalled, isLoading, status, refetch, namespace } = useTemplateInstalled(template.id)

  // Notify parent component of status changes
  useEffect(() => {
    if (onStatusChange && status) {
      onStatusChange(template.id, status)
    }
  }, [status, template.id]) // Remove onStatusChange from dependencies to prevent infinite loop

  const handleToggle = async (checked: boolean) => {
    console.log(`[TemplateCard] ${template.id} - Toggle clicked:`, { checked, isInstalled, isToggling })
    setIsToggling(true)
    try {
      if (checked && !isInstalled) {
        console.log(`[TemplateCard] ${template.id} - Opening deployment dialog`)
        setShowDialog(true)
      } else if (!checked && isInstalled) {
        console.log(`[TemplateCard] ${template.id} - Starting uninstall`)
        // Handle uninstall using new API with correct deployment name
        const deploymentName = `${template.id}-deployment`
        const response = await fetch(`/api/templates/${template.id}?namespace=${namespace}&name=${deploymentName}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          console.log(`[TemplateCard] ${template.id} - Uninstall successful, refetching status`)
          // Add a delay to allow backend to process the deletion
          // before refetching the status
          await new Promise(resolve => setTimeout(resolve, 1000))
          await refetch()
        } else {
          console.error(`[TemplateCard] ${template.id} - Uninstall failed:`, response.status, response.statusText)
          // Handle error response
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to uninstall template')
        }
      }
    } catch (error) {
      console.error(`[TemplateCard] ${template.id} - Failed to toggle template:`, error)
      // Keep the toggle in loading state a bit longer on error to show something went wrong
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsToggling(false)
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'installed': return 'installed'
      case 'installing': return 'installing'
      case 'not-installed': return 'not-installed'
      default: return 'error'
    }
  }

  // Determine states similar to operator card
  const isInstalling = status === 'installing' || isToggling
  const hasError = false // Templates don't have error state like operators

  const Icon = template?.icon || Database

  return (
    <>
      <Card className={cn(
        'relative transition-all duration-200',
        hasError && 'border-red-200 bg-red-50/50',
        isInstalling && 'border-yellow-200 bg-yellow-50/50'
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription className="text-xs">
                  {template.description}
                </CardDescription>
              </div>
            </div>
            <StatusIndicator status={getStatusText()} />
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-sm text-gray-600 line-clamp-3">
            {template.description}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-3">
            {isInstalling ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-600">
                  {status === 'installing' ? 'Installing...' : 'Processing...'}
                </span>
              </div>
            ) : (
              <>
                <Switch
                  checked={isInstalled}
                  onCheckedChange={handleToggle}
                  disabled={isInstalling}
                />
                <span className="text-sm text-gray-600">
                  {isInstalled ? 'Installed' : 'Not installed'}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setShowDialog(true)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <TemplateDialog
        template={template}
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open)
          if (!open) {
            refetch()
          }
        }}
      />
    </>
  )
}
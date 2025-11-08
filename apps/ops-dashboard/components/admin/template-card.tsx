'use client';

import { Database, Loader2, Settings } from 'lucide-react';
import { useEffect,useState } from 'react';

import { TemplateDialog } from '@/components/templates/template-dialog';
import type { Template } from '@/components/templates/templates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Switch } from '@/components/ui/switch';
import { useTemplateInstalled } from '@/hooks/use-templates';
import { cn } from '@/lib/utils';

import { StatusIndicator } from './status-indicator';

type TemplateStatus = 'all' | 'installed' | 'not-installed' | 'installing' | 'error'

interface TemplateCardProps {
  template: Template
  onStatusChange?: (templateId: string, status: TemplateStatus) => void
}

export function TemplateCard({ template, onStatusChange }: TemplateCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { isInstalled, isLoading, status, refetch, namespace } = useTemplateInstalled(template.id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'install' | 'uninstall' | null>(null);

  // Notify parent component of status changes
  useEffect(() => {
    if (onStatusChange && status) {
      onStatusChange(template.id, status);
    }
  }, [status, template.id]); // Remove onStatusChange from dependencies to prevent infinite loop

  const handleToggle = async (checked: boolean) => {
    console.log(`[TemplateCard] ${template.id} - Toggle clicked:`, { checked, isInstalled, isToggling });
    if (isToggling) return;
    // Removed pendingChecked to avoid unused variable

    if (checked && !isInstalled) {
      // Ask for confirmation before opening deployment dialog
      setConfirmAction('install');
      setConfirmOpen(true);
    } else if (!checked && isInstalled) {
      // Ask for confirmation before uninstalling
      setConfirmAction('uninstall');
      setConfirmOpen(true);
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction === 'install') {
        // Show a brief processing state and then open the setup dialog
        setIsToggling(true);
        setShowDialog(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsToggling(false);
      } else if (confirmAction === 'uninstall' && isInstalled) {
        setIsToggling(true);
        console.log(`[TemplateCard] ${template.id} - Starting uninstall`);
        const deploymentName = `${template.id}-deployment`;
        const response = await fetch(`/api/templates/${template.id}?namespace=${namespace}&name=${deploymentName}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          console.log(`[TemplateCard] ${template.id} - Uninstall successful, refetching status`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          await refetch();
        } else {
          console.error(`[TemplateCard] ${template.id} - Uninstall failed:`, response.status, response.statusText);
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to uninstall template');
        }
      }
    } catch (error) {
      console.error(`[TemplateCard] ${template.id} - Confirmation action failed:`, error);
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setConfirmOpen(false);
      setConfirmAction(null);
      setIsToggling(false);
    }
  };

  const getStatusText = () => {
    switch (status) {
    case 'installed': return 'installed';
    case 'installing': return 'installing';
    case 'not-installed': return 'not-installed';
    default: return 'error';
    }
  };

  // Determine states similar to operator card
  const isInstalling = status === 'installing' || isToggling;
  const hasError = false; // Templates don't have error state like operators

  const Icon = template?.icon || Database;

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
          setShowDialog(open);
          if (!open) {
            refetch();
          }
        }}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={confirmAction === 'uninstall' ? `Uninstall ${template.name}?` : `Install ${template.name}?`}
        description={confirmAction === 'uninstall' ? 'This will remove the deployment and its resources. You can reinstall later.' : 'We will open the setup dialog to configure deployment options.'}
        confirmText={confirmAction === 'uninstall' ? 'Uninstall' : 'Continue'}
        confirmVariant={confirmAction === 'uninstall' ? 'destructive' : 'default'}
        onConfirm={handleConfirm}
      />
    </>
  );
}
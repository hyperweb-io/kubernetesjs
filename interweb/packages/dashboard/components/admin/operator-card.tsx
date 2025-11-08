'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';


import { Settings, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusIndicator } from './status-indicator';
import { Switch } from '@/components/ui/switch'
import type { OperatorInfo } from '@interweb/client';
import { useOperatorMutation } from '@/hooks/use-operators';
import { Button } from '@/components/ui/button';

interface OperatorCardProps {
  operator: OperatorInfo;
  compact?: boolean;
}

// Operator icons mapping
const operatorIcons: Record<string, string> = {
  'ingress-nginx': '🌐',
  'cert-manager': '🔒',
  'knative-serving': '⚡',
  'cloudnative-pg': '🐘',
  'kube-prometheus-stack': '📊',
  'minio-operator': '🪣',
};

export function OperatorCard({ operator, compact = false }: OperatorCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const { installOperator, uninstallOperator } = useOperatorMutation();

  const handleToggle = async (checked: boolean) => {
    setIsToggling(true);
    try {
      if (checked) {
        await installOperator.mutateAsync(operator.name);
      } else {
        await uninstallOperator.mutateAsync(operator.name);
      }
    } catch (error) {
      console.error('Failed to toggle operator:', error);
      // TODO: Show error toast
    } finally {
      setIsToggling(false);
    }
  };

  // Treat installing as 'on' to reflect intent immediately
  const isInstalled = operator.status !== 'not-installed';
  const isInstalling = operator.status === 'installing' || isToggling;
  const hasError = operator.status === 'error';

  if (compact) {
    return (
      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {operatorIcons[operator.name] || '📦'}
            </div>
            <div>
              <div className="font-medium text-sm">{operator.displayName}</div>
              <div className="text-xs text-gray-500">v{operator.version}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <StatusIndicator status={operator.status} />
            {isInstalling ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            ) : (
              <Switch
                checked={isInstalled}
                onCheckedChange={handleToggle}
                disabled={isInstalling}
                size="sm"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn(
      'relative transition-all duration-200',
      hasError && 'border-red-200 bg-red-50/50',
      isInstalling && 'border-yellow-200 bg-yellow-50/50'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {operatorIcons[operator.name] || '📦'}
            </div>
            <div>
              <CardTitle className="text-base">{operator.displayName}</CardTitle>
              <CardDescription className="text-xs">
                v{operator.version}
              </CardDescription>
            </div>
          </div>
          <StatusIndicator status={operator.status} />
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-gray-600 line-clamp-3">
          {operator.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-3">
          {isInstalling ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              <span className="text-sm text-gray-600">
                {operator.status === 'installing' ? 'Installing...' : 'Processing...'}
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
          {isInstalled && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/operators/${operator.name}`}>
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
          )}
          {operator.docsUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={operator.docsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

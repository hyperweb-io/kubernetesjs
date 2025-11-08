import { AlertCircle, CheckCircle, Circle,Clock, XCircle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface StatusIndicatorProps {
  status: 'ready' | 'installed' | 'creating' | 'installing' | 'pending' | 'error' | 'not-installed' | 'unknown';
  className?: string;
  showText?: boolean;
}

const statusConfig = {
  ready: {
    icon: CheckCircle,
    className: 'text-green-600',
    text: 'Ready',
  },
  installed: {
    icon: CheckCircle,
    className: 'text-green-600',
    text: 'Installed',
  },
  creating: {
    icon: Clock,
    className: 'text-yellow-600 animate-pulse',
    text: 'Creating',
  },
  installing: {
    icon: Clock,
    className: 'text-yellow-600 animate-pulse',
    text: 'Installing',
  },
  pending: {
    icon: Clock,
    className: 'text-yellow-600',
    text: 'Pending',
  },
  error: {
    icon: XCircle,
    className: 'text-red-600',
    text: 'Error',
  },
  'not-installed': {
    icon: Circle,
    className: 'text-gray-400',
    text: 'Not Installed',
  },
  unknown: {
    icon: AlertCircle,
    className: 'text-gray-400',
    text: 'Unknown',
  },
};

export function StatusIndicator({ status, className, showText = false }: StatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <Icon className={cn('h-4 w-4', config.className)} />
      {showText && (
        <span className={cn('text-sm font-medium', config.className)}>
          {config.text}
        </span>
      )}
    </div>
  );
}

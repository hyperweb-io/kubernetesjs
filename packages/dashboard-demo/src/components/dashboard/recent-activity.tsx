'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRelativeTime } from '@/lib/utils';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

// Mock data for now - in a real implementation, this would come from Kubernetes events
const mockActivities = [
  {
    id: '1',
    type: 'deployment',
    message: 'CloudNativePG operator installed successfully',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'success',
  },
  {
    id: '2',
    type: 'database',
    message: 'PostgreSQL cluster "main-db" created',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'success',
  },
  {
    id: '3',
    type: 'operator',
    message: 'cert-manager operator installation in progress',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'pending',
  },
  {
    id: '4',
    type: 'secret',
    message: 'Database credentials secret created',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'success',
  },
  {
    id: '5',
    type: 'error',
    message: 'Failed to scale deployment "api-server"',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    status: 'error',
  },
];

const statusIcons = {
  success: CheckCircle,
  pending: Clock,
  error: XCircle,
  warning: AlertCircle,
};

const statusColors = {
  success: 'text-green-600',
  pending: 'text-yellow-600',
  error: 'text-red-600',
  warning: 'text-orange-600',
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => {
            const Icon = statusIcons[activity.status as keyof typeof statusIcons];
            const iconColor = statusColors[activity.status as keyof typeof statusColors];
            
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`mt-0.5 ${iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-primary hover:text-primary/80 font-medium">
            View all activity
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

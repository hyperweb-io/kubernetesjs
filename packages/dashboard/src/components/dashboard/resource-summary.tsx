'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClusterStatus } from '@/hooks/use-cluster-status';

export function ResourceSummary() {
  const { data: cluster, isLoading } = useClusterStatus();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resource Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const resourceTypes = [
    {
      name: 'CPU Usage',
      value: '2.4 / 8.0 cores',
      percentage: 30,
      color: 'bg-blue-500',
    },
    {
      name: 'Memory Usage',
      value: '4.2 / 16 GB',
      percentage: 26,
      color: 'bg-green-500',
    },
    {
      name: 'Storage Usage',
      value: '45 / 100 GB',
      percentage: 45,
      color: 'bg-purple-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {resourceTypes.map((resource) => (
          <div key={resource.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{resource.name}</span>
              <span className="text-gray-600">{resource.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${resource.color}`}
                style={{ width: `${resource.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

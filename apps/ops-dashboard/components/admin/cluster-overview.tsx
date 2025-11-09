'use client';

import { RefreshCw } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClusterStatus } from '@/hooks/use-cluster-status';

import { StatusIndicator } from './status-indicator';

export function ClusterOverview() {
  const { data: cluster, isLoading, error } = useClusterStatus();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading cluster status...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-2">Failed to load cluster status</p>
            <p className="text-sm text-gray-500">
              Make sure kubectl proxy is running on port 8001
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Cluster Status
          <StatusIndicator 
            status={cluster?.healthy ? 'ready' : 'error'} 
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {cluster?.nodeCount || 0}
            </div>
            <div className="text-sm text-gray-500">Nodes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {cluster?.podCount || 0}
            </div>
            <div className="text-sm text-gray-500">Pods</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {cluster?.serviceCount || 0}
            </div>
            <div className="text-sm text-gray-500">Services</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {cluster?.operatorCount || 0}
            </div>
            <div className="text-sm text-gray-500">Operators</div>
          </div>
        </div>

        {cluster?.nodes && cluster.nodes.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Nodes</h4>
            <div className="space-y-2">
              {cluster.nodes.map((node) => (
                <div key={node.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <StatusIndicator 
                      status={node.status === 'Ready' ? 'ready' : 'error'} 
                    />
                    <span className="font-medium">{node.name}</span>
                    {node.roles.length > 0 && (
                      <span className="text-gray-500">
                        ({node.roles.join(', ')})
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500">{node.version}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

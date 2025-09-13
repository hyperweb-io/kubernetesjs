'use client';

import { Menu, RefreshCw, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClusterStatus } from '@/hooks/use-cluster-status';
import { cn } from '@/lib/utils';

export function Header() {
  const { data: cluster, isLoading, refetch } = useClusterStatus();

  return (
    <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
      <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
        {/* Mobile menu button */}
        <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          {/* Cluster status */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${
                cluster?.healthy ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-gray-700">
                {isLoading ? 'Loading...' : cluster?.healthy ? 'Cluster Healthy' : 'Cluster Issues'}
              </span>
            </div>
            
            {cluster && (
              <div className="text-sm text-gray-500">
                {cluster.nodeCount} nodes • {cluster.podCount} pods • v{cluster.version}
              </div>
            )}
          </div>

          <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
            {/* Refresh button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700"
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            </Button>

            {/* Notifications (placeholder) */}
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              <Bell className="h-4 w-4" />
            </Button>

            {/* Profile dropdown (placeholder) */}
            <div className="flex items-center gap-x-1">
              <div className="h-8 w-8 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

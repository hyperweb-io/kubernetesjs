'use client';

import { ClusterOverview } from '@/components/dashboard/cluster-overview';
import { OperatorGrid } from '@/components/dashboard/operator-grid';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { ResourceSummary } from '@/components/dashboard/resource-summary';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Monitor your Kubernetes cluster and deployed operators</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-secondary">
            Refresh
          </button>
        </div>
      </div>

      {/* Cluster Status Overview */}
      <ClusterOverview />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OperatorGrid />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceSummary />
        <RecentActivity />
      </div>
    </div>
  );
}

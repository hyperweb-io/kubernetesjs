import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ClusterOverview } from '@/components/dashboard/cluster-overview';

export default function Home() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <ClusterOverview />
    </div>
  );
}

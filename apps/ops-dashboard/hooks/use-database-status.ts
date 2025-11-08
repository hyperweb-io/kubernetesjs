import { useQuery } from '@tanstack/react-query';

export interface DatabaseInstanceRow {
  name: string;
  role: 'Primary' | 'Replica' | 'Unknown';
  status: 'OK' | 'NotReady' | 'Unknown';
  qosClass?: string;
  node?: string;
  startTime?: string;
  ready?: string;      // e.g. 1/1
  restarts?: number;
}

export interface DatabaseStatusSummary {
  name: string;              // namespace/name
  namespace: string;
  cluster: string;
  image?: string;
  phase?: string;
  primary?: string;          // pod name
  primaryStartTime?: string; // RFC3339
  instances: number;
  readyInstances: number;
  systemID?: string;
  services: { rw: string; ro: string; poolerRw?: string };
  backups: { configured: boolean; scheduledCount: number; lastBackupTime?: string };
  streaming: { configured: boolean; replicas: number };
  instancesTable: DatabaseInstanceRow[];
}

export function useDatabaseStatus(namespace: string, name: string) {
  return useQuery<DatabaseStatusSummary>({
    queryKey: ['db-status', namespace, name],
    queryFn: async () => {
      const res = await fetch(`/api/databases/${namespace}/${name}/status`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch database status');
      return res.json();
    },
    refetchInterval: 15000,
  });
}

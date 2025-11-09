import { SetupClient } from '@kubernetesjs/client';
import { PostgresDeployer } from '@kubernetesjs/client';
import { InterwebClient as InterwebKubernetesClient } from '@kubernetesjs/ops';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function buildBackupCR(ns: string, name: string, method?: 'barmanObjectStore'|'volumeSnapshot'|'plugin', backupName?: string) {
  const cr: any = {
    apiVersion: 'postgresql.cnpg.io/v1',
    kind: 'Backup',
    metadata: { name: backupName || `${name}-backup-${Date.now()}`, namespace: ns },
    spec: { cluster: { name } },
  };
  if (method) (cr.spec as any).method = method;
  return cr;
}

function buildScheduledBackupCR(ns: string, name: string, schedule: string, method?: 'barmanObjectStore'|'volumeSnapshot'|'plugin', sbName?: string) {
  const cr: any = {
    apiVersion: 'postgresql.cnpg.io/v1',
    kind: 'ScheduledBackup',
    metadata: { name: sbName || `${name}-scheduled-backup`, namespace: ns },
    spec: { cluster: { name }, schedule },
  };
  if (method) (cr.spec as any).method = method;
  return cr;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ namespace: string; name: string }> }
) {
  const restEndpoint = process.env.KUBERNETES_PROXY_URL || 'http://127.0.0.1:8001';
  const kube = new InterwebKubernetesClient({ restEndpoint } as any);
  const setup = new SetupClient(kube as any);
  const pg = new PostgresDeployer(kube as any, setup as any);
  const { namespace: ns, name } = await params;
  try {
    const [cluster, backups, sbacks, snapApi]: any = await Promise.all([
      (kube as any).readPostgresqlCnpgIoV1NamespacedCluster({ path: { namespace: ns, name } }),
      (kube as any).listPostgresqlCnpgIoV1NamespacedBackup({ path: { namespace: ns } }).catch(() => ({ items: [] })),
      kube.get(`/apis/postgresql.cnpg.io/v1/namespaces/${ns}/scheduledbackups`).catch(() => ({ items: [] })),
      kube.get(`/apis/snapshot.storage.k8s.io/v1`).catch(() => null),
    ]);
    const configured = Boolean(cluster?.spec?.backup);
    const methodConfigured = cluster?.spec?.backup?.barmanObjectStore ? 'barmanObjectStore' : cluster?.spec?.backup?.volumeSnapshot ? 'volumeSnapshot' : undefined;
    const snapshotSupported = Boolean(snapApi);
    const list = (backups?.items || []).filter((b: any) => b?.spec?.cluster?.name === name).map((b: any) => ({
      name: b?.metadata?.name,
      phase: b?.status?.phase,
      startedAt: b?.status?.startedAt || b?.metadata?.creationTimestamp,
      completedAt: b?.status?.completedAt,
      method: b?.spec?.method,
    }));
    const scheduled = (sbacks?.items || []).filter((b: any) => b?.spec?.cluster?.name === name).map((b: any) => ({
      name: b?.metadata?.name,
      schedule: b?.spec?.schedule,
      suspended: b?.spec?.suspend === true,
      lastScheduleTime: b?.status?.lastScheduleTime,
      lastSuccessTime: b?.status?.lastSuccessTime,
      method: b?.spec?.method,
    }));
    return NextResponse.json({ configured, methodConfigured: methodConfigured || null, snapshotSupported, backups: list, scheduled });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to list backups', message: String(error?.message || error) }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ namespace: string; name: string }> }
) {
  const restEndpoint = process.env.KUBERNETES_PROXY_URL || 'http://127.0.0.1:8001';
  const kube = new InterwebKubernetesClient({ restEndpoint } as any);
  const setup = new SetupClient(kube as any);
  const pg = new PostgresDeployer(kube as any, setup as any);
  const { namespace: ns, name } = await params;
  try {
    const body = await req.json().catch(() => ({}));
    const type = body?.type as 'onDemand' | 'scheduled' | undefined;
    let method = body?.method as 'barmanObjectStore'|'volumeSnapshot'|'plugin'|undefined;
    if (!type) return NextResponse.json({ error: 'Missing type' }, { status: 400 });

    if (type === 'onDemand') {
      // Auto-select method if none provided
      if (!method) {
        const cluster: any = await (kube as any).readPostgresqlCnpgIoV1NamespacedCluster({ path: { namespace: ns, name } }).catch(() => null);
        const hasBarman = Boolean(cluster?.spec?.backup?.barmanObjectStore);
        if (hasBarman) {
          method = 'barmanObjectStore';
        } else {
          // try snapshot API presence
          const snapApi = await kube.get(`/apis/snapshot.storage.k8s.io/v1`).catch(() => null);
          if (snapApi) method = 'volumeSnapshot';
        }
      }
      if (!method) {
        return NextResponse.json({ error: 'Backups not configured. Configure spec.backup.barmanObjectStore on the Cluster, or install VolumeSnapshot CRDs and a snapshot-capable CSI driver.' }, { status: 400 });
      }
      const created = await pg.createBackup({ namespace: ns, clusterName: name, method, name: body?.name });
      return NextResponse.json({ success: true, created });
    }
    if (type === 'scheduled') {
      const schedule = body?.schedule as string | undefined;
      if (!schedule) return NextResponse.json({ error: 'Missing schedule' }, { status: 400 });
      const cr = buildScheduledBackupCR(ns, name, schedule, method, body?.name);
      const created = await kube.post(`/apis/postgresql.cnpg.io/v1/namespaces/${ns}/scheduledbackups`, undefined, cr as any);
      return NextResponse.json({ success: true, created });
    }
    return NextResponse.json({ error: 'Unsupported type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create backup resource', message: String(error?.message || error) }, { status: 500 });
  }
}

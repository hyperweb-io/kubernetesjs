import { NextResponse } from 'next/server';
import { InterwebClient as InterwebKubernetesClient } from '@kubernetesjs/ops';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ namespace: string; name: string }> }
) {
  const restEndpoint = process.env.KUBERNETES_PROXY_URL || 'http://127.0.0.1:8001';
  const kube = new InterwebKubernetesClient({ restEndpoint } as any);
  const { namespace: ns, name } = await params;

  try {
    // Cluster CR
    let cluster: any;
    try {
      cluster = await kube.get(`/apis/postgresql.cnpg.io/v1/namespaces/${ns}/clusters/${name}`);
    } catch (err: any) {
      const msg = String(err?.message || err);
      if (/status:\s*404/.test(msg) || /not found/i.test(msg)) {
        // Graceful not-found: report no database instead of 500
        return NextResponse.json({ notFound: true, name: `${ns}/${name}`, namespace: ns, cluster: name }, { headers: { 'Cache-Control': 'no-store' } });
      }
      throw err;
    }
    const phase = cluster?.status?.phase as string | undefined;
    const image = cluster?.spec?.imageName as string | undefined;
    const instances = Number(cluster?.spec?.instances ?? 0);
    const readyInstances = Number(cluster?.status?.readyInstances ?? 0);
    const primary = cluster?.status?.currentPrimary as string | undefined;
    const systemID = cluster?.status?.systemID as string | undefined;

    // Primary pod start time
    let primaryStartTime: string | undefined;
    if (primary) {
      try {
        const pod: any = await kube.readCoreV1NamespacedPod({ path: { namespace: ns, name: primary }, query: {} as any });
        primaryStartTime = pod?.status?.startTime;
      } catch {}
    }

    // Instance pods table
    const podsCluster: any = await kube.listCoreV1NamespacedPod({ path: { namespace: ns }, query: { labelSelector: `cnpg.io/cluster=${name}` } as any });
    const seen = new Set<string>();
    const items: any[] = [];
    for (const p of (podsCluster?.items || [])) {
      const key = p?.metadata?.name;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      items.push(p);
    }
    const instancesTable = items.map((p) => {
      const csts: any[] = p?.status?.containerStatuses || [];
      const ready = `${csts.filter((c: any) => c.ready).length}/${csts.length || 1}`;
      const restarts = csts.reduce((acc: number, c: any) => acc + Number(c?.restartCount || 0), 0);
      const roleLbl = p?.metadata?.labels?.['cnpg.io/instanceRole'];
      const role: any = roleLbl === 'primary' ? 'Primary' : roleLbl ? 'Replica' : 'Unknown';
      return {
        name: p?.metadata?.name,
        role,
        status: csts.every((c: any) => c.ready) ? 'OK' : 'NotReady',
        qosClass: p?.status?.qosClass,
        node: p?.spec?.nodeName,
        startTime: p?.status?.startTime,
        ready,
        restarts,
      };
    });

    // Services
    const services = {
      rw: `${name}-rw.${ns}.svc.cluster.local`,
      ro: `${name}-ro.${ns}.svc.cluster.local`,
    } as { rw: string; ro: string; poolerRw?: string };

    // Detect pooler rw service by label selector
    try {
      const pPods: any = await kube.listCoreV1NamespacedPod({ path: { namespace: ns }, query: { labelSelector: `cnpg.io/poolerName` } as any });
      const poolerName = pPods?.items?.[0]?.metadata?.labels?.['cnpg.io/poolerName'];
      if (poolerName) services.poolerRw = `${poolerName}-rw.${ns}.svc.cluster.local`;
    } catch {}

    // Backups and schedules
    let scheduledCount = 0; let lastBackupTime: string | undefined;
    try {
      const sbacks: any = await kube.get(`/apis/postgresql.cnpg.io/v1/namespaces/${ns}/scheduledbackups`);
      scheduledCount = (sbacks?.items || []).filter((b: any) => b?.spec?.cluster?.name === name).length;
    } catch {}
    try {
      const backs: any = await kube.get(`/apis/postgresql.cnpg.io/v1/namespaces/${ns}/backups`);
      const related = (backs?.items || []).filter((b: any) => b?.spec?.cluster?.name === name);
      lastBackupTime = related.map((b: any) => b?.status?.lastCompletionTime || b?.status?.completionTime).filter(Boolean).sort().pop();
    } catch {}
    const backups = { configured: scheduledCount > 0, scheduledCount, lastBackupTime };

    // Streaming replication basic heuristic
    const streaming = { configured: instances > 1, replicas: Math.max(instances - 1, 0) };

    const summary = {
      name: `${ns}/${name}`,
      namespace: ns,
      cluster: name,
      image,
      phase,
      primary,
      primaryStartTime,
      instances,
      readyInstances,
      systemID,
      services,
      backups,
      streaming,
      instancesTable,
    };
    return NextResponse.json(summary, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    console.error('[db.status] error', error);
    return NextResponse.json({ error: 'Failed to get database status', message: String(error?.message || error) }, { status: 500 });
  }
}

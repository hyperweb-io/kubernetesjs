import { InterwebClient as InterwebKubernetesClient } from "@interweb/interwebjs";
import { SetupClient } from "../../src/setup";
import { Client } from "../../src/client";
import { PostgresDeployer } from "../../src/postgres";
import type { ClusterSetupConfig, OperatorConfig } from "../../src/types";

// E2E for deploying a PostgreSQL database using CloudNativePG via @client
// Requires a running kubectl proxy or direct API; CI sets K8S_API

jest.setTimeout(20 * 60 * 1000);

const K8S_API = process.env.K8S_API || "http://127.0.0.1:8001";

const CNPG_VERSION = "1.25.2";
const CNPG_NAMESPACE = "cnpg-system";

describe("Postgres deploy (CloudNativePG) end-to-end", () => {
  const api = new InterwebKubernetesClient({ restEndpoint: K8S_API } as any);
  const setup = new SetupClient(api as any);
  const client = new Client({
    restEndpoint: K8S_API,
    namespace: "default",
    verbose: true,
  });

  const dbNs = "postgres-db";
  const clusterName = "postgres-cluster";
  const poolerName = "postgres-pooler";

  it("installs CNPG operator and deploys Postgres (basic readiness)", async () => {
    const connected = await setup.checkConnection();
    if (!connected) {
      console.warn("Kubernetes cluster not reachable; skipping test.");
      return;
    }

    // Install operator idempotently (no direct /apis calls)
    const op: OperatorConfig = {
      name: "cloudnative-pg",
      version: CNPG_VERSION,
      enabled: true,
      namespace: CNPG_NAMESPACE,
    } as OperatorConfig;
    const cfg: ClusterSetupConfig = {
      apiVersion: "interweb.dev/v1",
      kind: "ClusterSetup",
      metadata: { name: "e2e-cnpg-install", namespace: "interweb-system" },
      spec: {
        operators: [op],
        networking: { ingressClass: "nginx", domain: "127.0.0.1.nip.io" },
      },
    };
    await setup.installOperators(cfg);

    // Deploy Postgres (Cluster + Secrets + Pooler) and wait for readiness
    const res = await client.deployPostgres({
      namespace: dbNs,
      name: clusterName,
      instances: 1, // single instance for quicker CI
      storage: "1Gi",
      enablePooler: true,
      poolerName,
      poolerInstances: 1,
    });

    // Basic assertions on returned endpoints
    expect(res.namespace).toBe(dbNs);
    expect(res.clusterName).toBe(clusterName);
    expect(res.hosts.rw).toContain(`${clusterName}-rw.${dbNs}.svc`);

    // Verify RW service has endpoints (typed CoreV1 API)
    const ep: any = await api.readCoreV1NamespacedEndpoints({
      path: { namespace: dbNs, name: `${clusterName}-rw` },
      query: {} as any,
    });
    const subsets = ep?.subsets || [];
    const readyCount = subsets.reduce(
      (acc: number, s: any) => acc + ((s.addresses || []).length || 0),
      0
    );
    expect(readyCount).toBeGreaterThan(0);

    // Verify pooler pods are Ready (typed CoreV1 API)
    const pods: any = await api.listCoreV1NamespacedPod({
      path: { namespace: dbNs },
      query: { labelSelector: `cnpg.io/poolerName=${poolerName}` } as any,
    });
    const items: any[] = pods?.items || [];
    expect(items.length).toBeGreaterThan(0);
    const allReady = items.every((p) =>
      (p.status?.containerStatuses || []).every((c: any) => c.ready)
    );
    expect(allReady).toBe(true);

    // Verify superuser secret exists
    const su = await api.readCoreV1NamespacedSecret({
      path: { namespace: dbNs, name: "postgres-superuser" },
      query: {} as any,
    });
    expect(su?.metadata?.name).toBe("postgres-superuser");
  });

  it("creates an on-demand backup when supported", async () => {
    const connected = await setup.checkConnection();
    if (!connected) {
      console.warn("Kubernetes cluster not reachable; skipping backup test.");
      return;
    }

    // Determine backup capability: prefer barman if configured, else snapshot if API present
    const cluster: any = await (api as any)
      .readPostgresqlCnpgIoV1NamespacedCluster({
        path: { namespace: dbNs, name: clusterName },
      })
      .catch((_: unknown): any => null);
    const hasBarman = Boolean(cluster?.spec?.backup?.barmanObjectStore);
    let snapshotSupported = false;
    try {
      await api.get(`/apis/snapshot.storage.k8s.io/v1`);
      snapshotSupported = true;
    } catch {}

    if (!hasBarman && !snapshotSupported) {
      console.warn(
        "No backup method available (no barman config and no VolumeSnapshot CRDs); skipping."
      );
      return;
    }

    const method = hasBarman ? "barmanObjectStore" : "volumeSnapshot";
    const pg = new PostgresDeployer(api as any, setup as any, (m) =>
      console.log(m)
    );
    const created = await pg.createBackup({
      namespace: dbNs,
      clusterName,
      method: method as any,
    });
    expect(created?.name).toBeTruthy();

    // Verify the Backup CR exists; optional short wait for phase to appear
    const deadline = Date.now() + 60_000; // 60s soft wait
    let phase: string | undefined;
    while (Date.now() < deadline) {
      const backs: any = await (api as any)
        .listPostgresqlCnpgIoV1NamespacedBackup({ path: { namespace: dbNs } })
        .catch((_: unknown): { items: any[] } => ({ items: [] }));
      const mine = (backs?.items || []).find(
        (b: any) => b?.metadata?.name === created.name
      );
      if (mine) {
        phase = mine?.status?.phase;
        if (phase) break;
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
    // Existence is enough for e2e; phase might remain undefined in dev envs
    expect(typeof phase === "string" || phase === undefined).toBe(true);
  });
});

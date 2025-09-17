import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs';
import { KubernetesResource } from '@interweb/manifests';
import { SetupClient } from './setup';

export type PostgresPoolMode = 'session' | 'transaction' | 'statement';

export interface PostgresDeployOptions {
  name?: string; // Cluster name
  namespace?: string;
  instances?: number;
  storage?: string; // e.g. '10Gi'
  storageClass?: string; // optional
  imageName?: string; // e.g. 'ghcr.io/cloudnative-pg/postgresql:16.4'
  // Credentials (for dev defaults only; change in prod)
  superuserUsername?: string; // defaults to 'postgres'
  superuserPassword?: string; // defaults to 'postgres123!'
  appUsername?: string; // defaults to 'appuser'
  appPassword?: string; // defaults to 'appuser123!'
  // Pooler
  enablePooler?: boolean;
  poolerName?: string;
  poolerInstances?: number;
  poolMode?: PostgresPoolMode; // defaults to 'transaction'
  // Operator webhook namespace (where cnpg-webhook-service lives)
  operatorNamespace?: string; // defaults to 'cnpg-system'
  // Logging/diagnostics
  log?: (msg: string) => void;
}

const defaultOpts: Required<Pick<PostgresDeployOptions,
  'name' | 'namespace' | 'instances' | 'storage' | 'imageName' |
  'superuserUsername' | 'superuserPassword' | 'appUsername' | 'appPassword' |
  'enablePooler' | 'poolerName' | 'poolerInstances' | 'poolMode'
>> = {
  name: 'postgres-cluster',
  namespace: 'postgres-db',
  instances: 3,
  storage: '10Gi',
  imageName: 'ghcr.io/cloudnative-pg/postgresql:16.4',
  superuserUsername: 'postgres',
  superuserPassword: process.env.POSTGRES_SUPERUSER_PASSWORD || 'postgres123!',
  appUsername: 'appuser',
  appPassword: process.env.POSTGRES_APP_PASSWORD || 'appuser123!',
  enablePooler: true,
  poolerName: 'postgres-pooler',
  poolerInstances: 2,
  poolMode: 'transaction',
};

// Warn if default passwords are used
if ((defaultOpts.superuserPassword === 'postgres123!') && typeof defaultOpts.log === 'function') {
  defaultOpts.log('[WARNING] Using default superuser password. Set POSTGRES_SUPERUSER_PASSWORD in environment for production.');
}
if ((defaultOpts.appPassword === 'appuser123!') && typeof defaultOpts.log === 'function') {
  defaultOpts.log('[WARNING] Using default app user password. Set POSTGRES_APP_PASSWORD in environment for production.');
}
function b64(v: string): string {
  return Buffer.from(v, 'utf8').toString('base64');
}

function buildNamespace(ns: string): KubernetesResource {
  return {
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: { name: ns, labels: { 'app.interweb.dev/managed': 'true' } },
  } as any;
}

function buildSecrets(ns: string, suUser: string, suPass: string, appUser: string, appPass: string): KubernetesResource[] {
  const superuser: KubernetesResource = {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name: 'postgres-superuser',
      namespace: ns,
      labels: {
        'app.kubernetes.io/name': 'postgres-superuser',
        'app.kubernetes.io/component': 'database',
        'app.interweb.dev/managed': 'true',
      },
    },
    // Use base64 data to avoid type friction with stringData
    data: {
      username: b64(suUser),
      password: b64(suPass),
    },
  } as any;

  const app: KubernetesResource = {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name: 'postgres-app-user',
      namespace: ns,
      labels: {
        'app.kubernetes.io/name': 'postgres-app-user',
        'app.kubernetes.io/component': 'database',
        'app.interweb.dev/managed': 'true',
      },
    },
    data: {
      username: b64(appUser),
      password: b64(appPass),
    },
  } as any;

  return [superuser, app];
}

function buildCluster(opts: Required<PostgresDeployOptions>): KubernetesResource {
  const ns = opts.namespace!;
  const name = opts.name!;
  const spec: any = {
    instances: opts.instances,
    imageName: opts.imageName,
    superuserSecret: { name: 'postgres-superuser' },
    storage: {
      size: opts.storage,
      ...(opts.storageClass ? { storageClass: opts.storageClass } : {}),
    },
    resources: {
      requests: { memory: '256Mi', cpu: '100m' },
      limits: { memory: '1Gi', cpu: '500m' },
    },
    postgresql: {
      parameters: {
        shared_buffers: '256MB',
        effective_cache_size: '1GB',
        maintenance_work_mem: '64MB',
        checkpoint_completion_target: '0.9',
        wal_buffers: '16MB',
        default_statistics_target: '100',
        random_page_cost: '1.1',
        effective_io_concurrency: '200',
        max_connections: '200',
        password_encryption: 'scram-sha-256',
      },
    },
    monitoring: { enablePodMonitor: false },
    bootstrap: {
      initdb: {
        database: 'postgres',
        owner: opts.superuserUsername,
        dataChecksums: true,
        encoding: 'UTF8',
        localeCollate: 'en_US.UTF-8',
        localeCType: 'en_US.UTF-8',
        postInitSQL: [
          `CREATE USER ${opts.appUsername} WITH PASSWORD '${opts.appPassword}' CREATEDB;`,
          `GRANT CREATE ON DATABASE postgres TO ${opts.appUsername};`,
          'CREATE SCHEMA IF NOT EXISTS public;',
          `GRANT ALL PRIVILEGES ON SCHEMA public TO ${opts.appUsername};`,
        ],
      },
    },
    affinity: {
      enablePodAntiAffinity: true,
      topologyKey: 'kubernetes.io/hostname',
      podAntiAffinityType: 'preferred',
    },
  };

  return {
    apiVersion: 'postgresql.cnpg.io/v1',
    kind: 'Cluster',
    metadata: {
      name,
      namespace: ns,
      labels: {
        'app.kubernetes.io/name': name,
        'app.kubernetes.io/component': 'database',
        'app.interweb.dev/managed': 'true',
      },
    },
    spec,
  } as any;
}

function buildPooler(opts: Required<PostgresDeployOptions>): KubernetesResource {
  const ns = opts.namespace!;
  const poolerName = opts.poolerName!;
  return {
    apiVersion: 'postgresql.cnpg.io/v1',
    kind: 'Pooler',
    metadata: {
      name: poolerName,
      namespace: ns,
      labels: {
        'app.kubernetes.io/name': poolerName,
        'app.kubernetes.io/component': 'connection-pooler',
        'app.interweb.dev/managed': 'true',
      },
    },
    spec: {
      cluster: { name: opts.name },
      instances: opts.poolerInstances,
      type: 'rw',
      pgbouncer: {
        poolMode: opts.poolMode,
        parameters: {
          default_pool_size: '10',
          max_client_conn: '100',
          max_db_connections: '10',
          max_user_connections: '10',
          server_reset_query: 'DISCARD ALL',
          log_connections: '1',
          log_disconnections: '1',
          log_pooler_errors: '1',
          server_idle_timeout: '30',
          client_idle_timeout: '60',
          server_login_retry: '5',
          query_timeout: '30',
          ignore_startup_parameters: 'extra_float_digits',
          application_name_add_host: '1',
        },
      },
      template: {
        metadata: {
          labels: {
            'app.kubernetes.io/name': poolerName,
            'app.kubernetes.io/component': 'connection-pooler',
          },
        },
        spec: {
          containers: [
            {
              name: 'pgbouncer',
              resources: {
                requests: { memory: '64Mi', cpu: '50m' },
                limits: { memory: '256Mi', cpu: '200m' },
              },
            },
          ],
          affinity: {
            podAntiAffinity: {
              preferredDuringSchedulingIgnoredDuringExecution: [
                {
                  weight: 100,
                  podAffinityTerm: {
                    labelSelector: {
                      matchLabels: { 'cnpg.io/poolerName': poolerName },
                    },
                    topologyKey: 'kubernetes.io/hostname',
                  },
                },
              ],
            },
          },
        },
      },
    },
  } as any;
}

export interface DeployResult {
  namespace: string;
  clusterName: string;
  poolerName?: string;
  hosts: {
    rw: string;
    ro: string;
    poolerRw?: string;
  };
}

export class PostgresDeployer {
  private kube: InterwebKubernetesClient;
  private setup: SetupClient;
  private log: (msg: string) => void;

  constructor(kube: InterwebKubernetesClient, setup: SetupClient, log: (msg: string) => void = console.log) {
    this.kube = kube;
    this.setup = setup;
    this.log = log;
  }

  async deploy(options: PostgresDeployOptions = {}): Promise<DeployResult> {
    const opts = { ...defaultOpts, ...options } as Required<PostgresDeployOptions>;
    const ns = opts.namespace;
    const clusterName = opts.name;

    // Ensure CNPG admission webhooks are fully ready before creating CRs
    await this.waitForCnpgWebhooksReady(options.operatorNamespace || 'cnpg-system', 180_000).catch((e) => {
      this.log(`Warning: CNPG webhooks not confirmed ready: ${String(e)}`);
    });

    const resources: KubernetesResource[] = [
      buildNamespace(ns),
      ...buildSecrets(ns, opts.superuserUsername, opts.superuserPassword, opts.appUsername, opts.appPassword),
      buildCluster(opts),
      ...(opts.enablePooler ? [buildPooler(opts)] : []),
    ];

    this.log(`Applying ${resources.length} PostgreSQL manifest(s) to namespace ${ns}...`);
    await this.setup.applyManifests(resources, { continueOnError: false, log: this.log });

    // Wait for cluster ready
    await this.waitForClusterReady(clusterName, ns, 10 * 60 * 1000);
    if (opts.enablePooler) {
      await this.waitForPoolerReady(opts.poolerName, ns, 5 * 60 * 1000);
    }

    const res: DeployResult = {
      namespace: ns,
      clusterName,
      poolerName: opts.enablePooler ? opts.poolerName : undefined,
      hosts: {
        rw: `${clusterName}-rw.${ns}.svc.cluster.local`,
        ro: `${clusterName}-ro.${ns}.svc.cluster.local`,
        poolerRw: opts.enablePooler ? `${opts.poolerName}-rw.${ns}.svc.cluster.local` : undefined,
      },
    };
    return res;
  }

  async waitForClusterReady(name: string, namespace: string, timeoutMs = 600_000, pollMs = 5_000) {
    const start = Date.now();
    this.log(`Waiting for CNPG Cluster ${name} in ${namespace} to be healthy...`);
    while (Date.now() - start < timeoutMs) {
      try {
        const path = `/apis/postgresql.cnpg.io/v1/namespaces/${namespace}/clusters/${name}`;
        const cluster: any = await this.kube.get(path);
        const phase: string = cluster?.status?.phase || '';
        const ready = String(phase).toLowerCase().includes('healthy');
        const instances = cluster?.status?.readyInstances ?? 0;
        const desired = cluster?.spec?.instances ?? 0;
        if (ready && instances >= desired && desired > 0) {
          this.log(`✓ Cluster healthy: ${instances}/${desired} instances ready`);
          return;
        }
        this.log(`... status: "${phase}" (${instances}/${desired} ready)`);
      } catch (err) {
        // ignore 404 until created
      }
      await new Promise((r) => setTimeout(r, pollMs));
    }
    throw new Error(`Timeout waiting for Cluster ${name} in ${namespace} to be healthy`);
  }

  async waitForPoolerReady(name: string, namespace: string, timeoutMs = 300_000, pollMs = 5_000) {
    const start = Date.now();
    this.log(`Waiting for PgBouncer Pooler ${name} in ${namespace} to be ready...`);
    while (Date.now() - start < timeoutMs) {
      try {
        // Check pooler pods readiness by label
        const pods: any = await this.kube.listCoreV1NamespacedPod({
          path: { namespace },
          query: { labelSelector: `cnpg.io/poolerName=${name}` },
        } as any);
        const items: any[] = pods?.items ?? [];
        if (items.length > 0 && items.every(p => (p.status?.containerStatuses || []).every((c: any) => c.ready))) {
          this.log(`✓ Pooler ready with ${items.length} pod(s)`);
          return;
        }
        this.log(`... pooler pods ready: ${items.filter(p => (p.status?.containerStatuses || []).every((c: any) => c.ready)).length}/${items.length}`);
      } catch (err) {
        // ignore and retry
      }
      await new Promise((r) => setTimeout(r, pollMs));
    }
    throw new Error(`Timeout waiting for Pooler ${name} in ${namespace} to be ready`);
  }

  private async waitForCnpgWebhooksReady(namespace: string, timeoutMs = 480_000, pollMs = 3_000) {
    const start = Date.now();
    this.log(`Waiting for CNPG webhook service and CA bundle in namespace ${namespace}...`);
    // 0) Operator deployment available
    while (Date.now() - start < timeoutMs) {
      try {
        const dep: any = await this.kube.readAppsV1NamespacedDeployment({ path: { namespace, name: 'cnpg-controller-manager' } } as any);
        const av = dep?.status?.availableReplicas || 0;
        const desired = dep?.spec?.replicas || 0;
        if (av >= 1) {
          break;
        }
        this.log(`... cnpg-controller-manager availableReplicas ${av}/${desired}`);
      } catch {}
      await new Promise((r) => setTimeout(r, pollMs));
    }

    // 1) Webhook cert secret present (created by operator)
    while (Date.now() - start < timeoutMs) {
      try {
        const sec: any = await this.kube.readCoreV1NamespacedSecret({ path: { namespace, name: 'cnpg-webhook-cert' } } as any);
        const hasCrt = !!sec?.data?.['tls.crt'];
        const hasKey = !!sec?.data?.['tls.key'];
        if (hasCrt && hasKey) break;
      } catch {}
      await new Promise((r) => setTimeout(r, pollMs));
    }

    // 2) Service endpoints present
    while (Date.now() - start < timeoutMs) {
      try {
        const ep = await this.kube.readCoreV1NamespacedEndpoints({ path: { namespace, name: 'cnpg-webhook-service' } } as any);
        const subsets = (ep as any)?.subsets;
        if (Array.isArray(subsets) && subsets.some(s => Array.isArray(s.addresses) && s.addresses.length > 0)) {
          break;
        }
      } catch {}
      await new Promise(r => setTimeout(r, pollMs));
    }

    // 3) CA bundle injected into webhook configurations
    const mwcPath = `/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/cnpg-mutating-webhook-configuration`;
    const vwcPath = `/apis/admissionregistration.k8s.io/v1/validatingwebhookconfigurations/cnpg-validating-webhook-configuration`;
    while (Date.now() - start < timeoutMs) {
      try {
        const [mwc, vwc]: any[] = await Promise.all([
          this.kube.get(mwcPath).catch((): any => null),
          this.kube.get(vwcPath).catch((): any => null),
        ]);
        const mwcReady = Array.isArray(mwc?.webhooks) && mwc.webhooks.length > 0 && mwc.webhooks.every((w: any) => Boolean(w?.clientConfig?.caBundle));
        const vwcReady = Array.isArray(vwc?.webhooks) && vwc.webhooks.length > 0 && vwc.webhooks.every((w: any) => Boolean(w?.clientConfig?.caBundle));
        if (mwcReady && vwcReady) {
          this.log(`✓ CNPG webhooks report CA bundle injected.`);
          return;
        }
      } catch {}
      await new Promise(r => setTimeout(r, pollMs));
    }
    // Fallback: try to inject caBundle from the webhook secret (for CI flakiness)
    try {
      const sec: any = await this.kube.readCoreV1NamespacedSecret({ path: { namespace, name: 'cnpg-webhook-cert' } } as any);
      const ca = (sec?.data?.['ca.crt'] || sec?.data?.['tls.crt']) as string | undefined;
      if (ca) {
        await this.injectCaBundleIntoWebhooks(ca);
        this.log('✓ Injected CNPG webhook caBundle from secret.');
        return; // consider ready after manual injection
      }
    } catch {}

    throw new Error(`Timeout waiting for CNPG webhook CA bundle injection`);
  }

  private async injectCaBundleIntoWebhooks(caBundleB64: string): Promise<void> {
    const mwcPath = `/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/cnpg-mutating-webhook-configuration`;
    const vwcPath = `/apis/admissionregistration.k8s.io/v1/validatingwebhookconfigurations/cnpg-validating-webhook-configuration`;
    const [mwc, vwc]: any[] = await Promise.all([
      this.kube.get(mwcPath).catch((): any => null),
      this.kube.get(vwcPath).catch((): any => null),
    ]);
    if (mwc?.webhooks) {
      mwc.webhooks = mwc.webhooks.map((w: any) => ({
        ...w,
        clientConfig: { ...(w.clientConfig || {}), caBundle: caBundleB64 },
      }));
      await this.kube.put(mwcPath, undefined, mwc as any);
    }
    if (vwc?.webhooks) {
      vwc.webhooks = vwc.webhooks.map((w: any) => ({
        ...w,
        clientConfig: { ...(w.clientConfig || {}), caBundle: caBundleB64 },
      }));
      await this.kube.put(vwcPath, undefined, vwc as any);
    }
  }
}

export function connectionInfo(res: DeployResult, appUser = 'appuser', appPass = 'appuser123!') {
  const { namespace: ns, clusterName, poolerName, hosts } = res;
  return {
    direct: {
      host: hosts.rw,
      port: 5432,
      database: 'postgres',
      user: appUser,
      password: appPass,
      url: `postgresql://${encodeURIComponent(appUser)}:${encodeURIComponent(appPass)}@${hosts.rw}:5432/postgres`,
    },
    pooled: poolerName && hosts.poolerRw ? {
      host: hosts.poolerRw,
      port: 5432,
      database: 'postgres',
      user: appUser,
      password: appPass,
      url: `postgresql://${encodeURIComponent(appUser)}:${encodeURIComponent(appPass)}@${hosts.poolerRw}:5432/postgres`,
    } : undefined,
    notes: 'Change default passwords in production.',
  };
}

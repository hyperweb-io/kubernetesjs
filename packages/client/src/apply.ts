import { InterwebClient as InterwebKubernetesClient, APIResourceList, APIResource } from '@interweb/interwebjs';
import type { KubernetesResource } from '@interweb/manifests';

type GroupVersion = { group: string | null; version: string; key: string };

export interface ApplyOptions {
  defaultNamespace?: string;
  continueOnError?: boolean;
  log?: (msg: string) => void;
}

const isStatus = (err: unknown, code: number): boolean => {
  const msg = String((err as any)?.message ?? '');
  return new RegExp(`status:\\s*${code}`).test(msg);
};

const parseApiVersion = (apiVersion: string): GroupVersion => {
  if (!apiVersion || typeof apiVersion !== 'string') {
    throw new Error(`Invalid apiVersion: ${apiVersion}`);
  }
  if (apiVersion.includes('/')) {
    const [group, version] = apiVersion.split('/');
    return { group, version, key: `${group}/${version}` };
  }
  return { group: null, version: apiVersion, key: `core/${apiVersion}` };
};

export class K8sApplier {
  private client: InterwebKubernetesClient;
  private opts: Required<ApplyOptions>;
  private discovery: Map<string, APIResourceList> = new Map();

  constructor(client: InterwebKubernetesClient, opts: ApplyOptions = {}) {
    this.client = client;
    this.opts = {
      defaultNamespace: opts.defaultNamespace ?? 'default',
      continueOnError: opts.continueOnError ?? true,
      log: opts.log ?? (() => {}),
    };
  }

  async apply(manifest: KubernetesResource | null | undefined): Promise<void> {
    if (!manifest || typeof manifest !== 'object') return;

    if (manifest.kind === 'List' && Array.isArray((manifest as any).items)) {
      for (const item of (manifest as any).items) {
        await this.apply(item);
      }
      return;
    }

    const { apiVersion, kind, metadata } = manifest as any;
    if (!apiVersion || !kind) return;
    const name: string | undefined = metadata?.name;
    if (!name) {
      this.opts.log(`Skip ${kind}: missing metadata.name`);
      return;
    }

    try {
      const gv = parseApiVersion(apiVersion);
      const apiList = await this.getApiResourceList(gv);
      const res = this.findPrimaryResource(apiList, kind);
      if (!res) {
        throw new Error(`Resource for kind ${kind} not found in ${gv.key}`);
      }

      const isNamespaced = !!res.namespaced;
      const ns = isNamespaced ? (metadata?.namespace || this.opts.defaultNamespace) : undefined;
      const plural = res.name; // e.g., "deployments"

      const { collectionPath, itemPath } = this.buildPaths(gv, plural, name, ns);

      // Try read existing
      let existing: any | null = null;
      try {
        existing = await (this.client as any).get(itemPath);
      } catch (err) {
        if (!isStatus(err, 404)) throw err;
      }

      if (!existing) {
        const body = this.prepareForCreate(manifest, isNamespaced, ns);
        try {
          this.opts.log(`Creating ${kind}/${name}${ns ? ` in namespace ${ns}` : ''} (${gv.key})...`);
          await this.postWithRetries(collectionPath, body, `${kind}/${name}${ns ? ` in ${ns}` : ''}`);
          this.opts.log(`Created ${kind}/${name}${ns ? ` in ${ns}` : ''}`);
        } catch (err) {
          // If already exists, fall back to update
          if (isStatus(err, 409)) {
            this.opts.log(`${kind}/${name} already exists, updating...`);
            await this.replace(itemPath, manifest, null, isNamespaced, ns);
          } else {
            const errorMsg = `Error creating ${kind}/${name}${ns ? ` in namespace ${ns}` : ''}: ${String((err as any)?.message || err)}`;
            if (!this.opts.continueOnError) throw new Error(errorMsg);
            this.opts.log(errorMsg);
          }
        }
      } else {
        this.opts.log(`Updating existing ${kind}/${name}${ns ? ` in namespace ${ns}` : ''}...`);
        await this.replace(itemPath, manifest, existing, isNamespaced, ns);
      }
    } catch (err) {
      const errorMsg = `Apply error for ${kind}/${name}${metadata?.namespace ? ` in namespace ${metadata.namespace}` : ''}: ${String((err as any)?.message || err)}`;
      if (!this.opts.continueOnError) throw new Error(errorMsg);
      this.opts.log(errorMsg);
    }
  }

  async applyAll(manifests: Array<KubernetesResource | null | undefined>): Promise<void> {
    const docs = (manifests || []).filter(Boolean) as KubernetesResource[];
    if (docs.length === 0) return;

    // Partition manifests for a safer apply order and webhook readiness.
    const parts = await this.partitionManifests(docs);

    const count = docs.length;
    this.opts.log(`Applying ${count} manifests in phased order.`);

    // Phase 0: CRDs
    for (const m of parts.crds) await this.apply(m);

    // Phase 1: Namespaces
    for (const m of parts.namespaces) await this.apply(m);

    // Phase 2: Built-in (cluster-scoped then namespaced)
    for (const m of parts.builtinCluster) await this.apply(m);
    for (const m of parts.builtinNamespaced) await this.apply(m);

    // Phase 2.5: If webhook configurations exist, wait for their backing Services to have endpoints
    if (parts.webhookServices.length > 0) {
      this.opts.log(`Waiting for ${parts.webhookServices.length} webhook service(s) to be ready...`);
      for (const svc of parts.webhookServices) {
        await this.waitForServiceReady(svc.namespace, svc.name, 240_000).catch((e) => {
          this.opts.log(`Webhook service not ready: ${svc.namespace}/${svc.name}: ${String(e)}`);
        });
      }
      // Give kube-proxy/endpoints a brief settle time to avoid rare connection refused races
      await new Promise((r) => setTimeout(r, 5_000));
      this.opts.log(`Webhook services reported Ready; proceeding after 5s settle.`);
    }

    // Phase 3: Custom (cluster-scoped then namespaced)
    for (const m of parts.customCluster) await this.apply(m);
    for (const m of parts.customNamespaced) await this.apply(m);
  }

  async delete(manifest: KubernetesResource | null | undefined): Promise<void> {
    if (!manifest || typeof manifest !== 'object') return;

    if (manifest.kind === 'List' && Array.isArray((manifest as any).items)) {
      for (const item of (manifest as any).items) {
        await this.delete(item);
      }
      return;
    }

    const { apiVersion, kind, metadata } = manifest as any;
    if (!apiVersion || !kind) return;
    const name: string | undefined = metadata?.name;
    if (!name) {
      this.opts.log(`Skip ${kind}: missing metadata.name`);
      return;
    }

    try {
      const gv = parseApiVersion(apiVersion);
      const apiList = await this.getApiResourceList(gv);
      const res = this.findPrimaryResource(apiList, kind);
      if (!res) {
        throw new Error(`Resource for kind ${kind} not found in ${gv.key}`);
      }

      const isNamespaced = !!res.namespaced;
      const ns = isNamespaced ? (metadata?.namespace || this.opts.defaultNamespace) : undefined;
      const plural = res.name; // e.g., "deployments"

      const { itemPath } = this.buildPaths(gv, plural, name, ns);

      // Try to delete the resource
      try {
        await (this.client as any).delete(itemPath);
        this.opts.log(`Deleted ${kind}/${name}${ns ? ` in ${ns}` : ''}`);
      } catch (err) {
        if (isStatus(err, 404)) {
          this.opts.log(`${kind}/${name} not found (already deleted)`);
        } else {
          if (!this.opts.continueOnError) throw err;
          this.opts.log(`Error deleting ${kind}/${name}: ${String((err as any)?.message || err)}`);
        }
      }
    } catch (err) {
      if (!this.opts.continueOnError) throw err;
      this.opts.log(`Delete error: ${String((err as any)?.message || err)}`);
    }
  }

  async deleteAll(manifests: Array<KubernetesResource | null | undefined>): Promise<void> {
    const docs = (manifests || []).filter(Boolean) as KubernetesResource[];
    if (docs.length === 0) return;

    // Sort for safer delete order: reverse of apply order (namespaced -> cluster-scoped -> Namespaces -> CRDs)
    const withMeta = await Promise.all(
      docs.map(async (m) => ({ manifest: m, weight: await this.weightFor(m).catch(() => 99) }))
    );

    withMeta.sort((a, b) => b.weight - a.weight); // Reverse order for deletion
    for (const { manifest } of withMeta) {
      await this.delete(manifest);
    }
  }

  private async weightFor(manifest: KubernetesResource): Promise<number> {
    const { apiVersion, kind, metadata } = manifest as any;
    if (kind === 'CustomResourceDefinition') return 0;
    if (kind === 'Namespace' && (!apiVersion || apiVersion === 'v1')) return 1;
    const gv = parseApiVersion(apiVersion);
    const apiList = await this.getApiResourceList(gv);
    const res = this.findPrimaryResource(apiList, kind);
    if (!res) return 50;
    return res.namespaced ? 3 : 2;
  }

  private async replace(
    itemPath: string,
    manifest: KubernetesResource,
    existing: any | null,
    isNamespaced: boolean,
    ns?: string
  ) {
    const body = this.prepareForReplace(manifest, existing ?? undefined, isNamespaced, ns);
    try {
      await this.putWithRetries(itemPath, body, `${manifest.kind}/${manifest.metadata?.name}${ns ? ` in ${ns}` : ''}`);
      this.opts.log(`Updated ${manifest.kind}/${manifest.metadata?.name}${ns ? ` in ${ns}` : ''}`);
    } catch (err) {
      if (!this.opts.continueOnError) throw err;
      this.opts.log(`Error updating ${manifest.kind}/${manifest.metadata?.name}: ${String((err as any)?.message || err)}`);
    }
  }

  private prepareForCreate(
    manifest: KubernetesResource,
    isNamespaced: boolean,
    ns?: string
  ): KubernetesResource {
    const body = JSON.parse(JSON.stringify(manifest));
    if (isNamespaced) {
      body.metadata = body.metadata || ({} as any);
      body.metadata.namespace = body.metadata.namespace || ns || this.opts.defaultNamespace;
    }
    // Do not send status on create
    delete (body as any).status;
    return body;
  }

  private prepareForReplace(
    manifest: KubernetesResource,
    existing: any | undefined,
    isNamespaced: boolean,
    ns?: string
  ): KubernetesResource {
    const body = JSON.parse(JSON.stringify(manifest));
    body.metadata = body.metadata || ({} as any);
    if (isNamespaced) {
      body.metadata.namespace = body.metadata.namespace || ns || this.opts.defaultNamespace;
    } else {
      delete (body.metadata as any).namespace;
    }
    // Remove server-managed fields; then set resourceVersion from existing
    delete (body as any).status;
    if (body.metadata) {
      delete (body.metadata as any).creationTimestamp;
      delete (body.metadata as any).managedFields;
      delete (body.metadata as any).uid;
      delete (body.metadata as any).selfLink;
      delete (body.metadata as any).generation;
    }
    if (existing?.metadata?.resourceVersion) {
      (body.metadata as any).resourceVersion = existing.metadata.resourceVersion;
    }
    return body;
  }

  private async getApiResourceList(gv: GroupVersion): Promise<APIResourceList> {
    const cached = this.discovery.get(gv.key);
    if (cached) return cached;
    const path = gv.group ? `/apis/${gv.group}/${gv.version}` : `/api/${gv.version}`;
    const list = await this.client.get(path) as APIResourceList;
    this.discovery.set(gv.key, list);
    return list;
  }

  private findPrimaryResource(list: APIResourceList, kind: string): APIResource | undefined {
    return list.resources.find(r => r.kind === kind && !String(r.name).includes('/'));
  }

  private buildPaths(
    gv: GroupVersion,
    plural: string,
    name: string,
    namespace?: string
  ): { collectionPath: string; itemPath: string } {
    const base = gv.group ? `/apis/${gv.group}/${gv.version}` : `/api/${gv.version}`;
    if (namespace) {
      const collectionPath = `${base}/namespaces/${namespace}/${plural}`;
      const itemPath = `${collectionPath}/${name}`;
      return { collectionPath, itemPath };
    }
    const collectionPath = `${base}/${plural}`;
    const itemPath = `${collectionPath}/${name}`;
    return { collectionPath, itemPath };
  }

  private isBuiltinGroup(group: string | null): boolean {
    if (group === null) return true; // core/v1
    const builtin = new Set([
      'admissionregistration.k8s.io',
      'apiextensions.k8s.io',
      'apiregistration.k8s.io',
      'apps',
      'authentication.k8s.io',
      'authorization.k8s.io',
      'autoscaling',
      'batch',
      'certificates.k8s.io',
      'coordination.k8s.io',
      'discovery.k8s.io',
      'events.k8s.io',
      'flowcontrol.apiserver.k8s.io',
      'networking.k8s.io',
      'node.k8s.io',
      'policy',
      'rbac.authorization.k8s.io',
      'scheduling.k8s.io',
      'storage.k8s.io',
    ]);
    return builtin.has(group);
  }

  private async partitionManifests(docs: KubernetesResource[]) {
    const crds: KubernetesResource[] = [];
    const namespaces: KubernetesResource[] = [];
    const builtinCluster: KubernetesResource[] = [];
    const builtinNamespaced: KubernetesResource[] = [];
    const customCluster: KubernetesResource[] = [];
    const customNamespaced: KubernetesResource[] = [];
    const webhookServices: Array<{ namespace: string; name: string }> = [];

    for (const m of docs) {
      const { apiVersion, kind } = m as any;
      if (kind === 'CustomResourceDefinition') {
        crds.push(m);
        continue;
      }
      if (kind === 'Namespace' && (!apiVersion || apiVersion === 'v1')) {
        namespaces.push(m);
        continue;
      }

      // Detect webhook configuration service refs for later readiness wait
      if (apiVersion?.startsWith('admissionregistration.k8s.io/') && /WebhookConfiguration$/.test(kind)) {
        const webhooks = (m as any).webhooks as any[] | undefined;
        if (Array.isArray(webhooks)) {
          for (const w of webhooks) {
            const svc = w?.clientConfig?.service;
            if (svc?.name && svc?.namespace) webhookServices.push({ namespace: svc.namespace, name: svc.name });
          }
        }
      }

      // Determine namespaced vs cluster and builtin vs custom
      let isNamespaced = false;
      try {
        const gv = parseApiVersion(apiVersion);
        const list = await this.getApiResourceList(gv);
        const res = this.findPrimaryResource(list, kind);
        isNamespaced = !!res?.namespaced;
      } catch {
        // Fallback: assume namespaced for safety
        isNamespaced = true;
      }

      const group = apiVersion?.includes('/') ? apiVersion.split('/')[0] : null;
      const isBuiltin = this.isBuiltinGroup(group);

      if (isBuiltin) {
        if (isNamespaced) builtinNamespaced.push(m);
        else builtinCluster.push(m);
      } else {
        if (isNamespaced) customNamespaced.push(m);
        else customCluster.push(m);
      }
    }

    return { crds, namespaces, builtinCluster, builtinNamespaced, webhookServices, customCluster, customNamespaced };
  }

  private async waitForServiceReady(namespace: string, name: string, timeoutMs = 180_000, pollMs = 2_000) {
    const start = Date.now();
    const toLabelSelector = (sel: Record<string, string> | undefined): string | undefined => {
      if (!sel) return undefined;
      return Object.entries(sel)
        .map(([k, v]) => `${k}=${v}`)
        .join(',');
    };

    while (Date.now() - start < timeoutMs) {
      let podNames: string[] = [];
      let usedSelector = '';
      try {
        // Prefer Endpoints targetRefs
        const ep: any = await this.client.readCoreV1NamespacedEndpoints({ path: { namespace, name } } as any);
        const subsets = ep?.subsets || [];
        const addrs = subsets.flatMap((s: any) => (s.addresses || []));
        podNames = addrs
          .map((a: any) => a?.targetRef?.kind === 'Pod' ? a?.targetRef?.name : undefined)
          .filter(Boolean);
        if (addrs.length > 0) this.opts.log(`Webhook service ${namespace}/${name} has endpoints; verifying pod readiness...`);
      } catch {
        // ignore
      }

      if (podNames.length === 0) {
        // Fallback: derive pods via Service selector
        try {
          const svc: any = await this.client.readCoreV1NamespacedService({ path: { namespace, name } } as any);
          const selector = toLabelSelector(svc?.spec?.selector);
          usedSelector = selector || '';
          if (selector) {
            const pods: any = await this.client.listCoreV1NamespacedPod({ path: { namespace }, query: { labelSelector: selector } as any });
            podNames = (pods?.items || []).map((p: any) => p?.metadata?.name).filter(Boolean);
          }
        } catch {
          // service may not exist yet
        }
      }

      // If we have candidate pods, check they report Ready
      if (podNames.length > 0) {
        let allReady = true;
        for (const pn of podNames) {
          try {
            const pod: any = await this.client.readCoreV1NamespacedPod({ path: { namespace, name: pn } } as any);
            const conds: any[] = pod?.status?.conditions || [];
            const readyCond = conds.find((c) => c.type === 'Ready');
            const containers: any[] = pod?.status?.containerStatuses || [];
            const containersReady = containers.length > 0 && containers.every((c) => c.ready === true);
            if (!readyCond || readyCond.status !== 'True' || !containersReady) {
              allReady = false;
              break;
            }
          } catch {
            allReady = false;
            break;
          }
        }
        if (allReady) {
          this.opts.log(`Webhook service ${namespace}/${name} pods are Ready (${podNames.length}).`);
          return;
        }
      }

      await new Promise((r) => setTimeout(r, pollMs));
    }
    throw new Error(`Timeout waiting for webhook service ${namespace}/${name} to become Ready`);
  }

  private isAdmissionWebhookTransient(err: any): boolean {
    const msg = String(err?.message || err || '').toLowerCase();
    // Common transient cases when webhooks are rolling or not yet listening
    return (
      msg.includes('failed calling webhook') &&
      (
        msg.includes('connect: connection refused') ||
        msg.includes('context deadline exceeded') ||
        msg.includes('no endpoints available for service') ||
        /status:\s*500/.test(msg)
      )
    );
  }

  private async postWithRetries(path: string, body: any, ref: string, maxAttempts = 6, baseDelayMs = 2_000) {
    let attempt = 0;
    let lastErr: any;
    while (attempt < maxAttempts) {
      try {
        return await (this.client as any).post(path, undefined, body);
      } catch (err: any) {
        lastErr = err;
        if (!this.isAdmissionWebhookTransient(err)) throw err;
        const delay = Math.min(baseDelayMs * Math.pow(2, attempt), 10_000);
        this.opts.log(`Retrying ${ref} due to webhook readiness (attempt ${attempt + 1}/${maxAttempts}) in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        attempt++;
      }
    }
    throw lastErr;
  }

  private async putWithRetries(path: string, body: any, ref: string, maxAttempts = 5, baseDelayMs = 2_000) {
    let attempt = 0;
    let lastErr: any;
    while (attempt < maxAttempts) {
      try {
        return await (this.client as any).put(path, undefined, body);
      } catch (err: any) {
        lastErr = err;
        if (!this.isAdmissionWebhookTransient(err)) throw err;
        const delay = Math.min(baseDelayMs * Math.pow(2, attempt), 10_000);
        this.opts.log(`Retrying update for ${ref} due to webhook readiness (attempt ${attempt + 1}/${maxAttempts}) in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        attempt++;
      }
    }
    throw lastErr;
  }
}

export async function applyKubernetesResource(
  client: InterwebKubernetesClient,
  manifest: KubernetesResource,
  opts: ApplyOptions = {}
): Promise<void> {
  const applier = new K8sApplier(client, opts);
  await applier.apply(manifest);
}

export async function applyKubernetesResources(
  client: InterwebKubernetesClient,
  manifests: KubernetesResource[],
  opts: ApplyOptions = {}
): Promise<void> {
  const applier = new K8sApplier(client, opts);
  await applier.applyAll(manifests);
}

export async function deleteKubernetesResource(
  client: InterwebKubernetesClient,
  manifest: KubernetesResource,
  opts: ApplyOptions = {}
): Promise<void> {
  const applier = new K8sApplier(client, opts);
  await applier.delete(manifest);
}

export async function deleteKubernetesResources(
  client: InterwebKubernetesClient,
  manifests: KubernetesResource[],
  opts: ApplyOptions = {}
): Promise<void> {
  const applier = new K8sApplier(client, opts);
  await applier.deleteAll(manifests);
}

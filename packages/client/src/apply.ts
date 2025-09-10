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
          await (this.client as any).post(collectionPath, undefined, body);
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
        await this.waitForServiceEndpoints(svc.namespace, svc.name, 180_000).catch((e) => {
          this.opts.log(`Webhook service not ready: ${svc.namespace}/${svc.name}: ${String(e)}`);
        });
      }
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
      await (this.client as any).put(itemPath, undefined, body);
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

  private async waitForServiceEndpoints(namespace: string, name: string, timeoutMs = 120_000, pollMs = 2_000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const ep = await this.client.readCoreV1NamespacedEndpoints({ path: { namespace, name } } as any);
        const subsets = (ep as any)?.subsets;
        if (Array.isArray(subsets) && subsets.some(s => Array.isArray(s.addresses) && s.addresses.length > 0)) {
          this.opts.log(`Webhook service ${namespace}/${name} has ready endpoints.`);
          return;
        }
      } catch (err) {
        // ignore 404s until created
      }
      await new Promise((r) => setTimeout(r, pollMs));
    }
    throw new Error(`Timeout waiting for endpoints for service ${namespace}/${name}`);
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

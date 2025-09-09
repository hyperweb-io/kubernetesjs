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
          await (this.client as any).post(collectionPath, undefined, body);
          this.opts.log(`Created ${kind}/${name}${ns ? ` in ${ns}` : ''}`);
        } catch (err) {
          // If already exists, fall back to update
          if (isStatus(err, 409)) {
            await this.replace(itemPath, manifest, null, isNamespaced, ns);
          } else {
            if (!this.opts.continueOnError) throw err;
            this.opts.log(`Error creating ${kind}/${name}: ${String((err as any)?.message || err)}`);
          }
        }
      } else {
        await this.replace(itemPath, manifest, existing, isNamespaced, ns);
      }
    } catch (err) {
      if (!this.opts.continueOnError) throw err;
      this.opts.log(`Apply error: ${String((err as any)?.message || err)}`);
    }
  }

  async applyAll(manifests: Array<KubernetesResource | null | undefined>): Promise<void> {
    const docs = (manifests || []).filter(Boolean) as KubernetesResource[];
    if (docs.length === 0) return;

    // Sort for safer apply order: CRDs -> Namespaces -> cluster-scoped -> namespaced
    const withMeta = await Promise.all(
      docs.map(async (m) => ({ manifest: m, weight: await this.weightFor(m).catch(() => 99) }))
    );

    withMeta.sort((a, b) => a.weight - b.weight);
    for (const { manifest } of withMeta) {
      await this.apply(manifest);
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
    const list = await this.client.get<APIResourceList>(path);
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

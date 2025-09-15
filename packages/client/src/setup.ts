import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs';
import { ManifestLoader, SUPPORTED_OPERATORS, KubernetesResource } from '@interweb/manifests';
import {
  ClusterSetupConfig,
  ApplicationConfig,
  DeploymentStatus,
  InterwebClientConfig,
  OperatorConfig,
  OperatorInfo,
  ClusterOverview,
  SecretConfig,
} from './types';
import axios from 'axios';
import { applyKubernetesResource, applyKubernetesResources, deleteKubernetesResource, deleteKubernetesResources } from './apply';

export class SetupClient {
  private client: InterwebKubernetesClient;
  private defaultNamespace: string;

  constructor(client: InterwebKubernetesClient, defaultNamespace: string = 'default') {
    this.client = client;
    this.defaultNamespace = defaultNamespace || 'default';
  }

  /**
   * Check if the Kubernetes cluster is accessible
   */
  async checkConnection(): Promise<boolean> {
    try {
      await this.client.listCoreV1Node({
        query: {}
      });
      return true;
    } catch (error) {
      console.error('Failed to connect to Kubernetes cluster:', error);
      return false;
    }
  }

  public async applyManifest(manifest: KubernetesResource, options?: { continueOnError?: boolean; log?: (msg: string) => void }): Promise<void> {
    await applyKubernetesResource(this.client, manifest, {
      defaultNamespace: this.defaultNamespace,
      continueOnError: options?.continueOnError ?? true,
      log: options?.log ?? ((m) => console.log(m)),
    });
  }

  public async applyManifests(manifests: KubernetesResource[], options?: { continueOnError?: boolean; log?: (msg: string) => void }): Promise<void> {
    await applyKubernetesResources(this.client, manifests, {
      defaultNamespace: this.defaultNamespace,
      continueOnError: options?.continueOnError ?? true,
      log: options?.log ?? ((m) => console.log(m)),
    });
  }

  public async deleteManifest(manifest: KubernetesResource, options?: { continueOnError?: boolean; log?: (msg: string) => void }): Promise<void> {
    await deleteKubernetesResource(this.client, manifest, {
      defaultNamespace: this.defaultNamespace,
      continueOnError: options?.continueOnError ?? true,
      log: options?.log ?? ((m) => console.log(m)),
    });
  }

  public async deleteManifests(manifests: KubernetesResource[], options?: { continueOnError?: boolean; log?: (msg: string) => void }): Promise<void> {
    await deleteKubernetesResources(this.client, manifests, {
      defaultNamespace: this.defaultNamespace,
      continueOnError: options?.continueOnError ?? true,
      log: options?.log ?? ((m) => console.log(m)),
    });
  }

  /**
   * Install operators based on cluster setup configuration
   */
  public async installOperators(config: ClusterSetupConfig): Promise<void> {
    // check config.spec.operators are in the SUPPORTED_OPERATORS
    for (const operator of config.spec.operators) {
      if (!SUPPORTED_OPERATORS.includes(operator.name as any)) {
        throw new Error(`Unsupported operator: ${operator.name}`);
      }
    }

    for (const operator of config.spec.operators) {
      if (!operator.enabled) {
        console.log(`Skipping disabled operator: ${operator.name}`);
        continue;
      }
      console.log(`Applying operator: ${operator.name} ${operator.version}`);
      const manifests = ManifestLoader.loadOperatorManifests(operator.name, operator.version);
      await this.applyManifests(manifests, {
        continueOnError: false,
        log: (m) => console.log(m),
      });
      console.log(`Operator installed: ${operator.name} ${operator.version}`);
    }
  }

  /**
   * Delete operators based on cluster setup configuration
   */
  public async deleteOperators(config: ClusterSetupConfig, options?: { continueOnError?: boolean }): Promise<void> {
    // check config.spec.operators are in the SUPPORTED_OPERATORS
    for (const operator of config.spec.operators) {
      if (!SUPPORTED_OPERATORS.includes(operator.name as any)) {
        throw new Error(`Unsupported operator: ${operator.name}`);
      }
    }

    // Process operators in reverse order for safer deletion
    const operatorsToDelete = config.spec.operators
      .filter(op => op.enabled)
      .reverse();

    for (const operator of operatorsToDelete) {
      console.log(`Deleting operator: ${operator.name} ${operator.version}`);
      try {
        const manifests = ManifestLoader.loadOperatorManifests(operator.name, operator.version);
        await this.deleteManifests(manifests, {
          continueOnError: options?.continueOnError ?? true,
          log: (m) => console.log(m),
        });
        console.log(`Operator deleted: ${operator.name} ${operator.version}`);
      } catch (error) {
        const errorMsg = `Failed to delete operator ${operator.name}: ${error}`;
        if (options?.continueOnError ?? true) {
          console.warn(errorMsg);
        } else {
          throw new Error(errorMsg);
        }
      }
    }
  }

  /**
   * Get deployment status for a cluster setup
   */
  async getClusterSetupStatus(config: ClusterSetupConfig): Promise<DeploymentStatus> {
    const namespace = config.metadata.namespace || 'interweb-system';
    
    try {
      // Check if all operators are running
      const operatorStatuses = await Promise.all(
        config.spec.operators
          .filter(op => op.enabled)
          .map(op => this.getOperatorStatus(op.name, namespace))
      );

      const allReady = operatorStatuses.every(status => status);
      
      return {
        phase: allReady ? 'ready' : 'installing',
        message: allReady ? 'All operators are ready' : 'Some operators are still installing',
        conditions: operatorStatuses.map((ready, index) => ({
          type: 'OperatorReady',
          status: ready ? 'True' : 'False',
          reason: ready ? 'Ready' : 'Installing',
          message: `Operator ${config.spec.operators[index].name} is ${ready ? 'ready' : 'installing'}`,
          lastTransitionTime: new Date().toISOString()
        }))
      };
    } catch (error) {
      return {
        phase: 'failed',
        message: `Failed to get cluster setup status: ${error}`,
        conditions: []
      };
    }
  }

  /**
   * Get deployment status for an application
   */
  async getApplicationStatus(config: ApplicationConfig): Promise<DeploymentStatus> {
    const namespace = config.metadata.namespace || 'default';
    
    try {
      const deployments = await this.client.listAppsV1NamespacedDeployment({
        path: { namespace },
        query: {}
      });
      const appDeployments = deployments.items.filter(
        (dep: any) => dep.metadata?.labels?.['app.interweb.dev/instance'] === config.metadata.name
      );

      if (appDeployments.length === 0) {
        return {
          phase: 'pending',
          message: 'No deployments found'
        };
      }

      const allReady = appDeployments.every((dep: any) => 
        dep.status?.readyReplicas === dep.status?.replicas && 
        dep.status?.replicas > 0
      );

      return {
        phase: allReady ? 'ready' : 'installing',
        message: allReady ? 'Application is ready' : 'Application is still deploying',
        conditions: appDeployments.map((dep: any) => ({
          type: 'DeploymentReady',
          status: (dep.status?.readyReplicas === dep.status?.replicas) ? 'True' : 'False',
          reason: 'Deployment',
          message: `${dep.metadata?.name}: ${dep.status?.readyReplicas}/${dep.status?.replicas} replicas ready`,
          lastTransitionTime: new Date().toISOString()
        }))
      };
    } catch (error) {
      return {
        phase: 'failed',
        message: `Failed to get application status: ${error}`,
        conditions: []
      };
    }
  }

  /**
   * Delete resources for a cluster setup
   */
  async deleteClusterSetup(config: ClusterSetupConfig): Promise<void> {
    const namespace = config.metadata.namespace || 'interweb-system';
    
    try {
      // Delete namespace which will cascade delete all resources
      await this.client.deleteCoreV1Namespace({
        path: { name: String(namespace) },
        query: {}
      });
      console.log(`Deleted namespace: ${namespace}`);
    } catch (error: any) {
      if (error.response?.statusCode !== 404) {
        throw error;
      }
    }
  }

  private async getOperatorStatus(operatorName: string, namespace: string): Promise<boolean> {
    try {
      // Check if operator pods are running
      const pods = await this.client.listCoreV1NamespacedPod({
        path: { namespace },
        query: { labelSelector: `app=${operatorName}` }
      });
      return pods.items.every((pod: any) => pod.status?.phase === 'Running');
    } catch (error) {
      return false;
    }
  }

  // ===== Dashboard-friendly helpers (reusable) =====

  /**
   * Install a single operator by name (optional version).
   */
  public async installOperatorByName(name: string, version?: string): Promise<void> {
    const manifests = ManifestLoader.loadOperatorManifests(name, version);
    await this.applyManifests(manifests, {
      continueOnError: false,
      log: (m) => console.log(m),
    });
  }

  /**
   * Uninstall a single operator by name (optional version).
   */
  public async uninstallOperatorByName(name: string, version?: string): Promise<void> {
    const manifests = ManifestLoader.loadOperatorManifests(name, version);
    await this.deleteManifests(manifests, {
      continueOnError: true,
      log: (m) => console.log(m),
    });
  }

  /**
   * List supported operators with detected status + version across all namespaces.
   */
  public async listOperatorsInfo(): Promise<OperatorInfo[]> {
    const catalog: Array<Pick<OperatorInfo, 'name' | 'displayName' | 'description' | 'docsUrl'>> = [
      {
        name: 'ingress-nginx',
        displayName: 'NGINX Ingress Controller',
        description: 'Ingress controller using NGINX as a reverse proxy and load balancer',
        docsUrl: 'https://kubernetes.github.io/ingress-nginx/',
      },
      {
        name: 'cert-manager',
        displayName: 'cert-manager',
        description: 'X.509 certificate management for Kubernetes',
        docsUrl: 'https://cert-manager.io/',
      },
      {
        name: 'knative-serving',
        displayName: 'Knative Serving',
        description: 'Serverless workloads on Kubernetes',
        docsUrl: 'https://knative.dev/docs/serving/',
      },
      {
        name: 'cloudnative-pg',
        displayName: 'CloudNativePG',
        description: 'PostgreSQL operator for Kubernetes',
        docsUrl: 'https://cloudnative-pg.io/',
      },
      {
        name: 'kube-prometheus-stack',
        displayName: 'Prometheus Stack',
        description: 'Monitoring stack with Prometheus, Grafana, Alertmanager',
        docsUrl: 'https://prometheus.io/',
      },
    ];
    const results: OperatorInfo[] = [];
    for (const entry of catalog) {
      const installs = await this.getOperatorInstallations(entry.name);
      // Derive summary
      const installed = installs.find(i => i.status === 'installed');
      const installing = installs.find(i => i.status === 'installing');
      const status = installed ? 'installed' : installing ? 'installing' : 'not-installed';
      const version = installed?.version || installing?.version || 'unknown';
      const namespace = installed?.namespace || installing?.namespace || this.getOperatorDetector(entry.name).namespaces?.[0];
      results.push({ ...entry, status, version, namespace, installations: installs });
    }
    return results;
  }

  /**
   * High-level cluster overview (nodes/pods/services/operators/version).
   */
  public async getClusterOverview(): Promise<ClusterOverview> {
    // Nodes
    const nodesResp = await this.client.listCoreV1Node({ query: {} as any });
    const nodes = (nodesResp?.items || []).map((node: any) => ({
      name: node?.metadata?.name || '',
      status: (node?.status?.conditions || []).find((c: any) => c.type === 'Ready')?.status === 'True' ? 'Ready' : 'NotReady',
      version: node?.status?.nodeInfo?.kubeletVersion || '',
      roles: Object.keys(node?.metadata?.labels || {})
        .filter((k) => k.includes('node-role.kubernetes.io'))
        .map((k) => k.replace('node-role.kubernetes.io/', '')),
    }));

    // Pods/services across all namespaces
    let podCount = 0;
    let serviceCount = 0;
    const namespaces = await this.safeListNamespaces();
    for (const ns of namespaces) {
      const nsName = ns?.metadata?.name;
      if (!nsName) continue;
      try {
        const pods = await this.client.listCoreV1NamespacedPod({ path: { namespace: nsName }, query: {} as any });
        podCount += (pods?.items || []).length;
      } catch {}
      try {
        const svcs = await this.client.listCoreV1NamespacedService({ path: { namespace: nsName }, query: {} as any });
        serviceCount += (svcs?.items || []).length;
      } catch {}
    }

    // Server version
    let version = 'unknown';
    try {
      const v = await this.client.getCodeVersion({} as any);
      version = String(v?.gitVersion || 'unknown');
    } catch {}

    // Operators
    let operatorCount = 0;
    try {
      const ops = await this.listOperatorsInfo();
      operatorCount = ops.filter((o) => o.status === 'installed' || o.status === 'installing').length;
    } catch {}

    return {
      healthy: nodes.every((n) => n.status === 'Ready'),
      nodeCount: nodes.length,
      podCount,
      serviceCount,
      operatorCount,
      version,
      nodes,
    };
  }

  /**
   * Create a secret by applying a minimal Secret manifest.
   */
  public async createSecret(secret: SecretConfig): Promise<void> {
    const encoded = Object.fromEntries(
      Object.entries(secret.data).map(([k, v]) => [k, Buffer.from(String(v), 'utf8').toString('base64')])
    );
    const manifest: KubernetesResource = {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: { name: secret.name, namespace: secret.namespace },
      // @ts-ignore
      type: secret.type,
      data: encoded,
    } as any;
    await this.applyManifests([manifest]);
  }

  /**
   * List secrets in one or all namespaces (name/namespace/type/age/keys).
   */
  public async listSecrets(namespace?: string): Promise<Array<{ name: string; namespace: string; type: string; age: string; keys: string[] }>> {
    const out: Array<{ name: string; namespace: string; type: string; age: string; keys: string[] }> = [];
    const namespaces = namespace ? [{ metadata: { name: namespace } }] : await this.safeListNamespaces();
    for (const ns of namespaces) {
      const nsName = ns?.metadata?.name;
      if (!nsName) continue;
      try {
        const secrets = await this.client.listCoreV1NamespacedSecret({ path: { namespace: nsName }, query: {} as any });
        (secrets?.items || []).forEach((s: any) => {
          out.push({
            name: s?.metadata?.name || '',
            namespace: s?.metadata?.namespace || nsName,
            type: s?.type || '',
            age: this.formatAge(s?.metadata?.creationTimestamp),
            keys: Object.keys(s?.data || {}),
          });
        });
      } catch {}
    }
    return out;
  }

  // ----- internal helpers -----
  private async safeListNamespaces(): Promise<any[]> {
    try {
      const res = await this.client.listCoreV1Namespace({ query: {} as any });
      return res?.items || [];
    } catch {
      return [];
    }
  }

  private async findOperatorDeployment(namespaces: any[], operatorName: string): Promise<{ deployment: any; namespace: string } | null> {
    for (const ns of namespaces) {
      const nsName = ns?.metadata?.name;
      if (!nsName) continue;
      try {
        const deployments = await this.client.listAppsV1NamespacedDeployment({ path: { namespace: nsName }, query: {} as any });
        const found = (deployments?.items || []).find((d: any) =>
          String(d?.metadata?.name || '').includes(operatorName) ||
          d?.metadata?.labels?.['app.kubernetes.io/name'] === operatorName
        );
        if (found) return { deployment: found, namespace: nsName };
      } catch {}
    }
    return null;
  }

  /**
   * Return best-effort install state for a known operator.
   * Uses deployment label selectors and defaults per operator, then falls back to a cluster-wide search.
   */
  public async getOperatorInstallations(name: string): Promise<Array<{ namespace: string; status: OperatorInfo['status']; version: string }>> {
    const detector = this.getOperatorDetector(name);
    const namespaces = await this.safeListNamespaces();
    // If we have canonical namespaces, scan only those. Otherwise scan all.
    const nsOrder = (detector.namespaces && detector.namespaces.length > 0)
      ? detector.namespaces
      : (namespaces.map((n) => n?.metadata?.name).filter(Boolean) as string[]);
    const seen = new Set<string>();
    const results: Array<{ namespace: string; status: OperatorInfo['status']; version: string }> = [];
    const trySelectors = detector.labelSelectors?.length ? detector.labelSelectors : [];

    for (const nsName of nsOrder) {
      if (!nsName || seen.has(nsName)) continue;
      seen.add(nsName);
      let found = false;
      // Try known deployment selectors
      for (const sel of trySelectors) {
        try {
          const dpls = await this.client.listAppsV1NamespacedDeployment({ path: { namespace: nsName }, query: { labelSelector: sel } as any });
          const d = (dpls?.items || [])[0];
          if (d) {
            const ready = Number(d?.status?.readyReplicas || 0);
            const desired = Number(d?.spec?.replicas || 0);
            const status: OperatorInfo['status'] = desired > 0 ? (ready === desired ? 'installed' : 'installing') : 'error';
            const version = String(d?.metadata?.labels?.['app.kubernetes.io/version'] || d?.metadata?.annotations?.['version'] || 'unknown');
            results.push({ namespace: nsName, status, version });
            found = true;
            break;
          }
        } catch {}
      }
      if (found) continue;
      // Fallback: any deployment with matching name/label
      try {
        const dpls = await this.client.listAppsV1NamespacedDeployment({ path: { namespace: nsName }, query: {} as any });
        const d = (dpls?.items || []).find((dep: any) =>
          String(dep?.metadata?.name || '').includes(name) ||
          dep?.metadata?.labels?.['app.kubernetes.io/name'] === name ||
          dep?.metadata?.labels?.['app'] === name
        );
        if (d) {
          const ready = Number(d?.status?.readyReplicas || 0);
          const desired = Number(d?.spec?.replicas || 0);
          const status: OperatorInfo['status'] = desired > 0 ? (ready === desired ? 'installed' : 'installing') : 'error';
          const version = String(d?.metadata?.labels?.['app.kubernetes.io/version'] || d?.metadata?.annotations?.['version'] || 'unknown');
          results.push({ namespace: nsName, status, version });
          continue;
        }
      } catch {}
      // Last fallback: pods with selectors
      if (trySelectors.length > 0) {
        for (const sel of trySelectors) {
          try {
            const pods = await this.client.listCoreV1NamespacedPod({ path: { namespace: nsName }, query: { labelSelector: sel } as any });
            const p = (pods?.items || [])[0];
            if (p) {
              const status: OperatorInfo['status'] = 'installing';
              results.push({ namespace: nsName, status, version: 'unknown' });
              break;
            }
          } catch {}
        }
      }
    }
    if (results.length > 0) return results;
    // CRD presence implies at least installing
    try {
      const crdNames = this.getOperatorCRDHints(name);
      if (crdNames.length > 0) {
        const crds = await this.client.listApiextensionsV1CustomResourceDefinition({ query: {} as any });
        const present = crdNames.every((n) => crds?.items?.some((c: any) => c?.metadata?.name === n));
        if (present) {
          return [{ namespace: detector.namespaces?.[0] || 'default', status: 'installing', version: 'unknown' }];
        }
      }
    } catch {}
    return [];
  }

  /**
   * Wait until the operator reports 'installed' or timeout.
   */
  public async waitForOperator(name: string, timeoutMs = 300_000, pollMs = 5_000): Promise<void> {
    const start = Date.now();
    for (;;) {
      const installs = await this.getOperatorInstallations(name);
      const installed = installs.find(i => i.status === 'installed');
      if (installed) return;
      if (Date.now() - start > timeoutMs) {
        throw new Error(`Timeout waiting for operator '${name}' to be installed`);
      }
      await new Promise((r) => setTimeout(r, pollMs));
    }
  }

  /**
   * Wait until the operator is fully removed from its canonical namespaces (and CRDs absent if hinted).
   */
  public async waitForOperatorDeletion(name: string, timeoutMs = 300_000, pollMs = 5_000): Promise<void> {
    const start = Date.now();
    const detector = this.getOperatorDetector(name);
    for (;;) {
      const installs = await this.getOperatorInstallations(name);
      const stillPresent = installs.filter(i => detector.namespaces?.includes(i.namespace));
      let crdsPresent = false;
      try {
        const hints = this.getOperatorCRDHints(name);
        if (hints.length > 0) {
          const crds = await this.client.listApiextensionsV1CustomResourceDefinition({ query: {} as any });
          crdsPresent = hints.some((n) => crds?.items?.some((c: any) => c?.metadata?.name === n));
        }
      } catch {}
      if (stillPresent.length === 0 && !crdsPresent) return;
      if (Date.now() - start > timeoutMs) {
        throw new Error(`Timeout waiting for operator '${name}' to be deleted`);
      }
      await new Promise((r) => setTimeout(r, pollMs));
    }
  }

  /**
   * Detailed debug info for an operator: matched deployments/pods per namespace, and CRD presence.
   */
  public async getOperatorDebug(name: string): Promise<any> {
    const detector = this.getOperatorDetector(name);
    const namespaces = await this.safeListNamespaces();
    const nsOrder = (detector.namespaces && detector.namespaces.length > 0)
      ? detector.namespaces
      : (namespaces.map((n) => n?.metadata?.name).filter(Boolean) as string[]);
    const trySelectors = detector.labelSelectors || [];
    const matches: Record<string, any> = {};

    for (const nsName of nsOrder) {
      if (!nsName) continue;
      matches[nsName] = { deployments: [], pods: [] };
      // Deployments by selectors
      for (const sel of trySelectors) {
        try {
          const dpls = await this.client.listAppsV1NamespacedDeployment({ path: { namespace: nsName }, query: { labelSelector: sel } as any });
          (dpls?.items || []).forEach((d: any) => {
            matches[nsName].deployments.push({
              name: d?.metadata?.name,
              labels: d?.metadata?.labels,
              ready: d?.status?.readyReplicas || 0,
              replicas: d?.status?.replicas || d?.spec?.replicas || 0,
            });
          });
        } catch {}
      }
      // Fallback deployments by name/labels
      try {
        const dpls = await this.client.listAppsV1NamespacedDeployment({ path: { namespace: nsName }, query: {} as any });
        (dpls?.items || []).forEach((d: any) => {
          const lname = String(d?.metadata?.labels?.['app.kubernetes.io/name'] || d?.metadata?.labels?.['app'] || '');
          if (String(d?.metadata?.name || '').includes(name) || lname === name) {
            matches[nsName].deployments.push({
              name: d?.metadata?.name,
              labels: d?.metadata?.labels,
              ready: d?.status?.readyReplicas || 0,
              replicas: d?.status?.replicas || d?.spec?.replicas || 0,
            });
          }
        });
      } catch {}
      // Pods by selectors
      for (const sel of trySelectors) {
        try {
          const pods = await this.client.listCoreV1NamespacedPod({ path: { namespace: nsName }, query: { labelSelector: sel } as any });
          (pods?.items || []).forEach((p: any) => {
            matches[nsName].pods.push({ name: p?.metadata?.name, phase: p?.status?.phase, labels: p?.metadata?.labels });
          });
        } catch {}
      }
    }
    // CRDs present
    const crdHints = this.getOperatorCRDHints(name);
    let crdsPresent: string[] = [];
    try {
      if (crdHints.length > 0) {
        const crds = await this.client.listApiextensionsV1CustomResourceDefinition({ query: {} as any });
        crdsPresent = crdHints.filter((n) => crds?.items?.some((c: any) => c?.metadata?.name === n));
      }
    } catch {}

    return { detector, matches, crdHints, crdsPresent };
  }

  private getOperatorDetector(name: string): { namespaces?: string[]; labelSelectors?: string[] } {
    switch (name) {
      case 'cloudnative-pg':
        return { namespaces: ['cnpg-system'], labelSelectors: ['app.kubernetes.io/name=cloudnative-pg', 'app=cloudnative-pg'] };
      case 'cert-manager':
        return { namespaces: ['cert-manager'], labelSelectors: ['app.kubernetes.io/name=cert-manager', 'app.kubernetes.io/instance=cert-manager', 'app=cert-manager'] };
      case 'ingress-nginx':
        return { namespaces: ['ingress-nginx'], labelSelectors: ['app.kubernetes.io/name=ingress-nginx', 'app=ingress-nginx'] };
      case 'knative-serving':
        return { namespaces: ['knative-serving', 'kourier-system'], labelSelectors: ['app.kubernetes.io/part-of=knative-serving'] };
      case 'kube-prometheus-stack':
        return { namespaces: ['monitoring'], labelSelectors: ['app.kubernetes.io/name=kube-prometheus-stack', 'app.kubernetes.io/instance=kube-prometheus-stack'] };
      default:
        return {};
    }
  }

  private getOperatorCRDHints(name: string): string[] {
    switch (name) {
      case 'cloudnative-pg':
        return [
          'clusters.postgresql.cnpg.io',
          'backups.postgresql.cnpg.io',
        ];
      case 'cert-manager':
        return ['certificates.cert-manager.io', 'issuers.cert-manager.io'];
      case 'knative-serving':
        return ['services.serving.knative.dev'];
      default:
        return [];
    }
  }

  private formatAge(timestamp?: string): string {
    if (!timestamp) return 'unknown';
    const now = Date.now();
    const created = new Date(timestamp).getTime();
    const diff = Math.max(0, now - created);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}d`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h`;
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}m`;
  }
}

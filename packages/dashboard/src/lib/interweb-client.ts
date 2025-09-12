import { InterwebClient as K8s } from '@interweb/interwebjs';
import { SetupClient } from '@interweb/client';
import { ManifestLoader } from '@interweb/manifests';

export interface PostgresClusterConfig {
  name: string;
  namespace: string;
  replicas: number;
  version: string;
  storage: {
    size: string;
    storageClass: string;
  };
  resources?: {
    limits: {
      cpu: string;
      memory: string;
    };
    requests: {
      cpu: string;
      memory: string;
    };
  };
  backup?: {
    enabled: boolean;
    schedule?: string;
    retention?: string;
    objectStore?: {
      destinationPath: string;
      endpointURL?: string;
      credentials?: {
        accessKeyId: string;
        secretAccessKey: string;
      };
    };
  };
}

export interface SecretConfig {
  name: string;
  namespace: string;
  type: 'Opaque' | 'kubernetes.io/dockerconfigjson' | 'kubernetes.io/tls';
  data: Record<string, string>;
}

export interface OperatorInfo {
  name: string;
  displayName: string;
  description: string;
  version: string;
  status: 'installed' | 'not-installed' | 'installing' | 'error';
  icon?: string;
  docsUrl?: string;
  namespace?: string;
}

export interface ClusterStatus {
  healthy: boolean;
  nodeCount: number;
  podCount: number;
  serviceCount: number;
  operatorCount: number;
  version: string;
  nodes: Array<{
    name: string;
    status: string;
    version: string;
    roles: string[];
  }>;
}

export interface DatabaseCluster {
  name: string;
  namespace: string;
  status: 'ready' | 'creating' | 'updating' | 'error';
  replicas: number;
  readyReplicas: number;
  version: string;
  storage: string;
  primary?: string;
  created: string;
  lastBackup?: string;
}

export class DashboardClient {
  private k8sClient: K8s;
  private setupClient: SetupClient;

  constructor() {
    this.k8sClient = new K8s({ 
      restEndpoint: process.env.KUBERNETES_PROXY_URL || 'http://127.0.0.1:8001' 
    } as any);
    this.setupClient = new SetupClient(this.k8sClient);
  }

  get k8s() { return this.k8sClient; }
  get setup() { return this.setupClient; }

  // Cluster operations
  async getClusterStatus(): Promise<ClusterStatus> {
    try {
      // Get nodes
      const nodesResponse = await this.k8sClient.api.v1.listNode();
      const nodes = nodesResponse.body.items?.map(node => ({
        name: node.metadata?.name || '',
        status: node.status?.conditions?.find(c => c.type === 'Ready')?.status === 'True' ? 'Ready' : 'NotReady',
        version: node.status?.nodeInfo?.kubeletVersion || '',
        roles: Object.keys(node.metadata?.labels || {})
          .filter(label => label.includes('node-role.kubernetes.io'))
          .map(role => role.replace('node-role.kubernetes.io/', ''))
      })) || [];

      // Get all pods across namespaces
      const podsResponse = await this.k8sClient.api.v1.listPodForAllNamespaces();
      const podCount = podsResponse.body.items?.length || 0;

      // Get all services across namespaces
      const servicesResponse = await this.k8sClient.api.v1.listServiceForAllNamespaces();
      const serviceCount = servicesResponse.body.items?.length || 0;

      // Get version info
      const versionResponse = await this.k8sClient.coreApi.getCodeVersion();
      const version = versionResponse.body.gitVersion || 'unknown';

      return {
        healthy: nodes.every(node => node.status === 'Ready'),
        nodeCount: nodes.length,
        podCount,
        serviceCount,
        operatorCount: await this.getInstalledOperatorCount(),
        version,
        nodes
      };
    } catch (error) {
      console.error('Failed to get cluster status:', error);
      throw new Error('Failed to get cluster status');
    }
  }

  private async getInstalledOperatorCount(): Promise<number> {
    try {
      // Check for common operator deployments
      const deployments = await this.k8sClient.appsApi.listDeploymentForAllNamespaces();
      const operatorDeployments = deployments.body.items?.filter(deployment => 
        deployment.metadata?.name?.includes('operator') ||
        deployment.metadata?.name?.includes('controller') ||
        deployment.metadata?.labels?.['app.kubernetes.io/component'] === 'operator'
      ) || [];
      return operatorDeployments.length;
    } catch (error) {
      console.warn('Failed to count operators:', error);
      return 0;
    }
  }

  // Operator operations
  async getOperators(): Promise<OperatorInfo[]> {
    const supportedOperators = [
      {
        name: 'ingress-nginx',
        displayName: 'NGINX Ingress Controller',
        description: 'Ingress controller for Kubernetes using NGINX as a reverse proxy and load balancer',
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
        description: 'Kubernetes-based platform to deploy and manage modern serverless workloads',
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
        description: 'Kubernetes monitoring stack with Prometheus, Grafana, and Alertmanager',
        docsUrl: 'https://prometheus.io/',
      },
    ];

    // Check installation status for each operator
    const operatorsWithStatus = await Promise.all(
      supportedOperators.map(async (op) => {
        const status = await this.getOperatorStatus(op.name);
        return {
          ...op,
          version: await this.getOperatorVersion(op.name),
          status,
        };
      })
    );

    return operatorsWithStatus;
  }

  async installOperator(operatorName: string, config?: any): Promise<void> {
    try {
      const manifests = ManifestLoader.loadOperatorManifests(operatorName);
      await this.setupClient.applyManifests(manifests);
    } catch (error) {
      console.error(`Failed to install operator ${operatorName}:`, error);
      throw new Error(`Failed to install operator ${operatorName}`);
    }
  }

  async uninstallOperator(operatorName: string): Promise<void> {
    try {
      const manifests = ManifestLoader.loadOperatorManifests(operatorName);
      await this.setupClient.deleteManifests(manifests);
    } catch (error) {
      console.error(`Failed to uninstall operator ${operatorName}:`, error);
      throw new Error(`Failed to uninstall operator ${operatorName}`);
    }
  }

  async getOperatorStatus(operatorName: string): Promise<OperatorInfo['status']> {
    try {
      // Check for operator deployments based on common naming patterns
      const deployments = await this.k8sClient.appsApi.listDeploymentForAllNamespaces();
      const operatorDeployment = deployments.body.items?.find(deployment => 
        deployment.metadata?.name?.includes(operatorName) ||
        deployment.metadata?.labels?.['app.kubernetes.io/name'] === operatorName
      );

      if (!operatorDeployment) {
        return 'not-installed';
      }

      const readyReplicas = operatorDeployment.status?.readyReplicas || 0;
      const replicas = operatorDeployment.spec?.replicas || 0;

      if (readyReplicas === replicas && replicas > 0) {
        return 'installed';
      } else if (replicas > 0) {
        return 'installing';
      } else {
        return 'error';
      }
    } catch (error) {
      console.warn(`Failed to get status for operator ${operatorName}:`, error);
      return 'not-installed';
    }
  }

  private async getOperatorVersion(operatorName: string): Promise<string> {
    try {
      // Try to get version from deployment labels or annotations
      const deployments = await this.k8sClient.appsApi.listDeploymentForAllNamespaces();
      const operatorDeployment = deployments.body.items?.find(deployment => 
        deployment.metadata?.name?.includes(operatorName) ||
        deployment.metadata?.labels?.['app.kubernetes.io/name'] === operatorName
      );

      if (operatorDeployment) {
        return operatorDeployment.metadata?.labels?.['app.kubernetes.io/version'] || 
               operatorDeployment.metadata?.annotations?.['version'] || 
               'unknown';
      }
      return 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  // Database operations (CloudNativePG)
  async createPostgresCluster(config: PostgresClusterConfig): Promise<void> {
    const clusterManifest = this.generatePostgresClusterManifest(config);
    await this.setupClient.applyManifests([clusterManifest]);
  }

  async deletePostgresCluster(name: string, namespace: string): Promise<void> {
    // Implementation to delete PostgreSQL cluster
    try {
      await this.k8sClient.deleteNamespacedCustomObject(
        'postgresql.cnpg.io',
        'v1',
        namespace,
        'clusters',
        name
      );
    } catch (error) {
      console.error('Failed to delete PostgreSQL cluster:', error);
      throw new Error('Failed to delete PostgreSQL cluster');
    }
  }

  async getPostgresClusters(namespace?: string): Promise<DatabaseCluster[]> {
    try {
      // Get CloudNativePG clusters
      const clusters = namespace
        ? await this.k8sClient.listNamespacedCustomObject('postgresql.cnpg.io', 'v1', namespace, 'clusters')
        : await this.k8sClient.listClusterCustomObject('postgresql.cnpg.io', 'v1', 'clusters');

      return (clusters.body.items || []).map((cluster: any) => ({
        name: cluster.metadata.name,
        namespace: cluster.metadata.namespace,
        status: this.mapClusterStatus(cluster.status?.phase),
        replicas: cluster.spec.instances || 1,
        readyReplicas: cluster.status?.readyInstances || 0,
        version: cluster.spec.imageName?.split(':')[1] || 'unknown',
        storage: cluster.spec.storage?.size || 'unknown',
        primary: cluster.status?.currentPrimary,
        created: cluster.metadata.creationTimestamp,
        lastBackup: cluster.status?.firstRecoverabilityPoint,
      }));
    } catch (error) {
      console.error('Failed to get PostgreSQL clusters:', error);
      return [];
    }
  }

  private mapClusterStatus(phase?: string): DatabaseCluster['status'] {
    switch (phase) {
      case 'Cluster in healthy state': return 'ready';
      case 'Setting up cluster': return 'creating';
      case 'Applying cluster update': return 'updating';
      default: return 'error';
    }
  }

  private generatePostgresClusterManifest(config: PostgresClusterConfig) {
    return {
      apiVersion: 'postgresql.cnpg.io/v1',
      kind: 'Cluster',
      metadata: {
        name: config.name,
        namespace: config.namespace,
      },
      spec: {
        instances: config.replicas,
        imageName: `ghcr.io/cloudnative-pg/postgresql:${config.version}`,
        storage: {
          size: config.storage.size,
          storageClass: config.storage.storageClass,
        },
        resources: config.resources,
        backup: config.backup?.enabled ? {
          retentionPolicy: config.backup.retention || '30d',
          barmanObjectStore: config.backup.objectStore,
        } : undefined,
      },
    };
  }

  // Secret operations
  async createSecret(secret: SecretConfig): Promise<void> {
    const secretManifest = {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        name: secret.name,
        namespace: secret.namespace,
      },
      type: secret.type,
      data: Object.fromEntries(
        Object.entries(secret.data).map(([key, value]) => [key, btoa(value)])
      ),
    };

    await this.setupClient.applyManifests([secretManifest]);
  }

  async getSecrets(namespace?: string): Promise<Array<{
    name: string;
    namespace: string;
    type: string;
    age: string;
    keys: string[];
  }>> {
    try {
      const secrets = namespace
        ? await this.k8sClient.api.v1.listNamespacedSecret(namespace)
        : await this.k8sClient.api.v1.listSecretForAllNamespaces();

      return (secrets.body.items || []).map(secret => ({
        name: secret.metadata?.name || '',
        namespace: secret.metadata?.namespace || '',
        type: secret.type || '',
        age: this.calculateAge(secret.metadata?.creationTimestamp),
        keys: Object.keys(secret.data || {}),
      }));
    } catch (error) {
      console.error('Failed to get secrets:', error);
      return [];
    }
  }

  private calculateAge(timestamp?: string): string {
    if (!timestamp) return 'unknown';
    const now = new Date();
    const created = new Date(timestamp);
    const diff = now.getTime() - created.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}d`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h`;
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}m`;
  }
}

// Singleton instance
export const dashboardClient = new DashboardClient();

import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs';
import { ManifestLoader, SUPPORTED_OPERATORS, KubernetesResource } from '@interweb/manifests';
import { ClusterSetupConfig, ApplicationConfig, DeploymentStatus, InterwebClientConfig, OperatorConfig } from './types';
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
}

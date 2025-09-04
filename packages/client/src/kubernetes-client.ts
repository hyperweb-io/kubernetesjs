import { KubernetesClient } from 'kubernetesjs';
import { ClusterSetupConfig, ApplicationConfig, DeploymentStatus, InterwebClientConfig } from './types';
import axios from 'axios';

export class SetupClient {
  private client: KubernetesClient;
  private config: InterwebClientConfig;
  
  constructor(config?: InterwebClientConfig) {
    this.config = config || {};
    
    // KubernetesJS requires a REST endpoint, typically kubectl proxy
    const restEndpoint = this.config.restEndpoint || 
                        process.env.KUBERNETES_API_URL || 
                        'http://127.0.0.1:8001';
    
    this.client = new KubernetesClient({
      restEndpoint
    });
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

  /**
   * Create or update a namespace
   */
  async ensureNamespace(namespace: string): Promise<void> {
    try {
      await this.client.readCoreV1Namespace({
        path: { name: namespace },
        query: {}
      });
    } catch (error: any) {
      if (error.status === 404 || error.message?.includes('404')) {
        // Namespace doesn't exist, create it
        await this.client.createCoreV1Namespace({
          body: {
            apiVersion: 'v1',
            kind: 'Namespace',
            metadata: {
              name: namespace
            }
          },
          query: {}
        });
        console.log(`Created namespace: ${namespace}`);
      } else {
        throw error;
      }
    }
  }

  /**
   * Install operators based on cluster setup configuration
   */
  async installOperators(config: ClusterSetupConfig): Promise<void> {
    const namespace = config.metadata.namespace || 'interweb-system';
    await this.ensureNamespace(namespace);

    for (const operator of config.spec.operators) {
      if (!operator.enabled) {
        console.log(`Skipping disabled operator: ${operator.name}`);
        continue;
      }

      console.log(`Installing operator: ${operator.name}`);
      
      switch (operator.name) {
        case 'knative-serving':
          await this.installKnativeServing(operator.version, namespace);
          break;
        case 'cloudnative-pg':
          await this.installCloudNativePG(operator.version, namespace);
          break;
        case 'cert-manager':
          await this.installCertManager(operator.version, namespace);
          break;
        case 'ingress-nginx':
          await this.installIngressNginx(namespace);
          break;
        default:
          console.warn(`Unknown operator: ${operator.name}`);
      }
    }
  }

  /**
   * Deploy an application based on application configuration
   */
  async deployApplication(config: ApplicationConfig): Promise<void> {
    const namespace = config.metadata.namespace || 'default';
    await this.ensureNamespace(namespace);

    if (config.spec.database) {
      await this.deployDatabase(config.spec.database, namespace);
    }

    if (config.spec.services) {
      for (const service of config.spec.services) {
        await this.deployService(service, namespace);
      }
    }

    if (config.spec.ingress?.enabled) {
      await this.deployIngress(config.spec.ingress, namespace);
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

  /**
   * Delete resources for an application
   */
  async deleteApplication(config: ApplicationConfig): Promise<void> {
    const namespace = config.metadata.namespace || 'default';
    
    try {
      // Delete deployments
      const deployments = await this.client.listAppsV1NamespacedDeployment({
        path: { namespace },
        query: {}
      });
      const appDeployments = deployments.items.filter(
        (dep: any) => dep.metadata?.labels?.['app.interweb.dev/instance'] === config.metadata.name
      );

      for (const deployment of appDeployments) {
        await this.client.deleteAppsV1NamespacedDeployment({
          path: { name: deployment.metadata!.name!, namespace },
          query: {}
        });
        console.log(`Deleted deployment: ${deployment.metadata!.name}`);
      }

      // Delete services
      const services = await this.client.listCoreV1NamespacedService({
        path: { namespace },
        query: {}
      });
      const appServices = services.items.filter(
        (svc: any) => svc.metadata?.labels?.['app.interweb.dev/instance'] === config.metadata.name
      );

      for (const service of appServices) {
        await this.client.deleteCoreV1NamespacedService({
          path: { name: service.metadata!.name!, namespace },
          query: {}
        });
        console.log(`Deleted service: ${service.metadata!.name}`);
      }
    } catch (error) {
      console.error('Failed to delete application resources:', error);
      throw error;
    }
  }

  // Private helper methods for installing operators
  private async installKnativeServing(version?: string, namespace: string = 'knative-serving'): Promise<void> {
    // This would typically use Helm or apply YAML manifests
    // For now, we'll create a placeholder deployment
    console.log(`Installing Knative Serving ${version || 'latest'} in namespace ${namespace}`);
    await this.ensureNamespace(namespace);
  }

  private async installCloudNativePG(version?: string, namespace: string = 'cnpg-system'): Promise<void> {
    console.log(`Installing CloudNative-PG ${version || 'latest'} in namespace ${namespace}`);
    await this.ensureNamespace(namespace);
  }

  private async installCertManager(version?: string, namespace: string = 'cert-manager'): Promise<void> {
    console.log(`Installing cert-manager ${version || 'latest'} in namespace ${namespace}`);
    await this.ensureNamespace(namespace);
  }

  private async installIngressNginx(namespace: string = 'ingress-nginx'): Promise<void> {
    console.log(`Installing ingress-nginx in namespace ${namespace}`);
    await this.ensureNamespace(namespace);
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

  private async deployDatabase(dbConfig: any, namespace: string): Promise<void> {
    console.log(`Deploying ${dbConfig.type} database: ${dbConfig.name}`);
    // Implementation would create appropriate database resources
  }

  private async deployService(serviceConfig: any, namespace: string): Promise<void> {
    console.log(`Deploying service: ${serviceConfig.name}`);
    
    // Create deployment
    const deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: serviceConfig.name,
        namespace,
        labels: {
          'app.interweb.dev/name': serviceConfig.name,
          'app.interweb.dev/instance': serviceConfig.name
        }
      },
      spec: {
        replicas: serviceConfig.replicas || 1,
        selector: {
          matchLabels: {
            'app.interweb.dev/name': serviceConfig.name
          }
        },
        template: {
          metadata: {
            labels: {
              'app.interweb.dev/name': serviceConfig.name
            }
          },
          spec: {
            containers: [{
              name: serviceConfig.name,
              image: serviceConfig.image,
              ports: [{
                containerPort: serviceConfig.port
              }],
              env: Object.entries(serviceConfig.env || {}).map(([key, value]) => ({
                name: key,
                value: String(value)
              })),
              resources: serviceConfig.resources || {}
            }]
          }
        }
      }
    };

    await this.client.createAppsV1NamespacedDeployment({
      path: { namespace },
      body: deployment,
      query: {}
    });

    // Create service
    const service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: serviceConfig.name,
        namespace,
        labels: {
          'app.interweb.dev/name': serviceConfig.name,
          'app.interweb.dev/instance': serviceConfig.name
        }
      },
      spec: {
        selector: {
          'app.interweb.dev/name': serviceConfig.name
        },
        ports: [{
          port: serviceConfig.port,
          targetPort: serviceConfig.port
        }]
      }
    };

    await this.client.createCoreV1NamespacedService({
      path: { namespace },
      body: service,
      query: {}
    });
  }

  private async deployIngress(ingressConfig: any, namespace: string): Promise<void> {
    console.log('Deploying ingress configuration');
    // Implementation would create ingress resources
  }
}

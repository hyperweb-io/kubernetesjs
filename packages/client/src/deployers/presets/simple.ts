import { KubernetesResource } from '@kubernetesjs/ops';
import { applyKubernetesResource, deleteKubernetesResource } from '../../apply';
import { BaseTemplateDeployer, TemplateDeployOptions, TemplateDeployResult, TemplateUninstallOptions, TemplateUninstallResult } from './base';

export interface SimpleTemplateConfig {
  image: string;
  port: number;
  env?: { [key: string]: string };
  volumes?: {
    name: string;
    mountPath: string;
    size?: string;
  }[];
  replicas?: number;
  serviceType?: 'ClusterIP' | 'NodePort' | 'LoadBalancer';
  resources?: {
    requests?: { cpu?: string; memory?: string };
    limits?: { cpu?: string; memory?: string };
  };
}

export class SimpleTemplateDeployer extends BaseTemplateDeployer {
  private config: SimpleTemplateConfig;

  constructor(
    kubeClient: any,
    templateId: string,
    config: SimpleTemplateConfig,
    logger?: (message: string) => void
  ) {
    super(kubeClient, templateId, logger);
    this.config = config;
  }

  async deploy(options: TemplateDeployOptions): Promise<TemplateDeployResult> {
    const name = options.name || this.templateId;
    const namespace = options.namespace || 'default';

    try {
      this.log(`Deploying ${this.templateId} template as ${name} in namespace ${namespace}`);

      // Check if already deployed
      if (await this.isDeployed(name, namespace)) {
        return {
          templateId: this.templateId,
          name,
          namespace,
          status: 'deployed',
          message: 'Template already deployed'
        };
      }

      // Create namespace if it doesn't exist
      await this.ensureNamespace(namespace);

      // Create deployment
      const deployment = this.createDeployment(name, namespace, options);
      await applyKubernetesResource(this.kube, deployment);
      this.log(`✓ Created deployment ${name}`);

      // Create service
      const service = this.createService(name, namespace);
      await applyKubernetesResource(this.kube, service);
      this.log(`✓ Created service ${name}`);

      // Wait for deployment to be ready
      await this.waitForReady(name, namespace);

      // Get service endpoints
      const endpoints = await this.getEndpoints(name, namespace);

      return {
        templateId: this.templateId,
        name,
        namespace,
        status: 'deployed',
        message: 'Template deployed successfully',
        endpoints
      };

    } catch (error: any) {
      this.log(`✗ Failed to deploy ${this.templateId}: ${error.message}`);
      return {
        templateId: this.templateId,
        name,
        namespace,
        status: 'failed',
        message: error.message
      };
    }
  }

  async uninstall(options: TemplateUninstallOptions): Promise<TemplateUninstallResult> {
    const name = options.name || this.templateId;
    const namespace = options.namespace || 'default';

    try {
      this.log(`Uninstalling ${this.templateId} template ${name} from namespace ${namespace}`);

      // Delete service
      try {
        const service = this.createService(name, namespace);
        await deleteKubernetesResource(this.kube, service);
        this.log(`✓ Deleted service ${name}`);
      } catch (error: any) {
        if (!error.message.includes('404')) {
          throw error;
        }
      }

      // Delete deployment
      try {
        const deployment = this.createDeployment(name, namespace, {});
        await deleteKubernetesResource(this.kube, deployment);
        this.log(`✓ Deleted deployment ${name}`);
      } catch (error: any) {
        if (!error.message.includes('404')) {
          throw error;
        }
      }

      return {
        templateId: this.templateId,
        name,
        namespace,
        status: 'uninstalled',
        message: 'Template uninstalled successfully'
      };

    } catch (error: any) {
      this.log(`✗ Failed to uninstall ${this.templateId}: ${error.message}`);
      return {
        templateId: this.templateId,
        name,
        namespace,
        status: 'failed',
        message: error.message
      };
    }
  }

  async isDeployed(name: string, namespace: string): Promise<boolean> {
    try {
      await this.kube.readAppsV1NamespacedDeployment({ 
        path: { namespace, name }, 
        query: {} 
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getStatus(name: string, namespace: string): Promise<'deployed' | 'deploying' | 'failed' | 'not-found'> {
    try {
      const response = await this.kube.readAppsV1NamespacedDeployment({ 
        path: { namespace, name }, 
        query: {} 
      });
      const status = response.status;

      if (!status) {
        return 'deploying';
      }

      const replicas = status.replicas || 0;
      const readyReplicas = status.readyReplicas || 0;
      const unavailableReplicas = status.unavailableReplicas || 0;

      if (readyReplicas === replicas && unavailableReplicas === 0) {
        return 'deployed';
      }

      if (status.conditions?.some((c: any) => c.type === 'Progressing' && c.status === 'False')) {
        return 'failed';
      }

      return 'deploying';
    } catch (error) {
      return 'not-found';
    }
  }

  protected createDeployment(name: string, namespace: string, options: TemplateDeployOptions): KubernetesResource {
    const labels = this.generateLabels(this.templateId, name);
    const replicas = this.config.replicas || 1;

    return {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name,
        namespace,
        labels
      },
      spec: {
        replicas,
        selector: {
          matchLabels: labels
        },
        template: {
          metadata: {
            labels
          },
          spec: {
            containers: [{
              name: this.templateId,
              image: this.config.image,
              ports: [{
                containerPort: this.config.port,
                name: 'http'
              }],
              env: this.buildEnvVars(options),
              resources: this.config.resources,
              volumeMounts: this.config.volumes?.map(v => ({
                name: v.name,
                mountPath: v.mountPath
              }))
            }],
            volumes: this.config.volumes?.map(v => ({
              name: v.name,
              emptyDir: {}
            }))
          }
        }
      }
    };
  }

  protected createService(name: string, namespace: string): KubernetesResource {
    const labels = this.generateLabels(this.templateId, name);

    return {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name,
        namespace,
        labels
      },
      spec: {
        type: this.config.serviceType || 'ClusterIP',
        ports: [{
          port: this.config.port,
          targetPort: this.config.port,
          name: 'http'
        }],
        selector: labels
      }
    };
  }

  private buildEnvVars(options: TemplateDeployOptions): Array<{ name: string; value: string }> {
    const envVars: Array<{ name: string; value: string }> = [];

    // Add template-specific env vars
    if (this.config.env) {
      Object.entries(this.config.env).forEach(([key, value]) => {
        envVars.push({ name: key, value });
      });
    }

    // Add options as env vars (if they're strings)
    Object.entries(options).forEach(([key, value]) => {
      if (typeof value === 'string' && key !== 'name' && key !== 'namespace') {
        envVars.push({ 
          name: key.toUpperCase().replace(/[^A-Z0-9]/g, '_'), 
          value 
        });
      }
    });

    return envVars;
  }

  private async ensureNamespace(namespace: string): Promise<void> {
    if (namespace === 'default') return;

    try {
      await this.kube.readCoreV1Namespace({ 
        path: { name: namespace }, 
        query: {} 
      });
    } catch (error: any) {
      if (error.message.includes('404')) {
        const namespaceResource: KubernetesResource = {
          apiVersion: 'v1',
          kind: 'Namespace',
          metadata: { name: namespace }
        };
        await applyKubernetesResource(this.kube, namespaceResource);
        this.log(`✓ Created namespace ${namespace}`);
      }
    }
  }

  private async getEndpoints(name: string, namespace: string): Promise<any> {
    try {
      const service = await this.kube.readCoreV1NamespacedService({ 
        path: { namespace, name }, 
        query: {} 
      });
      
      return {
        [name]: {
          host: `${name}.${namespace}.svc.cluster.local`,
          port: this.config.port,
          url: `http://${name}.${namespace}.svc.cluster.local:${this.config.port}`
        }
      };
    } catch (error) {
      return {};
    }
  }
}
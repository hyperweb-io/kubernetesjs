import {
  BaseTemplateDeployer,
  TemplateDeployOptions,
  TemplateDeployResult,
  TemplateUninstallOptions,
  TemplateUninstallResult,
} from './base';
import { PostgresDeployer, PostgresDeployOptions, DeployResult, connectionInfo } from '../postgres';
import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs';

/**
 * Wrapper to adapt PostgresDeployer to the template interface
 */
export class PostgresTemplateWrapper extends BaseTemplateDeployer {
  constructor(private postgresDeployer: PostgresDeployer, kube: InterwebKubernetesClient, log: (msg: string) => void) {
    super(kube, 'postgres', log);
  }

  async deploy(options: TemplateDeployOptions): Promise<TemplateDeployResult> {
    try {
      // Convert template options to postgres options
      const postgresOptions: PostgresDeployOptions = {
        name: options.name || 'postgres',
        namespace: options.namespace || 'default',
        instances: 1,
        storage: '10Gi',
        imageName: 'ghcr.io/cloudnative-pg/postgresql:16.4',
        superuserUsername: 'postgres',
        superuserPassword: 'postgres',
        appUsername: 'appuser',
        appPassword: 'postgres',
        enablePooler: false,
        ...options.config,
      };

      const result: DeployResult = await this.postgresDeployer.deploy(postgresOptions);
      const connInfo = connectionInfo(result, postgresOptions.appUsername, postgresOptions.appPassword);
      
      return {
        templateId: 'postgres',
        name: options.name || 'postgres',
        namespace: options.namespace || 'default',
        status: 'deployed',
        message: 'PostgreSQL deployed successfully',
        endpoints: {
          postgres: {
            host: connInfo.direct.host,
            port: connInfo.direct.port,
            url: connInfo.direct.url,
          },
          ...(connInfo.pooled ? {
            'postgres-pooled': {
              host: connInfo.pooled.host,
              port: connInfo.pooled.port,
              url: connInfo.pooled.url,
            }
          } : {}),
        },
      };
    } catch (error) {
      return {
        templateId: 'postgres',
        name: options.name || 'postgres',
        namespace: options.namespace || 'default',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async uninstall(options: TemplateUninstallOptions): Promise<TemplateUninstallResult> {
    try {
      const name = options.name || 'postgres';
      const namespace = options.namespace || 'default';
      
      // Delete the cluster first, which should cascade delete related resources
      try {
        await this.kube.deletePostgresqlCnpgIoV1NamespacedCluster({
          path: { namespace, name },
          query: {}
        });
      } catch (error) {
        // Ignore 404 errors (already deleted)
        if (!String(error).includes('404')) {
          this.log(`Warning: Failed to delete cluster: ${error}`);
        }
      }
      
      // Clean up secrets
       const secretNames = ['postgres-superuser', 'postgres-app-user'];
       for (const secretName of secretNames) {
         try {
           await this.kube.deleteCoreV1NamespacedSecret({
             path: { namespace, name: secretName },
             query: {}
           });
         } catch (error) {
           // Ignore 404 errors (already deleted)
           if (!String(error).includes('404')) {
             this.log(`Warning: Failed to delete secret ${secretName}: ${error}`);
           }
         }
       }
      
      // Clean up any stuck jobs
      try {
        const jobs = await this.kube.listBatchV1NamespacedJob({
          path: { namespace },
          query: { labelSelector: `app.kubernetes.io/name=${name}` }
        });
        
        for (const job of jobs.items || []) {
          if (job.metadata?.name) {
            try {
              await this.kube.deleteBatchV1NamespacedJob({
                path: { namespace, name: job.metadata.name },
                query: { propagationPolicy: 'Background' }
              });
            } catch (error) {
              if (!String(error).includes('404')) {
                this.log(`Warning: Failed to delete job ${job.metadata.name}: ${error}`);
              }
            }
          }
        }
      } catch (error) {
        this.log(`Warning: Failed to list/delete jobs: ${error}`);
      }
      
      return {
        templateId: 'postgres',
        name,
        namespace,
        status: 'uninstalled',
        message: 'PostgreSQL uninstalled successfully',
      };
    } catch (error) {
      return {
        templateId: 'postgres',
        name: options.name || 'postgres',
        namespace: options.namespace || 'default',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async isDeployed(name: string, namespace: string): Promise<boolean> {
    try {
      const cluster = await this.kube.readPostgresqlCnpgIoV1NamespacedCluster({
        path: { namespace, name },
        query: {}
      });
      const phase: string = cluster.status?.phase || '';
      return String(phase).toLowerCase().includes('healthy');
    } catch (error) {
      return false;
    }
  }

  async getStatus(name: string, namespace: string): Promise<'deployed' | 'deploying' | 'failed' | 'not-found'> {
    try {
      const cluster = await this.kube.readPostgresqlCnpgIoV1NamespacedCluster({
        path: { namespace, name },
        query: {}
      });
      const phase: string = cluster.status?.phase || '';
      const instances = cluster.status?.readyInstances ?? 0;
      const desired = cluster.spec?.instances ?? 0;
      
      if (String(phase).toLowerCase().includes('healthy') && instances >= desired && desired > 0) {
        return 'deployed';
      } else if (phase) {
        return 'deploying';
      } else {
        return 'failed';
      }
    } catch (error) {
      if (String(error).includes('404')) {
        return 'not-found';
      }
      return 'failed';
    }
  }

  async waitForReady(name: string, namespace: string, timeoutMs: number): Promise<void> {
    await this.postgresDeployer.waitForClusterReady(name, namespace, timeoutMs);
  }
}
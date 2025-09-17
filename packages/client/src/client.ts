import chalk from 'chalk';
import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs';
import { ConfigLoader } from './config-loader';
import { SetupClient } from './setup';
import { PostgresDeployer, PostgresDeployOptions, DeployResult, connectionInfo } from './postgres';
import {
  ClusterSetupConfig,
  ApplicationConfig,
  DeploymentStatus,
  InterwebClientConfig
} from './types';

export interface InterwebContext {
  namespace?: string;
  kubeconfig?: string;
  context?: string;
  verbose?: boolean;
  timeout?: string;
  restEndpoint?: string;
}

export class Client {
  private setupClient: SetupClient;
  private ctx: InterwebContext;
  private kubeClient: InterwebKubernetesClient;
  private pg?: PostgresDeployer;
  
  constructor(ctx: InterwebContext = {}) {
    this.ctx = ctx;
    this.kubeClient = new InterwebKubernetesClient({
      kubeconfig: ctx.kubeconfig,
      namespace: ctx.namespace,
      context: ctx.context,
      restEndpoint: ctx.restEndpoint
    });
    this.setupClient = new SetupClient(this.kubeClient, ctx.namespace || 'default');
    this.pg = new PostgresDeployer(this.kubeClient, this.setupClient, (m) => this.log(m));
  }

  /**
   * Set up a cluster with the specified configuration
   */
  async setupCluster(configPath: string): Promise<void> {
    try {
      this.log('Loading cluster setup configuration...');
      const config = ConfigLoader.loadClusterSetup(configPath);
      
      this.log(`Setting up cluster: ${config.metadata.name}`);
      
      // Check Kubernetes connection
      const connected = await this.setupClient.checkConnection();
      if (!connected) {
        throw new Error('Unable to connect to Kubernetes cluster');
      }
      
      this.log('✓ Kubernetes cluster connection verified');
      
      // Install operators
      await this.setupClient.installOperators(config);
      
      this.log('✓ Cluster setup completed successfully');
    } catch (error) {
      this.log(`✗ Cluster setup failed: ${error}`);
      throw error;
    }
  }

  /**
   * Deploy a PostgreSQL database using CloudNativePG (operator must be installed).
   * Returns connection endpoints once ready.
   */
  async deployPostgres(options: PostgresDeployOptions = {}): Promise<DeployResult> {
    if (!this.pg) {
      this.pg = new PostgresDeployer(this.kubeClient, this.setupClient, (m) => this.log(m));
    }
    const res = await this.pg.deploy(options);
    const info = connectionInfo(res, options.appUsername ?? 'appuser', options.appPassword ?? 'appuser123!');
    this.log('PostgreSQL connection info:');
    this.log(`  Direct: ${info.direct.url}`);
    if (info.pooled?.url) this.log(`  Pooled: ${info.pooled.url}`);
    return res;
  }

  /**
   * Deploy an application with the specified configuration
   */
  // async deployApplication(configPath: string): Promise<void> {
  //   try {
  //     this.log('Loading application configuration...');
  //     const config = ConfigLoader.loadApplication(configPath);
      
  //     this.log(`Deploying application: ${config.metadata.name}`);
      
  //     // Check Kubernetes connection
  //     const connected = await this.setupClient.checkConnection();
  //     if (!connected) {
  //       throw new Error('Unable to connect to Kubernetes cluster');
  //     }
      
  //     // Deploy application
  //     await this.setupClient.installOperators(config);
      
  //     this.log('✓ Application deployed successfully');
  //   } catch (error) {
  //     this.log(`✗ Application deployment failed: ${error}`);
  //     throw error;
  //   }
  // }

  /**
   * Get the status of a cluster setup
   */
  async getClusterStatus(configPath: string): Promise<DeploymentStatus> {
    try {
      const config = ConfigLoader.loadClusterSetup(configPath);
      const status = await this.setupClient.getClusterSetupStatus(config);
      
      this.displayStatus('Cluster Setup', status);
      return status;
    } catch (error) {
      this.log(`✗ Failed to get cluster status: ${error}`);
      throw error;
    }
  }

  /**
   * Get the status of an application deployment
   */
  async getApplicationStatus(configPath: string): Promise<DeploymentStatus> {
    try {
      const config = ConfigLoader.loadApplication(configPath);
      const status = await this.setupClient.getApplicationStatus(config);
      
      this.displayStatus('Application', status);
      return status;
    } catch (error) {
      this.log(`✗ Failed to get application status: ${error}`);
      throw error;
    }
  }

  /**
   * Wait for a cluster setup to be ready
   */
  async waitForCluster(configPath: string, timeoutMs: number = 600000): Promise<void> {
    const startTime = Date.now();
    const config = ConfigLoader.loadClusterSetup(configPath);
    
    this.log(`Waiting for cluster ${config.metadata.name} to be ready...`);
    
    while (Date.now() - startTime < timeoutMs) {
      const status = await this.setupClient.getClusterSetupStatus(config);
      
      if (status.phase === 'ready') {
        this.log(chalk.green('✓ Cluster is ready!'));
        return;
      }
      
      if (status.phase === 'failed') {
        throw new Error(`Cluster setup failed: ${status.message}`);
      }
      
      this.log(`Cluster status: ${status.phase} - ${status.message}`);
      await this.sleep(5000); // Wait 5 seconds before checking again
    }
    
    throw new Error('Timeout waiting for cluster to be ready');
  }

  /**
   * Wait for an application to be ready
   */
  async waitForApplication(configPath: string, timeoutMs: number = 300000): Promise<void> {
    const startTime = Date.now();
    const config = ConfigLoader.loadApplication(configPath);
    
    this.log(`Waiting for application ${config.metadata.name} to be ready...`);
    
    while (Date.now() - startTime < timeoutMs) {
      const status = await this.setupClient.getApplicationStatus(config);
      
      if (status.phase === 'ready') {
        this.log(chalk.green('✓ Application is ready!'));
        return;
      }
      
      if (status.phase === 'failed') {
        throw new Error(`Application deployment failed: ${status.message}`);
      }
      
      this.log(`Application status: ${status.phase} - ${status.message}`);
      await this.sleep(5000); // Wait 5 seconds before checking again
    }
    
    throw new Error('Timeout waiting for application to be ready');
  }

  /**
   * Delete a cluster setup and all its resources
   */
  async deleteCluster(configPath: string): Promise<void> {
    try {
      this.log('Loading cluster setup configuration...');
      const config = ConfigLoader.loadClusterSetup(configPath);
      
      this.log(`Deleting cluster: ${config.metadata.name}`);
      
      await this.setupClient.deleteClusterSetup(config);
      
      this.log(chalk.green('✓ Cluster deleted successfully'));
    } catch (error) {
      this.log(chalk.red(`✗ Cluster deletion failed: ${error}`));
      throw error;
    }
  }

  /**
   * Delete an application and all its resources
   */
  // async deleteApplication(configPath: string): Promise<void> {
  //   try {
  //     this.log('Loading application configuration...');
  //     const config = ConfigLoader.loadApplication(configPath);
      
  //     this.log(`Deleting application: ${config.metadata.name}`);
      
  //     await this.setupClient.deleteApplication(config);
      
  //     this.log(chalk.green('✓ Application deleted successfully'));
  //   } catch (error) {
  //     this.log(chalk.red(`✗ Application deletion failed: ${error}`));
  //     throw error;
  //   }
  // }

  /**
   * Validate a configuration file
   */
  validateConfig(configPath: string, type: 'cluster' | 'application' = 'cluster'): boolean {
    try {
      if (type === 'cluster') {
        ConfigLoader.loadClusterSetup(configPath);
      } else {
        ConfigLoader.loadApplication(configPath);
      }
      
      this.log(chalk.green('✓ Configuration is valid'));
      return true;
    } catch (error) {
      this.log(chalk.red(`✗ Configuration validation failed: ${error}`));
      return false;
    }
  }

  /**
   * Generate a sample configuration file
   */
  generateSampleConfig(outputPath: string, type: 'cluster' | 'application' = 'cluster'): void {
    try {
      if (type === 'cluster') {
        const defaultConfig = ConfigLoader.getDefaultClusterSetup();
        ConfigLoader.saveConfig(defaultConfig, outputPath);
      } else {
        // Generate sample application config
        const sampleAppConfig = {
          apiVersion: 'interweb.dev/v1',
          kind: 'Application',
          metadata: {
            name: 'sample-app'
          },
          spec: {
            database: {
              type: 'postgresql' as const,
              name: 'postgres-cluster',
              namespace: 'postgres-db',
              config: {
                instances: 3,
                storage: '10Gi'
              }
            },
            services: [{
              name: 'api-server',
              image: 'nginx:latest',
              port: 80,
              replicas: 2,
              env: {
                'NODE_ENV': 'production'
              }
            }],
            ingress: {
              enabled: true,
              host: 'api.example.com',
              path: '/',
              tls: true
            }
          }
        };
        ConfigLoader.saveConfig(sampleAppConfig as any, outputPath);
      }
      
      this.log(chalk.green(`✓ Sample ${type} configuration saved to ${outputPath}`));
    } catch (error) {
      this.log(chalk.red(`✗ Failed to generate sample config: ${error}`));
      throw error;
    }
  }

  /**
   * List all interweb resources in the cluster
   */
  async listResources(): Promise<void> {
    try {
      // This would list all interweb-managed resources
      this.log('Listing interweb resources...');
      // Implementation would query Kubernetes for resources with interweb labels
      this.log('No resources found or feature not yet implemented');
    } catch (error) {
      this.log(chalk.red(`✗ Failed to list resources: ${error}`));
      throw error;
    }
  }

  private displayStatus(resourceType: string, status: DeploymentStatus): void {
    const phaseColor = status.phase === 'ready' ? 'green' : 
                      status.phase === 'failed' ? 'red' : 'yellow';
    
    this.log(`${resourceType} Status: ${chalk[phaseColor](status.phase.toUpperCase())}`);
    
    if (status.message) {
      this.log(`Message: ${status.message}`);
    }
    
    if (status.conditions && status.conditions.length > 0) {
      this.log('Conditions:');
      status.conditions.forEach(condition => {
        const conditionColor = condition.status === 'True' ? 'green' : 'red';
        this.log(`  ${condition.type}: ${chalk[conditionColor](condition.status)} - ${condition.message}`);
      });
    }
  }

  private log(message: string): void {
    if (this.ctx.verbose !== false) {
      console.log(message);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

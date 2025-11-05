import chalk from "chalk";
import { InterwebClient as InterwebKubernetesClient } from "@interweb/interwebjs";
import { ConfigLoader } from "./config-loader";
import { SetupClient } from "./setup";
import {
  PostgresDeployer,
  PostgresDeployOptions,
  DeployResult,
  connectionInfo,
} from "./deployers/postgres";
import {
  BaseTemplateDeployer,
  TemplateDeployOptions,
  TemplateDeployResult,
  TemplateUninstallOptions,
  TemplateUninstallResult,
} from "./deployers/presets/base";
import { MinioDeployer } from "./deployers/presets/minio";
import { OllamaDeployer } from "./deployers/presets/ollama";
import { PostgresTemplateWrapper } from "./deployers/presets/postgres";
import {
  ClusterSetupConfig,
  ApplicationConfig,
  DeploymentStatus,
  InterwebClientConfig,
} from "./types";

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
  private templateDeployers: Map<string, BaseTemplateDeployer> = new Map();

  constructor(ctx: InterwebContext = {}) {
    this.ctx = ctx;
    this.kubeClient = new InterwebKubernetesClient({
      kubeconfig: ctx.kubeconfig,
      namespace: ctx.namespace,
      context: ctx.context,
      restEndpoint: ctx.restEndpoint || 'http://127.0.0.1:8001'
    });
    this.setupClient = new SetupClient(
      this.kubeClient,
      ctx.namespace || "default"
    );
    this.pg = new PostgresDeployer(this.kubeClient, this.setupClient, (m) =>
      this.log(m)
    );
  }

  /**
   * Set up a cluster with the specified configuration
   */
  async setupCluster(configPath: string): Promise<void> {
    try {
      this.log("Loading cluster setup configuration...");
      const config = ConfigLoader.loadClusterSetup(configPath);

      this.log(`Setting up cluster: ${config.metadata.name}`);

      // Check Kubernetes connection
      const connected = await this.setupClient.checkConnection();
      if (!connected) {
        throw new Error("Unable to connect to Kubernetes cluster");
      }

      this.log("✓ Kubernetes cluster connection verified");

      // Install operators
      await this.setupClient.installOperators(config);

      this.log("✓ Cluster setup completed successfully");
    } catch (error) {
      this.log(`✗ Cluster setup failed: ${error}`);
      throw error;
    }
  }

  /**
   * Deploy a PostgreSQL database using CloudNativePG (operator must be installed).
   * Returns connection endpoints once ready.
   */
  async deployPostgres(
    options: PostgresDeployOptions = {}
  ): Promise<DeployResult> {
    if (!this.pg) {
      this.pg = new PostgresDeployer(this.kubeClient, this.setupClient, (m) =>
        this.log(m)
      );
    }
    const res = await this.pg.deploy(options);
    const info = connectionInfo(
      res,
      options.appUsername ?? "appuser",
      options.appPassword ?? "appuser123!"
    );
    this.log("PostgreSQL connection info:");
    this.log(`  Direct: ${info.direct.url}`);
    if (info.pooled?.url) this.log(`  Pooled: ${info.pooled.url}`);
    return res;
  }

  /**
   * Deploy a template (minio, ollama, postgres)
   */
  async deployTemplate(
    templateId: string,
    options: TemplateDeployOptions = {}
  ): Promise<TemplateDeployResult> {
    try {
      this.log(`Deploying template: ${templateId}`);
      
      const deployer = this.getTemplateDeployer(templateId);
      const result = await deployer.deploy(options);
      
      if (result.status === 'deployed') {
        this.log(`✓ Template ${templateId} deployed successfully`);
        if (result.endpoints) {
          this.log("Endpoints:");
          Object.entries(result.endpoints).forEach(([name, endpoint]) => {
            this.log(`  ${name}: ${endpoint.url || `${endpoint.host}:${endpoint.port}`}`);
          });
        }
      } else {
        this.log(`✗ Template ${templateId} deployment failed: ${result.message}`);
      }
      
      return result;
    } catch (error) {
      this.log(`✗ Template deployment failed: ${error}`);
      throw error;
    }
  }

  /**
   * Uninstall a template
   */
  async uninstallTemplate(
    templateId: string,
    options: TemplateUninstallOptions = {}
  ): Promise<TemplateUninstallResult> {
    try {
      this.log(`Uninstalling template: ${templateId}`);
      
      const deployer = this.getTemplateDeployer(templateId);
      const result = await deployer.uninstall(options);
      
      if (result.status === 'uninstalled') {
        this.log(`✓ Template ${templateId} uninstalled successfully`);
      } else {
        this.log(`✗ Template ${templateId} uninstall failed: ${result.message}`);
      }
      
      return result;
    } catch (error) {
      this.log(`✗ Template uninstall failed: ${error}`);
      throw error;
    }
  }

  /**
   * Check if a template is deployed
   */
  async isTemplateDeployed(
    templateId: string,
    name?: string,
    namespace?: string
  ): Promise<boolean> {
    try {
      const deployer = this.getTemplateDeployer(templateId);
      return await deployer.isDeployed(
        name || templateId,
        namespace || 'default'
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Get template deployment status
   */
  async getTemplateStatus(
    templateId: string,
    name?: string,
    namespace?: string
  ): Promise<'deployed' | 'deploying' | 'failed' | 'not-found'> {
    try {
      const deployer = this.getTemplateDeployer(templateId);
      return await deployer.getStatus(
        name || templateId,
        namespace || 'default'
      );
    } catch (error) {
      return 'not-found';
    }
  }

  /**
   * Wait for template to be ready
   */
  async waitForTemplate(
    templateId: string,
    name?: string,
    namespace?: string,
    timeoutMs: number = 300000
  ): Promise<void> {
    try {
      const deployer = this.getTemplateDeployer(templateId);
      await deployer.waitForReady(
        name || templateId,
        namespace || 'default',
        timeoutMs
      );
    } catch (error) {
      this.log(`✗ Template wait failed: ${error}`);
      throw error;
    }
  }

  private getTemplateDeployer(templateId: string): BaseTemplateDeployer {
    if (!this.templateDeployers.has(templateId)) {
      let deployer: BaseTemplateDeployer;
      
      switch (templateId) {
        case 'minio':
          deployer = new MinioDeployer(this.kubeClient, (m) => this.log(m));
          break;
        case 'ollama':
          deployer = new OllamaDeployer(this.kubeClient, (m) => this.log(m));
          break;
        case 'postgres':
          // Use existing PostgresDeployer wrapped in template interface
          if (!this.pg) {
            this.pg = new PostgresDeployer(this.kubeClient, this.setupClient, (m) => this.log(m));
          }
          // Create a wrapper for postgres deployer to match template interface
          deployer = new PostgresTemplateWrapper(this.pg, this.kubeClient, (m) => this.log(m));
          break;
        default:
          throw new Error(`Unknown template: ${templateId}`);
      }
      
      this.templateDeployers.set(templateId, deployer);
    }
    
    return this.templateDeployers.get(templateId)!;
  }

  /**
   * Deploy an application with the specified configuration
   */
  async deployApplication(configPath: string): Promise<void> {
    try {
      this.log('Loading application configuration...');
      const config = ConfigLoader.loadApplication(configPath);
      
      this.log(`Deploying application: ${config.metadata.name}`);
      
      // Check Kubernetes connection
      const connected = await this.setupClient.checkConnection();
      if (!connected) {
        throw new Error('Unable to connect to Kubernetes cluster');
      }
      
      // Generate manifests from application config
      const manifests = this.generateApplicationManifests(config);
      
      if (manifests.length === 0) {
        this.log('No resources to deploy');
        return;
      }
      
      this.log(`Deploying ${manifests.length} resources...`);
      
      // Apply manifests
      await this.setupClient.applyManifests(manifests, {
        continueOnError: false,
        log: (msg) => this.log(msg)
      });
      
      this.log('✓ Application deployed successfully');
    } catch (error) {
      this.log(`✗ Application deployment failed: ${error}`);
      throw error;
    }
  }

  /**
   * Get the status of a cluster setup
   */
  async getClusterStatus(configPath: string): Promise<DeploymentStatus> {
    try {
      const config = ConfigLoader.loadClusterSetup(configPath);
      const status = await this.setupClient.getClusterSetupStatus(config);

      this.displayStatus("Cluster Setup", status);
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

      this.displayStatus("Application", status);
      return status;
    } catch (error) {
      this.log(`✗ Failed to get application status: ${error}`);
      throw error;
    }
  }

  /**
   * Wait for a cluster setup to be ready
   */
  async waitForCluster(
    configPath: string,
    timeoutMs: number = 600000,
    pollMs: number = 5000
  ): Promise<void> {
    const startTime = Date.now();
    const config = ConfigLoader.loadClusterSetup(configPath);
    const maxRetries = 3;
    let consecutiveFailures = 0;

    this.log(`Waiting for cluster ${config.metadata.name} to be ready...`);

    while (Date.now() - startTime < timeoutMs) {
      try {
        const status = await this.setupClient.getClusterSetupStatus(config);
        consecutiveFailures = 0;

        if (status.phase === "ready") {
          this.log(chalk.green("✓ Cluster is ready!"));
          return;
        }

        if (status.phase === "failed") {
          throw new Error(`Cluster setup failed: ${status.message}`);
        }

        this.log(`Cluster status: ${status.phase} - ${status.message}`);
        
        // Check if we're approaching timeout
        const elapsed = Date.now() - startTime;
        const remaining = timeoutMs - elapsed;
        if (remaining < 60000 && remaining > 55000) {
          this.log(chalk.yellow(`⚠ Warning: Only ${Math.round(remaining / 1000)}s remaining before timeout`));
        }
        
        await this.sleep(pollMs);
      } catch (error) {
        consecutiveFailures++;
        this.log(chalk.yellow(`Warning: Error checking cluster status (attempt ${consecutiveFailures}/${maxRetries}): ${error}`));
        
        if (consecutiveFailures >= maxRetries) {
          throw new Error(`Failed to check cluster status after ${maxRetries} consecutive attempts. Last error: ${error}`);
        }
        
        await this.sleep(pollMs * 2);
      }
    }

    // If we reach here, we've timed out
    try {
      const finalStatus = await this.setupClient.getClusterSetupStatus(config);
      throw new Error(
        `Cluster setup timed out after ${timeoutMs / 1000} seconds. Final status: ${finalStatus.phase} - ${finalStatus.message}. ` +
        `Consider running 'teardown' and trying again, or check your cluster resources.`
      );
    } catch (statusError) {
      throw new Error(
        `Cluster setup timed out after ${timeoutMs / 1000} seconds and failed to get final status. ` +
        `Consider running 'teardown' and trying again, or check your cluster resources.`
      );
    }
  }

  /**
   * Wait for an application to be ready
   */
  async waitForApplication(
    configPath: string,
    timeoutMs: number = 300000
  ): Promise<void> {
    const startTime = Date.now();
    const config = ConfigLoader.loadApplication(configPath);

    this.log(`Waiting for application ${config.metadata.name} to be ready...`);

    while (Date.now() - startTime < timeoutMs) {
      const status = await this.setupClient.getApplicationStatus(config);

      if (status.phase === "ready") {
        this.log(chalk.green("✓ Application is ready!"));
        return;
      }

      if (status.phase === "failed") {
        throw new Error(`Application deployment failed: ${status.message}`);
      }

      this.log(`Application status: ${status.phase} - ${status.message}`);
      await this.sleep(5000); // Wait 5 seconds before checking again
    }

    throw new Error("Timeout waiting for application to be ready");
  }

  /**
   * Delete a cluster setup and all its resources
   */
  async deleteCluster(configPath: string): Promise<void> {
    try {
      this.log("Loading cluster setup configuration...");
      const config = ConfigLoader.loadClusterSetup(configPath);

      this.log(`Deleting cluster: ${config.metadata.name}`);

      await this.setupClient.deleteClusterSetup(config);

      this.log(chalk.green("✓ Cluster deleted successfully"));
    } catch (error) {
      this.log(chalk.red(`✗ Cluster deletion failed: ${error}`));
      throw error;
    }
  }

  /**
   * Teardown (uninstall) operators defined in the cluster setup configuration
   */
  async teardownOperators(configPath: string, options?: { continueOnError?: boolean }): Promise<void> {
    try {
      this.log('Loading cluster setup configuration...');
      const config = ConfigLoader.loadClusterSetup(configPath);

      const enabledOps = config.spec.operators.filter((op) => op.enabled);
      this.log(`Tearing down operators for cluster: ${config.metadata.name}`);
      if (enabledOps.length === 0) {
        this.log(chalk.yellow('No enabled operators found in configuration. Nothing to teardown.'));
        return;
      }
      this.log(`Operators to uninstall: ${enabledOps.map((op) => `${op.name}${op.version ? `@${op.version}` : ''}`).join(', ')}`);

      await this.setupClient.deleteOperators(config, { continueOnError: options?.continueOnError });

      this.log(chalk.green('✓ Operators teardown completed'));
    } catch (error) {
      this.log(chalk.red(`✗ Operators teardown failed: ${error}`));
      throw error;
    }
  }

  /**
   * Delete an application with the specified configuration
   */
  async deleteApplication(configPath: string): Promise<void> {
    try {
      this.log('Loading application configuration...');
      const config = ConfigLoader.loadApplication(configPath);
      
      this.log(`Deleting application: ${config.metadata.name}`);
      
      // Check Kubernetes connection
      const connected = await this.setupClient.checkConnection();
      if (!connected) {
        throw new Error('Unable to connect to Kubernetes cluster');
      }
      
      // Generate manifests from application config
      const manifests = this.generateApplicationManifests(config);
      
      if (manifests.length === 0) {
        this.log('No resources to delete');
        return;
      }
      
      this.log(`Deleting ${manifests.length} resources...`);
      
      // Delete manifests in reverse order (services first, then databases)
      const reversedManifests = [...manifests].reverse();
      await this.setupClient.deleteManifests(reversedManifests, {
        continueOnError: true,
        log: (msg) => this.log(msg)
      });
      
      this.log('✓ Application deleted successfully');
    } catch (error) {
      this.log(`✗ Application deletion failed: ${error}`);
      throw error;
    }
  }

  /**
   * Generate Kubernetes manifests from ApplicationConfig
   */
  private generateApplicationManifests(config: ApplicationConfig): any[] {
    const manifests: any[] = [];
    const namespace = config.metadata.namespace || 'default';
    const appName = config.metadata.name;

    // Generate service manifests
    if (config.spec.services) {
      for (const service of config.spec.services) {
        // Deployment
        manifests.push({
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          metadata: {
            name: service.name,
            namespace: namespace,
            labels: {
              app: service.name,
              'app.kubernetes.io/name': service.name,
              'app.kubernetes.io/instance': appName,
              'app.kubernetes.io/managed-by': 'interweb'
            }
          },
          spec: {
            replicas: service.replicas || 1,
            selector: {
              matchLabels: {
                app: service.name
              }
            },
            template: {
              metadata: {
                labels: {
                  app: service.name,
                  'app.kubernetes.io/name': service.name,
                  'app.kubernetes.io/instance': appName
                }
              },
              spec: {
                containers: [{
                  name: service.name,
                  image: service.image,
                  ports: [{
                    containerPort: service.port,
                    protocol: 'TCP'
                  }],
                  env: service.env ? Object.entries(service.env).map(([key, value]) => ({
                    name: key,
                    value: value
                  })) : [],
                  resources: service.resources || {}
                }]
              }
            }
          }
        });

        // Service
        manifests.push({
          apiVersion: 'v1',
          kind: 'Service',
          metadata: {
            name: service.name,
            namespace: namespace,
            labels: {
              app: service.name,
              'app.kubernetes.io/name': service.name,
              'app.kubernetes.io/instance': appName,
              'app.kubernetes.io/managed-by': 'interweb'
            }
          },
          spec: {
            type: 'ClusterIP',
            ports: [{
              port: service.port,
              targetPort: service.port,
              protocol: 'TCP'
            }],
            selector: {
              app: service.name
            }
          }
        });
      }
    }

    // Generate database manifests
    if (config.spec.database) {
      const db = config.spec.database;
      
      if (db.type === 'postgresql') {
        // PostgreSQL Cluster (CloudNativePG)
        manifests.push({
          apiVersion: 'postgresql.cnpg.io/v1',
          kind: 'Cluster',
          metadata: {
            name: db.name,
            namespace: db.namespace || namespace,
            labels: {
              'app.kubernetes.io/name': db.name,
              'app.kubernetes.io/instance': appName,
              'app.kubernetes.io/managed-by': 'interweb'
            }
          },
          spec: {
            instances: db.config.instances || 1,
            postgresql: {
              parameters: {
                max_connections: '100',
                shared_buffers: '128MB'
              }
            },
            bootstrap: {
              initdb: {
                database: db.name,
                owner: db.name,
                secret: {
                  name: `${db.name}-credentials`
                }
              }
            },
            storage: {
              size: db.config.storage || '1Gi'
            },
            resources: db.config.resources || {}
          }
        });

        // Database credentials secret
        manifests.push({
          apiVersion: 'v1',
          kind: 'Secret',
          metadata: {
            name: `${db.name}-credentials`,
            namespace: db.namespace || namespace,
            labels: {
              'app.kubernetes.io/name': db.name,
              'app.kubernetes.io/instance': appName,
              'app.kubernetes.io/managed-by': 'interweb'
            }
          },
          type: 'Opaque',
          data: {
            username: Buffer.from(db.name).toString('base64'),
            password: Buffer.from('changeme').toString('base64')
          }
        });
      }
    }

    // Generate ingress manifest
    if (config.spec.ingress?.enabled && config.spec.services && config.spec.services.length > 0) {
      const ingress = config.spec.ingress;
      const primaryService = config.spec.services[0]; // Use first service as primary

      manifests.push({
        apiVersion: 'networking.k8s.io/v1',
        kind: 'Ingress',
        metadata: {
          name: `${appName}-ingress`,
          namespace: namespace,
          labels: {
            'app.kubernetes.io/name': `${appName}-ingress`,
            'app.kubernetes.io/instance': appName,
            'app.kubernetes.io/managed-by': 'interweb'
          },
          annotations: {
            'nginx.ingress.kubernetes.io/rewrite-target': '/'
          }
        },
        spec: {
          ingressClassName: 'nginx',
          rules: [{
            host: ingress.host || `${appName}.local`,
            http: {
              paths: [{
                path: ingress.path || '/',
                pathType: 'Prefix',
                backend: {
                  service: {
                    name: primaryService.name,
                    port: {
                      number: primaryService.port
                    }
                  }
                }
              }]
            }
          }],
          ...(ingress.tls ? {
            tls: [{
              hosts: [ingress.host || `${appName}.local`],
              secretName: `${appName}-tls`
            }]
          } : {})
        }
      });
    }

    return manifests;
  }

  /**
   * Validate a configuration file
   */
  validateConfig(
    configPath: string,
    type: "cluster" | "application" = "cluster"
  ): boolean {
    try {
      if (type === "cluster") {
        ConfigLoader.loadClusterSetup(configPath);
      } else {
        ConfigLoader.loadApplication(configPath);
      }

      this.log(chalk.green("✓ Configuration is valid"));
      return true;
    } catch (error) {
      this.log(chalk.red(`✗ Configuration validation failed: ${error}`));
      return false;
    }
  }

  /**
   * Generate a sample configuration file
   */
  generateSampleConfig(
    outputPath: string,
    type: "cluster" | "application" = "cluster"
  ): void {
    try {
      if (type === "cluster") {
        const defaultConfig = ConfigLoader.getDefaultClusterSetup();
        ConfigLoader.saveConfig(defaultConfig, outputPath);
      } else {
        // Generate sample application config
        const sampleAppConfig = {
          apiVersion: "interweb.dev/v1",
          kind: "Application",
          metadata: {
            name: "sample-app",
          },
          spec: {
            database: {
              type: "postgresql" as const,
              name: "postgres-cluster",
              namespace: "postgres-db",
              config: {
                instances: 3,
                storage: "10Gi",
              },
            },
            services: [
              {
                name: "api-server",
                image: "nginx:latest",
                port: 80,
                replicas: 2,
                env: {
                  NODE_ENV: "production",
                },
              },
            ],
            ingress: {
              enabled: true,
              host: "api.example.com",
              path: "/",
              tls: true,
            },
          },
        };
        ConfigLoader.saveConfig(sampleAppConfig as any, outputPath);
      }

      this.log(
        chalk.green(`✓ Sample ${type} configuration saved to ${outputPath}`)
      );
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
      this.log("Listing interweb resources...");
      // Implementation would query Kubernetes for resources with interweb labels
      this.log("No resources found or feature not yet implemented");
    } catch (error) {
      this.log(chalk.red(`✗ Failed to list resources: ${error}`));
      throw error;
    }
  }

  private displayStatus(resourceType: string, status: DeploymentStatus): void {
    const phaseColor =
      status.phase === "ready"
        ? "green"
        : status.phase === "failed"
          ? "red"
          : "yellow";

    this.log(
      `${resourceType} Status: ${chalk[phaseColor](status.phase.toUpperCase())}`
    );

    if (status.message) {
      this.log(`Message: ${status.message}`);
    }

    if (status.conditions && status.conditions.length > 0) {
      this.log("Conditions:");
      status.conditions.forEach((condition) => {
        const conditionColor = condition.status === "True" ? "green" : "red";
        this.log(
          `  ${condition.type}: ${chalk[conditionColor](condition.status)} - ${condition.message}`
        );
      });
    }
  }

  private log(message: string): void {
    if (this.ctx.verbose !== false) {
      console.log(message);
    }
  }

  private async provisionApplicationDatabase(
    database?: ApplicationConfig["spec"]["database"]
  ): Promise<void> {
    if (!database) {
      return;
    }

    if (database.type !== "postgresql") {
      this.log(
        `Database type "${database.type}" is not supported for automatic provisioning. Skipping.`
      );
      return;
    }

    this.log("Provisioning PostgreSQL database for application...");
    await this.deployPostgres({
      name: database.name,
      namespace: database.namespace,
      instances: database.config.instances,
      storage: database.config.storage,
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

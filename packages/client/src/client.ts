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
      restEndpoint: ctx.restEndpoint,
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
      this.log("Loading application configuration...");
      const config = ConfigLoader.loadApplication(configPath);

      this.log(`Deploying application: ${config.metadata.name}`);

      const connected = await this.setupClient.checkConnection();
      if (!connected) {
        throw new Error("Unable to connect to Kubernetes cluster");
      }

      await this.provisionApplicationDatabase(config.spec.database);

      await this.setupClient.deployApplicationResources(config, {
        continueOnError: false,
        log: (msg) => this.log(msg),
      });

      this.log("✓ Application deployed successfully");
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
    timeoutMs: number = 600000
  ): Promise<void> {
    const startTime = Date.now();
    const config = ConfigLoader.loadClusterSetup(configPath);

    this.log(`Waiting for cluster ${config.metadata.name} to be ready...`);

    while (Date.now() - startTime < timeoutMs) {
      const status = await this.setupClient.getClusterSetupStatus(config);

      if (status.phase === "ready") {
        this.log(chalk.green("✓ Cluster is ready!"));
        return;
      }

      if (status.phase === "failed") {
        throw new Error(`Cluster setup failed: ${status.message}`);
      }

      this.log(`Cluster status: ${status.phase} - ${status.message}`);
      await this.sleep(5000); // Wait 5 seconds before checking again
    }

    throw new Error("Timeout waiting for cluster to be ready");
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
   * Delete an application and all its resources
   */
  async deleteApplication(configPath: string): Promise<void> {
    try {
      this.log("Loading application configuration...");
      const config = ConfigLoader.loadApplication(configPath);

      this.log(`Deleting application: ${config.metadata.name}`);

      await this.setupClient.deleteApplicationResources(config, {
        continueOnError: true,
        log: (msg) => this.log(msg),
      });

      this.log(chalk.green("✓ Application deleted successfully"));
    } catch (error) {
      this.log(chalk.red(`✗ Application deletion failed: ${error}`));
      throw error;
    }
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

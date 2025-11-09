import { Command } from 'commander';
import { Client, ConfigLoader } from '@kubernetesjs/client';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { getApiEndpoint } from '../utils/k8s-utils';

export function createDeleteCommand(): Command {
  const command = new Command('delete');
  
  command
    .description('Delete cluster setup or application deployment')
    .option('-c, --config <path>', 'Path to configuration file')
    .option('-t, --type <type>', 'Configuration type: cluster or application', 'cluster')
    .option('-n, --namespace <namespace>', 'Kubernetes namespace to use')
    .option('--kubeconfig <path>', 'Path to kubeconfig file')
    .option('--context <context>', 'Kubernetes context to use')
    .option('-v, --verbose', 'Enable verbose logging')
    .option('-f, --force', 'Skip confirmation prompt')
    .action(async (options) => {
      try {
        await deleteResources(options);
      } catch (error) {
        console.error(chalk.red('Deletion failed:'), error);
        process.exit(1);
      }
    });

  return command;
}

async function deleteResources(options: any): Promise<void> {
  // Determine config file and type
  let configPath = options.config;
  let configType = options.type;

  if (!configPath) {
    // Try to auto-detect config file
    if (ConfigLoader.configExists('k8sops.setup.yaml')) {
      configPath = 'k8sops.setup.yaml';
      configType = 'cluster';
    } else if (ConfigLoader.configExists('k8sops.deploy.yaml')) {
      configPath = 'k8sops.deploy.yaml';
      configType = 'application';
    } else {
      throw new Error('No configuration file found. Please specify -c <config-file> or ensure k8sops.setup.yaml or k8sops.deploy.yaml exists.');
    }
  }

  if (!ConfigLoader.configExists(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }

  // Auto-detect type if not specified
  if (configType === 'cluster' || configType === 'application') {
    try {
      const config = ConfigLoader.loadClusterSetup(configPath);
      if (config.kind === 'ClusterSetup') {
        configType = 'cluster';
      }
    } catch {
      try {
        const config = ConfigLoader.loadApplication(configPath);
        if (config.kind === 'Application') {
          configType = 'application';
        }
      } catch {
        throw new Error('Unable to determine configuration type. Please specify --type cluster or --type application');
      }
    }
  }

  console.log(chalk.red(`🗑️  Delete KubernetesJS Ops ${configType === 'cluster' ? 'Cluster' : 'Application'}`));
  console.log('=====================================\n');

  // Load and display configuration
  let config: any;
  if (configType === 'cluster') {
    config = ConfigLoader.loadClusterSetup(configPath);
    console.log(`Cluster: ${chalk.yellow(config.metadata.name)}`);
    console.log(`Namespace: ${chalk.yellow(config.metadata.namespace || 'interweb-system')}`);
    console.log(`Operators: ${config.spec.operators.filter((op: any) => op.enabled).length} enabled`);
  } else {
    config = ConfigLoader.loadApplication(configPath);
    console.log(`Application: ${chalk.yellow(config.metadata.name)}`);
    console.log(`Namespace: ${chalk.yellow(config.metadata.namespace || 'default')}`);
    if (config.spec.services) {
      console.log(`Services: ${config.spec.services.length}`);
    }
    if (config.spec.database) {
      console.log(`Database: ${config.spec.database.type}`);
    }
  }

  console.log('');

  // Warning message
  if (configType === 'cluster') {
    console.log(chalk.red('⚠️  WARNING: This will delete the entire cluster setup including:'));
    console.log(chalk.red('   • All operators and their resources'));
    console.log(chalk.red('   • The entire namespace and all contents'));
    console.log(chalk.red('   • Any applications deployed in the cluster'));
    console.log(chalk.red('   • All persistent data may be lost'));
  } else {
    console.log(chalk.red('⚠️  WARNING: This will delete the application including:'));
    console.log(chalk.red('   • All services and deployments'));
    console.log(chalk.red('   • Database and persistent storage'));
    console.log(chalk.red('   • All application data may be lost'));
  }

  console.log('');

  // Confirmation prompt (unless --force is used)
  if (!options.force) {
    const { confirmDelete } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirmDelete',
      message: chalk.red(`Are you sure you want to delete this ${configType}?`),
      default: false
    }]);

    if (!confirmDelete) {
      console.log(chalk.yellow('Deletion cancelled'));
      return;
    }

    // Double confirmation for cluster deletion
    if (configType === 'cluster') {
      const { doubleConfirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'doubleConfirm',
        message: chalk.red('This action cannot be undone. Are you absolutely sure?'),
        default: false
      }]);

      if (!doubleConfirm) {
        console.log(chalk.yellow('Deletion cancelled'));
        return;
      }
    }

    // Final confirmation with typing the name
    const { typedName } = await inquirer.prompt([{
      type: 'input',
      name: 'typedName',
      message: `Please type the ${configType} name "${config.metadata.name}" to confirm deletion:`
    }]);

    if (typedName !== config.metadata.name) {
      console.log(chalk.red('Name does not match. Deletion cancelled'));
      return;
    }
  }

  // Create client and delete resources
  const client = new Client({
    namespace: options.namespace || config.metadata.namespace,
    kubeconfig: options.kubeconfig,
    context: options.context,
    verbose: options.verbose,
    restEndpoint: getApiEndpoint(options.restEndpoint)
  });

  console.log(chalk.blue(`\nDeleting ${configType}...`));
  
  if (configType === 'cluster') {
    await client.deleteCluster(configPath);
  } else {
    await client.deleteApplication(configPath);
  }

  console.log(chalk.green(`\n✅ ${configType === 'cluster' ? 'Cluster' : 'Application'} deleted successfully!`));
  
  if (configType === 'cluster') {
    console.log(chalk.blue('\nThe cluster setup has been completely removed.'));
    console.log(chalk.blue('You can set up a new cluster using: k8sops setup -c ' + configPath));
  } else {
    console.log(chalk.blue('\nThe application has been completely removed.'));
    console.log(chalk.blue('You can redeploy the application using: k8sops deploy -c ' + configPath));
  }
}

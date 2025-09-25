import { Command } from 'commander';
import { Client, ConfigLoader } from '@interweb/client';
import chalk from 'chalk';

export function createStatusCommand(): Command {
  const command = new Command('status');
  
  command
    .description('Check the status of cluster setup or application deployment')
    .option('-c, --config <path>', 'Path to configuration file')
    .option('-t, --type <type>', 'Configuration type: cluster or application', 'cluster')
    .option('-n, --namespace <namespace>', 'Kubernetes namespace to use')
    .option('--kubeconfig <path>', 'Path to kubeconfig file')
    .option('--context <context>', 'Kubernetes context to use')
    .option('-v, --verbose', 'Enable verbose logging')
    .option('-w, --watch', 'Watch for status changes')
    .action(async (options) => {
      try {
        await checkStatus(options);
      } catch (error) {
        console.error(chalk.red('Status check failed:'), error);
        process.exit(1);
      }
    });

  return command;
}

async function checkStatus(options: any): Promise<void> {
  // Determine config file and type
  let configPath = options.config;
  let configType = options.type;

  if (!configPath) {
    // Try to auto-detect config file
    if (ConfigLoader.configExists('interweb.setup.yaml')) {
      configPath = 'interweb.setup.yaml';
      configType = 'cluster';
    } else if (ConfigLoader.configExists('interweb.deploy.yaml')) {
      configPath = 'interweb.deploy.yaml';
      configType = 'application';
    } else {
      throw new Error('No configuration file found. Please specify -c <config-file> or ensure interweb.setup.yaml or interweb.deploy.yaml exists.');
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

  console.log(chalk.blue(`📊 Interweb ${configType === 'cluster' ? 'Cluster' : 'Application'} Status`));
  console.log('=====================================\n');

  const client = new Client({
    namespace: options.namespace,
    kubeconfig: options.kubeconfig,
    context: options.context,
    verbose: options.verbose
  });

  if (options.watch) {
    console.log(chalk.yellow('Watching for status changes... (Press Ctrl+C to stop)\n'));
    
    // Watch mode - check status every 5 seconds
    const checkInterval = setInterval(async () => {
      try {
        console.clear();
        console.log(chalk.blue(`📊 Interweb ${configType === 'cluster' ? 'Cluster' : 'Application'} Status`));
        console.log('=====================================\n');
        console.log(chalk.gray(`Last updated: ${new Date().toLocaleTimeString()}\n`));
        
        if (configType === 'cluster') {
          await client.getClusterStatus(configPath);
        } else {
          await client.getApplicationStatus(configPath);
        }
        
        console.log(chalk.gray('\nPress Ctrl+C to stop watching...'));
      } catch (error) {
        console.error(chalk.red('Status check failed:'), error);
      }
    }, 5000);

    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
      clearInterval(checkInterval);
      console.log(chalk.yellow('\n\nStopped watching status.'));
      process.exit(0);
    });

    // Initial status check
    try {
      if (configType === 'cluster') {
        await client.getClusterStatus(configPath);
      } else {
        await client.getApplicationStatus(configPath);
      }
    } catch (error) {
      console.error(chalk.red('Initial status check failed:'), error);
    }
  } else {
    // Single status check
    if (configType === 'cluster') {
      const status = await client.getClusterStatus(configPath);
      
      // Show additional cluster information
      const config = ConfigLoader.loadClusterSetup(configPath);
      console.log('\nCluster Information:');
      console.log(`  Name: ${config.metadata.name}`);
      console.log(`  Namespace: ${config.metadata.namespace || 'interweb-system'}`);
      console.log(`  Operators: ${config.spec.operators.filter(op => op.enabled).length} enabled`);
      
      if (status.phase === 'ready') {
        console.log(chalk.green('\n✅ Cluster is ready for application deployments!'));
      } else if (status.phase === 'installing') {
        console.log(chalk.yellow('\n⏳ Cluster setup is in progress...'));
        console.log(chalk.blue('Tip: Use --watch to monitor progress in real-time'));
      } else if (status.phase === 'failed') {
        console.log(chalk.red('\n❌ Cluster setup has failed'));
        console.log(chalk.blue('Check the conditions above for more details'));
      }
    } else {
      const status = await client.getApplicationStatus(configPath);
      
      // Show additional application information
      const config = ConfigLoader.loadApplication(configPath);
      console.log('\nApplication Information:');
      console.log(`  Name: ${config.metadata.name}`);
      console.log(`  Namespace: ${config.metadata.namespace || 'default'}`);
      
      if (config.spec.services) {
        console.log(`  Services: ${config.spec.services.length}`);
      }
      
      if (config.spec.database) {
        console.log(`  Database: ${config.spec.database.type}`);
      }
      
      if (status.phase === 'ready') {
        console.log(chalk.green('\n✅ Application is ready and running!'));
      } else if (status.phase === 'installing') {
        console.log(chalk.yellow('\n⏳ Application deployment is in progress...'));
        console.log(chalk.blue('Tip: Use --watch to monitor progress in real-time'));
      } else if (status.phase === 'failed') {
        console.log(chalk.red('\n❌ Application deployment has failed'));
        console.log(chalk.blue('Check the conditions above for more details'));
      }
    }
  }
}

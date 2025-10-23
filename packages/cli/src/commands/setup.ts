import { Command } from 'commander';
import { Client, ConfigLoader } from '@interweb/client';
import chalk from 'chalk';
import inquirer from 'inquirer';
import * as path from 'path';
import { 
  getApiEndpoint, 
  getOperatorNamespaces, 
  waitForNamespacesDeletion, 
  deleteNamespace,
  checkNamespaceStatus 
} from '../utils/k8s-utils';

export function createSetupCommand(): Command {
  const command = new Command('setup');
  
  command
    .description('Set up a Kubernetes cluster with interweb operators')
    .option('-c, --config <path>', 'Path to cluster setup configuration file', '__fixtures__/config/setup.config.yaml')
    .option('-n, --namespace <namespace>', 'Kubernetes namespace to use')
    .option('--kubeconfig <path>', 'Path to kubeconfig file')
    .option('--context <context>', 'Kubernetes context to use')
    .option('-v, --verbose', 'Enable verbose logging')
    .option('--generate-config', 'Generate a sample configuration file')
    .option('-f, --force', 'Skip confirmation prompts')
    .action(async (options) => {
      try {
        if (options.generateConfig) {
          await generateConfig(options);
          process.exit(0);
          return;
        }

        await setupCluster(options);
      } catch (error) {
        console.error(chalk.red('Setup failed:'), error);
        process.exit(1);
      }
    });

  return command;
}

async function setupCluster(options: any): Promise<void> {
  console.log(chalk.blue('🚀 Interweb Cluster Setup'));
  console.log('==========================\n');

  // Check if config file exists
  if (!ConfigLoader.configExists(options.config)) {
    console.log(chalk.yellow(`Configuration file not found: ${options.config}`));
    
    const { shouldGenerate } = await inquirer.prompt([{
      type: 'confirm',
      name: 'shouldGenerate',
      message: 'Would you like to generate a sample configuration file?',
      default: true
    }]);

    if (shouldGenerate) {
      ConfigLoader.saveConfig(ConfigLoader.getDefaultClusterSetup(), options.config);
      console.log(chalk.green(`✓ Sample configuration saved to ${options.config}`));
      console.log(chalk.yellow('Please review and modify the configuration before running setup again.'));
      return;
    } else {
      throw new Error('Configuration file is required for setup');
    }
  }

  // Validate configuration
  console.log(chalk.blue('Validating configuration...'));
  const config = ConfigLoader.loadClusterSetup(options.config);
  console.log(chalk.green(`✓ Configuration loaded: ${config.metadata.name}`));

  // Show configuration summary
  console.log('\nCluster Setup Summary:');
  console.log(`  Name: ${config.metadata.name}`);
  console.log(`  Namespace: ${config.metadata.namespace || 'interweb-system'}`);
  console.log(`  Operators to install:`);
  
  config.spec.operators.forEach(op => {
    const status = op.enabled ? chalk.green('✓') : chalk.gray('○');
    const version = op.version ? ` (${op.version})` : '';
    console.log(`    ${status} ${op.name}${version}`);
  });

  if (config.spec.monitoring?.enabled) {
    console.log(`  Monitoring: ${chalk.green('enabled')}`);
  }

  if (config.spec.networking) {
    console.log(`  Domain: ${config.spec.networking.domain || 'not specified'}`);
    console.log(`  Ingress Class: ${config.spec.networking.ingressClass || 'not specified'}`);
  }

  // Confirm before proceeding
  if (!options.force) {
    const { shouldProceed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'shouldProceed',
      message: 'Proceed with cluster setup?',
      default: true
    }]);

    if (!shouldProceed) {
      console.log(chalk.yellow('Setup cancelled'));
      process.exit(0);
      return;
    }
  }

  // Create client and setup cluster
  const client = new Client({
    namespace: options.namespace || config.metadata.namespace,
    kubeconfig: options.kubeconfig,
    context: options.context,
    verbose: options.verbose,
    restEndpoint: getApiEndpoint(options.restEndpoint)
  });

  // Check for and wait for any terminating namespaces to be fully deleted
  console.log(chalk.blue('\nChecking for terminating namespaces...'));
  await waitForTerminatingNamespaces(client, config, options.restEndpoint);

  // Force delete any existing operator namespaces to avoid conflicts
  console.log(chalk.blue('\nCleaning up existing operator namespaces...'));
  await forceDeleteOperatorNamespaces(config, options.restEndpoint);

  console.log(chalk.blue('\nSetting up cluster...'));
  await client.setupCluster(options.config);

  console.log(chalk.blue('\nWaiting for cluster to be ready...'));
  await client.waitForCluster(options.config);

  console.log(chalk.green('\n🎉 Cluster setup completed successfully!'));
  
  // Explicitly exit to ensure the process terminates properly
  process.exit(0);
}

async function generateConfig(options: any): Promise<void> {
  console.log(chalk.blue('📝 Generate Cluster Setup Configuration'));
  console.log('=====================================\n');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Cluster name:',
      default: 'dev-cluster'
    },
    {
      type: 'input',
      name: 'namespace',
      message: 'Namespace:',
      default: 'interweb-system'
    },
    {
      type: 'input',
      name: 'domain',
      message: 'Domain for ingress:',
      default: '127.0.0.1.nip.io'
    },
    {
      type: 'checkbox',
      name: 'operators',
      message: 'Select operators to install:',
      choices: [
        { name: 'Knative Serving', value: 'knative-serving', checked: true },
        { name: 'CloudNative-PG', value: 'cloudnative-pg', checked: true },
        { name: 'Cert Manager', value: 'cert-manager', checked: true },
        { name: 'Ingress NGINX', value: 'ingress-nginx', checked: true }
      ]
    },
    {
      type: 'confirm',
      name: 'monitoring',
      message: 'Enable monitoring (Prometheus & Grafana)?',
      default: false
    }
  ]);

  // Create configuration based on answers
  const config = {
    apiVersion: 'interweb.dev/v1',
    kind: 'ClusterSetup',
    metadata: {
      name: answers.name,
      namespace: answers.namespace
    },
    spec: {
      operators: [
        {
          name: 'knative-serving',
          version: 'v1.15.0',
          enabled: answers.operators.includes('knative-serving')
        },
        {
          name: 'cloudnative-pg',
          version: '1.25.2',
          enabled: answers.operators.includes('cloudnative-pg')
        },
        {
          name: 'cert-manager',
          version: 'v1.17.0',
          enabled: answers.operators.includes('cert-manager')
        },
        {
          name: 'ingress-nginx',
          enabled: answers.operators.includes('ingress-nginx')
        }
      ],
      monitoring: {
        enabled: answers.monitoring,
        prometheus: {
          retention: '7d',
          storage: '10Gi'
        },
        grafana: {
          adminPassword: 'admin',
          persistence: '5Gi'
        }
      },
      networking: {
        ingressClass: 'nginx',
        domain: answers.domain
      }
    }
  };

  const outputPath = options.config || 'interweb.setup.yaml';
  ConfigLoader.saveConfig(config as any, outputPath);
  
  console.log(chalk.green(`✓ Configuration saved to ${outputPath}`));
  console.log(chalk.blue('\nTo set up the cluster, run:'));
  console.log(`  interweb setup -c ${outputPath}`);
}

async function forceDeleteOperatorNamespaces(config: any, restEndpoint?: string): Promise<void> {
  const operatorNamespaces = getOperatorNamespaces(config);
  const apiEndpoint = getApiEndpoint(restEndpoint);

  for (const namespace of operatorNamespaces) {
    try {
      // Check if namespace exists first
      const status = await checkNamespaceStatus(namespace, apiEndpoint);
      
      if (!status.exists) {
        // Namespace doesn't exist, skip
        continue;
      }
      
      if (status.phase === 'Terminating') {
        console.log(chalk.yellow(`⏳ Namespace ${namespace} is already terminating, waiting...`));
        continue;
      }
      
      // Delete the namespace
      console.log(chalk.yellow(`Deleting existing namespace: ${namespace}`));
      await deleteNamespace(namespace, apiEndpoint);
      console.log(chalk.green(`✓ Namespace ${namespace} deletion initiated`));
    } catch (error: any) {
      console.log(chalk.yellow(`Warning: Error checking/deleting namespace ${namespace}: ${error.message}`));
    }
  }

  // Wait for all namespaces to be fully deleted
  console.log(chalk.blue('Waiting for namespace cleanup to complete...'));
  await waitForNamespacesDeletion(operatorNamespaces, apiEndpoint);
}


async function waitForTerminatingNamespaces(client: Client, config: any, restEndpoint?: string): Promise<void> {
  const operatorNamespaces = getOperatorNamespaces(config);
  const apiEndpoint = getApiEndpoint(restEndpoint);

  for (const namespace of operatorNamespaces) {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    
    while (attempts < maxAttempts) {
      try {
        // Use fetch to check namespace status via Kubernetes API
        const response = await fetch(`${apiEndpoint}/api/v1/namespaces/${namespace}`);
        
        if (response.status === 404) {
          // Namespace doesn't exist, which is what we want
          break;
        }
        
        if (response.ok) {
          const ns = await response.json();
          
          if (ns.status?.phase === 'Terminating') {
            console.log(chalk.yellow(`⏳ Waiting for namespace ${namespace} to finish terminating... (${attempts + 1}/${maxAttempts})`));
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
            attempts++;
            continue;
          }
          
          // Namespace exists and is not terminating, break out of loop
          break;
        }
        
        // Other HTTP errors, log and continue
        console.log(chalk.yellow(`Warning: Error checking namespace ${namespace}: HTTP ${response.status}`));
        break;
      } catch (error: any) {
        // Network or other errors, log and continue
        console.log(chalk.yellow(`Warning: Error checking namespace ${namespace}: ${error.message}`));
        break;
      }
    }
    
    if (attempts >= maxAttempts) {
      throw new Error(`Timeout waiting for namespace ${namespace} to finish terminating. Please manually clean up the namespace and try again.`);
    }
  }
}

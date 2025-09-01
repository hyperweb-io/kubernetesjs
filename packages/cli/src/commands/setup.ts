import { Command } from 'commander';
import { InterwebClient, ConfigLoader } from '@interweb/client';
import chalk from 'chalk';
import inquirer from 'inquirer';
import * as path from 'path';

export function createSetupCommand(): Command {
  const command = new Command('setup');
  
  command
    .description('Set up a Kubernetes cluster with interweb operators')
    .option('-c, --config <path>', 'Path to cluster setup configuration file', 'interweb.setup.yaml')
    .option('-n, --namespace <namespace>', 'Kubernetes namespace to use')
    .option('--kubeconfig <path>', 'Path to kubeconfig file')
    .option('--context <context>', 'Kubernetes context to use')
    .option('-v, --verbose', 'Enable verbose logging')
    .option('--generate-config', 'Generate a sample configuration file')
    .action(async (options) => {
      try {
        if (options.generateConfig) {
          await generateConfig(options);
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

  console.log(`  Domain: ${config.spec.networking.domain}`);
  console.log(`  Ingress Class: ${config.spec.networking.ingressClass}\n`);

  // Confirm before proceeding
  const { shouldProceed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'shouldProceed',
    message: 'Proceed with cluster setup?',
    default: true
  }]);

  if (!shouldProceed) {
    console.log(chalk.yellow('Setup cancelled'));
    return;
  }

  // Create client and setup cluster
  const client = new InterwebClient({
    namespace: options.namespace || config.metadata.namespace,
    kubeconfig: options.kubeconfig,
    context: options.context,
    verbose: options.verbose
  });

  console.log(chalk.blue('\nSetting up cluster...'));
  await client.setupCluster(options.config);

  console.log(chalk.blue('\nWaiting for cluster to be ready...'));
  await client.waitForCluster(options.config);

  console.log(chalk.green('\n🎉 Cluster setup completed successfully!'));
  console.log(chalk.blue('\nNext steps:'));
  console.log('  1. Deploy applications using: interweb deploy -c your-app.yaml');
  console.log('  2. Check cluster status: interweb status -c ' + options.config);
  console.log('  3. View resources: interweb list');
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

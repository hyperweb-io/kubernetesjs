import { Command } from 'commander';
import { Client, ConfigLoader } from '@kubernetesjs/client';
import chalk from 'chalk';
import inquirer from 'inquirer';
import * as path from 'path';
import * as fs from 'fs';
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
    .option('--default', 'Use default fixture configuration without prompts')
    .option('-f, --force', 'Skip confirmation prompts')
    .action(async (options: any) => {
      try {
        if (options.generateConfig) {
          const generatedPath = await generateConfig(options);
          options.config = generatedPath;
          options.default = false;
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

  // Resolve config path, honoring --default to use fixture config
  let configPath = options.config;
  if (options.default) {
    const fixturePath = path.resolve(__dirname, '../../__fixtures__/config/setup.config.yaml');
    configPath = fixturePath;
    options.config = configPath;
    console.log(chalk.blue(`Using default fixture configuration: ${configPath}`));
  }

  // If config file does not exist and --default is NOT used, collect config via inquirer
  if (!ConfigLoader.configExists(configPath)) {
    if (options.default) {
      throw new Error(`Default fixture configuration not found at: ${configPath}`);
    }

    console.log(chalk.yellow(`Configuration file not found: ${configPath}`));
    console.log(chalk.blue('Let\'s create one interactively...'));

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
          { name: 'Ingress NGINX', value: 'ingress-nginx', checked: true },
          { name: 'Kube Prometheus Stack', value: 'kube-prometheus-stack', checked: true }
        ]
      },
      {
        type: 'confirm',
        name: 'monitoring',
        message: 'Enable monitoring (Prometheus & Grafana)?',
        default: false
      }
    ]);

    const generatedConfig = {
      apiVersion: 'interweb.dev/v1',
      kind: 'ClusterSetup',
      metadata: {
        name: answers.name,
        namespace: answers.namespace
      },
      spec: {
        operators: [
          { name: 'knative-serving', version: 'v1.15.0', enabled: answers.operators.includes('knative-serving') },
          { name: 'cloudnative-pg', version: '1.25.2', enabled: answers.operators.includes('cloudnative-pg') },
          { name: 'cert-manager', version: 'v1.17.0', enabled: answers.operators.includes('cert-manager') },
          { name: 'ingress-nginx', enabled: answers.operators.includes('ingress-nginx') },
          { name: 'kube-prometheus-stack', version: '77.5.0', enabled: answers.operators.includes('kube-prometheus-stack') }
        ],
        monitoring: {
          enabled: answers.monitoring,
          prometheus: { retention: '7d', storage: '10Gi' },
          grafana: { adminPassword: 'admin', persistence: '5Gi' }
        },
        networking: { ingressClass: 'nginx', domain: answers.domain }
      }
    };

    const outputPath = options.config || 'kjs.setup.yaml';
    ConfigLoader.saveConfig(generatedConfig as any, outputPath);
    options.config = outputPath;
    configPath = outputPath;
    console.log(chalk.green(`✓ Configuration saved to ${outputPath}`));
  }

  // Validate configuration
  console.log(chalk.blue('Validating configuration...'));
  const config = ConfigLoader.loadClusterSetup(configPath);
  console.log(chalk.green(`✓ Configuration loaded: ${config.metadata.name}`));

  // Show configuration summary
  console.log('\nCluster Setup Summary:');
  console.log(`  Name: ${config.metadata.name}`);
  console.log(`  Namespace: ${config.metadata.namespace || 'interweb-system'}`);
  console.log(`  Operators to install:`);
  
  config.spec.operators.forEach((op: any) => {
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
  await waitForTerminatingNamespaces(client, config);

  console.log(chalk.blue('\nSetting up cluster...'));
  await client.setupCluster(options.config);

  console.log(chalk.blue('\nWaiting for cluster to be ready...'));
  await client.waitForCluster(options.config);

  console.log(chalk.green('\n🎉 Cluster setup completed successfully!'));
  
  // Explicitly exit to ensure the process terminates properly
  process.exit(0);
}

async function generateConfig(options: any): Promise<string> {
  console.log(chalk.blue('📝 Generate Cluster Setup Configuration'));
  console.log('=====================================\n');

  // If --default is passed, copy the fixture config and skip prompts
  if (options?.default) {
    const fixturePath = path.resolve(__dirname, '../../__fixtures__/config/setup.config.yaml');
    let outputPath = options.config;
    if (!outputPath || path.resolve(outputPath) === fixturePath || outputPath === '__fixtures__/config/setup.config.yaml') {
      outputPath = path.resolve(process.cwd(), 'config/kjs.setup.yaml');
    }
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(fixturePath, outputPath);
    console.log(chalk.green(`✓ Default configuration copied to ${outputPath}`));
    return outputPath;
  }

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
        { name: 'Ingress NGINX', value: 'ingress-nginx', checked: true },
        { name: 'Kube Prometheus Stack', value: 'kube-prometheus-stack', checked: true }
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
        },
        {
          name: 'kube-prometheus-stack',
          version: '77.5.0',
          enabled: answers.operators.includes('kube-prometheus-stack')
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

  const outputPath = options.config || path.resolve(process.cwd(), 'config/kjs.setup.yaml');
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  ConfigLoader.saveConfig(config as any, outputPath);
  console.log(chalk.green(`✓ Configuration saved to ${outputPath}`));
  return outputPath;
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

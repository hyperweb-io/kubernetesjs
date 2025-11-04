import { Command } from 'commander';
import { Client, ConfigLoader } from '@interweb/client';
import chalk from 'chalk';
import inquirer from 'inquirer';

export function createTeardownCommand(): Command {
  const command = new Command('teardown');

  command
    .description('Teardown (uninstall) operators from the cluster setup configuration')
    .option('-c, --config <path>', 'Path to cluster setup configuration file', '__fixtures__/config/setup.config.yaml')
    .option('-n, --namespace <namespace>', 'Kubernetes namespace to use')
    .option('--kubeconfig <path>', 'Path to kubeconfig file')
    .option('--context <context>', 'Kubernetes context to use')
    .option('-v, --verbose', 'Enable verbose logging')
    .option('-f, --force', 'Skip confirmation prompt')
    .option('--continue-on-error', 'Continue even if some operator removals fail', false)
    .action(async (options) => {
      try {
        await teardownOperators(options);
      } catch (error) {
        console.error(chalk.red('Teardown failed:'), error);
        process.exit(1);
      }
    });

  return command;
}

async function teardownOperators(options: any): Promise<void> {
  console.log(chalk.blue('🧹 Interweb Operators Teardown'));
  console.log('================================\n');

  // Check if config file exists
  if (!ConfigLoader.configExists(options.config)) {
    throw new Error(`Configuration file not found: ${options.config}`);
  }

  // Validate configuration
  console.log(chalk.blue('Validating configuration...'));
  const config = ConfigLoader.loadClusterSetup(options.config);
  console.log(chalk.green(`✓ Configuration loaded: ${config.metadata.name}`));

  // Show operator summary
  const enabledOps = config.spec.operators.filter((op: any) => op.enabled);
  if (enabledOps.length === 0) {
    console.log(chalk.yellow('No enabled operators found in configuration. Nothing to teardown.'));
    return;
  }

  console.log('\nOperators to uninstall:');
  enabledOps.forEach((op: any) => {
    const version = op.version ? ` (${op.version})` : '';
    console.log(`  • ${op.name}${version}`);
  });

  console.log('');

  // Confirmation prompt (unless --force is used)
  if (!options.force) {
    const { shouldProceed } = await inquirer.prompt([{ 
      type: 'confirm', 
      name: 'shouldProceed', 
      message: chalk.yellow('⚠️  This will uninstall operators from your cluster. Proceed?'), 
      default: false 
    }]);
    if (!shouldProceed) {
      console.log(chalk.yellow('Teardown cancelled'));
      return;
    }
  }

  // Create client and teardown operators
  const client = new Client({ 
    namespace: options.namespace || config.metadata.namespace, 
    kubeconfig: options.kubeconfig, 
    context: options.context, 
    verbose: options.verbose 
  });

  console.log(chalk.blue('\nUninstalling operators...'));
  
  // Use .catch() pattern similar to Starship CLI for better error handling
  await client.teardownOperators(options.config, { 
    continueOnError: true // Always continue on error for teardown to clean up as much as possible
  }).catch((err: any) => {
    console.error(chalk.red('An error occurred during teardown:'), err);
    console.log(chalk.yellow('Continuing with teardown despite errors...'));
    // Don't throw error to allow teardown to continue
  });

  // Wait for namespaces to be fully deleted
  console.log(chalk.blue('\nWaiting for namespaces to be fully deleted...'));
  await waitForNamespaceDeletion(config);

  console.log(chalk.green('\n✅ Operators teardown completed!'));
  console.log(chalk.blue('\nNext steps:'));
  console.log('  1. Reinstall operators if needed: interweb setup -c ' + options.config);
  console.log('  2. Check cluster status: interweb status -c ' + options.config);
}

async function waitForNamespaceDeletion(config: any): Promise<void> {
  const operatorNamespaces = config.spec.operators
    .filter((op: any) => op.enabled)
    .map((op: any) => {
      switch (op.name) {
        case 'knative-serving':
          return ['knative-serving', 'kourier-system'];
        case 'cert-manager':
          return ['cert-manager'];
        case 'ingress-nginx':
          return ['ingress-nginx'];
        case 'cloudnative-pg':
          return ['cnpg-system'];
        default:
          return [];
      }
    })
    .flat();

  for (const namespace of operatorNamespaces) {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    
    while (attempts < maxAttempts) {
      try {
        // Use fetch to check namespace status via Kubernetes API
        const response = await fetch(`http://127.0.0.1:8001/api/v1/namespaces/${namespace}`);
        
        if (response.status === 404) {
          // Namespace doesn't exist, which means it's been successfully deleted
          console.log(chalk.green(`✓ Namespace ${namespace} successfully deleted`));
          break;
        }
        
        if (response.ok) {
          const ns = await response.json();
          
          if (ns.status?.phase === 'Terminating') {
            console.log(chalk.yellow(`⏳ Waiting for namespace ${namespace} to be deleted... (${attempts + 1}/${maxAttempts})`));
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
            attempts++;
            continue;
          }
          
          // Namespace still exists and is not terminating - this shouldn't happen after teardown
          console.log(chalk.yellow(`Warning: Namespace ${namespace} still exists but is not terminating`));
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
      console.log(chalk.red(`⚠️  Timeout waiting for namespace ${namespace} to be deleted. It may still be terminating.`));
      console.log(chalk.yellow(`You may need to manually clean up namespace ${namespace} before running setup again.`));
    }
  }
}
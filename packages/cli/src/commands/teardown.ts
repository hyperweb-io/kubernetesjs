import { Command } from 'commander';
import { Client, ConfigLoader } from '@interweb/client';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { 
  getApiEndpoint, 
  getOperatorNamespaces, 
  waitForNamespacesDeletion, 
  deleteNamespace,
  OPERATOR_CLUSTER_RESOURCES 
} from '../utils/k8s-utils';

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
    verbose: options.verbose,
    restEndpoint: getApiEndpoint(options.restEndpoint)
  });

  // Clean up application resources first
  console.log(chalk.blue('\nCleaning up application resources...'));
  await deleteApplicationResources(options.continueOnError, options.restEndpoint);

  console.log(chalk.blue('\nUninstalling operators...'));
  
  // Use .catch() pattern similar to Starship CLI for better error handling
  await client.deleteCluster(options.config).catch((err: any) => {
    console.error(chalk.red('An error occurred during teardown:'), err);
    console.log(chalk.yellow('Continuing with teardown despite errors...'));
    // Don't throw error to allow teardown to continue
  });

  // Explicitly delete operator namespaces
  console.log(chalk.blue('\nDeleting operator namespaces...'));
  await deleteOperatorNamespaces(config, options.continueOnError, options.restEndpoint);

  // Wait for namespaces to be fully deleted
  console.log(chalk.blue('\nWaiting for namespaces to be fully deleted...'));
  await waitForNamespaceDeletion(config, options.restEndpoint);

  // Clean up cluster-scoped resources
  console.log(chalk.blue('\nCleaning up cluster-scoped resources...'));
  await deleteClusterScopedResources(config, options.continueOnError, options.restEndpoint);

  console.log(chalk.green('\n✅ Teardown completed!'));
}

async function deleteOperatorNamespaces(config: any, continueOnError: boolean = true, restEndpoint?: string): Promise<void> {
  const operatorNamespaces = getOperatorNamespaces(config);
  const apiEndpoint = getApiEndpoint(restEndpoint);

  for (const namespace of operatorNamespaces) {
    try {
      console.log(chalk.yellow(`Deleting namespace: ${namespace}`));
      await deleteNamespace(namespace, apiEndpoint, continueOnError);
      console.log(chalk.green(`✓ Namespace ${namespace} deletion initiated`));
    } catch (error: any) {
      const errorMsg = `Error deleting namespace ${namespace}: ${error.message}`;
      console.log(chalk.red(`✗ ${errorMsg}`));
      if (!continueOnError) {
        throw new Error(errorMsg);
      }
    }
  }
}

async function deleteApplicationResources(continueOnError: boolean = true, restEndpoint?: string): Promise<void> {
  const apiEndpoint = getApiEndpoint(restEndpoint);
  
  try {
    // Get all namespaces to search for application resources
    const namespacesResponse = await fetch(`${apiEndpoint}/api/v1/namespaces`);
    if (!namespacesResponse.ok) {
      throw new Error(`Failed to get namespaces: HTTP ${namespacesResponse.status}`);
    }
    
    const namespacesData = await namespacesResponse.json();
    const namespaces = namespacesData.items.map((ns: any) => ns.metadata.name);
    
    // Resource types to clean up
    const resourceTypes = [
      { type: 'ingresses', apiVersion: 'networking.k8s.io/v1' },
      { type: 'services', apiVersion: 'v1' },
      { type: 'deployments', apiVersion: 'apps/v1' },
      { type: 'pods', apiVersion: 'v1' }
    ];
    
    for (const namespace of namespaces) {
      console.log(chalk.gray(`  Checking namespace: ${namespace}`));
      
      for (const resource of resourceTypes) {
        try {
          // Get resources with Interweb labels
          const url = resource.apiVersion === 'v1' 
            ? `${apiEndpoint}/api/v1/namespaces/${namespace}/${resource.type}`
            : `${apiEndpoint}/apis/${resource.apiVersion}/namespaces/${namespace}/${resource.type}`;
          
          const response = await fetch(url);
          if (!response.ok) {
            if (response.status === 404) {
              // Resource type not found in this namespace, skip
              continue;
            }
            throw new Error(`Failed to get ${resource.type}: HTTP ${response.status}`);
          }
          
          const data = await response.json();
          const interwebResources = data.items.filter((item: any) => 
            item.metadata?.labels?.['app.interweb.dev/instance'] ||
            item.metadata?.annotations?.['app.interweb.dev/managed'] === 'true'
          );
          
          // Delete each Interweb-managed resource
          for (const item of interwebResources) {
            try {
              console.log(chalk.yellow(`    Deleting ${resource.type.slice(0, -1)}: ${item.metadata.name}`));
              
              const deleteUrl = resource.apiVersion === 'v1'
                ? `${apiEndpoint}/api/v1/namespaces/${namespace}/${resource.type}/${item.metadata.name}`
                : `${apiEndpoint}/apis/${resource.apiVersion}/namespaces/${namespace}/${resource.type}/${item.metadata.name}`;
              
              const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' });
              if (!deleteResponse.ok && deleteResponse.status !== 404) {
                throw new Error(`Failed to delete ${item.metadata.name}: HTTP ${deleteResponse.status}`);
              }
              
              console.log(chalk.green(`    ✅ Deleted ${resource.type.slice(0, -1)}: ${item.metadata.name}`));
            } catch (error: any) {
              console.error(chalk.red(`    ❌ Failed to delete ${item.metadata.name}: ${error.message}`));
              if (!continueOnError) {
                throw error;
              }
            }
          }
        } catch (error: any) {
          console.error(chalk.red(`  ❌ Failed to process ${resource.type} in namespace ${namespace}: ${error.message}`));
          if (!continueOnError) {
            throw error;
          }
        }
      }
    }
    
    console.log(chalk.green('✅ Application resources cleanup completed'));
  } catch (error: any) {
    console.error(chalk.red(`❌ Failed to clean up application resources: ${error.message}`));
    if (!continueOnError) {
      throw error;
    }
  }
}

async function deleteClusterScopedResources(config: any, continueOnError: boolean = true, restEndpoint?: string): Promise<void> {
  const apiEndpoint = getApiEndpoint(restEndpoint);
  
  const operatorResources = config.spec.operators
    .filter((op: any) => op.enabled)
    .map((op: any) => OPERATOR_CLUSTER_RESOURCES[op.name] || { crds: [], clusterRoles: [], clusterRoleBindings: [], webhooks: [] });

  // Flatten all resources
  const allCrds = operatorResources.flatMap((r: any) => r.crds);
  const allClusterRoles = operatorResources.flatMap((r: any) => r.clusterRoles);
  const allClusterRoleBindings = operatorResources.flatMap((r: any) => r.clusterRoleBindings);
  const allWebhooks = operatorResources.flatMap((r: any) => r.webhooks);

  // Delete CRDs
  for (const crd of allCrds) {
    try {
      console.log(chalk.yellow(`Deleting CRD: ${crd}`));
      const response = await fetch(`${apiEndpoint}/apis/apiextensions.k8s.io/v1/customresourcedefinitions/${crd}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok || response.status === 404) {
        console.log(chalk.green(`✓ CRD ${crd} deleted`));
      } else {
        const errorText = await response.text();
        console.log(chalk.yellow(`Warning: Failed to delete CRD ${crd}: HTTP ${response.status} - ${errorText}`));
      }
    } catch (error: any) {
      const message = `Error deleting CRD ${crd}: ${error.message}`;
      if (continueOnError) {
        console.log(chalk.yellow(`Warning: ${message}`));
      } else {
        throw new Error(message);
      }
    }
  }

  // Delete ClusterRoles
  for (const clusterRole of allClusterRoles) {
    try {
      console.log(chalk.yellow(`Deleting ClusterRole: ${clusterRole}`));
      const response = await fetch(`${apiEndpoint}/apis/rbac.authorization.k8s.io/v1/clusterroles/${clusterRole}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok || response.status === 404) {
        console.log(chalk.green(`✓ ClusterRole ${clusterRole} deleted`));
      } else {
        const errorText = await response.text();
        console.log(chalk.yellow(`Warning: Failed to delete ClusterRole ${clusterRole}: HTTP ${response.status} - ${errorText}`));
      }
    } catch (error: any) {
      const message = `Error deleting ClusterRole ${clusterRole}: ${error.message}`;
      if (continueOnError) {
        console.log(chalk.yellow(`Warning: ${message}`));
      } else {
        throw new Error(message);
      }
    }
  }

  // Delete ClusterRoleBindings
  for (const clusterRoleBinding of allClusterRoleBindings) {
    try {
      console.log(chalk.yellow(`Deleting ClusterRoleBinding: ${clusterRoleBinding}`));
      const response = await fetch(`${apiEndpoint}/apis/rbac.authorization.k8s.io/v1/clusterrolebindings/${clusterRoleBinding}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok || response.status === 404) {
        console.log(chalk.green(`✓ ClusterRoleBinding ${clusterRoleBinding} deleted`));
      } else {
        const errorText = await response.text();
        console.log(chalk.yellow(`Warning: Failed to delete ClusterRoleBinding ${clusterRoleBinding}: HTTP ${response.status} - ${errorText}`));
      }
    } catch (error: any) {
      const message = `Error deleting ClusterRoleBinding ${clusterRoleBinding}: ${error.message}`;
      if (continueOnError) {
        console.log(chalk.yellow(`Warning: ${message}`));
      } else {
        throw new Error(message);
      }
    }
  }

  // Delete ValidatingWebhookConfigurations and MutatingWebhookConfigurations
  for (const webhook of allWebhooks) {
    try {
      // Try ValidatingWebhookConfiguration first
      console.log(chalk.yellow(`Deleting ValidatingWebhookConfiguration: ${webhook}`));
      let response = await fetch(`${apiEndpoint}/apis/admissionregistration.k8s.io/v1/validatingwebhookconfigurations/${webhook}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log(chalk.green(`✓ ValidatingWebhookConfiguration ${webhook} deleted`));
        continue;
      } else if (response.status === 404) {
        // Trxy MutatingWebhookConfiguration
        console.log(chalk.yellow(`Deleting MutatingWebhookConfiguration: ${webhook}`));
        response = await fetch(`${apiEndpoint}/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/${webhook}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok || response.status === 404) {
          console.log(chalk.green(`✓ MutatingWebhookConfiguration ${webhook} deleted`));
        } else {
          const errorText = await response.text();
          console.log(chalk.yellow(`Warning: Failed to delete MutatingWebhookConfiguration ${webhook}: HTTP ${response.status} - ${errorText}`));
        }
      } else {
        const errorText = await response.text();
        console.log(chalk.yellow(`Warning: Failed to delete ValidatingWebhookConfiguration ${webhook}: HTTP ${response.status} - ${errorText}`));
      }
    } catch (error: any) {
      const message = `Error deleting webhook ${webhook}: ${error.message}`;
      if (continueOnError) {
        console.log(chalk.yellow(`Warning: ${message}`));
      } else {
        throw new Error(message);
      }
    }
  }
}

async function waitForNamespaceDeletion(config: any, restEndpoint?: string): Promise<void> {
  const operatorNamespaces = getOperatorNamespaces(config);
  const apiEndpoint = getApiEndpoint(restEndpoint);
  
  await waitForNamespacesDeletion(operatorNamespaces, apiEndpoint);
}
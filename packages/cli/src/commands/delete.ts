import chalk from 'chalk';
import * as fs from 'fs';
import { CLIOptions, Inquirerer, OptionValue, Question } from 'inquirerer';
import { KubernetesClient } from 'kubernetesjs';
import { ParsedArgs } from 'minimist';

import { getCurrentNamespace, readYamlFile } from '../config';

async function promptResourceType(prompter: Inquirerer, argv: Partial<ParsedArgs>): Promise<string> {
  const resourceTypes = [
    'pod', 
    'service', 
    'deployment', 
    'replicaset', 
    'statefulset', 
    'daemonset', 
    'configmap', 
    'secret'
  ];

  const question: Question = {
    type: 'autocomplete',
    name: 'resourceType',
    message: 'Select resource type to delete',
    options: resourceTypes,
    maxDisplayLines: 10,
    required: true
  };

  const { resourceType } = await prompter.prompt(argv, [question]);
  return resourceType;
}

async function promptResourceSelection(
  prompter: Inquirerer, 
  argv: Partial<ParsedArgs>, 
  resourceType: string, 
  namespace: string,
  client: KubernetesClient
): Promise<string[]> {
  let resources: any[] = [];
  
  switch (resourceType) {
  case 'pod':
    const pods = await client.listCoreV1NamespacedPod({
      path: { namespace },
      query: { limit: 100 }
    });
    resources = pods.items || [];
    break;
      
  case 'service':
    const services = await client.listCoreV1NamespacedService({
      path: { namespace },
      query: { limit: 100 }
    });
    resources = services.items || [];
    break;
      
  case 'deployment':
    const deployments = await client.listAppsV1NamespacedDeployment({
      path: { namespace },
      query: { limit: 100 }
    });
    resources = deployments.items || [];
    break;
      
  case 'configmap':
    const configmaps = await client.listCoreV1NamespacedConfigMap({
      path: { namespace },
      query: { limit: 100 }
    });
    resources = configmaps.items || [];
    break;
      
  case 'secret':
    const secrets = await client.listCoreV1NamespacedSecret({
      path: { namespace },
      query: { limit: 100 }
    });
    resources = secrets.items || [];
    break;
      
  default:
    console.log(chalk.yellow(`Resource type '${resourceType}' not implemented yet for selection`));
    return [];
  }
  
  if (resources.length === 0) {
    console.log(chalk.yellow(`No ${resourceType}s found in namespace ${namespace}`));
    return [];
  }
  
  const options = resources.map(r => ({
    name: r.metadata.name,
    value: r.metadata.name
  }));
  
  const question: Question = {
    type: 'checkbox',
    name: 'selectedResources',
    message: `Select ${resourceType}(s) to delete`,
    options,
    maxDisplayLines: 10,
    required: true
  };
  
  let selectedResources: OptionValue[];
  ({ selectedResources } = await prompter.prompt(argv, [question]));
  return selectedResources
    .filter(res=>res.selected)
    .map(res=>res.value);
}

async function deleteResource(
  client: KubernetesClient, 
  resourceType: string, 
  resourceName: string, 
  namespace: string
): Promise<void> {
  try {
    switch (resourceType) {
    case 'pod':
      await client.deleteCoreV1NamespacedPod({
        path: { 
          namespace,
          name: resourceName
        },
        query: {
            
        }
      });
      console.log(chalk.green(`Pod "${resourceName}" deleted successfully`));
      break;
        
    case 'service':
      await client.deleteCoreV1NamespacedService({
        path: { 
          namespace,
          name: resourceName
        },
        query: {
            
        }
      });
      console.log(chalk.green(`Service "${resourceName}" deleted successfully`));
      break;
        
    case 'deployment':
      await client.deleteAppsV1NamespacedDeployment({
        path: { 
          namespace,
          name: resourceName
        },
        query: {
            
        }
      });
      console.log(chalk.green(`Deployment "${resourceName}" deleted successfully`));
      break;
        
    case 'configmap':
      await client.deleteCoreV1NamespacedConfigMap({
        path: { 
          namespace,
          name: resourceName
        },
        query: {
            
        }
      });
      console.log(chalk.green(`ConfigMap "${resourceName}" deleted successfully`));
      break;
        
    case 'secret':
      await client.deleteCoreV1NamespacedSecret({
        path: { 
          namespace,
          name: resourceName
        },
        query: {
            
        }
      });
      console.log(chalk.green(`Secret "${resourceName}" deleted successfully`));
      break;
        
    default:
      console.log(chalk.yellow(`Resource type '${resourceType}' not implemented yet for deletion`));
    }
  } catch (error) {
    console.error(chalk.red(`Error deleting ${resourceType} "${resourceName}": ${error}`));
  }
}

async function deleteFromYaml(client: KubernetesClient, filePath: string, namespace: string): Promise<void> {
  try {
    const content = readYamlFile(filePath);
    
    const resources = Array.isArray(content) ? content : 
      (content.kind === 'List' && Array.isArray(content.items)) ? content.items : 
        [content];
    
    for (const resource of resources) {
      const kind = resource.kind.toLowerCase();
      const name = resource.metadata?.name;
      const ns = resource.metadata?.namespace || namespace;
      
      if (!name) {
        console.error(chalk.red('Resource must have a name'));
        continue;
      }
      
      await deleteResource(client, kind, name, ns);
    }
  } catch (error) {
    console.error(chalk.red(`Error processing YAML file: ${error}`));
  }
}

export default async (
  argv: Partial<ParsedArgs>,
  prompter: Inquirerer,
  _options: CLIOptions
) => {
  try {
    const client = new KubernetesClient({
      restEndpoint: 'http://localhost:8001' // Default kube-proxy endpoint
    });

    const namespace = argv.n || argv.namespace || getCurrentNamespace();
    
    if (argv.f || argv.filename) {
      const filePath = argv.f || argv.filename;
      
      if (!fs.existsSync(filePath as string)) {
        console.error(chalk.red(`File not found: ${filePath}`));
        return;
      }
      
      await deleteFromYaml(client, filePath as string, namespace as string);
      return;
    }
    
    const resourceType = argv._?.[0] || await promptResourceType(prompter, argv);
    
    const resourceName = argv._?.[1];
    
    if (resourceName) {
      await deleteResource(client, resourceType, resourceName, namespace as string);
    } else {
      const selectedResources = await promptResourceSelection(
        prompter, 
        argv, 
        resourceType, 
        namespace as string, 
        client
      );
      
      if (selectedResources.length === 0) {
        console.log(chalk.yellow('No resources selected for deletion'));
        return;
      }
      
      const confirmQuestion: Question = {
        type: 'confirm',
        name: 'confirmDelete',
        message: `Are you sure you want to delete ${selectedResources.length} ${resourceType}(s)?`,
        required: true
      };
      
      const { confirmDelete } = await prompter.prompt(argv, [confirmQuestion]);
      
      if (!confirmDelete) {
        console.log(chalk.yellow('Deletion cancelled'));
        return;
      }
      
      for (const resource of selectedResources) {
        await deleteResource(client, resourceType, resource, namespace as string);
      }
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
  }
};

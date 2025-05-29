import { CLIOptions, Inquirerer, Question } from 'inquirerer';
import { ParsedArgs } from 'minimist';
import chalk from 'chalk';
import { KubernetesClient } from 'kubernetesjs';
import { readYamlFile, inferResourceType } from '../config';
import * as fs from 'fs';
import * as path from 'path';

async function promptYamlFilePath(prompter: Inquirerer, argv: Partial<ParsedArgs>): Promise<string> {
  const question: Question = {
    type: 'text',
    name: 'filePath',
    message: 'Enter path to YAML file',
    required: true
  };
  
  const { filePath } = await prompter.prompt(argv, [question]);
  return filePath;
}

async function applyResource(client: KubernetesClient, resource: any, namespace: string): Promise<void> {
  const kind = resource.kind.toLowerCase();
  const name = resource.metadata?.name;
  
  if (!name) {
    throw new Error('Resource must have a name');
  }
  
  console.log(chalk.blue(`Applying ${kind} "${name}" in namespace ${namespace}...`));
  
  try {
    switch (kind) {
      case 'deployment':
        await client.createAppsV1NamespacedDeployment({
          path: { namespace },
          query: { 
            pretty: 'true',
            fieldManager: 'kubernetesjs-cli'
          },
          body: resource
        });
        console.log(chalk.green(`Deployment "${name}" created/updated successfully`));
        break;
        
      case 'service':
        await client.createCoreV1NamespacedService({
          path: { namespace },
          query: { 
            pretty: 'true',
            fieldManager: 'kubernetesjs-cli'
          },
          body: resource
        });
        console.log(chalk.green(`Service "${name}" created/updated successfully`));
        break;
        
      case 'pod':
        await client.createCoreV1NamespacedPod({
          path: { namespace },
          query: { 
            pretty: 'true',
            fieldManager: 'kubernetesjs-cli'
          },
          body: resource
        });
        console.log(chalk.green(`Pod "${name}" created/updated successfully`));
        break;
        
      case 'configmap':
        await client.createCoreV1NamespacedConfigMap({
          path: { namespace },
          query: { 
            pretty: 'true',
            fieldManager: 'kubernetesjs-cli'
          },
          body: resource
        });
        console.log(chalk.green(`ConfigMap "${name}" created/updated successfully`));
        break;
        
      case 'secret':
        await client.createCoreV1NamespacedSecret({
          path: { namespace },
          query: { 
            pretty: 'true',
            fieldManager: 'kubernetesjs-cli'
          },
          body: resource
        });
        console.log(chalk.green(`Secret "${name}" created/updated successfully`));
        break;
        
      default:
        console.log(chalk.yellow(`Resource kind "${kind}" not implemented yet`));
    }
  } catch (error) {
    console.error(chalk.red(`Error applying ${kind} "${name}": ${error}`));
    throw error;
  }
}

export default async (
  argv: Partial<ParsedArgs>,
  prompter: Inquirerer,
  _options: CLIOptions
) => {
  try {
    const client = new KubernetesClient({
      restEndpoint: (_options as any).clientUrl || 'http://127.0.0.1:8001'
    });
    
    const filePath = argv.f || argv._?.[0] || await promptYamlFilePath(prompter, argv);
    
    if (!filePath) {
      console.error(chalk.red('No file path provided'));
      return;
    }
    
    if (!fs.existsSync(filePath)) {
      console.error(chalk.red(`File not found: ${filePath}`));
      return;
    }
    
    let resources: any[];
    try {
      const content = readYamlFile(filePath);
      
      if (Array.isArray(content)) {
        resources = content;
      } else if (content.kind === 'List' && Array.isArray(content.items)) {
        resources = content.items;
      } else {
        resources = [content];
      }
    } catch (error) {
      console.error(chalk.red(`Error parsing YAML file: ${error}`));
      return;
    }
    
    for (const resource of resources) {
      try {
        const namespace = resource.metadata?.namespace || argv.n || argv.namespace || 'default';
        await applyResource(client, resource, namespace);
      } catch (error) {
        console.error(chalk.red(`Failed to apply resource: ${error}`));
      }
    }
    
    console.log(chalk.green('Apply completed'));
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
  }
};

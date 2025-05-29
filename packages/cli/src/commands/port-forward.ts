import { CLIOptions, Inquirerer, Question } from 'inquirerer';
import { ParsedArgs } from 'minimist';
import chalk from 'chalk';
import { KubernetesClient } from 'kubernetesjs';
import { getCurrentNamespace } from '../config';
import { spawn } from 'child_process';

async function promptServiceName(
  prompter: Inquirerer, 
  argv: Partial<ParsedArgs>, 
  namespace: string,
  client: KubernetesClient
): Promise<string> {
  try {
    const services = await client.listCoreV1NamespacedService({
      path: { namespace },
      query: { limit: 100 }
    });
    
    if (!services.items || services.items.length === 0) {
      console.log(chalk.yellow(`No services found in namespace ${namespace}`));
      return '';
    }
    
    const options = services.items.map(service => ({
      name: service.metadata.name,
      value: service.metadata.name
    }));
    
    const question: Question = {
      type: 'autocomplete',
      name: 'serviceName',
      message: 'Select service',
      options,
      maxDisplayLines: 10,
      required: true
    };
    
    const { serviceName } = await prompter.prompt(argv, [question]);
    return serviceName;
  } catch (error) {
    console.error(chalk.red(`Error getting services: ${error}`));
    return '';
  }
}

async function promptPortMapping(
  prompter: Inquirerer, 
  argv: Partial<ParsedArgs>, 
  namespace: string,
  serviceName: string,
  client: KubernetesClient
): Promise<string> {
  try {
    const service = await client.readCoreV1NamespacedService({
      path: { 
        namespace,
        name: serviceName
      }
    });
    
    if (!service.spec || !service.spec.ports || service.spec.ports.length === 0) {
      console.log(chalk.yellow(`No ports found in service ${serviceName}`));
      return '';
    }
    
    if (service.spec.ports.length === 1) {
      const port = service.spec.ports[0];
      const localPort = port.port;
      const remotePort = port.targetPort || port.port;
      
      const confirmQuestion: Question = {
        type: 'confirm',
        name: 'confirmPortMapping',
        message: `Use port mapping ${localPort}:${remotePort}?`,
        required: true
      };
      
      const { confirmPortMapping } = await prompter.prompt(argv, [confirmQuestion]);
      
      if (confirmPortMapping) {
        return `${localPort}:${remotePort}`;
      }
    }
    
    const portMappingQuestion: Question = {
      type: 'text',
      name: 'portMapping',
      message: 'Enter port mapping (local:remote)',
      required: true
    };
    
    const { portMapping } = await prompter.prompt(argv, [portMappingQuestion]);
    return portMapping;
  } catch (error) {
    console.error(chalk.red(`Error getting service ports: ${error}`));
    return '';
  }
}

async function portForward(
  namespace: string,
  resourceType: string,
  resourceName: string,
  portMapping: string
): Promise<void> {
  console.log(chalk.blue(`Forwarding ports ${portMapping} to ${resourceType}/${resourceName} in namespace ${namespace}...`));
  console.log(chalk.yellow('Press Ctrl+C to stop port forwarding'));
  
  const kubectlArgs = [
    'port-forward',
    '-n', namespace,
    `${resourceType}/${resourceName}`,
    portMapping
  ];
  
  const kubectl = spawn('kubectl', kubectlArgs, {
    stdio: 'inherit',
    shell: true
  });
  
  return new Promise((resolve, reject) => {
    kubectl.on('close', (code) => {
      if (code === 0 || code === 130) { // 130 is the exit code when terminated by Ctrl+C
        resolve();
      } else {
        reject(new Error(`kubectl port-forward exited with code ${code}`));
      }
    });
    
    kubectl.on('error', (error) => {
      reject(error);
    });
  });
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
    
    let resourceType = 'svc';
    let resourceName = '';
    
    if (argv._?.[0]) {
      const resourceArg = argv._[0];
      
      if (resourceArg.includes('/')) {
        const [type, name] = resourceArg.split('/');
        resourceType = type;
        resourceName = name;
      } else {
        resourceName = resourceArg;
      }
    }
    
    if (!resourceName) {
      resourceName = await promptServiceName(prompter, argv, namespace as string, client);
      if (!resourceName) {
        return;
      }
    }
    
    const portMapping = argv._?.[1] || await promptPortMapping(
      prompter, 
      argv, 
      namespace as string, 
      resourceName, 
      client
    );
    
    if (!portMapping) {
      return;
    }
    
    await portForward(namespace as string, resourceType, resourceName, portMapping);
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
  }
};

import { CLIOptions, Inquirerer, Question } from 'inquirerer';
import { ParsedArgs } from 'minimist';
import chalk from 'chalk';
import { KubernetesClient } from 'kubernetesjs';
import { getCurrentNamespace } from '../config';
import { spawn } from 'child_process';

async function promptPodName(
  prompter: Inquirerer, 
  argv: Partial<ParsedArgs>, 
  namespace: string,
  client: KubernetesClient
): Promise<string> {
  try {
    const pods = await client.listCoreV1NamespacedPod({
      path: { namespace },
      query: { limit: 100 }
    });
    
    if (!pods.items || pods.items.length === 0) {
      console.log(chalk.yellow(`No pods found in namespace ${namespace}`));
      return '';
    }
    
    const options = pods.items.map(pod => ({
      name: pod.metadata.name,
      value: pod.metadata.name
    }));
    
    const question: Question = {
      type: 'autocomplete',
      name: 'podName',
      message: 'Select pod',
      options,
      maxDisplayLines: 10,
      required: true
    };
    
    const { podName } = await prompter.prompt(argv, [question]);
    return podName;
  } catch (error) {
    console.error(chalk.red(`Error getting pods: ${error}`));
    return '';
  }
}

async function promptContainerName(
  prompter: Inquirerer, 
  argv: Partial<ParsedArgs>, 
  namespace: string,
  podName: string,
  client: KubernetesClient
): Promise<string> {
  try {
    const pod = await client.readCoreV1NamespacedPod({
      path: { 
        namespace,
        name: podName
      },
      query: {
        
      }
    });
    
    if (!pod.spec || !pod.spec.containers || pod.spec.containers.length === 0) {
      console.log(chalk.yellow(`No containers found in pod ${podName}`));
      return '';
    }
    
    if (pod.spec.containers.length === 1) {
      return pod.spec.containers[0].name;
    }
    
    const options = pod.spec.containers.map(container => ({
      name: container.name,
      value: container.name
    }));
    
    const question: Question = {
      type: 'autocomplete',
      name: 'containerName',
      message: 'Select container',
      options,
      maxDisplayLines: 10,
      required: true
    };
    
    const { containerName } = await prompter.prompt(argv, [question]);
    return containerName;
  } catch (error) {
    console.error(chalk.red(`Error getting containers: ${error}`));
    return '';
  }
}

async function execInPod(
  namespace: string,
  podName: string,
  containerName: string,
  command: string[]
): Promise<void> {
  console.log(chalk.blue(`Executing command in ${containerName ? 'container ' + containerName + ' of ' : ''}pod ${podName} in namespace ${namespace}...`));
  
  const kubectlArgs = [
    'exec',
    '-it',
    '-n', namespace,
    podName
  ];
  
  if (containerName) {
    kubectlArgs.push('-c', containerName);
  }
  
  kubectlArgs.push('--', ...command);
  
  const kubectl = spawn('kubectl', kubectlArgs, {
    stdio: 'inherit',
    shell: true
  });
  
  return new Promise((resolve, reject) => {
    kubectl.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`kubectl exec exited with code ${code}`));
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
    
    const podName = argv._?.[0] || await promptPodName(prompter, argv, namespace as string, client);
    
    if (!podName) {
      return;
    }
    
    let containerName = argv.c || argv.container;
    if (!containerName) {
      containerName = await promptContainerName(prompter, argv, namespace as string, podName, client);
      if (!containerName) {
        return;
      }
    }
    
    let command: string[] = [];
    
    const dashIndex = argv._.findIndex(arg => arg === '--');
    
    if (dashIndex !== -1 && dashIndex < argv._.length - 1) {
      command = argv._.slice(dashIndex + 1);
    } else {
      const commandQuestion: Question = {
        type: 'text',
        name: 'command',
        message: 'Enter command to execute',
        required: true,
        default: '/bin/sh',
        useDefault: true
      };
      
      const { command: cmd } = await prompter.prompt(argv, [commandQuestion]);
      command = cmd.split(' ');
    }
    
    await execInPod(namespace as string, podName, containerName as string, command);
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
  }
};

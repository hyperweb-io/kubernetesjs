import { CLIOptions, Inquirerer, Question } from 'inquirerer';
import { ParsedArgs } from 'minimist';
import chalk from 'chalk';
import { KubernetesClient } from 'kubernetesjs';
import { getCurrentNamespace } from '../config';

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
    
    console.log(chalk.blue(`Getting logs for ${containerName ? 'container ' + containerName + ' in ' : ''}pod ${podName} in namespace ${namespace}...`));
    
    const logs = await client.readCoreV1NamespacedPodLog({
      path: { 
        namespace,
        name: podName
      },
      query: {
        container: containerName,
        tailLines: argv.tail ? parseInt(argv.tail as string, 10) : undefined,
        follow: false,
        previous: argv.previous === true
      }
    });
    
    console.log(logs);
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
  }
};

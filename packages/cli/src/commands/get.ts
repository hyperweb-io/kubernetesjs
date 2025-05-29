import { CLIOptions, Inquirerer, Question } from 'inquirerer';
import { ParsedArgs } from 'minimist';
import chalk from 'chalk';
import { KubernetesClient } from 'kubernetesjs';
import { getCurrentNamespace } from '../config';

async function promptResourceType(prompter: Inquirerer, argv: Partial<ParsedArgs>): Promise<string> {
  const resourceTypes = [
    'pods', 
    'services', 
    'deployments', 
    'replicasets', 
    'statefulsets', 
    'daemonsets', 
    'configmaps', 
    'secrets', 
    'namespaces',
    'all'
  ];

  const question: Question = {
    type: 'autocomplete',
    name: 'resourceType',
    message: 'Select resource type',
    options: resourceTypes,
    maxDisplayLines: 10,
    required: true
  };

  const { resourceType } = await prompter.prompt(argv, [question]);
  return resourceType;
}

function formatPodData(pod: any): void {
  const name = pod.metadata.name;
  const ready = `${pod.status.containerStatuses?.filter((c: any) => c.ready).length || 0}/${pod.status.containerStatuses?.length || 0}`;
  const status = pod.status.phase;
  const restarts = pod.status.containerStatuses?.reduce((sum: number, c: any) => sum + c.restartCount, 0) || 0;
  const age = new Date(pod.metadata.creationTimestamp).toLocaleString();

  console.log(
    chalk.green(name.padEnd(50)) +
    ready.padEnd(10) +
    status.padEnd(15) +
    restarts.toString().padEnd(10) +
    age
  );
}

function formatServiceData(service: any): void {
  const name = service.metadata.name;
  const type = service.spec.type;
  const clusterIP = service.spec.clusterIP;
  const externalIP = service.spec.externalIPs?.join(',') || '<none>';
  const ports = service.spec.ports?.map((p: any) => `${p.port}:${p.targetPort}`).join(',') || '<none>';
  const age = new Date(service.metadata.creationTimestamp).toLocaleString();

  console.log(
    chalk.green(name.padEnd(30)) +
    type.padEnd(15) +
    clusterIP.padEnd(20) +
    externalIP.padEnd(20) +
    ports.padEnd(20) +
    age
  );
}

function formatDeploymentData(deployment: any): void {
  const name = deployment.metadata.name;
  const ready = `${deployment.status.readyReplicas || 0}/${deployment.status.replicas || 0}`;
  const upToDate = deployment.status.updatedReplicas || 0;
  const available = deployment.status.availableReplicas || 0;
  const age = new Date(deployment.metadata.creationTimestamp).toLocaleString();

  console.log(
    chalk.green(name.padEnd(30)) +
    ready.padEnd(10) +
    upToDate.toString().padEnd(10) +
    available.toString().padEnd(10) +
    age
  );
}

async function getAllResources(client: KubernetesClient, namespace: string): Promise<void> {
  try {
    const pods = await client.listCoreV1NamespacedPod({
      path: { namespace },
      query: { limit: 100 }
    });
    
    if (pods.items && pods.items.length > 0) {
      console.log(chalk.bold('\nPODS:'));
      console.log(chalk.bold('NAME'.padEnd(50) + 'READY'.padEnd(10) + 'STATUS'.padEnd(15) + 'RESTARTS'.padEnd(10) + 'AGE'));
      pods.items.forEach(formatPodData);
    }

    const services = await client.listCoreV1NamespacedService({
      path: { namespace },
      query: { limit: 100 }
    });
    
    if (services.items && services.items.length > 0) {
      console.log(chalk.bold('\nSERVICES:'));
      console.log(chalk.bold('NAME'.padEnd(30) + 'TYPE'.padEnd(15) + 'CLUSTER-IP'.padEnd(20) + 'EXTERNAL-IP'.padEnd(20) + 'PORT(S)'.padEnd(20) + 'AGE'));
      services.items.forEach(formatServiceData);
    }

    const deployments = await client.listAppsV1NamespacedDeployment({
      path: { namespace },
      query: { limit: 100 }
    });
    
    if (deployments.items && deployments.items.length > 0) {
      console.log(chalk.bold('\nDEPLOYMENTS:'));
      console.log(chalk.bold('NAME'.padEnd(30) + 'READY'.padEnd(10) + 'UP-TO-DATE'.padEnd(10) + 'AVAILABLE'.padEnd(10) + 'AGE'));
      deployments.items.forEach(formatDeploymentData);
    }
  } catch (error) {
    console.error(chalk.red(`Error getting resources: ${error}`));
  }
}

export default async (
  argv: Partial<ParsedArgs>,
  prompter: Inquirerer,
  _options: CLIOptions
) => {
  try {
    const client = new KubernetesClient({
      restEndpoint: argv.clientUrl
    });

    const namespace = argv.n || argv.namespace || getCurrentNamespace();
    
    const resourceType = argv._?.[0] || await promptResourceType(prompter, argv);

    console.log(chalk.blue(`Getting ${resourceType} in namespace ${namespace}...`));

    if (resourceType === 'all') {
      await getAllResources(client, namespace as string);
      return;
    }

    switch (resourceType) {
      case 'pods':
        const pods = await client.listCoreV1NamespacedPod({
          path: { namespace },
          query: { limit: 100 }
        });
        
        console.log(chalk.bold('NAME'.padEnd(50) + 'READY'.padEnd(10) + 'STATUS'.padEnd(15) + 'RESTARTS'.padEnd(10) + 'AGE'));
        
        if (pods.items && pods.items.length > 0) {
          pods.items.forEach(formatPodData);
        } else {
          console.log(chalk.yellow('No pods found'));
        }
        break;
        
      case 'services':
        const services = await client.listCoreV1NamespacedService({
          path: { namespace },
          query: { limit: 100 }
        });
        
        console.log(chalk.bold('NAME'.padEnd(30) + 'TYPE'.padEnd(15) + 'CLUSTER-IP'.padEnd(20) + 'EXTERNAL-IP'.padEnd(20) + 'PORT(S)'.padEnd(20) + 'AGE'));
        
        if (services.items && services.items.length > 0) {
          services.items.forEach(formatServiceData);
        } else {
          console.log(chalk.yellow('No services found'));
        }
        break;
        
      case 'deployments':
        const deployments = await client.listAppsV1NamespacedDeployment({
          path: { namespace },
          query: { limit: 100 }
        });
        
        console.log(chalk.bold('NAME'.padEnd(30) + 'READY'.padEnd(10) + 'UP-TO-DATE'.padEnd(10) + 'AVAILABLE'.padEnd(10) + 'AGE'));
        
        if (deployments.items && deployments.items.length > 0) {
          deployments.items.forEach(formatDeploymentData);
        } else {
          console.log(chalk.yellow('No deployments found'));
        }
        break;
        
      default:
        console.log(chalk.yellow(`Resource type '${resourceType}' not implemented yet`));
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
  }
};

import { CLIOptions, Inquirerer } from 'inquirerer';
import { ParsedArgs } from 'minimist';
import chalk from 'chalk';
import { KubernetesClient } from 'kubernetesjs';

export default async (
  _argv: Partial<ParsedArgs>,
  _prompter: Inquirerer,
  _options: CLIOptions
) => {
  try {
    const client = new KubernetesClient({
      restEndpoint: 'http://localhost:8001' // Default kube-proxy endpoint
    });

    console.log(chalk.blue('Kubernetes cluster info:'));
    
    const apiVersions = await client.getAPIVersions();
    console.log(chalk.bold('\nAPI Versions:'));
    if (apiVersions.versions) {
      apiVersions.versions.forEach(version => {
        console.log(`  ${version}`);
      });
    }
    
    const apiResources = await client.getAPIResources({
      path: { group: '', version: 'v1' }
    });
    
    console.log(chalk.bold('\nAPI Resources:'));
    if (apiResources.resources) {
      apiResources.resources.forEach(resource => {
        console.log(`  ${resource.name.padEnd(30)} ${resource.namespaced ? 'Namespaced' : 'Cluster'}`);
      });
    }
    
    const versionInfo = await client.getCode();
    console.log(chalk.bold('\nVersion Info:'));
    console.log(`  Kubernetes Version: ${versionInfo.gitVersion || 'unknown'}`);
    console.log(`  Build Date: ${versionInfo.buildDate || 'unknown'}`);
    console.log(`  Go Version: ${versionInfo.goVersion || 'unknown'}`);
    console.log(`  Platform: ${versionInfo.platform || 'unknown'}`);
    
    console.log(chalk.bold('\nKubernetes control plane:'));
    console.log(`  https://kubernetes.default.svc:443`);
    
    console.log(chalk.bold('\nTo further debug and diagnose cluster problems, use:'));
    console.log(`  kubectl cluster-info dump`);
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
  }
};

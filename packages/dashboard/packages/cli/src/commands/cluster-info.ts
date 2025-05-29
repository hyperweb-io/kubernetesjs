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
      restEndpoint: _argv.clientUrl || 'http://127.0.0.1:8001'
    });

    console.log(chalk.blue('Kubernetes cluster info:'));
    
    const apiVersions = await client.getAPIVersions({
      params: {
        
      },
      query: {
        
      }
    });
    console.log(chalk.bold('\nAPI Versions:'));
    if (apiVersions.apiVersion) {
      console.log(apiVersions.apiVersion)
    }
    
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
  }
};

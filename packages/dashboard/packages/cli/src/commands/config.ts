import { CLIOptions, Inquirerer, Question } from 'inquirerer';
import { ParsedArgs } from 'minimist';
import chalk from 'chalk';
import { KubernetesClient } from 'kubernetesjs';
import { getCurrentNamespace, setCurrentNamespace } from '../config';

async function promptNamespace(
  prompter: Inquirerer, 
  argv: Partial<ParsedArgs>, 
  client: KubernetesClient
): Promise<string> {
  try {
    const namespaces = await client.listCoreV1Namespace({
      query: {}
    });
    
    if (!namespaces.items || namespaces.items.length === 0) {
      console.log(chalk.yellow('No namespaces found'));
      return '';
    }
    
    const options = namespaces.items.map(ns => ({
      name: ns.metadata.name,
      value: ns.metadata.name
    }));
    
    const question: Question = {
      type: 'autocomplete',
      name: 'namespace',
      message: 'Select namespace',
      options,
      maxDisplayLines: 10,
      required: true
    };
    
    const { namespace } = await prompter.prompt(argv, [question]);
    return namespace;
  } catch (error) {
    console.error(chalk.red(`Error getting namespaces: ${error}`));
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
    
    const subcommand = argv._?.[0];
    
    if (subcommand === 'get-context') {
      const namespace = getCurrentNamespace();
      console.log(chalk.green(`Current namespace: ${namespace}`));
      return;
    }
    
    if (subcommand === 'set-context') {
      if (argv.current !== true) {
        console.error(chalk.red('Missing --current flag'));
        return;
      }
      
      let namespace = argv.namespace;
      if (!namespace) {
        namespace = await promptNamespace(prompter, argv, client);
        if (!namespace) {
          return;
        }
      }
      
      setCurrentNamespace(namespace as string);
      console.log(chalk.green(`Namespace set to "${namespace}"`));
      return;
    }
    
    console.log(chalk.blue('Available config commands:'));
    console.log('  get-context                  Display the current context');
    console.log('  set-context --current --namespace=<namespace>  Set the current namespace');
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
  }
};

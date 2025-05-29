import chalk from 'chalk';

import { readAndParsePackageJson } from './package';
import { ParsedArgs } from 'minimist';

export const extractFirst = (argv: Partial<ParsedArgs>) => {
    const first = argv._?.[0];
    const newArgv = {
      ...argv,
      _: argv._?.slice(1) ?? []
    };
    return { first, newArgv };
  };

// Function to display the version information
export function displayVersion() {
    const pkg = readAndParsePackageJson();
    console.log(chalk.green(`Name: ${pkg.name}`));
    console.log(chalk.blue(`Version: ${pkg.version}`));
}

export const usageText = `
  Usage: k8s <command> [options]
  
  Commands:
    get [resource]         List resources (pods, services, deployments, etc.)
    describe [resource]    Show detailed information about a specific resource
    logs [pod]             Display logs from a container in a pod
    exec [pod] -- [cmd]    Execute a command in a container
    apply -f [file]        Apply a configuration to a resource by file name
    delete [resource]      Delete resources
    port-forward [svc]     Forward one or more local ports to a pod
    cluster-info           Display cluster information
    config                 Modify kubeconfig files
    deploy                 Deploy a container to Kubernetes
    version, -v            Display the version of the CLI
  
  Configuration File:
    --config <path>        Specify the path to a YAML configuration file.
                           Command-line options will override settings from this file if both are provided.
  
  Namespace:
    -n, --namespace        Specify the namespace to use. Default is from local config or "default".
  
  Additional Options:
    --clientUrl <url>      Specify the Kubernetes API endpoint URL.
                           Default is http://127.0.0.1:8001 (kubectl proxy)
  
  Additional Help:
    $ k8s help             Display this help information.
  `;

export function displayUsage() {
    console.log(usageText);
}

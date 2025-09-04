#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createSetupCommand, createDeployCommand, createStatusCommand, createDeleteCommand } from './commands';

const program = new Command();

// Package information (in a real implementation, this would come from package.json)
const version = '0.0.1';

program
  .name('interweb')
  .description('Interweb CLI - Kubernetes cluster management and application deployment')
  .version(version, '-v, --version', 'Display version number');

// Add commands
program.addCommand(createSetupCommand());
program.addCommand(createDeployCommand());
program.addCommand(createStatusCommand());
program.addCommand(createDeleteCommand());

// Add additional utility commands
program
  .command('list')
  .description('List all interweb resources in the cluster')
  .option('--kubeconfig <path>', 'Path to kubeconfig file')
  .option('--context <context>', 'Kubernetes context to use')
  .action(async (options: any) => {
    console.log(chalk.blue('📋 Interweb Resources'));
    console.log('====================\n');
    console.log(chalk.yellow('Feature not yet implemented'));
    console.log('This will list all interweb-managed resources in the cluster');
  });

program
  .command('wait')
  .description('Wait for cluster setup or application to be ready')
  .option('-c, --config <path>', 'Path to configuration file')
  .option('-t, --type <type>', 'Configuration type: cluster or application', 'cluster')
  .option('--timeout <seconds>', 'Timeout in seconds', '600')
  .option('--kubeconfig <path>', 'Path to kubeconfig file')
  .option('--context <context>', 'Kubernetes context to use')
  .action(async (options: any) => {
    console.log(chalk.blue('⏳ Waiting for resources to be ready...'));
    console.log(chalk.yellow('Feature not yet implemented'));
    console.log('This will wait for the specified resources to be ready');
  });

program
  .command('validate')
  .description('Validate configuration files')
  .option('-c, --config <path>', 'Path to configuration file')
  .option('-t, --type <type>', 'Configuration type: cluster or application', 'cluster')
  .action((options: any) => {
    console.log(chalk.blue('✅ Validating configuration...'));
    console.log(chalk.yellow('Feature not yet implemented'));
    console.log('This will validate the specified configuration file');
  });

// Global error handling
program.exitOverride((err: any) => {
  if (err.code === 'commander.help') {
    process.exit(0);
  }
  if (err.code === 'commander.version') {
    process.exit(0);
  }
  console.error(chalk.red('Error:'), err.message);
  process.exit(1);
});

// Custom help
program.on('--help', () => {
  console.log('');
  console.log(chalk.blue('Examples:'));
  console.log('  $ interweb setup                    # Set up cluster with interweb.setup.yaml');
  console.log('  $ interweb setup --generate-config  # Generate sample cluster config');
  console.log('  $ interweb deploy -c app.yaml       # Deploy application');
  console.log('  $ interweb status                   # Check cluster status');
  console.log('  $ interweb status -t application    # Check application status');
  console.log('  $ interweb delete -c app.yaml       # Delete application');
  console.log('');
  console.log(chalk.blue('Configuration Files:'));
  console.log('  interweb.setup.yaml  - Cluster setup configuration');
  console.log('  interweb.deploy.yaml - Application deployment configuration');
  console.log('');
  console.log(chalk.blue('Documentation:'));
  console.log('  https://docs.interweb.dev');
});

// Show help if no command is provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}

// Parse arguments and run
async function main() {
  try {
    await program.parseAsync(process.argv);
  } catch (error: any) {
    console.error(chalk.red('An error occurred:'), error.message);
    if (error.stack && process.env.DEBUG) {
      console.error(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}

main();

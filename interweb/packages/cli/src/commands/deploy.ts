import { Command } from 'commander';
import { Client, ConfigLoader } from '@interweb/client';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { getApiEndpoint } from '../utils/k8s-utils';

export function createDeployCommand(): Command {
  const command = new Command('deploy');
  
  command
    .description('Deploy an application to the Kubernetes cluster')
    .option('-c, --config <path>', 'Path to application configuration file', '__fixtures__/config/deploy.config.yaml')
    .option('-n, --namespace <namespace>', 'Kubernetes namespace to use')
    .option('--kubeconfig <path>', 'Path to kubeconfig file')
    .option('--context <context>', 'Kubernetes context to use')
    .option('-v, --verbose', 'Enable verbose logging')
    .option('--generate-config', 'Generate a sample application configuration file')
    .option('-w, --wait', 'Wait for deployment to be ready')
    .action(async (options) => {
      try {
        if (options.generateConfig) {
          await generateAppConfig(options);
          return;
        }

        await deployApplication(options);
      } catch (error) {
        console.error(chalk.red('Deployment failed:'), error);
        process.exit(1);
      }
    });

  return command;
}

async function deployApplication(options: any): Promise<void> {
  console.log(chalk.blue('🚀 Interweb Application Deployment'));
  console.log('==================================\n');

  // Check if config file exists
  if (!ConfigLoader.configExists(options.config)) {
    console.log(chalk.yellow(`Configuration file not found: ${options.config}`));
    
    const { shouldGenerate } = await inquirer.prompt([{
      type: 'confirm',
      name: 'shouldGenerate',
      message: 'Would you like to generate a sample application configuration file?',
      default: true
    }]);

    if (shouldGenerate) {
      await generateAppConfig(options);
      console.log(chalk.yellow('Please review and modify the configuration before running deploy again.'));
      return;
    } else {
      throw new Error('Configuration file is required for deployment');
    }
  }

  // Validate configuration
  console.log(chalk.blue('Validating configuration...'));
  const config = ConfigLoader.loadApplication(options.config);
  console.log(chalk.green(`✓ Configuration loaded: ${config.metadata.name}`));

  // Show deployment summary
  console.log('\nApplication Deployment Summary:');
  console.log(`  Name: ${config.metadata.name}`);
  console.log(`  Namespace: ${config.metadata.namespace || 'default'}`);

  if (config.spec.database) {
    console.log(`  Database: ${config.spec.database.type} (${config.spec.database.name})`);
    console.log(`    Instances: ${config.spec.database.config.instances}`);
    if (config.spec.database.config.storage) {
      console.log(`    Storage: ${config.spec.database.config.storage}`);
    }
  }

  if (config.spec.services && config.spec.services.length > 0) {
    console.log(`  Services:`);
    config.spec.services.forEach(service => {
      console.log(`    ${chalk.green('•')} ${service.name} (${service.image}:${service.port})`);
      if (service.replicas && service.replicas > 1) {
        console.log(`      Replicas: ${service.replicas}`);
      }
    });
  }

  if (config.spec.ingress?.enabled) {
    console.log(`  Ingress: ${chalk.green('enabled')}`);
    if (config.spec.ingress.host) {
      console.log(`    Host: ${config.spec.ingress.host}`);
    }
  }

  console.log('');

  // Confirm before proceeding
  const { shouldProceed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'shouldProceed',
    message: 'Proceed with application deployment?',
    default: true
  }]);

  if (!shouldProceed) {
    console.log(chalk.yellow('Deployment cancelled'));
    return;
  }

  // Create client and deploy application
  const client = new Client({
    namespace: options.namespace || config.metadata.namespace,
    kubeconfig: options.kubeconfig,
    context: options.context,
    verbose: options.verbose,
    restEndpoint: getApiEndpoint(options.restEndpoint)
  });

  console.log(chalk.blue('\nDeploying application...'));
  await client.deployApplication(options.config);

  if (options.wait) {
    console.log(chalk.blue('\nWaiting for application to be ready...'));
    await client.waitForApplication(options.config);
  }

  console.log(chalk.green('\n🎉 Application deployed successfully!'));
}

async function generateAppConfig(options: any): Promise<void> {
  console.log(chalk.blue('📝 Generate Application Configuration'));
  console.log('=====================================\n');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Application name:',
      default: 'my-app'
    },
    {
      type: 'input',
      name: 'namespace',
      message: 'Namespace:',
      default: 'default'
    },
    {
      type: 'confirm',
      name: 'includeDatabase',
      message: 'Include database?',
      default: true
    },
    {
      type: 'list',
      name: 'databaseType',
      message: 'Database type:',
      choices: ['postgresql', 'mysql', 'mongodb'],
      when: (answers) => answers.includeDatabase
    },
    {
      type: 'number',
      name: 'databaseInstances',
      message: 'Database instances:',
      default: 3,
      when: (answers) => answers.includeDatabase
    },
    {
      type: 'confirm',
      name: 'includeService',
      message: 'Include application service?',
      default: true
    },
    {
      type: 'input',
      name: 'serviceName',
      message: 'Service name:',
      default: 'api-server',
      when: (answers) => answers.includeService
    },
    {
      type: 'input',
      name: 'serviceImage',
      message: 'Service image:',
      default: 'nginx:latest',
      when: (answers) => answers.includeService
    },
    {
      type: 'number',
      name: 'servicePort',
      message: 'Service port:',
      default: 80,
      when: (answers) => answers.includeService
    },
    {
      type: 'number',
      name: 'serviceReplicas',
      message: 'Service replicas:',
      default: 2,
      when: (answers) => answers.includeService
    },
    {
      type: 'confirm',
      name: 'enableIngress',
      message: 'Enable ingress?',
      default: false
    },
    {
      type: 'input',
      name: 'ingressHost',
      message: 'Ingress host:',
      default: 'app.example.com',
      when: (answers) => answers.enableIngress
    }
  ]);

  // Create configuration based on answers
  const config: any = {
    apiVersion: 'interweb.dev/v1',
    kind: 'Application',
    metadata: {
      name: answers.name,
      namespace: answers.namespace
    },
    spec: {}
  };

  if (answers.includeDatabase) {
    config.spec.database = {
      type: answers.databaseType,
      name: `${answers.name}-db`,
      namespace: `${answers.name}-db`,
      config: {
        instances: answers.databaseInstances,
        storage: '10Gi'
      }
    };
  }

  if (answers.includeService) {
    config.spec.services = [{
      name: answers.serviceName,
      image: answers.serviceImage,
      port: answers.servicePort,
      replicas: answers.serviceReplicas,
      env: {
        'NODE_ENV': 'production'
      }
    }];
  }

  if (answers.enableIngress) {
    config.spec.ingress = {
      enabled: true,
      host: answers.ingressHost,
      path: '/',
      tls: true
    };
  }

  const outputPath = options.config || 'interweb.deploy.yaml';
  ConfigLoader.saveConfig(config, outputPath);
  
  console.log(chalk.green(`✓ Configuration saved to ${outputPath}`));
  console.log(chalk.blue('\nTo deploy the application, run:'));
  console.log(`  interweb deploy -c ${outputPath}`);
}

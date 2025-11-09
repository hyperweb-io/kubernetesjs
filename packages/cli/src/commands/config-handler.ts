import chalk from 'chalk';
import * as fs from 'fs';
import { CLIOptions, Inquirerer } from 'inquirerer';
import { ParsedArgs } from 'minimist';

import { inferResourceType,readYamlFile } from '../config';
import type { CommandHandler } from '../types';

/**
 * Handle the --config flag by parsing the YAML file and executing the appropriate command
 * @param argv Command line arguments
 * @param prompter Inquirerer instance
 * @param options CLI options
 * @param commandMap Map of available commands
 */
export default async (
  argv: Partial<ParsedArgs>,
  prompter: Inquirerer,
  options: CLIOptions,
  commandMap: Record<string, CommandHandler>
): Promise<boolean> => {
  if (!argv.config) {
    return false;
  }

  const configPath = argv.config as string;

  if (!fs.existsSync(configPath)) {
    console.error(chalk.red(`Config file not found: ${configPath}`));
    return true;
  }

  try {
    const resource = readYamlFile(configPath);
    
    const resourceType = inferResourceType(resource);
    
    console.log(chalk.blue(`Detected resource type: ${resourceType}`));
    
    let command: string;
    
    command = 'apply';
    
    const newArgv = {
      ...argv,
      _: [configPath],
      f: configPath
    };
    
    if (commandMap[command]) {
      await commandMap[command](newArgv, prompter, options);
    } else {
      console.error(chalk.red(`No command found for resource type: ${resourceType}`));
    }
    
    return true;
  } catch (error) {
    console.error(chalk.red(`Error processing config file: ${error}`));
    return true;
  }
};

import { CLIOptions, Inquirerer } from 'inquirerer';
import { ParsedArgs } from 'minimist';

import apply from './commands/apply';
import clusterInfo from './commands/cluster-info';
import config from './commands/config';
import deleteCmd from './commands/delete';
// Commands
import deploy from './commands/deploy';
import describe from './commands/describe';
import exec from './commands/exec';
import get from './commands/get';
import logs from './commands/logs';
import portForward from './commands/port-forward';
import { readAndParsePackageJson } from './package';
import type { CommandHandler } from './types';
import { extractFirst, usageText } from './utils';

const commandMap: Record<string, CommandHandler> = {
  deploy,
  get,
  describe,
  logs,
  apply,
  delete: deleteCmd,
  exec,
  'port-forward': portForward,
  'cluster-info': clusterInfo,
  config
};

import configHandler from './commands/config-handler';

export const commands = async (argv: Partial<ParsedArgs>, prompter: Inquirerer, options: CLIOptions) => {
  if (argv.version || argv.v) {
    const pkg = readAndParsePackageJson();
    console.log(pkg.version);
    process.exit(0);
  }

  if (argv.config) {
    const handled = await configHandler(argv, prompter, options, commandMap);
    if (handled) {
      prompter.close();
      return argv;
    }
  }

  let { first: command, newArgv } = extractFirst(argv);

  // Show usage if explicitly requested
  if (argv.help || argv.h || command === 'help') {
    console.log(usageText);
    process.exit(0);
  }

  // Prompt if no command provided
  if (!command) {
    const answer = await prompter.prompt(argv, [
      {
        type: 'autocomplete',
        name: 'command',
        message: 'What do you want to do?',
        options: Object.keys(commandMap)
      }
    ]);
    command = answer.command;
  }

  // Prompt for working directory and client URL
  newArgv = await prompter.prompt(newArgv, [
    {
      type: 'text',
      name: 'cwd',
      message: 'Working directory',
      required: false,
      default: process.cwd(),
      useDefault: true
    },
    {
      type: 'text',
      name: 'clientUrl',
      message: 'Kubernetes API URL',
      required: false,
      default: 'http://127.0.0.1:8001',
      useDefault: true
    }
  ]);

  const commandFn = commandMap[command];

  if (!commandFn) {
    console.error(`Unknown command: ${command}`);
    console.log(usageText);
    process.exit(1);
  }

  await commandFn(newArgv, prompter, options);
  prompter.close();

  return argv;
};

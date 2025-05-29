import { CLIOptions, Inquirerer } from 'inquirerer';
import { ParsedArgs } from 'minimist';

import { readAndParsePackageJson } from './package';
import { extractFirst, usageText } from './utils';
import { getClientUrl } from './config';

// Commands
import deploy from './commands/deploy';
import get from './commands/get';
import describe from './commands/describe';
import logs from './commands/logs';
import apply from './commands/apply';
import deleteCmd from './commands/delete';
import exec from './commands/exec';
import portForward from './commands/port-forward';
import clusterInfo from './commands/cluster-info';
import config from './commands/config';

const commandMap: Record<string, Function> = {
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

  // Prompt for working directory
  newArgv = await prompter.prompt(newArgv, [
    {
      type: 'text',
      name: 'cwd',
      message: 'Working directory',
      required: false,
      default: process.cwd(),
      useDefault: true
    }
  ]);

  const commandFn = commandMap[command];

  if (!commandFn) {
    console.error(`Unknown command: ${command}`);
    console.log(usageText);
    process.exit(1);
  }

  const clientUrl = getClientUrl(newArgv);
  const extendedOptions = { ...options, clientUrl };

  await commandFn(newArgv, prompter, extendedOptions);
  prompter.close();

  return argv;
};

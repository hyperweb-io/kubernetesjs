import type { CLIOptions, Inquirerer } from 'inquirerer';
import type { ParsedArgs } from 'minimist';

export type CommandHandler = (
  argv: Partial<ParsedArgs>,
  prompter: Inquirerer,
  options: CLIOptions
) => Promise<unknown> | unknown;


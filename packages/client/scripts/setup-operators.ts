import { promises as fs } from 'fs';
import path from 'path';
import { load as loadYaml } from 'js-yaml';
import { spawnSync } from 'child_process';
import { InterwebClient as InterwebKubernetesClient } from '@kubernetesjs/ops';
import { getOperatorIds } from '@kubernetesjs/manifests';
import { SetupClient } from '../src/setup';
import { ClusterSetupConfig, OperatorConfig } from '../src/types';

export interface OperatorScriptOptions {
  configPath: string;
  kubeApi?: string;
  kubeconfig?: string;
  namespace?: string;
  continueOnError?: boolean;
  requiredOperators?: string[];
  skipConnectionCheck?: boolean;
}

const DEFAULT_REQUIRED_OPERATORS = ['cloudnative-pg', 'minio-operator'];
const DEFAULT_API_ENDPOINT = process.env.K8S_API || 'http://127.0.0.1:8001';
const SUPPORTED_SETUP_OPERATORS = new Set(getOperatorIds());
const HELM_BIN = process.env.HELM_BIN || 'helm';

interface PartitionedOperators {
  supported: OperatorConfig[];
  external: OperatorConfig[];
}

export async function setup(options: OperatorScriptOptions): Promise<void> {
  const config = await loadClusterSetupConfig(options.configPath);
  validateRequiredOperators(config, options.requiredOperators);

  const client = createSetupClient(config, options);

  if (!options.skipConnectionCheck) {
    const ok = await client.checkConnection();
    if (!ok) {
      throw new Error('Kubernetes cluster not reachable. Aborting operator setup.');
    }
  }

  const { supported, external } = partitionOperators(config.spec.operators);

  if (supported.length > 0) {
    const filteredConfig = cloneConfigWithOperators(config, supported);
    await client.installOperators(filteredConfig);
  }

  if (external.length > 0) {
    await installExternalOperators(external, options);
  }
}

export async function teardown(options: OperatorScriptOptions): Promise<void> {
  const config = await loadClusterSetupConfig(options.configPath);
  validateRequiredOperators(config, options.requiredOperators);

  const client = createSetupClient(config, options);

  if (!options.skipConnectionCheck) {
    const ok = await client.checkConnection();
    if (!ok) {
      throw new Error('Kubernetes cluster not reachable. Aborting operator teardown.');
    }
  }

  const { supported, external } = partitionOperators(config.spec.operators);

  if (supported.length > 0) {
    const filteredConfig = cloneConfigWithOperators(config, supported);
    await client.deleteOperators(filteredConfig, {
      continueOnError: options.continueOnError ?? true,
    });
  }

  if (external.length > 0) {
    await deleteExternalOperators(external, options);
  }
}

function createSetupClient(config: ClusterSetupConfig, options: OperatorScriptOptions): SetupClient {
  const defaultNamespace = options.namespace || config.metadata?.namespace || 'default';
  const clientOpts: Record<string, unknown> = {};

  if (options.kubeApi) {
    clientOpts.restEndpoint = options.kubeApi;
  } else if (!options.kubeconfig) {
    clientOpts.restEndpoint = DEFAULT_API_ENDPOINT;
  }

  if (options.kubeconfig) {
    clientOpts.kubeconfig = options.kubeconfig;
  }

  const kubeClient = new InterwebKubernetesClient(clientOpts as any);
  return new SetupClient(kubeClient, defaultNamespace);
}

async function loadClusterSetupConfig(filePath: string): Promise<ClusterSetupConfig> {
  const resolved = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  const raw = await fs.readFile(resolved, 'utf8');

  let parsed: unknown;
  if (resolved.endsWith('.json')) {
    parsed = JSON.parse(raw);
  } else {
    parsed = loadYamlSafe(raw, resolved);
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`Invalid cluster setup config: ${resolved}`);
  }

  const cfg = parsed as ClusterSetupConfig;
  if (!cfg.spec || !Array.isArray(cfg.spec.operators)) {
    throw new Error(`Cluster setup config is missing spec.operators: ${resolved}`);
  }
  return cfg;
}

function loadYamlSafe(raw: string, file: string): unknown {
  try {
    return loadYaml(raw);
  } catch (error) {
    throw new Error(`Failed to parse YAML config at ${file}: ${error}`);
  }
}

function validateRequiredOperators(
  config: ClusterSetupConfig,
  requiredOverride?: string[],
): void {
  const required = requiredOverride && requiredOverride.length > 0
    ? requiredOverride
    : DEFAULT_REQUIRED_OPERATORS;

  const enabledNames = new Set(
    config.spec.operators
      .filter((op) => op.enabled !== false)
      .map((op) => op.name),
  );

  const missing = required.filter((name) => !enabledNames.has(name));
  if (missing.length > 0) {
    throw new Error(
      `Cluster setup config must enable the following operators: ${missing.join(', ')}`,
    );
  }
}

function parseArgs(argv: string[]): { command: 'setup' | 'teardown'; options: OperatorScriptOptions } {
  const [, , maybeCommand, ...rest] = argv;
  if (!maybeCommand || (maybeCommand !== 'setup' && maybeCommand !== 'teardown')) {
    throw new Error('Usage: setup-operators.ts <setup|teardown> --config <path> [--api <url>] [--kubeconfig <path>] [--namespace <ns>] [--no-continue]');
  }

  const options: OperatorScriptOptions = {
    configPath: '',
    continueOnError: true,
  };

  let i = 0;
  while (i < rest.length) {
    const arg = rest[i];
    switch (arg) {
      case '--config':
      case '-c': {
        const value = rest[i + 1];
        if (!value) {
          throw new Error('Missing value for --config');
        }
        options.configPath = value;
        i += 2;
        break;
      }
      case '--api': {
        const value = rest[i + 1];
        if (!value) {
          throw new Error('Missing value for --api');
        }
        options.kubeApi = value;
        i += 2;
        break;
      }
      case '--kubeconfig': {
        const value = rest[i + 1];
        if (!value) {
          throw new Error('Missing value for --kubeconfig');
        }
        options.kubeconfig = value;
        i += 2;
        break;
      }
      case '--namespace':
      case '-n': {
        const value = rest[i + 1];
        if (!value) {
          throw new Error('Missing value for --namespace');
        }
        options.namespace = value;
        i += 2;
        break;
      }
      case '--required': {
        const value = rest[i + 1];
        if (!value) {
          throw new Error('Missing value for --required');
        }
        options.requiredOperators = value
          .split(/[\s,]+/)
          .map((s) => s.trim())
          .filter(Boolean);
        i += 2;
        break;
      }
      case '--no-continue':
        options.continueOnError = false;
        i += 1;
        break;
      case '--skip-connection-check':
        options.skipConnectionCheck = true;
        i += 1;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!options.configPath) {
    throw new Error('Missing --config <path> argument');
  }

  return { command: maybeCommand, options };
}

async function main(): Promise<void> {
  try {
    const { command, options } = parseArgs(process.argv);
    if (command === 'setup') {
      await setup(options);
    } else {
      await teardown(options);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  void main();
}

// Utility export for tests if we need to inject operators
export function ensureOperatorsEnabled(
  operators: OperatorConfig[],
  names: string[],
): OperatorConfig[] {
  const enabled = new Set(operators.filter((op) => op.enabled !== false).map((op) => op.name));
  const missing = names.filter((name) => !enabled.has(name));
  if (missing.length > 0) {
    throw new Error(`Operators not enabled: ${missing.join(', ')}`);
  }
  return operators;
}

function partitionOperators(operators: OperatorConfig[]): PartitionedOperators {
  const supported: OperatorConfig[] = [];
  const external: OperatorConfig[] = [];

  for (const op of operators) {
    if (SUPPORTED_SETUP_OPERATORS.has(op.name)) {
      supported.push(op);
    } else {
      external.push(op);
    }
  }

  return { supported, external };
}

function cloneConfigWithOperators(config: ClusterSetupConfig, operators: OperatorConfig[]): ClusterSetupConfig {
  return {
    ...config,
    spec: {
      ...config.spec,
      operators,
    },
  };
}

async function installExternalOperators(operators: OperatorConfig[], options: OperatorScriptOptions): Promise<void> {
  for (const operator of operators) {
    switch (operator.name) {
      case 'minio-operator':
        installMinioOperator(operator);
        break;
      default:
        throw new Error(`Unsupported external operator '${operator.name}'. Update manifests or script.`);
    }
  }
}

async function deleteExternalOperators(operators: OperatorConfig[], options: OperatorScriptOptions): Promise<void> {
  for (const operator of operators) {
    switch (operator.name) {
      case 'minio-operator':
        uninstallMinioOperator(operator, options.continueOnError ?? true);
        break;
      default:
        console.warn(`Skipping teardown for unsupported operator '${operator.name}'.`);
    }
  }
}

function installMinioOperator(operator: OperatorConfig): void {
  const namespace = operator.namespace || 'minio-operator';
  const version = operator.version || '5.0.11';
  const releaseName = operator.config?.releaseName || 'interweb-minio-operator';

  ensureHelmRepo('minio-operator', 'https://operator.min.io/');

  const args = [
    'upgrade',
    '--install',
    releaseName,
    'operator',
    '--repo',
    'https://operator.min.io/',
    '--namespace',
    namespace,
    '--create-namespace',
    '--version',
    version,
  ];

  runCommand(HELM_BIN, args, `Failed to install MinIO operator ${version}`);
}

function uninstallMinioOperator(operator: OperatorConfig, continueOnError: boolean): void {
  const namespace = operator.namespace || 'minio-operator';
  const releaseName = operator.config?.releaseName || 'interweb-minio-operator';

  const result = spawnSync(HELM_BIN, ['uninstall', releaseName, '--namespace', namespace], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    const msg = `Failed to uninstall MinIO operator (release ${releaseName})`;
    if (continueOnError) {
      console.warn(msg);
    } else {
      throw new Error(msg);
    }
  }
}

function ensureHelmRepo(name: string, url: string): void {
  const add = spawnSync(HELM_BIN, ['repo', 'add', name, url], { stdio: 'ignore' });
  if (add.status !== 0) {
    // repo may already exist; ignore errors
  }
  spawnSync(HELM_BIN, ['repo', 'update'], { stdio: 'ignore' });
}

function runCommand(cmd: string, args: string[], errorMessage: string): void {
  const result = spawnSync(cmd, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(errorMessage);
  }
}

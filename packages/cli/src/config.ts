import { existsSync, readFileSync, writeFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { homedir } from 'os';
import { join } from 'path';

const KUBECONFIG_PATH = join(homedir(), '.kubeconfig');

const DEFAULT_NAMESPACE = 'default';

interface KubeConfig {
  currentNamespace: string;
}

/**
 * Read and parse a YAML file
 * @param filePath Path to the YAML file
 * @returns Parsed YAML content
 */
export function readYamlFile(filePath: string): any {
  try {
    const fileContent = readFileSync(filePath, 'utf8');
    return yaml.load(fileContent);
  } catch (error) {
    console.error(`Error reading YAML file: ${error}`);
    throw error;
  }
}

/**
 * Infer the resource type from a Kubernetes YAML
 * @param resource The parsed Kubernetes resource
 * @returns The resource type (lowercase)
 */
export function inferResourceType(resource: any): string {
  if (!resource || !resource.kind) {
    throw new Error('Invalid Kubernetes resource: missing kind');
  }
  return resource.kind.toLowerCase();
}

/**
 * Get the current namespace from the local kubeconfig
 * @returns The current namespace
 */
export function getCurrentNamespace(): string {
  try {
    if (!existsSync(KUBECONFIG_PATH)) {
      return DEFAULT_NAMESPACE;
    }

    const configContent = readFileSync(KUBECONFIG_PATH, 'utf8');
    const config: KubeConfig = JSON.parse(configContent);
    return config.currentNamespace || DEFAULT_NAMESPACE;
  } catch (error) {
    console.error(`Error reading kubeconfig: ${error}`);
    return DEFAULT_NAMESPACE;
  }
}

/**
 * Set the current namespace in the local kubeconfig
 * @param namespace The namespace to set
 */
export function setCurrentNamespace(namespace: string): void {
  try {
    let config: KubeConfig = { currentNamespace: namespace };
    
    if (existsSync(KUBECONFIG_PATH)) {
      try {
        const configContent = readFileSync(KUBECONFIG_PATH, 'utf8');
        config = { ...JSON.parse(configContent), currentNamespace: namespace };
      } catch (error) {
        console.error(`Error parsing existing kubeconfig: ${error}`);
      }
    }

    writeFileSync(KUBECONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
    console.log(`Namespace set to "${namespace}"`);
  } catch (error) {
    console.error(`Error setting namespace: ${error}`);
    throw error;
  }
}

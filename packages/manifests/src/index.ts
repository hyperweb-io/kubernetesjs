import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

export interface KubernetesResource {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace?: string;
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
  };
  spec?: any;
  data?: any;
}

export class ManifestLoader {
  private static manifestsDir = path.join(__dirname, 'operators');

  /**
   * Load all manifests for a specific operator
   */
  static loadOperatorManifests(operatorName: string): KubernetesResource[] {
    const manifestPath = path.join(this.manifestsDir, `${operatorName}.yaml`);
    
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Manifest not found for operator: ${operatorName}`);
    }

    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const documents = yaml.loadAll(manifestContent) as KubernetesResource[];
    
    return documents.filter(doc => doc && typeof doc === 'object');
  }

  /**
   * Get available operator manifest names
   */
  static getAvailableOperators(): string[] {
    if (!fs.existsSync(this.manifestsDir)) {
      return [];
    }

    return fs.readdirSync(this.manifestsDir)
      .filter(file => file.endsWith('.yaml'))
      .map(file => path.basename(file, '.yaml'));
  }

  /**
   * Load custom manifest from file path
   */
  static loadCustomManifest(filePath: string): KubernetesResource[] {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Manifest file not found: ${filePath}`);
    }

    const manifestContent = fs.readFileSync(filePath, 'utf8');
    const documents = yaml.loadAll(manifestContent) as KubernetesResource[];
    
    return documents.filter(doc => doc && typeof doc === 'object');
  }

  /**
   * Parse YAML string into Kubernetes resources
   */
  static parseManifestString(yamlContent: string): KubernetesResource[] {
    const documents = yaml.loadAll(yamlContent) as KubernetesResource[];
    return documents.filter(doc => doc && typeof doc === 'object');
  }

  /**
   * Apply variable substitution to manifest content
   */
  static substituteVariables(yamlContent: string, variables: Record<string, string>): string {
    let result = yamlContent;
    
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
      result = result.replace(regex, value);
    }
    
    return result;
  }

  /**
   * Load operator manifests with variable substitution
   */
  static loadOperatorManifestsWithVars(
    operatorName: string, 
    variables: Record<string, string> = {}
  ): KubernetesResource[] {
    const manifestPath = path.join(this.manifestsDir, `${operatorName}.yaml`);
    
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Manifest not found for operator: ${operatorName}`);
    }

    let manifestContent = fs.readFileSync(manifestPath, 'utf8');
    
    // Apply variable substitution
    if (Object.keys(variables).length > 0) {
      manifestContent = this.substituteVariables(manifestContent, variables);
    }
    
    const documents = yaml.loadAll(manifestContent) as KubernetesResource[];
    return documents.filter(doc => doc && typeof doc === 'object');
  }
}

// Export the supported operators
export const SUPPORTED_OPERATORS = [
  'ingress-nginx',
  'cert-manager',
  'kube-prometheus-stack',
  'cloudnative-pg',
  'knative-serving'
] as const;

export type SupportedOperator = typeof SUPPORTED_OPERATORS[number];

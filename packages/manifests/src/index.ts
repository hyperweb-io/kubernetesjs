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
   * Get the correct manifests directory path (works in both dev and built environments)
   */
  private static getManifestsDir(): string {
    // Try multiple possible paths for the operators directory
    const possiblePaths = [
      // Development environment
      path.join(__dirname, 'operators'),
      // Built package (CommonJS)
      path.join(__dirname, '..', 'operators'),
      // Built package (ESM) - from dist/esm/ to dist/operators/
      path.join(__dirname, '..', 'operators'),
      // Alternative: try to find relative to package root
      path.join(process.cwd(), 'node_modules', '@interweb', 'manifests', 'dist', 'operators'),
      // Fallback: try to find in current working directory
      path.join(process.cwd(), 'operators')
    ];
    
    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        return path;
      }
    }
    
    // If none found, throw an error with helpful information
    throw new Error(`Could not find operators directory. Tried paths: ${possiblePaths.join(', ')}`);
  }

  /**
   * Load all manifests for a specific operator
   */
  static loadOperatorManifests(operatorName: string): KubernetesResource[] {
    // Handle composite operators that have multiple manifest files
    if (operatorName === 'knative-serving') {
      return this.loadKnativeServingManifests();
    }
    
    const manifestPath = path.join(this.getManifestsDir(), `${operatorName}.yaml`);
    
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
    const manifestsDir = this.getManifestsDir();
    if (!fs.existsSync(manifestsDir)) {
      return [];
    }

    return fs.readdirSync(manifestsDir)
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
   * Load Knative Serving manifests (composite operator with multiple files)
   */
  private static loadKnativeServingManifests(): KubernetesResource[] {
    const manifestFiles = [
      'knative-serving-crds.yaml',
      'knative-serving-core.yaml',
      'knative-kourier.yaml'
    ];
    
    let allResources: KubernetesResource[] = [];
    
    for (const file of manifestFiles) {
      const manifestPath = path.join(this.getManifestsDir(), file);
      if (fs.existsSync(manifestPath)) {
        const manifestContent = fs.readFileSync(manifestPath, 'utf8');
        const documents = yaml.loadAll(manifestContent) as KubernetesResource[];
        allResources = allResources.concat(documents.filter(doc => doc && typeof doc === 'object'));
      }
    }
    
    return allResources;
  }

  /**
   * Load operator manifests with variable substitution
   */
  static loadOperatorManifestsWithVars(
    operatorName: string, 
    variables: Record<string, string> = {}
  ): KubernetesResource[] {
    // Handle composite operators that have multiple manifest files
    if (operatorName === 'knative-serving') {
      let allResources = this.loadKnativeServingManifests();
      
      // Apply variable substitution to the resources
      if (Object.keys(variables).length > 0) {
        allResources = allResources.map(resource => {
          const resourceStr = yaml.dump(resource);
          const substitutedStr = this.substituteVariables(resourceStr, variables);
          return yaml.load(substitutedStr) as KubernetesResource;
        });
      }
      
      return allResources;
    }
    
    const manifestPath = path.join(this.getManifestsDir(), `${operatorName}.yaml`);
    
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

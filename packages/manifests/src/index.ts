import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';

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
    // Allow override via environment variable (useful for bundlers like Next.js)
    const override = process.env.INTERWEB_MANIFESTS_DIR;
    if (override && fs.existsSync(override)) {
      return override;
    }

    // Resolve from the installed package root using Node's module resolver.
    // This is robust even when the code is bundled by Next, because resolution
    // is done against the actual package entry, not the route's __dirname.
    try {
      // Prefer CJS require when available; otherwise create a require from the ESM URL via eval.
      let pkgPath: string | undefined;
      try {
        // @ts-ignore - in ESM this will throw
        pkgPath = require.resolve('@interweb/manifests/package.json');
      } catch {
        const esmUrl = (0, eval)('import.meta.url') as string;
        const req = createRequire(esmUrl);
        pkgPath = req.resolve('@interweb/manifests/package.json');
      }
      if (pkgPath) {
        const base = path.dirname(pkgPath);
        const fromPkg = path.join(base, 'operators');
        if (fs.existsSync(fromPkg)) return fromPkg;
      }
    } catch {}

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
  static loadOperatorManifests(operatorName: string, version?: string): KubernetesResource[] {
    // If a version is provided, prefer versioned manifest path first
    if (version) {
      const versionedPath = path.join(this.getManifestsDir(), operatorName, `${version}.yaml`);
      if (fs.existsSync(versionedPath)) {
        const content = fs.readFileSync(versionedPath, 'utf8');
        const docs = yaml.loadAll(content) as KubernetesResource[];
        return docs.filter((d) => d && typeof d === 'object');
      }
      // Fallback to unversioned below if not found
    }

    // Handle composite operator (legacy unversioned layout)
    if (!version && operatorName === 'knative-serving') {
      return this.loadKnativeServingManifests();
    }

    const manifestPath = path.join(this.getManifestsDir(), `${operatorName}.yaml`);
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Manifest not found for operator: ${operatorName}${version ? `@${version}` : ''}`);
    }
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const documents = yaml.loadAll(manifestContent) as KubernetesResource[];
    return documents.filter((doc) => doc && typeof doc === 'object');
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
    const unifiedPath = path.join(this.getManifestsDir(), 'knative-serving.yaml');
    if (!fs.existsSync(unifiedPath)) {
      throw new Error('Unified knative-serving.yaml not found in operators directory');
    }
    const manifestContent = fs.readFileSync(unifiedPath, 'utf8');
    const documents = yaml.loadAll(manifestContent) as KubernetesResource[];
    return documents.filter((doc) => doc && typeof doc === 'object');
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

// Optional metadata for UIs: display name, description, docs, and (optionally) canonical namespaces
export interface OperatorCatalogEntry {
  name: SupportedOperator | string;
  displayName: string;
  description: string;
  docsUrl?: string;
  namespaces?: string[];
}

export const OPERATOR_CATALOG: Record<string, OperatorCatalogEntry> = {
  'ingress-nginx': {
    name: 'ingress-nginx',
    displayName: 'NGINX Ingress Controller',
    description: 'Ingress controller using NGINX as a reverse proxy and load balancer',
    docsUrl: 'https://kubernetes.github.io/ingress-nginx/',
    namespaces: ['ingress-nginx'],
  },
  'cert-manager': {
    name: 'cert-manager',
    displayName: 'cert-manager',
    description: 'X.509 certificate management for Kubernetes',
    docsUrl: 'https://cert-manager.io/',
    namespaces: ['cert-manager'],
  },
  'knative-serving': {
    name: 'knative-serving',
    displayName: 'Knative Serving',
    description: 'Serverless workloads on Kubernetes',
    docsUrl: 'https://knative.dev/docs/serving/',
    namespaces: ['knative-serving', 'kourier-system'],
  },
  'cloudnative-pg': {
    name: 'cloudnative-pg',
    displayName: 'CloudNativePG',
    description: 'PostgreSQL operator for Kubernetes',
    docsUrl: 'https://cloudnative-pg.io/',
    namespaces: ['cnpg-system'],
  },
  'kube-prometheus-stack': {
    name: 'kube-prometheus-stack',
    displayName: 'Prometheus Stack',
    description: 'Monitoring stack with Prometheus, Grafana, Alertmanager',
    docsUrl: 'https://prometheus.io/',
    namespaces: ['monitoring'],
  },
};

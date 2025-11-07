import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { ClusterSetupConfig, ApplicationConfig } from './types';

export class ConfigLoader {
  /**
   * Load and parse a cluster setup configuration file
   */
  static loadClusterSetup(configPath: string): ClusterSetupConfig {
    try {
      const absolutePath = path.resolve(configPath);
      const fileContent = fs.readFileSync(absolutePath, 'utf8');
      const config = yaml.load(fileContent) as ClusterSetupConfig;
      
      this.validateClusterSetupConfig(config);
      return config;
    } catch (error) {
      throw new Error(`Failed to load cluster setup config from ${configPath}: ${error}`);
    }
  }

  /**
   * Load and parse an application configuration file
   */
  static loadApplication(configPath: string): ApplicationConfig {
    try {
      const absolutePath = path.resolve(configPath);
      const fileContent = fs.readFileSync(absolutePath, 'utf8');
      const config = yaml.load(fileContent) as ApplicationConfig;
      
      this.validateApplicationConfig(config);
      return config;
    } catch (error) {
      throw new Error(`Failed to load application config from ${configPath}: ${error}`);
    }
  }

  /**
   * Save a configuration to a YAML file
   */
  static saveConfig(config: ClusterSetupConfig | ApplicationConfig, outputPath: string): void {
    try {
      const yamlContent = yaml.dump(config, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false
      });
      
      const absolutePath = path.resolve(outputPath);
      const dir = path.dirname(absolutePath);
      
      // Ensure directory exists
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(absolutePath, yamlContent, 'utf8');
    } catch (error) {
      throw new Error(`Failed to save config to ${outputPath}: ${error}`);
    }
  }

  /**
   * Validate cluster setup configuration structure
   */
  private static validateClusterSetupConfig(config: ClusterSetupConfig): void {
    if (!config.apiVersion) {
      throw new Error('Missing required field: apiVersion');
    }
    
    if (!config.kind || config.kind !== 'ClusterSetup') {
      throw new Error('Invalid or missing kind. Expected "ClusterSetup"');
    }
    
    if (!config.metadata?.name) {
      throw new Error('Missing required field: metadata.name');
    }
    
    if (!config.spec) {
      throw new Error('Missing required field: spec');
    }
    
    if (!Array.isArray(config.spec.operators)) {
      throw new Error('spec.operators must be an array');
    }
    
    // Validate operators
    config.spec.operators.forEach((operator, index) => {
      if (!operator.name) {
        throw new Error(`Missing name for operator at index ${index}`);
      }
      if (typeof operator.enabled !== 'boolean') {
        throw new Error(`Missing or invalid enabled field for operator ${operator.name}`);
      }
    });
    
    // // Validate networking
    // if (!config.spec.networking.ingressClass) {
    //   throw new Error('Missing required field: spec.networking.ingressClass');
    // }
    
    // if (!config.spec.networking.domain) {
    //   throw new Error('Missing required field: spec.networking.domain');
    // }
  }

  /**
   * Validate application configuration structure
   */
  private static validateApplicationConfig(config: ApplicationConfig): void {
    if (!config.apiVersion) {
      throw new Error('Missing required field: apiVersion');
    }
    
    if (!config.kind || config.kind !== 'Application') {
      throw new Error('Invalid or missing kind. Expected "Application"');
    }
    
    if (!config.metadata?.name) {
      throw new Error('Missing required field: metadata.name');
    }
    
    if (!config.spec) {
      throw new Error('Missing required field: spec');
    }
    
    // Validate database config if present
    if (config.spec.database) {
      const db = config.spec.database;
      if (!db.type || !['postgresql', 'mysql', 'mongodb'].includes(db.type)) {
        throw new Error('Invalid database type. Must be one of: postgresql, mysql, mongodb');
      }
      
      if (!db.name) {
        throw new Error('Missing required field: spec.database.name');
      }
      
      if (!db.namespace) {
        throw new Error('Missing required field: spec.database.namespace');
      }
      
      if (!db.config || typeof db.config.instances !== 'number') {
        throw new Error('Missing or invalid spec.database.config.instances');
      }
    }
    
    // Validate services if present
    if (config.spec.services && Array.isArray(config.spec.services)) {
      config.spec.services.forEach((service, index) => {
        if (!service.name) {
          throw new Error(`Missing name for service at index ${index}`);
        }
        if (!service.image) {
          throw new Error(`Missing image for service ${service.name}`);
        }
        if (typeof service.port !== 'number') {
          throw new Error(`Missing or invalid port for service ${service.name}`);
        }
      });
    }
  }

  /**
   * Check if a file exists and is readable
   */
  static configExists(configPath: string): boolean {
    try {
      const absolutePath = path.resolve(configPath);
      return fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile();
    } catch {
      return false;
    }
  }

  /**
   * Get default cluster setup configuration
   */
  static getDefaultClusterSetup(): ClusterSetupConfig {
    return {
      apiVersion: 'interweb.dev/v1',
      kind: 'ClusterSetup',
      metadata: {
        name: 'dev-cluster'
      },
      spec: {
        operators: [
          {
            name: 'knative-serving',
            version: 'v1.15.0',
            enabled: true
          },
          {
            name: 'cloudnative-pg',
            version: '1.25.2',
            enabled: true
          },
          {
            name: 'cert-manager',
            version: 'v1.17.0',
            enabled: true
          },
          {
            name: 'ingress-nginx',
            enabled: true
          }
        ],
        monitoring: {
          enabled: false,
          prometheus: {
            retention: '7d',
            storage: '1Gi'
          },
          grafana: {
            adminPassword: 'admin',
            persistence: '1Gi'
          }
        },
        networking: {
          ingressClass: 'nginx',
          domain: '127.0.0.1.nip.io'
        }
      }
    };
  }
}

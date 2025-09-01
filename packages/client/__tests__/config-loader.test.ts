import { ConfigLoader } from '../src/config-loader';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('ConfigLoader', () => {
  let tempDir: string;
  let testConfigPath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'interweb-test-'));
    testConfigPath = path.join(tempDir, 'test-config.yaml');
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('getDefaultClusterSetup', () => {
    it('should return a valid default cluster setup configuration', () => {
      const config = ConfigLoader.getDefaultClusterSetup();
      
      expect(config.apiVersion).toBe('interweb.dev/v1');
      expect(config.kind).toBe('ClusterSetup');
      expect(config.metadata.name).toBe('dev-cluster');
      expect(config.spec.operators).toHaveLength(4);
      expect(config.spec.networking.domain).toBe('127.0.0.1.nip.io');
    });
  });

  describe('saveConfig and loadClusterSetup', () => {
    it('should save and load a cluster setup configuration', () => {
      const originalConfig = ConfigLoader.getDefaultClusterSetup();
      
      ConfigLoader.saveConfig(originalConfig, testConfigPath);
      expect(fs.existsSync(testConfigPath)).toBe(true);
      
      const loadedConfig = ConfigLoader.loadClusterSetup(testConfigPath);
      expect(loadedConfig).toEqual(originalConfig);
    });
  });

  describe('configExists', () => {
    it('should return true for existing config file', () => {
      const config = ConfigLoader.getDefaultClusterSetup();
      ConfigLoader.saveConfig(config, testConfigPath);
      
      expect(ConfigLoader.configExists(testConfigPath)).toBe(true);
    });

    it('should return false for non-existing config file', () => {
      expect(ConfigLoader.configExists('non-existing-file.yaml')).toBe(false);
    });
  });

  describe('validation', () => {
    it('should throw error for invalid cluster setup config', () => {
      const invalidConfig = {
        apiVersion: 'interweb.dev/v1',
        kind: 'ClusterSetup',
        metadata: {
          // Missing name
        },
        spec: {
          operators: [],
          networking: {
            ingressClass: 'nginx',
            domain: 'example.com'
          }
        }
      };

      fs.writeFileSync(testConfigPath, JSON.stringify(invalidConfig));
      
      expect(() => {
        ConfigLoader.loadClusterSetup(testConfigPath);
      }).toThrow('Missing required field: metadata.name');
    });

    it('should throw error for missing config file', () => {
      expect(() => {
        ConfigLoader.loadClusterSetup('non-existing-file.yaml');
      }).toThrow('Failed to load cluster setup config');
    });
  });
});

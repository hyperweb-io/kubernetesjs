// Template deployers
export { PostgresDeployer, type PostgresDeployOptions, type DeployResult as PostgresDeployResult } from './postgres';
export { MinioDeployer, type MinioDeployOptions, type MinioDeployResult } from './minio';
export { OllamaDeployer, type OllamaDeployOptions, type OllamaDeployResult } from './ollama';

// Template metadata (browser-safe)
export { 
  type TemplateMetadata, 
  allTemplates, 
  postgresTemplateMetadata, 
  minioTemplateMetadata, 
  ollamaTemplateMetadata 
} from './presets/metadata';
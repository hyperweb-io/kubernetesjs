// Template metadata only - no Node.js dependencies
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  details: {
    image: string;
    ports: number[];
    environment: { name: string; description: string; }[];
  };
}

export const postgresTemplateMetadata: TemplateMetadata = {
  id: 'postgres',
  name: 'PostgreSQL',
  description: 'PostgreSQL database with pgvector extension for vector storage',
  icon: 'Database',
  details: {
    image: 'pyramation/pgvector:13.3-alpine',
    ports: [5432],
    environment: [
      { name: 'POSTGRES_USER', description: 'PostgreSQL username' },
      { name: 'POSTGRES_PASSWORD', description: 'PostgreSQL password' },
      { name: 'POSTGRES_DB', description: 'PostgreSQL database name' },
    ],
  },
};

export const minioTemplateMetadata: TemplateMetadata = {
  id: 'minio',
  name: 'MinIO',
  description: 'High-performance object storage compatible with S3 API',
  icon: 'Cloud',
  details: {
    image: 'minio/minio:latest',
    ports: [9000],
    environment: [
      { name: 'MINIO_ROOT_USER', description: 'MinIO root username' },
      { name: 'MINIO_ROOT_PASSWORD', description: 'MinIO root password' },
    ],
  },
};

export const ollamaTemplateMetadata: TemplateMetadata = {
  id: 'ollama',
  name: 'Ollama',
  description: 'Run large language models locally with a simple API',
  icon: 'Cpu',
  details: {
    image: 'ollama/ollama:latest',
    ports: [11434],
    environment: [],
  },
};

// All templates metadata
export const allTemplates: TemplateMetadata[] = [
  postgresTemplateMetadata,
  minioTemplateMetadata,
  ollamaTemplateMetadata,
];
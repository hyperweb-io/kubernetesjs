'use client';

import { allTemplates, type TemplateMetadata } from '@kubernetesjs/client/deployers/presets/metadata';
import { Cloud, Cpu,Database } from 'lucide-react';

export interface Template {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  details: {
    image: string
    ports: number[]
    environment?: { [key: string]: string }
  }
}

// Icon mapping for template metadata
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Database: Database,
  Cloud: Cloud,
  Cpu: Cpu,
};

// Convert client template metadata to dashboard template format
function convertTemplateMetadata(metadata: TemplateMetadata): Template {
  // Convert environment array to object with default values
  const environment: { [key: string]: string } = {};
  
  metadata.details.environment.forEach(env => {
    // Set default values for common environment variables
    switch (env.name) {
    case 'POSTGRES_DB':
      environment[env.name] = 'postgres';
      break;
    case 'POSTGRES_USER':
      environment[env.name] = 'postgres';
      break;
    case 'POSTGRES_PASSWORD':
      environment[env.name] = 'postgres';
      break;
    case 'MINIO_ROOT_USER':
      environment[env.name] = 'minioadmin';
      break;
    case 'MINIO_ROOT_PASSWORD':
      environment[env.name] = 'minioadmin';
      break;
    default:
      environment[env.name] = '';
    }
  });

  return {
    id: metadata.id,
    name: metadata.name,
    description: metadata.description,
    icon: iconMap[metadata.icon] || Database,
    details: {
      image: metadata.details.image,
      ports: metadata.details.ports,
      environment: Object.keys(environment).length > 0 ? environment : undefined,
    },
  };
}

// Convert all client templates to dashboard format
export const templates: Template[] = allTemplates.map(convertTemplateMetadata);
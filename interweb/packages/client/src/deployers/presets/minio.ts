import { SimpleTemplateDeployer, SimpleTemplateConfig } from './simple';
import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs';

const minioConfig: SimpleTemplateConfig = {
  image: 'minio/minio:latest',
  port: 9000,
  env: {
    MINIO_ROOT_USER: 'minioadmin',
    MINIO_ROOT_PASSWORD: 'minioadmin',
  },
  volumes: [
    {
      name: 'data',
      mountPath: '/data',
      size: '10Gi'
    }
  ],
  replicas: 1,
  serviceType: 'ClusterIP',
  resources: {
    requests: { cpu: '100m', memory: '128Mi' },
    limits: { cpu: '500m', memory: '512Mi' }
  }
};

export class MinioDeployer extends SimpleTemplateDeployer {
  constructor(
    kubeClient: InterwebKubernetesClient,
    logger?: (message: string) => void
  ) {
    super(kubeClient, 'minio', minioConfig, logger);
  }

  protected createDeployment(name: string, namespace: string, options: any): any {
    const deployment: any = super.createDeployment(name, namespace, options);
    
    // Add MinIO-specific configurations
    if (deployment.spec?.template?.spec?.containers?.[0]) {
      deployment.spec.template.spec.containers[0].command = ['minio'];
      deployment.spec.template.spec.containers[0].args = ['server', '/data'];
    }
    
    return deployment;
  }

  protected createService(name: string, namespace: string): any {
    const service: any = super.createService(name, namespace);
    
    return service;
  }
}
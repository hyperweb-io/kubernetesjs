import { SimpleTemplateDeployer, SimpleTemplateConfig } from './simple';
import { InterwebClient as InterwebKubernetesClient } from '@kubernetesjs/ops';

const ollamaConfig: SimpleTemplateConfig = {
  image: 'ollama/ollama:latest',
  port: 11434,
  env: {},
  volumes: [
    {
      name: 'ollama-data',
      mountPath: '/root/.ollama',
      size: '10Gi'
    }
  ],
  replicas: 1,
  serviceType: 'ClusterIP',
  resources: {
    requests: { cpu: '500m', memory: '1Gi' },
    limits: { cpu: '2', memory: '4Gi' }
  }
};

export class OllamaDeployer extends SimpleTemplateDeployer {
  constructor(
    kubeClient: InterwebKubernetesClient,
    logger?: (message: string) => void
  ) {
    super(kubeClient, 'ollama', ollamaConfig, logger);
  }

  protected createDeployment(name: string, namespace: string, options: any): any {
    const deployment: any = super.createDeployment(name, namespace, options);
    
    return deployment;
  }
}
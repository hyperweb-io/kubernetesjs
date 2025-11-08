import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs';

export interface TemplateDeployOptions {
  name?: string;
  namespace?: string;
  [key: string]: any; // Allow template-specific options
}

export interface TemplateDeployResult {
  templateId: string;
  name: string;
  namespace: string;
  status: 'deployed' | 'failed';
  message?: string;
  endpoints?: {
    [serviceName: string]: {
      host: string;
      port: number;
      url?: string;
    };
  };
}

export interface TemplateUninstallOptions {
  name?: string;
  namespace?: string;
  force?: boolean;
}

export interface TemplateUninstallResult {
  templateId: string;
  name: string;
  namespace: string;
  status: 'uninstalled' | 'failed';
  message?: string;
}

export abstract class BaseTemplateDeployer {
  protected kube: InterwebKubernetesClient;
  protected templateId: string;
  protected log: (message: string) => void;

  constructor(
    kubeClient: InterwebKubernetesClient,
    templateId: string,
    logger?: (message: string) => void
  ) {
    this.kube = kubeClient;
    this.templateId = templateId;
    this.log = logger || (() => {});
  }

  abstract deploy(options: TemplateDeployOptions): Promise<TemplateDeployResult>;
  abstract uninstall(options: TemplateUninstallOptions): Promise<TemplateUninstallResult>;
  
  /**
   * Check if template is already deployed
   */
  abstract isDeployed(name: string, namespace: string): Promise<boolean>;

  /**
   * Get deployment status
   */
  abstract getStatus(name: string, namespace: string): Promise<'deployed' | 'deploying' | 'failed' | 'not-found'>;

  /**
   * Wait for deployment to be ready
   */
  async waitForReady(
    name: string,
    namespace: string,
    timeoutMs: number = 300000
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const status = await this.getStatus(name, namespace);
      
      if (status === 'deployed') {
        this.log(`✓ Template ${this.templateId} is ready`);
        return;
      }
      
      if (status === 'failed') {
        throw new Error(`Template ${this.templateId} deployment failed`);
      }
      
      this.log(`Template ${this.templateId} status: ${status}`);
      await this.sleep(5000);
    }
    
    throw new Error(`Timeout waiting for template ${this.templateId} to be ready`);
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected generateLabels(templateId: string, name: string): Record<string, string> {
    return {
      app: templateId,
      'app.kubernetes.io/name': name,
      'app.kubernetes.io/component': templateId,
      'app.kubernetes.io/managed-by': 'interweb-client',
      'interweb.dev/template': templateId,
    };
  }
}
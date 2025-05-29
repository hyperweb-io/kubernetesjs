declare module 'kubernetesjs' {
  export interface KubernetesClient {
    getCoreV1APIResources(options: any): Promise<any>;
    listCoreV1Namespace(options: any): Promise<any>;
    listCoreV1NamespacedPod(options: any): Promise<any>;
    listAppsV1NamespacedDeployment(options: any): Promise<any>;
    listCoreV1NamespacedService(options: any): Promise<any>;
    readNamespacedPodLog(options: any): Promise<any>;
    createAppsV1NamespacedDeployment(options: any): Promise<any>;
    createCoreV1NamespacedService(options: any): Promise<any>;
    patchNamespacedDeployment(options: any): Promise<any>;
    deleteNamespacedPod(options: any): Promise<any>;
    deleteNamespacedDeployment(options: any): Promise<any>;
    deleteNamespacedService(options: any): Promise<any>;
  }

  export interface KubernetesClientOptions {
    basePath?: string;
    restEndpoint?: string;
  }

  export class KubernetesClient {
    constructor(options?: KubernetesClientOptions);
  }
}

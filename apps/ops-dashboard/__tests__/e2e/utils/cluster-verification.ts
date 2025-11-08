import { Page } from '@playwright/test';

/**
 * Cluster verification interface
 */
export interface ClusterState {
  namespaces: string[];
  deployments: Array<{
    name: string;
    namespace: string;
    replicas: number;
    readyReplicas: number;
    status: string;
  }>;
  pods: Array<{
    name: string;
    namespace: string;
    status: string;
    ready: boolean;
  }>;
  services: Array<{
    name: string;
    namespace: string;
    type: string;
    clusterIP: string;
  }>;
}

/**
 * Verify cluster state through API calls
 */
export async function verifyClusterState(page: Page, expectedState: Partial<ClusterState>): Promise<boolean> {
  console.log('Verifying cluster state through API...');
  
  try {
    // Get cluster state through API
    const clusterState = await getClusterState(page);
    
    // Verify namespaces
    if (expectedState.namespaces) {
      const missingNamespaces = expectedState.namespaces.filter(
        ns => !clusterState.namespaces.includes(ns)
      );
      if (missingNamespaces.length > 0) {
        console.error(`Missing namespaces: ${missingNamespaces.join(', ')}`);
        return false;
      }
    }
    
    // Verify deployments
    if (expectedState.deployments) {
      for (const expectedDeployment of expectedState.deployments) {
        const deployment = clusterState.deployments.find(
          d => d.name === expectedDeployment.name && d.namespace === expectedDeployment.namespace
        );
        if (!deployment) {
          console.error(`Deployment ${expectedDeployment.name} not found in namespace ${expectedDeployment.namespace}`);
          return false;
        }
        if (expectedDeployment.replicas && deployment.replicas !== expectedDeployment.replicas) {
          console.error(`Deployment ${expectedDeployment.name} has ${deployment.replicas} replicas, expected ${expectedDeployment.replicas}`);
          return false;
        }
        if (expectedDeployment.status && deployment.status !== expectedDeployment.status) {
          console.error(`Deployment ${expectedDeployment.name} status is ${deployment.status}, expected ${expectedDeployment.status}`);
          return false;
        }
      }
    }
    
    // Verify pods
    if (expectedState.pods) {
      for (const expectedPod of expectedState.pods) {
        const pod = clusterState.pods.find(
          p => p.name.includes(expectedPod.name) && p.namespace === expectedPod.namespace
        );
        if (!pod) {
          console.error(`Pod matching ${expectedPod.name} not found in namespace ${expectedPod.namespace}`);
          return false;
        }
        if (expectedPod.status && pod.status !== expectedPod.status) {
          console.error(`Pod ${pod.name} status is ${pod.status}, expected ${expectedPod.status}`);
          return false;
        }
      }
    }
    
    // Verify services
    if (expectedState.services) {
      for (const expectedService of expectedState.services) {
        const service = clusterState.services.find(
          s => s.name === expectedService.name && s.namespace === expectedService.namespace
        );
        if (!service) {
          console.error(`Service ${expectedService.name} not found in namespace ${expectedService.namespace}`);
          return false;
        }
      }
    }
    
    console.log('Cluster state verification passed');
    return true;
  } catch (error) {
    console.error('Cluster state verification failed:', error);
    return false;
  }
}

/**
 * Get current cluster state through API
 */
async function getClusterState(page: Page): Promise<ClusterState> {
  const baseURL = process.env.K8S_API || 'http://localhost:8001';
  
  // Get namespaces
  const namespacesResponse = await page.request.get(`${baseURL}/api/v1/namespaces`);
  const namespacesData = await namespacesResponse.json();
  const namespaces = namespacesData.items.map((ns: any) => ns.metadata.name);
  
  // Get deployments
  const deploymentsResponse = await page.request.get(`${baseURL}/apis/apps/v1/deployments`);
  const deploymentsData = await deploymentsResponse.json();
  const deployments = deploymentsData.items.map((dep: any) => ({
    name: dep.metadata.name,
    namespace: dep.metadata.namespace,
    replicas: dep.spec.replicas || 0,
    readyReplicas: dep.status.readyReplicas || 0,
    status: dep.status.conditions?.[0]?.type || 'Unknown'
  }));
  
  // Get pods
  const podsResponse = await page.request.get(`${baseURL}/api/v1/pods`);
  const podsData = await podsResponse.json();
  const pods = podsData.items.map((pod: any) => ({
    name: pod.metadata.name,
    namespace: pod.metadata.namespace,
    status: pod.status.phase,
    ready: pod.status.conditions?.find((c: any) => c.type === 'Ready')?.status === 'True'
  }));
  
  // Get services
  const servicesResponse = await page.request.get(`${baseURL}/api/v1/services`);
  const servicesData = await servicesResponse.json();
  const services = servicesData.items.map((svc: any) => ({
    name: svc.metadata.name,
    namespace: svc.metadata.namespace,
    type: svc.spec.type,
    clusterIP: svc.spec.clusterIP
  }));
  
  return {
    namespaces,
    deployments,
    pods,
    services
  };
}

/**
 * Wait for deployment to be ready
 */
export async function waitForDeploymentReady(
  page: Page, 
  deploymentName: string, 
  namespace: string, 
  timeout: number = 300000
): Promise<boolean> {
  console.log(`Waiting for deployment ${deploymentName} in namespace ${namespace} to be ready...`);
  
  const startTime = Date.now();
  const baseURL = process.env.K8S_API || 'http://localhost:8001';
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await page.request.get(
        `${baseURL}/apis/apps/v1/namespaces/${namespace}/deployments/${deploymentName}`
      );
      
      if (response.ok()) {
        const deployment = await response.json();
        const readyReplicas = deployment.status.readyReplicas || 0;
        const replicas = deployment.spec.replicas || 0;
        
        if (readyReplicas === replicas && replicas > 0) {
          console.log(`Deployment ${deploymentName} is ready (${readyReplicas}/${replicas})`);
          return true;
        }
        
        console.log(`Deployment ${deploymentName} not ready yet (${readyReplicas}/${replicas})`);
      }
    } catch (error) {
      console.log(`Error checking deployment ${deploymentName}:`, error);
    }
    
    await page.waitForTimeout(5000); // Wait 5 seconds before next check
  }
  
  console.error(`Deployment ${deploymentName} did not become ready within ${timeout}ms`);
  return false;
}

/**
 * Wait for pod to be ready
 */
export async function waitForPodReady(
  page: Page, 
  podNamePattern: string, 
  namespace: string, 
  timeout: number = 300000
): Promise<boolean> {
  console.log(`Waiting for pod matching ${podNamePattern} in namespace ${namespace} to be ready...`);
  
  const startTime = Date.now();
  const baseURL = process.env.K8S_API || 'http://localhost:8001';
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await page.request.get(`${baseURL}/api/v1/namespaces/${namespace}/pods`);
      const podsData = await response.json();
      
      const matchingPods = podsData.items.filter((pod: any) => 
        pod.metadata.name.includes(podNamePattern)
      );
      
      if (matchingPods.length > 0) {
        const allReady = matchingPods.every((pod: any) => {
          const readyCondition = pod.status.conditions?.find((c: any) => c.type === 'Ready');
          return readyCondition?.status === 'True';
        });
        
        if (allReady) {
          console.log(`Pods matching ${podNamePattern} are ready`);
          return true;
        }
        
        console.log(`Pods matching ${podNamePattern} not ready yet`);
      }
    } catch (error) {
      console.log(`Error checking pods:`, error);
    }
    
    await page.waitForTimeout(5000); // Wait 5 seconds before next check
  }
  
  console.error(`Pods matching ${podNamePattern} did not become ready within ${timeout}ms`);
  return false;
}

/**
 * Clean up resources
 */
export async function cleanupResources(page: Page, namespace: string): Promise<void> {
  console.log(`Cleaning up resources in namespace ${namespace}...`);
  
  const baseURL = process.env.K8S_API || 'http://localhost:8001';
  
  try {
    // Delete deployments
    const deploymentsResponse = await page.request.get(
      `${baseURL}/apis/apps/v1/namespaces/${namespace}/deployments`
    );
    const deploymentsData = await deploymentsResponse.json();
    
    for (const deployment of deploymentsData.items) {
      if (deployment.metadata.name.includes('test-')) {
        console.log(`Deleting deployment ${deployment.metadata.name}`);
        await page.request.delete(
          `${baseURL}/apis/apps/v1/namespaces/${namespace}/deployments/${deployment.metadata.name}`
        );
      }
    }
    
    // Delete services
    const servicesResponse = await page.request.get(
      `${baseURL}/api/v1/namespaces/${namespace}/services`
    );
    const servicesData = await servicesResponse.json();
    
    for (const service of servicesData.items) {
      if (service.metadata.name.includes('test-')) {
        console.log(`Deleting service ${service.metadata.name}`);
        await page.request.delete(
          `${baseURL}/api/v1/namespaces/${namespace}/services/${service.metadata.name}`
        );
      }
    }
    
    console.log(`Cleanup completed for namespace ${namespace}`);
  } catch (error) {
    console.error(`Error during cleanup:`, error);
  }
}

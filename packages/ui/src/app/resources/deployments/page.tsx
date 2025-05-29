"use client";

import { useState, useEffect } from "react";
import { ResourceHeader } from "@/components/resources/resource-header";
import { DeploymentList } from "@/components/resources/deployments/deployment-list";
import { useKubernetes } from "@/hooks/use-kubernetes";

export default function DeploymentsPage() {
  const { client, namespace } = useKubernetes();
  const [deployments, setDeployments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeployments() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await client.listAppsV1NamespacedDeployment({
          path: { namespace }
        });
        
        setDeployments(response.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch deployments");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDeployments();
  }, [client, namespace]);

  return (
    <div className="space-y-6">
      <ResourceHeader 
        title="Deployments" 
        description={`Manage deployments in the ${namespace} namespace`}
        onRefresh={() => {
          setIsLoading(true);
          const timer = setTimeout(() => {
            setIsLoading(false);
          }, 100);
          return () => clearTimeout(timer);
        }}
      />
      
      <DeploymentList 
        deployments={deployments} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}

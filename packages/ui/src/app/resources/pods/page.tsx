"use client";

import { useState, useEffect } from "react";
import { ResourceHeader } from "@/components/resources/resource-header";
import { PodList } from "@/components/resources/pods/pod-list";
import { useKubernetes } from "@/hooks/use-kubernetes";

export default function PodsPage() {
  const { client, namespace } = useKubernetes();
  const [pods, setPods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPods() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await client.listCoreV1NamespacedPod({
          path: { namespace }
        });
        
        setPods(response.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch pods");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPods();
  }, [client, namespace]);

  return (
    <div className="space-y-6">
      <ResourceHeader 
        title="Pods" 
        description={`Manage pods in the ${namespace} namespace`}
        onRefresh={() => {
          setIsLoading(true);
          const timer = setTimeout(() => {
            setIsLoading(false);
          }, 100);
          return () => clearTimeout(timer);
        }}
      />
      
      <PodList 
        pods={pods} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}

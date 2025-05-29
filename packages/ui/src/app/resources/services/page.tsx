"use client";

import { useState, useEffect } from "react";
import { ResourceHeader } from "@/components/resources/resource-header";
import { ServiceList } from "@/components/resources/services/service-list";
import { useKubernetes } from "@/hooks/use-kubernetes";

export default function ServicesPage() {
  const { client, namespace } = useKubernetes();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await client.listCoreV1NamespacedService({
          path: { namespace }
        });
        
        setServices(response.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch services");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchServices();
  }, [client, namespace]);

  return (
    <div className="space-y-6">
      <ResourceHeader 
        title="Services" 
        description={`Manage services in the ${namespace} namespace`}
        onRefresh={() => {
          setIsLoading(true);
          const timer = setTimeout(() => {
            setIsLoading(false);
          }, 100);
          return () => clearTimeout(timer);
        }}
      />
      
      <ServiceList 
        services={services} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Server, Box, Layers, Grid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKubernetes } from "@/hooks/use-kubernetes";

interface ClusterStats {
  nodes: number;
  pods: number;
  services: number;
  deployments: number;
  isLoading: boolean;
  error: string | null;
}

export function ClusterOverview() {
  const { client, namespace } = useKubernetes();
  const [stats, setStats] = useState<ClusterStats>({
    nodes: 0,
    pods: 0,
    services: 0,
    deployments: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchClusterStats() {
      setStats((prev) => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const nodesResponse = await client.listCoreV1Node({
          query: {}
        });
        
        const podsResponse = await client.listCoreV1NamespacedPod({
          path: { namespace }
        });
        
        const servicesResponse = await client.listCoreV1NamespacedService({
          path: { namespace }
        });
        
        const deploymentsResponse = await client.listAppsV1NamespacedDeployment({
          path: { namespace }
        });
        
        setStats({
          nodes: nodesResponse.items?.length || 0,
          pods: podsResponse.items?.length || 0,
          services: servicesResponse.items?.length || 0,
          deployments: deploymentsResponse.items?.length || 0,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setStats((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to fetch cluster stats",
        }));
      }
    }
    
    fetchClusterStats();
  }, [client, namespace]);

  const statCards = [
    {
      title: "Nodes",
      value: stats.nodes,
      icon: Server,
      description: "Total cluster nodes",
    },
    {
      title: "Pods",
      value: stats.pods,
      icon: Box,
      description: `Pods in ${namespace} namespace`,
    },
    {
      title: "Services",
      value: stats.services,
      icon: Grid,
      description: `Services in ${namespace} namespace`,
    },
    {
      title: "Deployments",
      value: stats.deployments,
      icon: Layers,
      description: `Deployments in ${namespace} namespace`,
    },
  ];

  if (stats.error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        <p>Error loading cluster stats: {stats.error}</p>
        <p className="text-sm mt-2">
          Make sure your Kubernetes API is accessible. You may need to run:
          <code className="ml-2 p-1 bg-muted rounded text-xs">kubectl proxy</code>
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-muted"></div>
              ) : (
                card.value
              )}
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

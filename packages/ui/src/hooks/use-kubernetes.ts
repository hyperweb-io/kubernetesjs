"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import type { KubernetesClient } from "kubernetesjs";
import { getKubernetesClient, getCurrentNamespace } from "@/lib/kubernetes";

interface KubernetesContextType {
  client: KubernetesClient;
  namespace: string;
  setNamespace: (namespace: string) => void;
  isConnected: boolean;
  error: string | null;
}

const KubernetesContext = createContext<KubernetesContextType | undefined>(undefined);

export function KubernetesProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => getKubernetesClient());
  const [namespace, setNamespace] = useState(getCurrentNamespace());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        await client.getCoreV1APIResources({});
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setIsConnected(false);
        setError(err instanceof Error ? err.message : "Failed to connect to Kubernetes API");
      }
    }

    checkConnection();
  }, [client]);

  return React.createElement(
    KubernetesContext.Provider,
    {
      value: {
        client,
        namespace,
        setNamespace,
        isConnected,
        error
      }
    },
    children
  );
}

export function useKubernetes() {
  const context = useContext(KubernetesContext);
  
  if (context === undefined) {
    throw new Error("useKubernetes must be used within a KubernetesProvider");
  }
  
  return context;
}

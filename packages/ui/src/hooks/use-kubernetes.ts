"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { KubernetesClient } from "kubernetesjs";
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
  const [client] = useState<KubernetesClient>(() => getKubernetesClient());
  const [namespace, setNamespace] = useState<string>(getCurrentNamespace());
  const [isConnected, setIsConnected] = useState<boolean>(false);
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

  return (
    <KubernetesContext.Provider
      value={{
        client,
        namespace,
        setNamespace,
        isConnected,
        error,
      }}
    >
      {children}
    </KubernetesContext.Provider>
  );
}

export function useKubernetes() {
  const context = useContext(KubernetesContext);
  
  if (context === undefined) {
    throw new Error("useKubernetes must be used within a KubernetesProvider");
  }
  
  return context;
}

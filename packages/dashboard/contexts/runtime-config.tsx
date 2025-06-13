import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { appBuildTimeConfig } from '@/config/app-config';
import type { RuntimeConfig } from '@/pages/api/config';

// Define the context shape
interface RuntimeConfigContextType {
  config: RuntimeConfig | null;
  isLoading: boolean;
  error: Error | null;
}

// Determine build mode (available at build time via next.config.mjs)
const isPlaygroundBuild = process.env.NEXT_PUBLIC_BUILD_TARGET === 'playground';

// Function to get static config directly from build-time env vars
// These are embedded in the JS bundle during `next build` for export mode.
function getStaticConfig(): RuntimeConfig {
  return {
    rpcUrl: appBuildTimeConfig.rpcUrl,
    faucetUrl: appBuildTimeConfig.faucetUrl,
    registryUrl: appBuildTimeConfig.registryUrl,
    s3BucketUrl: appBuildTimeConfig.s3BucketUrl,
    s3TarballName: appBuildTimeConfig.s3TarballName,
  };
}

// Create the context with a default value suitable for the initial render
// based on the build mode.
const RuntimeConfigContext = createContext<RuntimeConfigContextType>({
  config: isPlaygroundBuild ? null : getStaticConfig(),
  isLoading: isPlaygroundBuild, // Only loading if we need to fetch
  error: null,
});

// Define the props for the provider component
interface RuntimeConfigProviderProps {
  children: ReactNode;
}

// The Provider component
export function RuntimeConfigProvider({ children }: RuntimeConfigProviderProps) {
  // Initialize state using a function to avoid re-running getStaticConfig unnecessarily
  const [config, setConfig] = useState<RuntimeConfig | null>(() => (isPlaygroundBuild ? null : getStaticConfig()));
  // isLoading is true only if we are in playground mode and need to fetch
  const [isLoading, setIsLoading] = useState<boolean>(isPlaygroundBuild);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch config ONLY if it's a playground (standalone) build
    // and only on the client-side (where window is defined).
    if (isPlaygroundBuild && typeof window !== 'undefined') {
      // Initial state already has isLoading = true for this case
      fetch('/api/config')
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch runtime config: ${res.status} ${res.statusText} - ${errorText}`);
          }
          return res.json();
        })
        .then((data: RuntimeConfig) => {
          setConfig(data);
          setError(null);
        })
        .catch((err) => {
          console.error('Error fetching runtime config:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setConfig(null); // Clear config on error
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    // If not a playground build (i.e., export build), the config is already
    // initialized statically, and isLoading is false. No fetch needed.
  }, []); // Empty dependency array: effect runs once on mount for playground builds.

  const value = {
    config,
    isLoading,
    error,
  };

  return <RuntimeConfigContext.Provider value={value}>{children}</RuntimeConfigContext.Provider>;
}

// Custom hook to use the runtime config context
export function useRuntimeConfig() {
  const context = useContext(RuntimeConfigContext);
  if (context === undefined) {
    throw new Error('useRuntimeConfig must be used within a RuntimeConfigProvider');
  }
  return context;
}

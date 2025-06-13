import { appBuildTimeConfig } from '@/configs/app-config';

export type ContractConfig = {
  rpcUrl: string;
  faucetUrl: string;
  registryUrl: string;
  s3BucketUrl: string;
  s3TarballName: string;
};

function getStaticConfig(): ContractConfig {
  return {
    rpcUrl: appBuildTimeConfig.rpcUrl!,
    faucetUrl: appBuildTimeConfig.faucetUrl!,
    registryUrl: appBuildTimeConfig.registryUrl!,
    s3BucketUrl: appBuildTimeConfig.s3BucketUrl!,
    s3TarballName: appBuildTimeConfig.s3TarballName!,
  };
}

/**
 * Defines the expected structure for Hyperweb endpoint configuration.
 */
export interface HyperwebConfigShape {
  chain: {
    rpc: string | undefined;
    faucet: string | undefined;
  };
  registry: {
    rest: string | undefined;
  };
  s3?: {
    bucketUrl: string | undefined;
    tarballName: string | undefined;
  };
  rpcUrl: string;
  faucetUrl: string;
  registryUrl: string;
  s3BucketUrl: string;
  s3TarballName: string;
}

/**
 * Hook to get Hyperweb configuration values in the desired nested structure.
 *
 * This hook centralizes access to configuration determined by the RuntimeConfigProvider.
 * It handles loading and error states, providing the config values once available.
 * For 'export' builds, config is available immediately from build-time env vars.
 * For 'standalone' builds, config is fetched from the /api/config endpoint at runtime.
 *
 * @returns {Object} { config: HyperwebConfigShape | null, isLoading: boolean, error: Error | null }
 */
export function getHyperwebConfig(): HyperwebConfigShape {
  // Transform the raw config into the desired nested structure
  const contractConfig = getStaticConfig();

  return {
    ...contractConfig,
    chain: {
      rpc: contractConfig.rpcUrl,
      faucet: contractConfig.faucetUrl,
    },
    registry: {
      rest: contractConfig.registryUrl,
    },
    s3: {
      bucketUrl: contractConfig.s3BucketUrl,
      tarballName: contractConfig.s3TarballName,
    },
  };
}

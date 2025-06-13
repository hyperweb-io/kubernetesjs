import { useRuntimeConfig } from '@/contexts/runtime-config';

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
	// Add other config groups if needed
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
export function useHyperwebConfig() {
	// Fetch the raw config, loading, and error states from the context
	const { config: rawConfig, isLoading, error } = useRuntimeConfig();

	// Transform the raw config into the desired nested structure only if it exists
	const hyperwebConfig: HyperwebConfigShape | null = rawConfig
		? {
				chain: {
					rpc: rawConfig.rpcUrl,
					faucet: rawConfig.faucetUrl,
				},
				registry: {
					rest: rawConfig.registryUrl,
				},
				s3: {
					bucketUrl: rawConfig.s3BucketUrl,
					tarballName: rawConfig.s3TarballName,
				},
			}
		: null; // Return null if the raw config isn't loaded yet or failed

	return {
		config: hyperwebConfig,
		isLoading,
		error,
	};
}

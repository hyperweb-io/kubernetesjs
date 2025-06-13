import { ContractAnalyzer } from '@hyperweb/parse';
import { useQuery } from '@tanstack/react-query';
import { createGetGetContract } from 'hyperwebjs/hyperweb/hvm/query.rpc.func';

import { validateContractAddress } from '@/lib/contract/interact';

import { HYPERWEB_CONTRACT_ADDRESS_LENGTH } from './use-contract-address-schema';
import { useHyperwebChain } from './use-hyperweb-chain';
import { useRpcEndpoint } from './use-rpc-endpoint';

export const useContractMethods = ({
	contractAddress,
	enabled = true,
}: {
	contractAddress: string;
	enabled?: boolean;
}) => {
	const { data: rpcEndpoint } = useRpcEndpoint();
	const { chain } = useHyperwebChain();

	return useQuery({
		queryKey: ['useContractMethods', contractAddress],
		queryFn: async () => {
			const errorMsg = validateContractAddress(
				contractAddress,
				chain?.bech32Prefix ?? '',
				HYPERWEB_CONTRACT_ADDRESS_LENGTH,
			);

			if (!rpcEndpoint || !contractAddress || !enabled || errorMsg) {
				return { queries: [], mutations: [], error: null };
			}

			try {
				const getContract = createGetGetContract(rpcEndpoint);

				const response = await getContract({
					address: contractAddress,
				});

				if (!response?.contract?.code) {
					return {
						queries: [],
						mutations: [],
						error: 'No contract code found',
					};
				}

				const analyzer = new ContractAnalyzer();

				// Safely parse the contract source
				let contractFiles: Record<string, string>;
				try {
					// Check if source exists and is a string
					if (!response.contract.source || typeof response.contract.source !== 'string') {
						throw new Error('No valid source data found');
					}

					// Try to parse as JSON
					const parsedSource = JSON.parse(response.contract.source);

					// Validate that it's an object with string values
					if (!parsedSource || typeof parsedSource !== 'object' || Array.isArray(parsedSource)) {
						throw new Error('Source is not a valid object');
					}

					// Ensure all values are strings
					const isValidSourceFormat = Object.values(parsedSource).every((value) => typeof value === 'string');

					if (!isValidSourceFormat) {
						throw new Error('Source object contains non-string values');
					}

					contractFiles = parsedSource as Record<string, string>;

					// Check if contractFiles is empty
					if (Object.keys(contractFiles).length === 0) {
						throw new Error('Source object is empty');
					}
				} catch (sourceError) {
					console.warn('Failed to parse contract source as JSON:', sourceError);

					// Fallback: use the raw code if available
					if (response.contract.code) {
						const withSchema = analyzer.analyzeWithSchema(response.contract.code);

						return {
							queries: withSchema.queries || [],
							mutations: withSchema.mutations || [],
							error: null,
						};
					}

					// No valid source or code available
					return {
						queries: [],
						mutations: [],
						error: 'Contract source is not in a valid format and no fallback code available',
					};
				}

				const withSchema = analyzer.analyzeMultiFileWithSchema(contractFiles);

				return {
					queries: withSchema.queries || [],
					mutations: withSchema.mutations || [],
					error: null,
				};
			} catch (error) {
				console.error('Error analyzing contract:', error);
				return {
					queries: [],
					mutations: [],
					error: error instanceof Error ? error.message : 'Unknown error',
				};
			}
		},
		enabled: !!rpcEndpoint && !!contractAddress && enabled,
		staleTime: Infinity,
	});
};

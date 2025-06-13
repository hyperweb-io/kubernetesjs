import { useCallback, useMemo } from 'react';
import { createGetGetContract } from 'hyperwebjs/hyperweb/hvm/query.rpc.func';
import { z } from 'zod';

import { validateContractAddress } from '@/lib/contract/interact';

import { useHyperwebChain } from './use-hyperweb-chain';
import { useRpcEndpoint } from './use-rpc-endpoint';

export const HYPERWEB_CONTRACT_ADDRESS_LENGTH = 44;

export const useContractAddressSchema = () => {
	const { chain } = useHyperwebChain();
	const { data: rpcEndpoint, refetch: getRpcEndpoint } = useRpcEndpoint();

	const checkContractExists = useCallback(
		async (address: string) => {
			if (!address) return false;

			try {
				const client = rpcEndpoint ?? (await getRpcEndpoint()).data;
				const getContract = createGetGetContract(client);
				const response = await getContract({
					address,
				});
				return !!response;
			} catch (error) {
				console.error(error);
				return false;
			}
		},
		[getRpcEndpoint, rpcEndpoint],
	);

	const schema = useMemo(
		() =>
			z.object({
				contractAddress: z
					.string()
					.min(1, 'Contract address is required')
					.superRefine(async (val, ctx) => {
						const errorMsg = validateContractAddress(val, chain?.bech32Prefix ?? '', HYPERWEB_CONTRACT_ADDRESS_LENGTH);
						if (errorMsg) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: errorMsg,
							});
							return;
						}

						const exists = await checkContractExists(val);
						if (!exists) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: 'Contract not found',
							});
						}
					}),
			}),
		[chain, checkContractExists],
	);

	return { schema };
};

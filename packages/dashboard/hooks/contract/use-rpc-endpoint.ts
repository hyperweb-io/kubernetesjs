import { useQuery } from '@tanstack/react-query';

import { useHyperwebChain } from './use-hyperweb-chain';

export const useRpcEndpoint = () => {
	const { getRpcEndpoint } = useHyperwebChain();

	return useQuery({
		queryKey: ['useRpcEndpoint'],
		queryFn: async () => {
			return await getRpcEndpoint();
		},
		staleTime: Infinity,
	});
};

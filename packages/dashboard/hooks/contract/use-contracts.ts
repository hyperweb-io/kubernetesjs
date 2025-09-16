import { useQuery } from '@tanstack/react-query';
import { createGetListContracts } from 'hyperwebjs/hyperweb/hvm/query.rpc.func';

import { useRpcEndpoint } from './use-rpc-endpoint';

export const useContracts = (page = 1, limit = 10) => {
	const { data: rpcEndpoint } = useRpcEndpoint();

	return useQuery({
		queryKey: ['useContracts', page, limit],
		queryFn: async () => {
			if (!rpcEndpoint) return { contracts: [], pagination: null };

			const getListContracts = createGetListContracts(rpcEndpoint);

			try {
				const response = await getListContracts({
					pagination: {
						limit: BigInt(limit),
						reverse: true,
						countTotal: true,
						key: new Uint8Array(),
						offset: BigInt((page - 1) * limit),
					},
				});

				return {
					contracts: response.contracts.sort((a, b) => Number(b.index) - Number(a.index)),
					pagination: response.pagination,
				};
			} catch (error) {
				console.error('Error fetching contracts:', error);
				return { contracts: [], pagination: null };
			}
		},
		enabled: !!rpcEndpoint,
	});
};

import { useQuery } from '@tanstack/react-query';
import { createGetEval } from 'hyperwebjs/hyperweb/hvm/query.rpc.func';

import { useRpcEndpoint } from './use-rpc-endpoint';

export const useQueryContract = ({
	contractAddress,
	callee,
	args,
	enabled = true,
}: {
	contractAddress: string;
	callee: string;
	args: string[];
	enabled?: boolean;
}) => {
	const { data: rpcEndpoint } = useRpcEndpoint();

	return useQuery({
		queryKey: ['useQueryContract', contractAddress, callee, args],
		queryFn: async () => {
			if (!rpcEndpoint) return null;

			const getEval = createGetEval(rpcEndpoint);

			const response = await getEval({
				address: contractAddress,
				callee,
				args,
			});

			return response;
		},
		enabled: !!rpcEndpoint && !!contractAddress && !!callee && enabled,
	});
};

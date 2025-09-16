import { MsgInstantiate } from 'hyperwebjs/hyperweb/hvm/tx';
import { createInstantiate } from 'hyperwebjs/hyperweb/hvm/tx.rpc.func';
import type { DeliverTxResponse, StdFee } from 'hyperwebjs/types';

import { useHandleTx } from './use-handle-tx';
import { useHyperwebChain } from './use-hyperweb-chain';

interface InstantiateTxParams {
	address: string;
	code: string;
	source?: string;
	onTxSucceed?: (txInfo: DeliverTxResponse) => void;
	onTxFailed?: () => void;
}

export const useInstantiateTx = () => {
	const handleTx = useHandleTx();
	const { getSigningClient } = useHyperwebChain();

	const instantiateTx = async ({ address, code, source, onTxSucceed, onTxFailed }: InstantiateTxParams) => {
		const fee: StdFee = { amount: [], gas: '800000' };

		await handleTx<DeliverTxResponse>({
			executeTx: async () => {
				const signingClient = await getSigningClient();

				const instantiate = createInstantiate(signingClient);

				const msg = MsgInstantiate.fromPartial({
					code,
					creator: address,
					source,
				});

				const res = await instantiate(address, msg, fee, 'Instantiated from Hyperweb Playground');

				return res;
			},
			successMessage: 'Deploy Success',
			onTxSucceed,
			onTxFailed,
		});
	};

	return { instantiateTx };
};

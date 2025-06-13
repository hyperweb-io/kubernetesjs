import { MsgEval } from 'hyperwebjs/hyperweb/hvm/tx';
import { createEval } from 'hyperwebjs/hyperweb/hvm/tx.rpc.func';
import { DeliverTxResponse, StdFee } from 'hyperwebjs/types';

import { useHandleTx } from './use-handle-tx';
import { useHyperwebChain } from './use-hyperweb-chain';

interface ExecuteContractTxParams {
	creator: string;
	contractAddress: string;
	callee: string;
	args: string[];
	onTxSucceed?: (result: DeliverTxResponse) => void;
	onTxFailed?: () => void;
}

export const useExecuteContractTx = () => {
	const { getSigningClient } = useHyperwebChain();
	const handleTx = useHandleTx();

	const executeContractTx = async ({
		creator,
		contractAddress,
		callee,
		args,
		onTxFailed = () => {},
		onTxSucceed = () => {},
	}: ExecuteContractTxParams) => {
		const msg = MsgEval.fromPartial({
			address: contractAddress,
			creator,
			callee,
			args,
		});

		const fee: StdFee = { amount: [], gas: '550000' };

		await handleTx({
			executeTx: async () => {
				const signingClient = await getSigningClient();
				const evalContract = createEval(signingClient);

				const res = await evalContract(creator, msg, fee, 'hyperweb');

				return res;
			},
			onTxSucceed,
			onTxFailed,
		});
	};

	return { executeContractTx };
};

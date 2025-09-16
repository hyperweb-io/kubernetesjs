import { useWalletManager } from '@interchain-kit/react';
import { useCallback, useEffect, useState } from 'react';

import { useHyperwebStore } from '@/contexts/hyperweb';
import { HyperwebChainInfo, useHyperwebChainInfo } from './use-hyperweb-chain-info';

export const useHyperwebInit = () => {
	const { isHyperwebAdded, setIsHyperwebAdded } = useHyperwebStore();
	const { data: hyperwebChain, isLoading: isChainInfoLoading, refetch } = useHyperwebChainInfo();
	const { addChains } = useWalletManager();
	const [isAddingChain, setIsAddingChain] = useState(false);

	const addHyperwebChain = useCallback(
		async (data: HyperwebChainInfo | null | undefined) => {
			if (!data || isAddingChain) return;

			setIsAddingChain(true);
			try {
				await addChains([data.chain], [data.assetList], {
					signing: () => ({
						broadcast: { checkTx: true, deliverTx: true },
					}),
					preferredSignType: () => 'direct',
				});
				setIsHyperwebAdded(true);
			} catch (error) {
				console.error('Failed to add Hyperweb chain:', error);
			} finally {
				setIsAddingChain(false);
			}
		},
		[addChains, setIsHyperwebAdded, isAddingChain],
	);

	const willAutoAddChain = hyperwebChain && !isHyperwebAdded && !isChainInfoLoading && !isAddingChain;

	useEffect(() => {
		if (willAutoAddChain) {
			addHyperwebChain(hyperwebChain);
		}
	}, [willAutoAddChain, addHyperwebChain, hyperwebChain]);

	const refetchAndAddChain = useCallback(() => {
		refetch().then(({ data }) => {
			if (data && !isHyperwebAdded && !isAddingChain) {
				addHyperwebChain(data);
			}
		});
	}, [refetch, addHyperwebChain, isHyperwebAdded, isAddingChain]);

	const isLoading = isChainInfoLoading || isAddingChain || willAutoAddChain;

	return {
		isLoading,
		isHyperwebAdded,
		refetchAndAddChain,
	};
};

import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { useHyperwebChainInfo } from '@/hooks/contract/use-hyperweb-chain-info';

interface SavedContract {
	index: string;
	label: string;
	contractAddress: string;
}

interface SavedContractsStoreState {
	chainServerId: string;
	contracts: {
		[walletAddress: string]: {
			[contractIndex: string]: SavedContract;
		};
	};

	// Actions
	saveContract: (walletAddress: string, contractIndex: string, contractAddress: string, label: string) => void;
	updateLabel: (walletAddress: string, contractIndex: string, label: string) => void;
	clearContracts: () => void;
	getContract: (walletAddress: string, contractIndex: string) => SavedContract | undefined;
	getAllContracts: (walletAddress: string) => SavedContract[];
	setChainServerId: (chainServerId: string) => void;
}

const savedContractsStore = create<SavedContractsStoreState>()(
	persist(
		(set, get) => ({
			chainServerId: '',
			contracts: {},

			saveContract: (walletAddress: string, contractIndex: string, contractAddress: string, label: string) =>
				set((state) => ({
					contracts: {
						...state.contracts,
						[walletAddress]: {
							...state.contracts[walletAddress],
							[contractIndex]: {
								index: contractIndex,
								contractAddress,
								label,
							},
						},
					},
				})),

			updateLabel: (walletAddress: string, contractIndex: string, label: string) =>
				set((state) => {
					const walletContracts = state.contracts[walletAddress];
					if (!walletContracts || !walletContracts[contractIndex]) return state;

					return {
						contracts: {
							...state.contracts,
							[walletAddress]: {
								...walletContracts,
								[contractIndex]: {
									...walletContracts[contractIndex],
									label,
								},
							},
						},
					};
				}),

			clearContracts: () => set({ contracts: {} }),

			getContract: (walletAddress: string, contractIndex: string) => {
				const walletContracts = get().contracts[walletAddress];
				return walletContracts ? walletContracts[contractIndex] : undefined;
			},

			getAllContracts: (walletAddress: string) => {
				return Object.values(get().contracts[walletAddress] || {}).sort((a, b) => Number(b.index) - Number(a.index));
			},

			setChainServerId: (chainServerId: string) => set({ chainServerId }),
		}),
		{
			name: 'saved-contracts-storage',
			partialize: (state) => ({
				chainServerId: state.chainServerId,
				contracts: state.contracts,
			}),
		},
	),
);

export const useSavedContracts = () => {
	const { data: hyperwebChainInfo } = useHyperwebChainInfo();
	const chainServerId = hyperwebChainInfo?.chainServerId;

	const store = savedContractsStore();

	useEffect(() => {
		if (chainServerId && store.chainServerId !== chainServerId) {
			store.clearContracts();
			store.setChainServerId(chainServerId);
		}
	}, [chainServerId, store.chainServerId]);

	return store;
};

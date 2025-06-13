import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useContractTabs } from './use-contract-tabs';

interface ContractEditorContextValue {
	selectedNodeIds: string[];
	setSelectedNodeIds: (nodeIds: string[]) => void;
	handleSelectionChange: (nodeIds: string[]) => void;
	clearSelection: () => void;
	selectNode: (nodeId: string) => void;
}

const ContractEditorContext = createContext<ContractEditorContextValue | null>(null);

export function ContractEditorProvider({ children }: { children: React.ReactNode }) {
	const { activeTab } = useContractTabs();
	const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

	const handleSelectionChange = useCallback((nodeIds: string[]) => {
		setSelectedNodeIds(nodeIds);
	}, []);

	const clearSelection = useCallback(() => {
		setSelectedNodeIds([]);
	}, []);

	const selectNode = useCallback((nodeId: string) => {
		setSelectedNodeIds([nodeId]);
	}, []);

	// Init on mount
	useEffect(() => {
		if (activeTab) {
			selectNode(activeTab);
		}
	}, [selectNode]);

	return (
		<ContractEditorContext.Provider
			value={{
				selectedNodeIds,
				setSelectedNodeIds,
				handleSelectionChange,
				clearSelection,
				selectNode,
			}}
		>
			{children}
		</ContractEditorContext.Provider>
	);
}

export function useContractEditor() {
	const context = useContext(ContractEditorContext);
	if (!context) {
		throw new Error('useContractEditor must be used within ContractEditorProvider');
	}
	return context;
}

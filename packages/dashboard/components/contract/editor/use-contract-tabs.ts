import { useCallback, useEffect } from 'react';

import { useContracts } from '@/state/contracts';

import { scrollContractTabIntoView } from './contract-editor.utils';

export interface FileTab {
	id: string;
	name: string;
	path: string;
	isDirty?: boolean;
}

export function useContractTabs() {
	const {
		openTabs,
		activeTabId,
		openTab,
		closeTab,
		setActiveTab,
		syncTabs,
		markTabDirty,
		markTabClean,
		isTabDirty,
		dirtyTabIds,
	} = useContracts();

	const handleOpenTab = useCallback(
		(tab: FileTab) => {
			openTab(tab);
		},
		[openTab],
	);

	const handleCloseTab = useCallback(
		(tabId: string, event?: React.MouseEvent) => {
			event?.stopPropagation();
			closeTab(tabId);
		},
		[closeTab],
	);

	useEffect(() => {
		if (activeTabId) {
			scrollContractTabIntoView(activeTabId);
		}
	}, [activeTabId]);

	// Sync tabs whenever the hook is used
	useEffect(() => {
		syncTabs();
	}, [syncTabs]);

	return {
		openTabs,
		activeTab: activeTabId,
		handleOpenTab,
		handleCloseTab,
		setActiveTab,
		markTabDirty,
		markTabClean,
		isTabDirty,
		dirtyTabIds,
	};
}

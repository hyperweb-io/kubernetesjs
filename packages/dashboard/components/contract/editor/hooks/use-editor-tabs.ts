import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TabState {
	id: string;
	name: string;
	path: string;
}

export interface EditorTabsState {
	openTabs: TabState[];
	activeTabId: string | null;
	dirtyTabIds: string[];
}

export interface EditorTabsActions {
	openTab: (tab: TabState) => void;
	closeTab: (tabId: string) => void;
	setActiveTab: (tabId: string | null) => void;
	getOpenTabs: () => TabState[];
	getActiveTab: () => TabState | null;
	markTabDirty: (tabId: string) => void;
	markTabClean: (tabId: string) => void;
	isTabDirty: (tabId: string) => boolean;
	closeAllTabs: () => void;
	updateTab: (tabId: string, updates: Partial<Omit<TabState, 'id'>>) => void;
}

export const useEditorTabs = create<EditorTabsState & EditorTabsActions>()(
	persist(
		(set, get) => ({
			openTabs: [],
			activeTabId: null,
			dirtyTabIds: [],

			openTab: (tab) => {
				set((state) => {
					// Don't duplicate tabs, but always set as active
					if (state.openTabs.some((t) => t.id === tab.id)) {
						return {
							...state,
							activeTabId: tab.id,
						};
					}

					return {
						...state,
						openTabs: [...state.openTabs, tab],
						activeTabId: tab.id,
					};
				});
			},

			closeTab: (tabId) => {
				set((state) => {
					const newTabs = state.openTabs.filter((tab) => tab.id !== tabId);
					let newActiveTabId = state.activeTabId;

					// If we're closing the active tab
					if (state.activeTabId === tabId) {
						const tabIndex = state.openTabs.findIndex((tab) => tab.id === tabId);
						const newActiveTab = state.openTabs[tabIndex - 1] || state.openTabs[tabIndex + 1];
						newActiveTabId = newActiveTab?.id || null;
					}

					return {
						...state,
						openTabs: newTabs,
						activeTabId: newActiveTabId,
						dirtyTabIds: state.dirtyTabIds.filter((id) => id !== tabId),
					};
				});
			},

			setActiveTab: (tabId) => {
				set((state) => ({
					...state,
					activeTabId: tabId,
				}));
			},

			getOpenTabs: () => {
				return get().openTabs;
			},

			getActiveTab: () => {
				return get().openTabs.find((tab) => tab.id === get().activeTabId) || null;
			},

			markTabDirty: (tabId) => {
				set((state) => {
					if (state.dirtyTabIds.includes(tabId)) {
						return state;
					}
					return {
						...state,
						dirtyTabIds: [...state.dirtyTabIds, tabId],
					};
				});
			},

			markTabClean: (tabId) => {
				set((state) => ({
					...state,
					dirtyTabIds: state.dirtyTabIds.filter((id) => id !== tabId),
				}));
			},

			isTabDirty: (tabId) => {
				return get().dirtyTabIds.includes(tabId);
			},

			closeAllTabs: () => {
				set((state) => ({
					...state,
					openTabs: [],
					activeTabId: null,
					dirtyTabIds: [],
				}));
			},

			updateTab: (tabId, updates) => {
				set((state) => {
					const tabIndex = state.openTabs.findIndex((tab) => tab.id === tabId);
					if (tabIndex === -1) return state;

					const updatedTabs = [...state.openTabs];
					updatedTabs[tabIndex] = {
						...updatedTabs[tabIndex],
						...updates,
					};

					return {
						...state,
						openTabs: updatedTabs,
					};
				});
			},
		}),
		{
			name: 'hyperweb:editor-tabs',
			partialize: (state) => ({
				openTabs: state.openTabs,
				activeTabId: state.activeTabId,
			}),
		},
	),
);

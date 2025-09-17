import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ContractType = 'user' | 'template';

export const CONTRACT_METADATA_BY_TYPE: Record<
  ContractType,
  {
    folderName: string;
    description: string;
  }
> = {
  user: {
    folderName: 'Your Contracts',
    description: 'User contracts are contracts that you have created.',
  },
  template: {
    folderName: 'Templates',
    description: 'Template contracts are provided by Hyperweb and are ready to use.',
  },
};

export interface Contract {
  id: string;
  name: string;
  sourceCode: string;
  type: ContractType;
  createdAt: number;
  updatedAt: number;
  description?: string;
}

interface TabState {
  id: string;
  name: string;
  path: string;
}

export interface ContractsData {
  contracts: Record<string, Contract>;
  activeContractId: string | null;
  openTabs: TabState[];
  activeTabId: string | null;
  dirtyTabIds: string[];
}

export interface ContractsActions {
  // Actions
  createContract: (name: string, sourceCode: string, type?: ContractType) => string;
  updateContract: (id: string, updates: Partial<Omit<Contract, 'id' | 'type'>>) => void;
  deleteContract: (id: string) => void;
  setActiveContract: (id: string | null) => void;
  getContract: (id: string) => Contract | undefined;
  getUserContracts: () => Contract[];
  getTemplateContracts: () => Contract[];
  // Add tab actions
  openTab: (tab: TabState) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string | null) => void;
  getOpenTabs: () => TabState[];
  syncTabs: () => void; // Ensures tabs are in sync with existing contracts
  // Add fork action
  forkContract: (id: string) => string | null; // Returns new contract id or null if fork fails
  // Add dirty tab management
  markTabDirty: (tabId: string) => void;
  markTabClean: (tabId: string) => void;
  isTabDirty: (tabId: string) => boolean;
}

interface ContractsState extends ContractsData, ContractsActions {
  _getState: () => ContractsData;
  _setState: (state: ContractsData) => void;
}

// Add helper function at the top level
function getNextAvailableName(baseName: string, existingNames: string[]): string {
  if (!existingNames.includes(baseName)) return baseName;

  let counter = 1;
  let newName = `${baseName}-${counter}`;

  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName}-${counter}`;
  }

  return newName;
}

export const useContracts = create<ContractsState>()(
  persist(
    (set, get) => ({
      contracts: {},
      activeContractId: null,
      openTabs: [],
      activeTabId: null,
      dirtyTabIds: [],

      createContract: (name, sourceCode, type = 'user') => {
        const id = nanoid();
        const now = Date.now();

        set((state) => ({
          contracts: {
            ...state.contracts,
            [id]: {
              id,
              name,
              sourceCode,
              type,
              createdAt: now,
              updatedAt: now,
            },
          },
          activeContractId: id, // Set the new contract as active
        }));

        return id;
      },

      updateContract: (id, updates) => {
        set((state) => {
          const contract = state.contracts[id];
          if (!contract) return state;

          // For template contracts, only allow description updates
          if (contract.type === 'template') {
            if (!('description' in updates)) return state;

            const updatedContract = {
              ...contract,
              description: updates.description,
              updatedAt: Date.now(),
            };

            return {
              ...state,
              contracts: {
                ...state.contracts,
                [id]: updatedContract,
              },
            };
          }

          // For user contracts, allow all updates
          const updatedContract = {
            ...contract,
            ...updates,
            updatedAt: Date.now(),
          };

          // Update any open tabs with the new contract name
          const updatedTabs = state.openTabs.map((tab) =>
            tab.id === id
              ? {
                  ...tab,
                  name: updatedContract.name,
                  path: updatedContract.name,
                }
              : tab
          );

          return {
            ...state,
            contracts: {
              ...state.contracts,
              [id]: updatedContract,
            },
            openTabs: updatedTabs,
          };
        });
      },

      deleteContract: (id) => {
        set((state) => {
          const contract = state.contracts[id];
          if (!contract || contract.type !== 'user') return state;

          const { [id]: _, ...remainingContracts } = state.contracts;

          // Close any tabs for the deleted contract
          const newTabs = state.openTabs.filter((tab) => tab.id !== id);
          let newActiveTabId = state.activeTabId;

          if (state.activeTabId === id) {
            const tabIndex = state.openTabs.findIndex((tab) => tab.id === id);
            const newActiveTab = state.openTabs[tabIndex - 1] || state.openTabs[tabIndex + 1];
            newActiveTabId = newActiveTab?.id || null;
          }

          return {
            ...state,
            contracts: remainingContracts,
            activeContractId: state.activeContractId === id ? null : state.activeContractId,
            openTabs: newTabs,
            activeTabId: newActiveTabId,
          };
        });
      },

      setActiveContract: (id) => {
        set((state) => ({
          ...state,
          activeContractId: id,
        }));
      },

      getContract: (id) => {
        return get().contracts[id];
      },

      getUserContracts: () => {
        return Object.values(get().contracts).filter((contract) => contract.type === 'user');
      },

      getTemplateContracts: () => {
        return Object.values(get().contracts).filter((contract) => contract.type === 'template');
      },

      openTab: (tab) => {
        set((state) => {
          // Only open tab if contract exists
          const contract = state.contracts[tab.id];
          if (!contract) return state;

          // Create new tab with contract's current name and path
          const newTab = {
            id: tab.id,
            name: contract.name,
            path: contract.name,
          };

          // Don't duplicate tabs, but always set as active
          if (state.openTabs.some((t) => t.id === tab.id)) {
            return {
              ...state,
              activeTabId: tab.id, // Always set as active
            };
          }

          return {
            ...state,
            openTabs: [...state.openTabs, newTab],
            activeTabId: tab.id, // Always set as active
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

      syncTabs: () => {
        set((state) => {
          // Filter out tabs for contracts that no longer exist
          const validTabs = state.openTabs.filter((tab) => state.contracts[tab.id] !== undefined);

          // Update tab names/paths in case contracts were renamed
          const updatedTabs = validTabs.map((tab) => {
            const contract = state.contracts[tab.id];
            if (!contract) return tab; // This shouldn't happen due to the filter above
            return {
              ...tab,
              name: contract.name,
              path: contract.name,
            };
          });

          // Ensure active tab is still valid
          let newActiveTabId = state.activeTabId;
          if (!updatedTabs.some((tab) => tab.id === state.activeTabId)) {
            newActiveTabId = updatedTabs[0]?.id || null;
          }

          return {
            ...state,
            openTabs: updatedTabs,
            activeTabId: newActiveTabId,
          };
        });
      },

      forkContract: (id) => {
        const sourceContract = get().contracts[id];

        // Can only fork template contracts
        if (!sourceContract || sourceContract.type !== 'template') {
          return null;
        }

        const newId = nanoid();
        const now = Date.now();

        // Get base name for the fork
        const baseName = `${sourceContract.name} (Fork)`;

        // Get all existing contract names
        const existingNames = Object.values(get().contracts).map((c) => c.name);

        // Get unique name for the new contract
        const newName = getNextAvailableName(baseName, existingNames);

        // Create new user contract with template's content
        set((state) => ({
          contracts: {
            ...state.contracts,
            [newId]: {
              id: newId,
              name: newName,
              sourceCode: sourceContract.sourceCode,
              type: 'user',
              createdAt: now,
              updatedAt: now,
              description: sourceContract.description
                ? `Forked from template: ${sourceContract.description}`
                : 'Forked from template',
            },
          },
          activeContractId: newId,
        }));

        // Open the new contract in a tab
        get().openTab({
          id: newId,
          name: newName,
          path: newName,
        });

        return newId;
      },

      markTabDirty: (tabId: string) => {
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

      markTabClean: (tabId: string) => {
        set((state) => ({
          ...state,
          dirtyTabIds: state.dirtyTabIds.filter((id) => id !== tabId),
        }));
      },

      isTabDirty: (tabId: string) => {
        return get().dirtyTabIds.includes(tabId);
      },

      _getState: () => get(),

      _setState: (state: ContractsData) => {
        set((prevState) => ({
          ...prevState,
          ...state,
        }));
      },
    }),
    {
      name: 'contracts-storage',
      partialize: (state) => {
        // Filter out template contracts
        const userContracts = Object.fromEntries(
          Object.entries(state.contracts).filter(([_, contract]) => contract.type === 'user')
        );

        // Filter out tabs for template contracts
        const userTabs = state.openTabs.filter((tab) => state.contracts[tab.id]?.type === 'user');

        // Only persist activeTabId if it belongs to a user contract
        const activeTabId =
          state.activeTabId && state.contracts[state.activeTabId]?.type === 'user' ? state.activeTabId : null;

        return {
          contracts: userContracts,
          activeContractId: state.activeContractId,
          openTabs: userTabs,
          activeTabId: activeTabId,
        };
      },
    }
  )
);

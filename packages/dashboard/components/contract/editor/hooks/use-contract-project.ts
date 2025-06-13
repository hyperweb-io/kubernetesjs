import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
	ensureParentPathExist,
	getParentPath,
	normalizePath,
	setupContractProject,
	validatePath,
	validateTreeViewItemName,
} from '../contract-editor.utils';
import { initializeFs } from '../services/fs';
import { useEditorTabs } from './use-editor-tabs';
import type { RuntimeConfig } from '@/pages/api/config';

interface FileSystemObject {
	id: string;
	name: string;
	path: string;
	parentId: string | null | undefined;
	createdAt: number;
	updatedAt: number;
}

export interface FileItem extends FileSystemObject {
	type: 'file';
	content: string;
}

export interface FolderItem extends FileSystemObject {
	type: 'folder';
}

export interface Variable {
	name: string;
	message: string;
	required: boolean;
	choices?: string[];
	type?: string;
	value?: string;
}

export type ProjectItem = FileItem | FolderItem;

// Define the initialization status type
export type InitializationStatus = 'idle' | 'initializing' | 'initialized' | 'error';

// ==== Zustand store state ====
export interface ContractProjectState {
	initializationStatus: InitializationStatus;
	isInitialized: boolean;
	items: Record<string, ProjectItem>;
	activeItemId: string | null;
	createdAt: number;
	expandedPaths: Set<string>;
	unsavedContent: Record<string, string>;
	variables: Variable[];
	hasAppliedVariables: boolean;
}

// ==== Zustand store actions ====
export interface ContractProjectActions {
	// ==== Project actions ====
	initializeProject: ({
		fallbackItems,
		config,
	}: {
		fallbackItems?: Record<string, ProjectItem>;
		config: RuntimeConfig;
	}) => Promise<OperationResult<void>>;

	resetProject: ({
		fallbackItems,
		config,
	}: {
		fallbackItems?: Record<string, ProjectItem>;
		config: RuntimeConfig;
	}) => Promise<OperationResult<void>>;

	// ==== Variable actions ====
	setVariableValues: (values: Record<string, string>) => void;
	applyVariables: () => OperationResult<void>;

	// ==== Generic item operations ====
	renameItem: (id: string, newName: string) => OperationResult<void>;
	deleteItem: (id: string) => OperationResult<void>;
	deleteItems: (ids: string[]) => OperationResult<void>;

	// ==== File-specific operations ====
	createFile: (params: Pick<FileItem, 'path' | 'name' | 'content'>) => OperationResult<string>;
	createFiles: (files: Array<Pick<FileItem, 'path' | 'name' | 'content'>>) => OperationResult<string[]>;
	updateFileContent: (id: string, content: string) => OperationResult<void>;
	saveFile: (id: string) => OperationResult<void>;
	getCurrentFileContent: (id: string) => string | null;
	updateUnsavedContent: (id: string, content: string) => OperationResult<void>;
	discardUnsavedChanges: (id: string) => OperationResult<void>;

	// ==== Folder-specific operations ====
	createFolder: (params: Pick<FolderItem, 'path' | 'name'>) => OperationResult<string>;
	getChildrenByPath: (path: string) => ProjectItem[];

	// ==== Utility operations ====
	getItemById: <T extends ProjectItem['type'] | undefined = undefined>(
		id: string,
		type?: T,
	) => T extends 'file' ? FileItem | undefined : T extends 'folder' ? FolderItem | undefined : ProjectItem | undefined;

	getItemByPath: <T extends ProjectItem['type'] | undefined = undefined>(
		path: string,
		type?: T,
	) => T extends 'file' ? FileItem | undefined : T extends 'folder' ? FolderItem | undefined : ProjectItem | undefined;

	setActiveFile: (id: string) => OperationResult<void>;

	// ==== Tree actions ====
	togglePathExpanded: (path: string) => void;
	setExpandedPaths: (paths: string[]) => void;
}

interface ContractProjectStore extends ContractProjectState, ContractProjectActions {
	_getState: () => ContractProjectState;
	_setState: (state: ContractProjectState) => void;
}

export const ROOT_ID = 'root';

const REFRESH_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

interface OperationSuccess<T> {
	success: true;
	data: T;
}

interface OperationError {
	success: false;
	error: string;
	details?: Error;
}

export type OperationResult<T> = OperationSuccess<T> | OperationError;

// Helper function to escape regex special characters (basic)
function escapeRegex(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const useContractProject = create<ContractProjectStore>()(
	persist(
		(set, get) => ({
			initializationStatus: 'idle',
			isInitialized: false,
			items: {},
			activeItemId: null,
			createdAt: 0,
			expandedPaths: new Set<string>(),
			unsavedContent: {},
			variables: [],
			hasAppliedVariables: false,

			initializeProject: async ({ fallbackItems, config }) => {
				const currentState = get().initializationStatus;
				if (currentState === 'initialized' || currentState === 'initializing') {
					return { success: true, data: undefined };
				}

				set({ initializationStatus: 'initializing', isInitialized: false });

				try {
					await initializeFs();

					const state = get();
					const now = Date.now();

					const hasItems = Object.keys(state.items).length > 0;
					if (hasItems) {
						const lastUpdateTime = Math.max(...Object.values(state.items).map((item) => item.updatedAt));
						if (now - lastUpdateTime < REFRESH_INTERVAL) {
							set({ initializationStatus: 'initialized', isInitialized: true });
							return { success: true, data: undefined };
						}
					}

					const { items, createdAt, variables } = await setupContractProject({
						fallbackItems,
						config,
					});

					set({
						items,
						initializationStatus: 'initialized',
						isInitialized: true,
						createdAt,
						activeItemId: null,
						expandedPaths: new Set<string>(),
						variables,
						unsavedContent: {},
						hasAppliedVariables: false,
					});

					return { success: true, data: undefined };
				} catch (error) {
					set({ initializationStatus: 'error', isInitialized: false });
					return {
						success: false,
						error: 'Failed to initialize project',
						details: error as Error,
					};
				}
			},

			resetProject: async ({ fallbackItems, config }) => {
				set({ initializationStatus: 'initializing', isInitialized: false });
				try {
					await initializeFs();

					useEditorTabs.getState().closeAllTabs();

					const { items, createdAt, variables } = await setupContractProject({
						fallbackItems,
						config,
					});

					set({
						items,
						initializationStatus: 'initialized',
						isInitialized: true,
						createdAt,
						activeItemId: null,
						expandedPaths: new Set<string>(),
						variables,
						unsavedContent: {},
						hasAppliedVariables: false,
					});
					return { success: true, data: undefined };
				} catch (error) {
					set({ initializationStatus: 'error', isInitialized: false });
					return {
						success: false,
						error: 'Failed to reset project',
						details: error as Error,
					};
				}
			},

			createFile: ({ name, path, content }) => {
				try {
					const state = get();
					const normalizedPath = normalizePath(path);
					const validation = validateTreeViewItemName(state.items, name, normalizedPath);

					if (!validation.isValid) {
						return { success: false, error: validation.error || 'Invalid file name' };
					}

					if (!validatePath(normalizedPath)) {
						return { success: false, error: 'Invalid file path' };
					}

					const fileId = nanoid();

					set((state) => {
						const { parentId, newFolders } = ensureParentPathExist(state.items, normalizedPath);

						const newFile: FileItem = {
							id: fileId,
							type: 'file',
							parentId,
							createdAt: Date.now(),
							updatedAt: Date.now(),
							name,
							path: normalizedPath,
							content,
						};

						return {
							items: {
								...state.items,
								...newFolders,
								[fileId]: newFile,
							},
						};
					});

					useEditorTabs.getState().openTab({
						id: fileId,
						name,
						path: normalizedPath,
					});

					return { success: true, data: fileId };
				} catch (error) {
					return {
						success: false,
						error: `Failed to create file at ${path}`,
						details: error as Error,
					};
				}
			},

			updateFileContent: (id, content) => {
				try {
					const state = get();
					const file = state.items[id];
					if (!file || file.type !== 'file') {
						return { success: false, error: 'File not found' };
					}

					set((state) => {
						const newUnsavedContent = { ...state.unsavedContent };
						delete newUnsavedContent[id];

						return {
							items: {
								...state.items,
								[id]: {
									...file,
									content,
									updatedAt: Date.now(),
								},
							},
							unsavedContent: newUnsavedContent,
						};
					});

					return { success: true, data: undefined };
				} catch (error) {
					return {
						success: false,
						error: 'Failed to update file content',
						details: error as Error,
					};
				}
			},

			createFolder: ({ name, path }) => {
				try {
					const state = get();
					const normalizedPath = normalizePath(path);
					const validation = validateTreeViewItemName(state.items, name, normalizedPath);
					if (!validation.isValid) {
						return { success: false, error: validation.error || 'Invalid folder name' };
					}

					if (!validatePath(normalizedPath)) {
						return { success: false, error: 'Invalid folder path' };
					}

					const folderId = nanoid();

					set((state) => {
						const { parentId, newFolders } = ensureParentPathExist(state.items, normalizedPath);

						const newFolder: FolderItem = {
							id: folderId,
							type: 'folder',
							parentId,
							createdAt: Date.now(),
							updatedAt: Date.now(),
							name,
							path: normalizedPath,
						};

						return {
							items: {
								...state.items,
								...newFolders,
								[folderId]: newFolder,
							},
						};
					});

					return { success: true, data: folderId };
				} catch (error) {
					return {
						success: false,
						error: `Failed to create folder at ${path}`,
						details: error as Error,
					};
				}
			},

			renameItem: (id, newName) => {
				try {
					const state = get();
					const item = state.items[id];
					if (!item) {
						return { success: false, error: 'Item not found' };
					}

					const validation = validateTreeViewItemName(state.items, newName, item.path, id);
					if (!validation.isValid) {
						return { success: false, error: validation.error || 'Invalid name' };
					}

					const parentPath = getParentPath(item.path);
					const newPath = parentPath ? `${parentPath}/${newName}` : newName;

					if (!validatePath(newPath)) {
						return { success: false, error: 'Invalid new path' };
					}

					const updatedItems = { ...state.items };
					if (item.type === 'folder') {
						const oldPrefix = item.path;
						const newPrefix = newPath;

						Object.entries(state.items).forEach(([itemId, currentItem]) => {
							if (currentItem.path.startsWith(oldPrefix + '/')) {
								const relativePath = currentItem.path.slice(oldPrefix.length);
								const updatedPath = newPrefix + relativePath;
								updatedItems[itemId] = {
									...currentItem,
									path: updatedPath,
									updatedAt: Date.now(),
								};
								if (currentItem.type === 'file') {
									const updatedName = updatedPath.split('/').pop() || '';
									useEditorTabs.getState().updateTab(itemId, {
										name: updatedName,
										path: updatedPath,
									});
								}
							}
						});
					} else if (item.type === 'file') {
						useEditorTabs.getState().updateTab(id, {
							name: newName,
							path: newPath,
						});
					}

					updatedItems[id] = {
						...item,
						name: newName,
						path: newPath,
						updatedAt: Date.now(),
					};

					set({ items: updatedItems });
					return { success: true, data: undefined };
				} catch (error) {
					return {
						success: false,
						error: 'Failed to rename item',
						details: error as Error,
					};
				}
			},

			deleteItem: (id) => {
				try {
					const state = get();
					const item = state.items[id];
					if (!item) {
						return { success: true, data: undefined };
					}

					const updatedItems = { ...state.items };

					if (item.type === 'folder') {
						Object.entries(state.items).forEach(([itemId, currentItem]) => {
							if (currentItem.path.startsWith(item.path + '/') || itemId === id) {
								delete updatedItems[itemId];
								if (currentItem.type === 'file') {
									useEditorTabs.getState().closeTab(itemId);
								}
							}
						});
					} else {
						delete updatedItems[id];
						useEditorTabs.getState().closeTab(id);
					}

					const updates: Partial<ContractProjectState> = { items: updatedItems };
					if (state.activeItemId === id) {
						updates.activeItemId = null;
					}

					set(updates);
					return { success: true, data: undefined };
				} catch (error) {
					return {
						success: false,
						error: 'Failed to delete item',
						details: error as Error,
					};
				}
			},

			setActiveFile: (id) => {
				const state = get();
				const item = state.items[id];
				if (!item || item.type !== 'file') {
					return { success: false, error: 'File not found' };
				}

				useEditorTabs.getState().openTab({
					id,
					name: item.name,
					path: item.path,
				});

				set({ activeItemId: id });
				return { success: true, data: undefined };
			},

			togglePathExpanded: (path) => {
				set((state) => {
					const newExpandedPaths = new Set(state.expandedPaths);
					if (newExpandedPaths.has(path)) {
						newExpandedPaths.delete(path);
					} else {
						newExpandedPaths.add(path);
					}
					return { expandedPaths: newExpandedPaths };
				});
			},

			setExpandedPaths: (paths) => {
				set({ expandedPaths: new Set(paths) });
			},

			getChildrenByPath: (path) => {
				const state = get();
				const normalizedPath = normalizePath(path);
				const isFolder = state.getItemByPath(normalizedPath)?.type === 'folder';

				if (!isFolder) {
					return [];
				}

				return Object.values(state.items).filter((item) => {
					return item.path.startsWith(normalizedPath + '/');
				});
			},

			createFiles: (files) => {
				try {
					const fileIds: string[] = [];
					const errors: string[] = [];

					for (const file of files) {
						const result = get().createFile(file);
						if (result.success) {
							fileIds.push(result.data);
						} else {
							errors.push(`Failed to create ${file.path}: ${result.error}`);
						}
					}

					if (errors.length > 0) {
						return { success: false, error: errors.join('; ') };
					}

					return { success: true, data: fileIds };
				} catch (error) {
					return {
						success: false,
						error: 'Failed to create files',
						details: error as Error,
					};
				}
			},

			deleteItems: (ids) => {
				try {
					const errors: string[] = [];

					for (const id of ids) {
						const result = get().deleteItem(id);
						if (!result.success) {
							errors.push(`Failed to delete: ${result.error}`);
						}
					}

					if (errors.length > 0) {
						return { success: false, error: errors.join('; ') };
					}

					return { success: true, data: undefined };
				} catch (error) {
					return {
						success: false,
						error: 'Failed to delete items',
						details: error as Error,
					};
				}
			},

			getItemById: (id, type) => {
				const item = get().items[id];
				if (!item) return undefined;
				if (type && item.type !== type) return undefined;
				return item as any;
			},

			getItemByPath: (path, type) => {
				const item = Object.values(get().items).find((item) => item.path === path);
				if (!item) return undefined;
				if (type && item.type !== type) return undefined;
				return item as any;
			},

			getCurrentFileContent: (id) => {
				const state = get();
				if (id in state.unsavedContent) {
					return state.unsavedContent[id];
				}
				const file = state.items[id];
				return file && file.type === 'file' ? file.content : null;
			},

			updateUnsavedContent: (id, content) => {
				try {
					const state = get();
					const file = state.items[id];
					if (!file || file.type !== 'file') {
						return { success: false, error: 'File not found' };
					}

					const { markTabDirty, markTabClean } = useEditorTabs.getState();

					if (content !== file.content) {
						set((state) => ({
							unsavedContent: {
								...state.unsavedContent,
								[id]: content,
							},
						}));

						markTabDirty(id);
					} else {
						set((state) => {
							const newUnsavedContent = { ...state.unsavedContent };
							delete newUnsavedContent[id];
							return { unsavedContent: newUnsavedContent };
						});

						markTabClean(id);
					}

					return { success: true, data: undefined };
				} catch (error) {
					return {
						success: false,
						error: 'Failed to update unsaved content',
						details: error as Error,
					};
				}
			},

			saveFile: (id) => {
				try {
					const state = get();
					if (!(id in state.unsavedContent)) {
						return { success: true, data: undefined };
					}

					const content = state.unsavedContent[id];
					const result = get().updateFileContent(id, content);

					if (result.success) {
						useEditorTabs.getState().markTabClean(id);
					}

					return result;
				} catch (error) {
					return {
						success: false,
						error: 'Failed to save file',
						details: error as Error,
					};
				}
			},

			discardUnsavedChanges: (id) => {
				try {
					set((state) => {
						const newUnsavedContent = { ...state.unsavedContent };
						delete newUnsavedContent[id];
						return { unsavedContent: newUnsavedContent };
					});

					useEditorTabs.getState().markTabClean(id);

					return { success: true, data: undefined };
				} catch (error) {
					return {
						success: false,
						error: 'Failed to discard unsaved changes',
						details: error as Error,
					};
				}
			},

			setVariableValues: (values: Record<string, string>) => {
				set((state) => ({
					variables: state.variables.map((variable) => ({
						...variable,
						value: values[variable.name] || variable.value,
					})),
				}));
			},

			applyVariables: () => {
				try {
					const state = get();
					const { items, unsavedContent, variables } = state;

					const variableMap = new Map<string, string>();
					const variableNames: string[] = [];

					variables.forEach((variable) => {
						if (variable.value) {
							variableMap.set(variable.name, variable.value);
							variableNames.push(escapeRegex(variable.name));
						}
					});

					if (variableNames.length === 0) {
						return { success: true, data: undefined };
					}

					const combinedRegex = new RegExp(variableNames.join('|'), 'g');

					const updatedItems = { ...items };
					const updatedUnsavedContent = { ...unsavedContent };
					let changesMade = false;

					Object.values(items).forEach((item) => {
						if (item.type !== 'file') return;

						let itemChanged = false;

						const originalContent = item.content;
						const newContent = originalContent.replace(combinedRegex, (match) => variableMap.get(match) ?? match);

						if (newContent !== originalContent) {
							updatedItems[item.id] = {
								...item,
								content: newContent,
								updatedAt: Date.now(),
							};
							itemChanged = true;
						}

						if (item.id in updatedUnsavedContent) {
							const originalUnsaved = updatedUnsavedContent[item.id];
							const newUnsaved = originalUnsaved.replace(combinedRegex, (match) => variableMap.get(match) ?? match);

							if (newUnsaved !== originalUnsaved) {
								updatedUnsavedContent[item.id] = newUnsaved;
								changesMade = true;
							}
						}

						if (itemChanged) {
							changesMade = true;
						}
					});

					if (changesMade) {
						set({
							items: updatedItems,
							hasAppliedVariables: true,
							unsavedContent: updatedUnsavedContent,
						});
					} else {
						set({ hasAppliedVariables: true });
					}

					return { success: true, data: undefined };
				} catch (error) {
					return {
						success: false,
						error: 'Failed to apply variables',
						details: error instanceof Error ? error : new Error(String(error)),
					};
				}
			},

			_getState: () => get(),

			_setState: (state) => {
				set((prevState) => ({
					...prevState,
					...state,
				}));
			},
		}),
		{
			name: 'hyperweb:project-contracts',
			partialize: (state) => ({
				initializationStatus: state.initializationStatus,
				isInitialized: state.isInitialized,
				items: state.items,
				variables: state.variables,
				hasAppliedVariables: state.hasAppliedVariables,
			}),
		},
	),
);

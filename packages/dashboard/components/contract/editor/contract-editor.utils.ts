import { SourceCollector } from '@hyperweb/parse';
import { parse, VariableDeclarator } from 'acorn';
import * as walk from 'acorn-walk';
import * as esbuild from 'esbuild-wasm';
import type { Plugin, PluginBuild } from 'esbuild-wasm';
import { minimatch } from 'minimatch';
import { nanoid } from 'nanoid';

import { createTree, Node } from '@/components/ui/treeview';
import { contractSourceStoreActions } from '@/contexts/contract-source';
import type { RuntimeConfig } from '@/pages/api/config';
import { CONTRACT_METADATA_BY_TYPE, ContractType } from '@/state/contracts';

import { FileItem, FolderItem, ProjectItem, ROOT_ID, Variable } from './hooks/use-contract-project';
import { esbuildInitializer } from './services/esbuild';
import { dirExists, getFileSystem } from './services/fs';
import { downloadAndExtractRepo, GIT_CONFIG } from './services/git';
import { fallbackVariables } from './settings/variable-fields';

export type TreeFolderId = `folder-${ContractType}`;

export function makeFocusTabKey(id: string) {
	return `contractTab__${id}`;
}

export function scrollContractTabIntoView(id: string) {
	requestAnimationFrame(() => {
		const tabElement = document.getElementById(makeFocusTabKey(id));
		if (!tabElement) return;

		const scrollContainer = document.querySelector('[data-testid="tabs-scroller"]');
		if (!scrollContainer) return;

		const scrollRect = scrollContainer.getBoundingClientRect();
		const tabRect = tabElement.getBoundingClientRect();
		const relativeLeft = tabRect.left - scrollRect.left + scrollContainer.scrollLeft;

		// Calculate center position
		const containerWidth = scrollContainer.clientWidth;
		const targetScrollPosition = relativeLeft - containerWidth / 2 + tabRect.width / 2;
		const tabLengthDelta = 100;

		scrollContainer.scrollTo({
			left: Math.max(0, targetScrollPosition - tabLengthDelta),
			behavior: 'smooth',
		});

		// Ensure the tab is also focused
		tabElement.focus();
	});
}

export function isFolder(nodeId: string | string[]): boolean {
	const id = Array.isArray(nodeId) ? nodeId[nodeId.length - 1] : nodeId;
	return id?.startsWith('folder-') ?? false;
}

export function getFolderType(nodeId: string | string[]): ContractType | null {
	const id = Array.isArray(nodeId) ? nodeId[nodeId.length - 1] : nodeId;
	if (!id || !isFolder(id)) return null;
	const type = id.replace('folder-', '') as ContractType;
	return Object.keys(CONTRACT_METADATA_BY_TYPE).includes(type) ? type : null;
}

export const DEFAULT_EXPANDED_FOLDERS = Object.keys(CONTRACT_METADATA_BY_TYPE).map(
	(type) => `folder-${type}` as TreeFolderId,
);

/**
 * Generates a unique file name for new blank contracts
 * Format: untitled.ts, untitled-1.ts, untitled-2.ts, etc.
 */
export function generateBlankFileName(existingFiles: string[]): string {
	const baseFileName = 'untitled';
	const extension = '.ts';

	// If no files exist or base name is available, use it
	if (!existingFiles.includes(`${baseFileName}${extension}`)) {
		return `${baseFileName}${extension}`;
	}

	// Find the next available number
	let counter = 1;
	while (existingFiles.includes(`${baseFileName}-${counter}${extension}`)) {
		counter++;
	}

	return `${baseFileName}-${counter}${extension}`;
}

export function validatePath(path: string): boolean {
	// Remove leading/trailing slashes and empty segments
	const parts = path.split('/').filter(Boolean);

	// Check for invalid characters, double dots, etc.
	return parts.every((part) => part !== '..' && part !== '.' && /^[\w-]+([.][\w-]+)*$/.test(part));
}

export function getParentPath(path: string): string {
	return path.split('/').slice(0, -1).join('/');
}

export function normalizePath(path: string): string {
	return path.replace(/^\/+|\/+$/g, ''); // Remove leading and trailing slashes
}

function createProjectItem(
	entry: string,
	relativePath: string,
	parentId: string,
	isDirectory: boolean,
	content?: string,
): ProjectItem {
	const id = nanoid();
	const now = Date.now();

	if (isDirectory) {
		return {
			id,
			type: 'folder',
			name: entry,
			path: relativePath,
			parentId,
			createdAt: now,
			updatedAt: now,
		};
	} else {
		return {
			id,
			type: 'file',
			name: entry,
			path: relativePath,
			parentId,
			content: content || '',
			createdAt: now,
			updatedAt: now,
		};
	}
}

export async function makeProjectItems(
	dirPath: string,
	projectRootPath: string,
	parentId: string = ROOT_ID,
): Promise<Record<string, ProjectItem>> {
	const items: Record<string, ProjectItem> = {};

	try {
		if (!(await dirExists(dirPath))) return items;

		const fs = getFileSystem();
		const entries = await fs.promises.readdir(dirPath);

		for (const entry of entries) {
			if (entry.startsWith('.')) continue; // Skip hidden files

			const fullPath = `${dirPath}/${entry}`;
			const relativePath = fullPath.replace(projectRootPath, '').replace(/^\//, '');

			// Check if the current file/folder matches any exclude pattern
			const shouldExclude = GIT_CONFIG.exclude?.some((pattern) => minimatch(relativePath, pattern));

			if (shouldExclude) continue;

			try {
				const stats = await fs.promises.stat(fullPath);

				if (stats.isDirectory()) {
					// Create folder item
					const item = createProjectItem(entry, relativePath, parentId, true);
					items[item.id] = item;

					const childItems = await makeProjectItems(fullPath, projectRootPath, item.id);
					Object.assign(items, childItems);
				} else {
					// Create file item
					try {
						const content = await fs.promises.readFile(fullPath, { encoding: 'utf8' });
						const item = createProjectItem(entry, relativePath, parentId, false, content.toString());
						items[item.id] = item;
					} catch (readError) {
						console.error(`Error reading file ${fullPath}:`, readError);
						// Create item with empty content
						const item = createProjectItem(entry, relativePath, parentId, false, '');
						items[item.id] = item;
					}
				}
			} catch (statError) {
				console.error(`Error getting stats for ${fullPath}:`, statError);
			}
		}
	} catch (error) {
		console.error(`Error processing directory ${dirPath}:`, error);
	}

	return items;
}

export async function getProjectVariables(
	projectRootPath: string,
	existingItems?: Record<string, ProjectItem>,
): Promise<Variable[]> {
	const fs = getFileSystem();

	try {
		// First try to read .questions.json
		const questionsPath = `${projectRootPath}/.questions.json`;

		if (await dirExists(questionsPath)) {
			const content = fs.readFileSync(questionsPath, 'utf-8').toString();
			const variables = JSON.parse(content);
			return variables;
		}

		// If .questions.json doesn't exist, scan files for variables
		const items = existingItems || (await makeProjectItems(projectRootPath, projectRootPath));
		const variableSet = new Set<string>();

		// Scan through all file contents to find variables
		Object.values(items).forEach((item) => {
			if (item.type === 'file') {
				const matches = item.content.match(/__[A-Z0-9_]+__/g);
				if (matches) {
					matches.forEach((match) => variableSet.add(match));
				}
			}
		});

		return Array.from(variableSet).map((name) => ({
			name,
			message: `Value for ${name}`,
			required: true,
		}));
	} catch (error) {
		console.error('Error getting project variables:', error);
		return [];
	}
}

export async function setupContractProject({
	config,
	fallbackItems,
}: {
	config: RuntimeConfig;
	fallbackItems?: Record<string, ProjectItem>;
}): Promise<{
	items: Record<string, ProjectItem>;
	variables: Variable[];
	createdAt: number;
	usedFallback?: boolean;
	fallbackReason?: string;
}> {
	const now = Date.now();

	// Increase timeout to 30 seconds for larger tarballs or slower connections
	const DOWNLOAD_TIMEOUT_MS = 30000;

	try {
		// Create a promise that resolves after the timeout
		const timeoutPromise = new Promise<null>((resolve) => {
			setTimeout(() => resolve(null), DOWNLOAD_TIMEOUT_MS);
		});

		const downloadPromise = downloadAndExtractRepo({
			dir: GIT_CONFIG.rootDir,
			s3BaseUrl: config.s3BucketUrl || '',
		}).catch((error) => {
			console.error('Download operation failed:', error);
			return false;
		});

		const result = await Promise.race([downloadPromise, timeoutPromise]);

		// If the result is null, it means the timeout won
		if (result === null) {
			return { items: fallbackItems || {}, variables: fallbackVariables, createdAt: now };
		}

		const projectRootPath = `${GIT_CONFIG.rootDir}${GIT_CONFIG.projectPath}`;
		const items = await makeProjectItems(projectRootPath, projectRootPath);
		const variables = await getProjectVariables(projectRootPath, items);

		return { items, variables, createdAt: now };
	} catch (error) {
		console.error('Error setting up project:', error);
		return { items: fallbackItems || {}, variables: fallbackVariables, createdAt: now };
	}
}

export interface FolderCreationResult {
	parentId: string;
	newFolders: Record<string, FolderItem>;
}

export function ensureParentPathExist(items: Record<string, ProjectItem>, path: string): FolderCreationResult {
	const pathParts = path.split('/').filter(Boolean);
	const newFolders: Record<string, FolderItem> = {};

	let currentPath = '';
	let currentParentId = ROOT_ID;

	for (const part of pathParts.slice(0, -1)) {
		currentPath = currentPath ? `${currentPath}/${part}` : part;

		// Check if folder already exists
		const existingFolder = Object.values(items).find((item) => item.path === currentPath);

		if (!existingFolder) {
			const folderId = nanoid();
			newFolders[folderId] = {
				id: folderId,
				type: 'folder',
				name: part,
				path: currentPath,
				parentId: currentParentId,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};
			currentParentId = folderId;
		} else {
			currentParentId = existingFolder.id;
		}
	}

	return {
		parentId: currentParentId,
		newFolders,
	};
}

function buildTreeNode(
	parentId: string,
	childrenByParent: Record<string, ProjectItem[]>,
	visited: Set<string> = new Set(),
): Node[] {
	// Prevent infinite recursion
	if (visited.has(parentId)) {
		return [];
	}
	visited.add(parentId);

	const children = childrenByParent[parentId] || [];

	// Sort: folders first, then files, both alphabetically
	return children
		.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === 'folder' ? -1 : 1;
			}
			return a.name.localeCompare(b.name);
		})
		.map((item) => ({
			id: item.id,
			name: item.name,
			path: item.path,
			type: item.type,
			children: item.type === 'folder' ? buildTreeNode(item.id, childrenByParent, visited) : undefined,
		}));
}

export function buildFileTree(items: Record<string, ProjectItem>) {
	const childrenByParent: Record<string, ProjectItem[]> = {};

	// Group items by their parent ID, but only if both the item and its parent exist
	Object.values(items).forEach((item) => {
		const parentId = item.parentId || ROOT_ID;
		// Only add the item if its parent exists in items or if it's a root-level item
		if (parentId === ROOT_ID || items[parentId]) {
			if (!childrenByParent[parentId]) {
				childrenByParent[parentId] = [];
			}
			childrenByParent[parentId].push(item);
		}
	});

	// Build tree starting from root
	const rootNodes = buildTreeNode(ROOT_ID, childrenByParent);

	const rootNode: Node = {
		id: ROOT_ID,
		name: 'root',
		path: '',
		type: 'folder',
		children: rootNodes,
	};

	return createTree<Node>({
		nodeToValue: (node: Node) => node.id,
		nodeToString: (node: Node) => node.name,
		nodeToChildren: (node: Node) => node?.children || [],
		rootNode,
	});
}

export const getLanguageFromFileName = (filename: string): string => {
	const extension = filename.split('.').pop()?.toLowerCase() || '';

	const extensionMap: Record<string, string> = {
		// JavaScript family
		ts: 'typescript',
		tsx: 'typescript',
		js: 'javascript',
		jsx: 'javascript',
		mjs: 'javascript',

		// Web
		html: 'html',
		htm: 'html',
		css: 'css',
		scss: 'scss',
		less: 'less',

		// Data formats
		json: 'json',
		jsonc: 'jsonc',
		yaml: 'yaml',
		yml: 'yaml',
		xml: 'xml',

		// Markdown
		md: 'markdown',
		markdown: 'markdown',

		// Programming languages
		py: 'python',
		java: 'java',
		cpp: 'cpp',
		c: 'c',
		cs: 'csharp',
		go: 'go',
		rs: 'rust',
		php: 'php',
		rb: 'ruby',
		sql: 'sql',

		// Shell scripts
		sh: 'shell',
		bash: 'shell',

		// Config files
		conf: 'plaintext',
		config: 'plaintext',
		env: 'plaintext',
	};

	return extensionMap[extension] || 'plaintext';
};

export function validateTreeViewItemName(
	items: Record<string, ProjectItem>,
	newName: string,
	path: string,
	excludeId?: string,
): { isValid: boolean; error?: string } {
	// Check for empty or whitespace-only names
	if (!newName || !newName.trim()) {
		return { isValid: false, error: 'Name cannot be empty' };
	}

	// Check for special characters
	const validNameRegex = /^[a-zA-Z0-9_.-]+$/;
	if (!validNameRegex.test(newName)) {
		return {
			isValid: false,
			error: 'Name can only contain letters, numbers, dots, dashes and underscores',
		};
	}

	// Get the parent directory path
	const parentPath = getParentPath(path);

	// Check for duplicates in the same directory
	const siblingItems = Object.values(items).filter((item) => {
		const itemParentPath = getParentPath(item.path);
		return itemParentPath === parentPath && item.id !== excludeId;
	});

	const isDuplicate = siblingItems.some((item) => item.name.toLowerCase() === newName.toLowerCase());
	if (isDuplicate) {
		return {
			isValid: false,
			error: `Name already exists in this location`,
		};
	}

	return { isValid: true };
}

export interface BuildResult {
	success: boolean;
	outputFiles?: esbuild.OutputFile[];
	error?: string;
}

function resolveImportPath(importPath: string, currentDir: string): string {
	// Remove './' prefix if exists
	const cleanPath = importPath.replace(/^\.\//, '');
	// Join with current directory
	return currentDir ? `${currentDir}/${cleanPath}` : cleanPath;
}

// Add a logger to allow for better debugging
const logger = {
	debug: (message: string, ...args: any[]) => {
		if (process.env.NODE_ENV === 'development') {
			console.debug(`[Contract Build] ${message}`, ...args);
		}
	},
	info: (message: string, ...args: any[]) => {
		console.log(`[Contract Build] ${message}`, ...args);
	},
	warn: (message: string, ...args: any[]) => {
		console.warn(`[Contract Build] ${message}`, ...args);
	},
	error: (message: string, ...args: any[]) => {
		console.error(`[Contract Build] ${message}`, ...args);
	},
};

// Add a build cache to avoid rebuilding unchanged files
const buildCache = new Map<
	string,
	{
		hash: string;
		result: esbuild.BuildResult;
		timestamp: number;
	}
>();

// Add cache size control
const MAX_CACHE_ITEMS = 50; // Maximum number of cached builds

function pruneCache() {
	if (buildCache.size <= MAX_CACHE_ITEMS) return;

	// Convert to array, sort by timestamp (oldest first), and delete oldest entries
	const entries = Array.from(buildCache.entries());
	entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

	const itemsToRemove = entries.slice(0, entries.length - MAX_CACHE_ITEMS);
	itemsToRemove.forEach(([key]) => buildCache.delete(key));

	logger.debug(`Pruned ${itemsToRemove.length} items from build cache`);
}

// Function to create a simple hash of file content
function createContentHash(files: Map<string, string>, config: BuildConfig): string {
	const relevantFiles = new Set<string>();

	// Helper to collect dependent files
	function collectDependencies(filePath: string) {
		if (relevantFiles.has(filePath) || !files.has(filePath)) return;

		relevantFiles.add(filePath);
		const content = files.get(filePath) || '';

		// Very basic import extraction - in a real app we'd use a proper parser
		const importRegex = /import\s+.*?from\s+['"](\.\/[^'"]+)['"]/g;
		let match;

		while ((match = importRegex.exec(content)) !== null) {
			const importPath = match[1];
			const resolvedPath = resolveImportPath(importPath, getParentPath(filePath));

			// Try different path variations
			const variations = [resolvedPath, resolvedPath + '.ts', resolvedPath + '/index.ts'];

			for (const path of variations) {
				if (files.has(path)) {
					collectDependencies(path);
					break;
				}
			}
		}
	}

	// Start with the entry file
	collectDependencies(config.entryFile);

	// Create a combined string of all file contents in a deterministic order
	const orderedFiles = Array.from(relevantFiles).sort();
	const contentString = orderedFiles.map((path) => `${path}:${files.get(path)}`).join('');

	// Use a simple hash function - in production, use a proper hashing algorithm
	let hash = 0;
	for (let i = 0; i < contentString.length; i++) {
		const char = contentString.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}

	// Include config in the hash
	const configString = JSON.stringify(config);
	for (let i = 0; i < configString.length; i++) {
		const char = configString.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}

	return hash.toString(16);
}

function validateEntryPoints(
	items: Record<string, ProjectItem>,
	buildConfigs: BuildConfig[],
): { isValid: boolean; error?: string } {
	if (buildConfigs.length === 0) {
		return { isValid: false, error: 'No build configurations provided' };
	}

	// Check for duplicate output files
	const outputFiles = new Set<string>();
	const duplicateOutputs: string[] = [];

	buildConfigs.forEach((config) => {
		if (outputFiles.has(config.outFile)) {
			duplicateOutputs.push(config.outFile);
		} else {
			outputFiles.add(config.outFile);
		}
	});

	if (duplicateOutputs.length > 0) {
		return {
			isValid: false,
			error: `Duplicate output files detected: ${duplicateOutputs.join(', ')}`,
		};
	}

	// Check if entry points exist and are TypeScript files
	const invalidEntryPoints = buildConfigs.filter((config) => {
		const file = Object.values(items).find((item) => item.type === 'file' && item.path === config.entryFile);
		return !file || !file.name.endsWith('.ts');
	});

	if (invalidEntryPoints.length > 0) {
		return {
			isValid: false,
			error: `Invalid entry points: ${invalidEntryPoints.map((c) => c.entryFile).join(', ')}`,
		};
	}

	return { isValid: true };
}

// Improve the createVirtualFileSystem function to optimize memory usage
function createVirtualFileSystem(items: Record<string, ProjectItem>): Map<string, string> {
	const files = new Map<string, string>();

	// Only include TypeScript, JavaScript, and JSON files to save memory
	const relevantExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];

	for (const item of Object.values(items)) {
		if (item.type !== 'file') continue;

		const extension = item.name.substring(item.name.lastIndexOf('.'));
		if (relevantExtensions.includes(extension)) {
			files.set(item.path, item.content);
		}
	}

	logger.debug(`Added ${files.size} files to virtual filesystem`);
	return files;
}

function createVirtualFsPlugin(files: Map<string, string>): Plugin {
	return {
		name: 'virtual-fs',
		setup(build: PluginBuild) {
			// Handle entry points and relative imports
			build.onResolve({ filter: /.*/ }, (args) => {
				const isEntryPoint = args.kind === 'entry-point';
				const isRelativeImport = args.path.startsWith('.');

				if (!isEntryPoint && !isRelativeImport) {
					return { path: args.path, external: true };
				}

				let currentDir = '';
				let targetPath = args.path;

				if (isEntryPoint) {
					currentDir = getParentPath(args.path);
				} else {
					// For relative imports
					currentDir = getParentPath(args.importer);
					targetPath = resolveImportPath(args.path, currentDir);
				}

				// Try different path variations
				const variations = [targetPath, targetPath + '.ts', targetPath + '/index.ts'];

				for (const path of variations) {
					if (files.has(path)) {
						return {
							path,
							namespace: 'virtual-fs',
							pluginData: {
								currentDir: getParentPath(path),
							},
						};
					}
				}

				console.warn('Resolution failed:', {
					original: args.path,
					currentDir,
					targetPath,
					variations,
					available: Array.from(files.keys()),
				});

				return { path: args.path, external: true };
			});

			build.onLoad({ filter: /.*/, namespace: 'virtual-fs' }, (args) => {
				const contents = files.get(args.path);
				if (!contents) {
					console.warn('File not found:', args.path);
					return { contents: '', loader: 'ts' };
				}

				return {
					contents,
					loader: 'ts',
					resolveDir: args.pluginData?.currentDir || getParentPath(args.path),
				};
			});
		},
	};
}

async function bundleTsFiles(config: BuildConfig, virtualFsPlugin: Plugin): Promise<esbuild.BuildResult> {
	return esbuild.build({
		entryPoints: [config.entryFile],
		outfile: config.outFile,
		bundle: true,
		format: 'esm',
		target: 'es2022',
		write: false,
		external: config.externalPackages || [],
		plugins: [virtualFsPlugin],
	});
}

export async function buildContracts(
	items: Record<string, ProjectItem>,
	buildConfigs: BuildConfig[],
): Promise<BuildResult> {
	const startTime = performance.now();
	logger.info(`Starting build for ${buildConfigs.length} configurations`);

	// Early return for empty configs
	if (buildConfigs.length === 0) {
		return {
			success: false,
			error: 'No build configurations provided',
		};
	}

	try {
		// 1. Validate entry points
		const validation = validateEntryPoints(items, buildConfigs);
		if (!validation.isValid) {
			logger.warn(`Validation failed: ${validation.error}`);
			return {
				success: false,
				error: validation.error,
			};
		}

		// 2. Initialize esbuild
		logger.debug('Initializing esbuild');
		await esbuildInitializer.initialize();
		if (!esbuildInitializer.isInitialized()) {
			const error = esbuildInitializer.getError() || 'Failed to initialize esbuild';
			logger.error(`esbuild initialization failed: ${error}`);
			return {
				success: false,
				error,
			};
		}

		// 3. Setup virtual filesystem
		logger.debug('Setting up virtual filesystem');
		const files = createVirtualFileSystem(items);
		const virtualFsPlugin = createVirtualFsPlugin(files);

		// 4. Check cache and build configs that changed
		const now = Date.now();
		const cacheTimeout = 5 * 60 * 1000; // 5 minutes cache lifetime

		let cacheHits = 0;
		let cacheMisses = 0;

		// Separate configs into cached and need-to-build
		const buildTasks = buildConfigs.map((config) => {
			const hash = createContentHash(files, config);
			const cacheKey = `${config.entryFile}:${config.outFile}`;
			const cached = buildCache.get(cacheKey);

			// Use cache if valid and not expired
			if (cached && cached.hash === hash && now - cached.timestamp < cacheTimeout) {
				logger.debug(`Cache hit for ${config.entryFile}`);
				cacheHits++;
				return Promise.resolve(cached.result);
			}

			// Otherwise build and update cache
			logger.debug(`Cache miss for ${config.entryFile}, building`);
			cacheMisses++;
			return bundleTsFiles(config, virtualFsPlugin).then((result) => {
				buildCache.set(cacheKey, { hash, result, timestamp: now });
				return result;
			});
		});

		logger.info(`Build stats: ${cacheHits} cache hits, ${cacheMisses} cache misses`);

		// Clean up cache if it's getting too large
		pruneCache();

		// 5. Run all build tasks with enhanced error handling
		logger.debug('Running build tasks');
		const buildResults = await Promise.allSettled(buildTasks);

		// 6. Check for any failures and collect detailed error information
		const failures = buildResults.filter((result): result is PromiseRejectedResult => result.status === 'rejected');

		if (failures.length > 0) {
			logger.error(`${failures.length} build tasks failed`);
			const errorMessages = failures.map((failure) => {
				const error = failure.reason;
				// Extract relevant error details for better diagnostics
				if (error?.errors?.length > 0) {
					return error.errors
						.map(
							(e: any) =>
								`${e.text} (${e.location?.file || 'unknown'}:${e.location?.line || '?'}:${e.location?.column || '?'})`,
						)
						.join('\n');
				}
				return error instanceof Error ? error.message : String(error);
			});

			return {
				success: false,
				error: `Build failed with errors:\n${errorMessages.join('\n')}`,
			};
		}

		// 7. Process successful results
		const fulfilledResults = buildResults.filter(
			(result): result is PromiseFulfilledResult<esbuild.BuildResult> => result.status === 'fulfilled',
		);

		const outputFiles = fulfilledResults.flatMap(
			(result) =>
				result.value.outputFiles?.map((file) => ({
					...file,
					text: file.text.replace(/\/\/ virtual-fs:/g, '// '),
				})) || [],
		);

		// 8. Generate source snapshots for each build config and store them
		logger.info('Generating source snapshots');

		contractSourceStoreActions.clearAllSourceFiles();

		const sourceCollector = new SourceCollector();
		const allSourceFiles = Object.values(items)
			.filter((item) => item.type === 'file')
			.map((item) => ({ path: item.path, content: item.content }));

		for (const config of buildConfigs) {
			try {
				const sourceFiles = sourceCollector.collect(config.entryFile, allSourceFiles);
				contractSourceStoreActions.saveSourceFiles(config.outFile, sourceFiles);
				logger.info(`Generated source snapshot for ${config.entryFile} with ${Object.keys(sourceFiles).length} files`);
			} catch (error) {
				logger.warn(`Failed to generate source snapshot for ${config.entryFile}:`, error);
				// Continue with other configs even if one fails
			}
		}

		// Return success only if we have output files
		if (outputFiles.length === 0) {
			logger.warn('No output files were generated');
			return {
				success: false,
				error: 'Build completed but no output files were generated',
			};
		}

		const endTime = performance.now();
		logger.info(
			`Build completed successfully in ${Math.round(endTime - startTime)}ms, generated ${outputFiles.length} files`,
		);

		return {
			success: true,
			outputFiles,
		};
	} catch (error) {
		logger.error('Build error:', error);

		// Enhanced error reporting
		let errorMessage = 'Unknown build error';

		if (error instanceof Error) {
			errorMessage = error.message;

			// Add more context for specific error types
			if ('code' in error) {
				const errorCode = (error as any).code;
				if (errorCode === 'ENOENT') {
					errorMessage = `File not found: ${errorMessage}`;
				}
			}

			// Include stack trace in console but not in the returned error
			logger.debug('Build error stack:', error.stack);
		}

		return {
			success: false,
			error: errorMessage,
		};
	} finally {
		// Cleanup any resources if needed
	}
}

function extractConfigsFromDecl(declarations: VariableDeclarator[]): BuildConfig[] | null {
	for (const decl of declarations) {
		if (decl.id?.type === 'Identifier' && decl.id.name === 'configs' && decl.init?.type === 'ArrayExpression') {
			return decl.init.elements.map((el) => {
				if (!el || el.type !== 'ObjectExpression') {
					throw new Error('Each config must be an object');
				}
				return Object.fromEntries(
					el.properties.map((prop: any) => [
						prop.key.name,
						prop.value.type === 'Literal'
							? prop.value.value
							: prop.value.type === 'ArrayExpression'
								? prop.value.elements?.map((e: any) => e.value)
								: undefined,
					]),
				);
			});
		}
	}
	return null;
}

interface BuildConfig {
	entryFile: string;
	outFile: string;
	externalPackages?: string[];
}

function validateConfig(config: Record<string, unknown>, index: number): BuildConfig | string {
	// Validate entryFile
	if (!config.entryFile || typeof config.entryFile !== 'string') {
		return `Config at index ${index}: "entryFile" not found or invalid`;
	}

	// Validate outFile
	if (!config.outFile || typeof config.outFile !== 'string') {
		return `Config at index ${index}: "outFile" not found or invalid`;
	}

	// Validate outFile is in dist directory, has a filename, and ends with .js
	const normalizedOutFile = normalizePath(config.outFile);
	if (!normalizedOutFile.startsWith('dist/')) {
		return `Config at index ${index}: "outFile" must be a file inside the dist directory`;
	}
	if (!normalizedOutFile.endsWith('.js')) {
		return `Config at index ${index}: "outFile" must have a .js extension`;
	}

	// Validate externalPackages if present
	if (config.externalPackages !== undefined) {
		if (
			!Array.isArray(config.externalPackages) ||
			!config.externalPackages.every((pkg: string) => typeof pkg === 'string')
		) {
			return `Config at index ${index}: "externalPackages" must be an array of strings`;
		}
	}

	return {
		entryFile: config.entryFile,
		outFile: config.outFile,
		externalPackages: config.externalPackages as string[] | undefined,
	};
}

interface ParseResult {
	success: boolean;
	configs?: BuildConfig[];
	error?: string;
}

export async function parseConfigFile(content: string): Promise<ParseResult> {
	try {
		await esbuildInitializer.initialize();

		if (!esbuildInitializer.isInitialized()) {
			return {
				success: false,
				error: esbuildInitializer.getError() || 'Failed to initialize esbuild',
			};
		}

		const { code } = await esbuild.transform(content, {
			loader: 'ts',
			format: 'esm',
			target: 'es2022',
			minify: false,
		});

		const ast = parse(code, {
			sourceType: 'module',
			ecmaVersion: 'latest',
		});

		let configs: BuildConfig[] | null = null;

		walk.simple(ast, {
			// match "const configs = [/* ... */]"
			VariableDeclaration(node: any) {
				configs = extractConfigsFromDecl(node.declarations) || configs;
			},
			// match "export const configs = [/* ... */]"
			ExportNamedDeclaration(node: any) {
				if (node.declaration?.type === 'VariableDeclaration') {
					configs = extractConfigsFromDecl(node.declaration.declarations) || configs;
				}
			},
		});

		if (!configs) {
			return {
				success: false,
				error: 'Config must export an array named "configs"',
			};
		}

		const validatedConfigs: BuildConfig[] = [];
		const errors: string[] = [];

		// Ensure configs is treated as an array
		const configsArray: Record<string, unknown>[] = configs;

		for (let i = 0; i < configsArray.length; i++) {
			const config = configsArray[i];
			const result = validateConfig(config, i);
			if (typeof result === 'string') {
				errors.push(result);
			} else {
				validatedConfigs.push(result);
			}
		}

		if (errors.length > 0) {
			return {
				success: false,
				error: errors.join('\n'),
			};
		}

		return {
			success: true,
			configs: validatedConfigs,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to parse config file',
		};
	}
}

export const exportProjectAsZip = async (
	items: Record<string, ProjectItem>,
	variables: Variable[] = [],
	zipName: string = 'hyperweb.zip',
): Promise<void> => {
	// Check if there are any files to export
	const fileItems = Object.values(items).filter((item) => item.type === 'file');
	if (fileItems.length === 0) {
		throw new Error('No files to export. Project appears to be empty.');
	}

	try {
		const JSZip = (await import('jszip')).default;
		const saveAs = (await import('file-saver')).default;

		const zip = new JSZip();

		// Create a set of folder paths to ensure we create all necessary directories
		const folderPaths = new Set<string>();

		// First, collect all folder paths that need to be created
		Object.values(items).forEach((item) => {
			if (item.type === 'folder') {
				folderPaths.add(item.path);
			} else if (item.type === 'file') {
				// Also add parent directories for files
				const pathParts = item.path.split('/');
				if (pathParts.length > 1) {
					// Create parent paths (excluding the file name)
					let currentPath = '';
					for (let i = 0; i < pathParts.length - 1; i++) {
						if (currentPath) {
							currentPath += '/';
						}
						currentPath += pathParts[i];
						folderPaths.add(currentPath);
					}
				}
			}
		});

		// Explicitly create all folders to ensure proper directory structure
		folderPaths.forEach((folderPath) => {
			// Add trailing slash to signify a directory to JSZip
			zip.folder(folderPath);
		});

		// Create a map of variable names to their values for quick lookup
		const variableValues = new Map(variables.map((v) => [v.name, v.value]));

		// Add all files to zip maintaining folder structure
		Object.values(items).forEach((item) => {
			if (item.type === 'file') {
				// Replace variables in the content with their values
				let processedContent = item.content;
				if (variableValues.size > 0) {
					// Replace all variables that have values
					for (const [name, value] of variableValues) {
						if (value) {
							const regex = new RegExp(name, 'g');
							processedContent = processedContent.replace(regex, value);
						}
					}
				}

				// Add the processed file to the zip at its path location
				zip.file(item.path, processedContent);
			}
		});

		// Generate the zip file and trigger download
		const content = await zip.generateAsync({
			type: 'blob',
			compression: 'DEFLATE', // Use compression for smaller file size
			compressionOptions: {
				level: 6, // Balance between size and speed (1-9)
			},
		});

		// Trigger download
		saveAs(content, zipName);
	} catch (error) {
		console.error('Error exporting project:', error);
		throw new Error(error instanceof Error ? error.message : 'Failed to export project');
	}
};

export const getOutputJsContracts = (items: Record<string, ProjectItem>, outputPath: string = 'dist/') => {
	return Object.values(items).filter(
		({ path, type }) => type === 'file' && path.startsWith(outputPath) && path.endsWith('.js'),
	) as FileItem[];
};

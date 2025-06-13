import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Editor as MonacoEditor, OnMount } from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';
import type * as monaco from 'monaco-editor';
import { useTheme } from 'next-themes';

import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

import { useContractProject } from './hooks/use-contract-project';
import { DependencyManager, OMIT_PACKAGES } from './services/dependency-manager/index';
import { initializeFs } from './services/fs';
import { tsRunner } from './ts-runner';

type MonacoEditorInstance = Parameters<OnMount>[0];
type MonacoNamespace = typeof monaco;

interface ContractSourceViewerProps {
	value?: string;
	onChange?: (value: string | undefined) => void;
	language?: string;
	readOnly?: boolean;
	className?: string;
	onTranspiled?: (code: string) => void;
	isOutput?: boolean;
	onSaveChanges?: () => void;
	fileId?: string;
}

export const ContractSourceViewer = memo(function ContractSourceViewer({
	value = '',
	onChange,
	language = 'typescript',
	readOnly = false,
	className,
	onTranspiled,
	isOutput = false,
	onSaveChanges,
	fileId,
}: ContractSourceViewerProps) {
	const { theme } = useTheme();
	const [editorValue, setEditorValue] = useState(value);
	const editorRef = useRef<MonacoEditorInstance | null>(null);
	const monacoRef = useRef<MonacoNamespace | null>(null);
	const dependencyManagerRef = useRef<DependencyManager | null>(null);
	const [packageJsonContent, setPackageJsonContent] = useState<string | null>(null);
	const [isManagerInitialized, setIsManagerInitialized] = useState(false);

	// Get project items and initialization status from Zustand store
	const { getItemByPath, initializationStatus } = useContractProject();

	const prevFileIdRef = useRef<string | undefined>(fileId);
	const isFileChanged = prevFileIdRef.current !== fileId;

	// Function to create file content resolver that handles both absolute and relative paths
	const createFileContentResolver = useCallback(() => {
		return async (filePath: string): Promise<{ content: string; actualPath: string } | undefined> => {
			logger.info(`Resolving content for file: ${filePath}`);

			// Helper to get just the filename from a path (strip directories)
			const getBasename = (path: string): string => {
				// Remove any Monaco editor prefix
				const cleanPath = path
					.replace(/^inmemory:\/+model\/+/, '') // Remove standard Monaco prefix
					.replace(/^inmemory:\/+/, ''); // Remove any other inmemory:/ prefix
				// Get just the filename
				return cleanPath.split('/').pop() || cleanPath;
			};

			// Helper to remove file extension
			const removeExtension = (filename: string): string => {
				return filename.replace(/\.(ts|tsx|js|jsx|d\.ts)$/, '');
			};

			// Normalize Monaco paths for consistent lookup
			const normalizeMonacoPath = (p: string): string => {
				return p
					.replace(/^inmemory:\/+model\/+/, '') // Remove standard Monaco prefix
					.replace(/^inmemory:\/+/, ''); // Remove any other inmemory:/ prefix
			};

			// Normalize the input path
			const normalizedFilePath = normalizeMonacoPath(filePath);
			logger.info(`Normalized path for lookup: ${normalizedFilePath}`);

			// Try different strategies to find the file

			// 1. Try exact path first
			let fileItem = getItemByPath(normalizedFilePath, 'file');

			// 2. Try normalized path (remove leading slashes)
			if (!fileItem) {
				const pathWithoutLeadingSlash = normalizedFilePath.replace(/^[/\\]+/, '');

				fileItem = getItemByPath(pathWithoutLeadingSlash, 'file');

				// 3. Try adding .ts extension if not present
				if (!fileItem && !pathWithoutLeadingSlash.includes('.')) {
					const withTsExt = `${pathWithoutLeadingSlash}.ts`;
					fileItem = getItemByPath(withTsExt, 'file');

					// 4. Try with .tsx extension
					if (!fileItem) {
						const withTsxExt = `${pathWithoutLeadingSlash}.tsx`;
						fileItem = getItemByPath(withTsxExt, 'file');
					}
				}
			}

			// 5. Try searching by filename as a last resort
			if (!fileItem) {
				const filename = getBasename(normalizedFilePath);
				const filenameWithoutExt = removeExtension(filename);

				// Look for file by iterating through all project items
				const { items } = useContractProject.getState();

				// Find files that match the basename
				const matchingFiles = Object.values(items).filter((item) => {
					if (item.type !== 'file') return false;

					const itemBasename = getBasename(item.path);
					const itemBasenameWithoutExt = removeExtension(itemBasename);

					// Match with or without extension
					return itemBasename === filename || itemBasenameWithoutExt === filenameWithoutExt;
				});

				// If we found exactly one matching file, use it
				if (matchingFiles.length === 1) {
					fileItem = matchingFiles[0] as any;
					logger.info(`Found file by basename: ${fileItem!.path}`);
				} else if (matchingFiles.length > 1) {
					// If multiple files match the basename, check for the correct extension
					const matchingFileWithExt = matchingFiles.find((item) => {
						const itemBasename = getBasename(item.path);
						return itemBasename === filename;
					});

					if (matchingFileWithExt) {
						fileItem = matchingFileWithExt as any;
						logger.info(`Found file with matching extension: ${fileItem!.path}`);
					} else {
						// If still ambiguous, try to find a match in a similar directory
						logger.warn(`Multiple matching files found for ${filename}, using first match`);
						fileItem = matchingFiles[0] as any;
					}
				}
			}

			if (fileItem) {
				logger.info(`Resolved file from project store: ${fileItem.path}`);
				// Return both the content and the actual path where the file was found
				return {
					content: fileItem.content,
					actualPath: fileItem.path,
				};
			}

			logger.warn(`File not found in project store: ${filePath}`);
			return undefined;
		};
	}, [getItemByPath]);

	// --- Initialize ZenFS (Run once on mount) ---
	useEffect(() => {
		let isMounted = true;
		// Note: useContractProject also calls initializeFs. Ensure this doesn't cause issues.
		// Assuming explicit call needed here and it doesn't cost anything to call it if already initialized
		initializeFs()
			.then(() => {
				if (isMounted) logger.info('ZenFS initialized for ContractSourceViewer.');
			})
			.catch((error) => {
				if (isMounted) logger.error('Failed to initialize ZenFS:', error);
			});
		return () => {
			isMounted = false;
		};
	}, []);

	// --- Initialize SWC (Run once on mount) ---
	useEffect(() => {
		tsRunner.initialize().catch((error) => {
			logger.error('Failed to initialize SWC:', error);
		});
	}, []);

	// --- Get package.json content when project is initialized ---
	useEffect(() => {
		if (initializationStatus === 'initialized') {
			const pkgJsonFile = getItemByPath('package.json', 'file');
			if (pkgJsonFile) {
				setPackageJsonContent(pkgJsonFile.content);
				logger.info('Retrieved package.json content.');
			} else {
				logger.warn('package.json not found in project items.');
				setPackageJsonContent(null); // Ensure it's null if not found
			}
		}
	}, [initializationStatus, getItemByPath]); // Rerun when project status changes

	// --- Editor/Manager Setup ---
	const handleEditorDidMount: OnMount = useCallback(
		async (editor, monacoInstance) => {
			editorRef.current = editor;
			monacoRef.current = monacoInstance; // Store monaco instance

			// Set compiler options (as before)
			monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
				target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
				allowNonTsExtensions: true,
				moduleResolution: monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
				module: monacoInstance.languages.typescript.ModuleKind.ESNext,
				noEmit: true,
				esModuleInterop: true,
				jsx: monacoInstance.languages.typescript.JsxEmit.React,
				strict: true,
				strictNullChecks: true,
			});

			// --- Initialize Dependency Manager ---
			try {
				logger.info('Creating DependencyManager...');

				// Use DependencyManager.create with file content resolver
				const manager = await DependencyManager.create(editor, {
					monaco: monacoInstance,
					// Provide logging callbacks with explicit types
					onError: (err: unknown) => logger.error('DepManager Error:', err),
					onUpdate: (_: unknown, text: string) => logger.info('DepManager:', text),
					// Add our custom file content resolver
					fileContentResolver: createFileContentResolver(),
				});
				dependencyManagerRef.current = manager;
				setIsManagerInitialized(true); // Signal manager is ready
				logger.info('DependencyManager created successfully.');

				// Set up content change listener for relative imports
				manager.setupContentChangeListener();

				// Trigger initial import resolution for relative imports in current file
				if (value && value.length > 0) {
					logger.info('Triggering initial fetchAndApplyTypes for relative imports...');
					manager.fetchAndApplyTypes().catch((error) => {
						logger.error('Error during initial fetchAndApplyTypes:', error);
					});
				}
			} catch (error) {
				logger.error('Failed to create DependencyManager:', error);
				setIsManagerInitialized(false); // Ensure state reflects failure
			}

			// Set initial value
			editor.setValue(value);
			prevFileIdRef.current = fileId;
		},
		[value, fileId, createFileContentResolver],
	);

	// --- Fetch types using package.json ---
	useEffect(() => {
		const manager = dependencyManagerRef.current;
		// Only run if manager is initialized AND we have package.json content
		if (isManagerInitialized && manager && packageJsonContent !== null) {
			logger.info('Triggering resolveImportsFromPackageJsonRoot...');
			manager
				.resolveImportsFromPackageJsonRoot(packageJsonContent, OMIT_PACKAGES)
				.then(() => {
					logger.info('resolveImportsFromPackageJsonRoot completed.');
				})
				.catch((error: unknown) => {
					logger.error('Error during resolveImportsFromPackageJsonRoot:', error);
				});
		} else if (isManagerInitialized && packageJsonContent === null) {
			logger.warn('DependencyManager is initialized, but package.json content is not available. Skipping fetch.');
		}
	}, [isManagerInitialized, packageJsonContent]); // Run when manager status or pkg content changes

	// --- Cleanup Dependency Manager ---
	useEffect(() => {
		// Return cleanup function
		return () => {
			if (dependencyManagerRef.current) {
				logger.info('Disposing DependencyManager...');
				// Call dispose on DependencyManager instance
				dependencyManagerRef.current.dispose();
				dependencyManagerRef.current = null;
				setIsManagerInitialized(false); // Reset status on unmount
				logger.info('DependencyManager disposed.');
			}
		};
	}, []); // Empty dependency array ensures this runs only on unmount

	// --- Handle external value/file changes ---
	// only perform a full reset when switching between different files
	useEffect(() => {
		if (isFileChanged && editorRef.current && fileId) {
			// When switching files, need to reset and re-initialize DependencyManager
			// to handle relative imports in the new file context
			if (dependencyManagerRef.current) {
				// Dispose of old manager
				dependencyManagerRef.current.dispose();

				// Reinitialize with the new file
				if (monacoRef.current && editorRef.current) {
					DependencyManager.create(editorRef.current, {
						monaco: monacoRef.current,
						onError: (err: unknown) => logger.error('DepManager Error:', err),
						onUpdate: (_: unknown, text: string) => logger.info('DepManager:', text),
						fileContentResolver: createFileContentResolver(),
					})
						.then((manager) => {
							dependencyManagerRef.current = manager;

							// Set up content change listener
							manager.setupContentChangeListener();

							// Trigger import resolution for the new file
							manager.fetchAndApplyTypes().catch((error) => {
								logger.error('Error during file change fetchAndApplyTypes:', error);
							});
						})
						.catch((error) => {
							logger.error('Failed to recreate DependencyManager after file change:', error);
						});
				}
			}

			editorRef.current.setValue(value);
			prevFileIdRef.current = fileId;
		} else {
			setEditorValue(value);
		}
	}, [value, fileId, isFileChanged, createFileContentResolver]);

	// --- Handle editor content changes ---
	const handleEditorChange = useCallback(
		(newValue: string | undefined) => {
			if (newValue === undefined || isOutput) return;

			setEditorValue(newValue);
			onChange?.(newValue);

			// Transpile logic (as before)
			if (!isOutput) {
				const result = tsRunner.transpile(newValue);
				if (result.success && result.code) {
					onTranspiled?.(result.code);
				}
			}

			// Note: We don't need to call fetchAndApplyTypes here since it's already
			// handled by the content change listener set up in setupContentChangeListener.
			// The listener uses debouncing to prevent too frequent calls.
		},
		[isOutput, onChange, onTranspiled],
	);

	// --- Handle save shortcut ---
	const handleSaveShortcut = useCallback(
		(e: KeyboardEvent) => {
			const isSaveKey = e.key === 's' && (e.metaKey || e.ctrlKey);
			if (isSaveKey && !readOnly && onSaveChanges) {
				e.preventDefault();
				onSaveChanges();
				// You might re-trigger package.json fetch *if* saving could have changed it,
				// or trigger fetchAndApplyTypes if saving implies code might use new imports.
				// Example: dependencyManagerRef.current?.fetchAndApplyTypes();
			}
		},
		[readOnly, onSaveChanges],
	);

	useEffect(() => {
		window.addEventListener('keydown', handleSaveShortcut);
		return () => {
			window.removeEventListener('keydown', handleSaveShortcut);
		};
	}, [handleSaveShortcut]);

	// --- Render ---
	return (
		<div className={cn('relative h-full w-full', className)} data-testid='contract-source-viewer'>
			<MonacoEditor
				height='100%'
				width='100%'
				language={language}
				theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
				value={editorValue}
				onChange={handleEditorChange}
				onMount={handleEditorDidMount}
				key={fileId}
				loading={
					<div className='absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm'>
						<Loader2 className='h-6 w-6 animate-spin text-zinc-400' />
					</div>
				}
				options={{
					readOnly,
					minimap: {
						enabled: true,
						maxColumn: 120,
						renderCharacters: false,
						scale: 1,
						showSlider: 'mouseover',
						size: 'proportional',
						side: 'right',
					},
					fontSize: 14,
					lineNumbers: 'on',
					roundedSelection: true,
					scrollBeyondLastLine: true,
					padding: { top: 16, bottom: 16 },
					cursorStyle: 'line',
					automaticLayout: true,
					wordWrap: 'on',
					scrollbar: {
						vertical: 'visible',
						horizontal: 'visible',
						useShadows: false,
						verticalScrollbarSize: 10,
						horizontalScrollbarSize: 10,
					},
				}}
				className='rounded-md'
			/>
		</div>
	);
});

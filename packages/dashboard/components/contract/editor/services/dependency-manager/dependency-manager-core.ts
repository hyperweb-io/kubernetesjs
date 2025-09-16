import * as path from 'path';
import type * as monaco from 'monaco-editor';

import { logger } from '@/lib/logger';

import { DependencyManagerOptions, SourceCache, SourceResolver } from './dependency-manager.types';
import { HttpRequestsCache } from './http-requests-cache';
import { ImportResolver } from './import-resolver';
import { invokeUpdate } from './invoke-update';
import { RecursionDepth } from './recursion-depth';
import { ResolutionCache } from './resolution-cache';
import { UnpkgResolver } from './unpkg-resolver';
import { ZenFsCache } from './zenfs-cache';

type Editor = monaco.editor.ICodeEditor | monaco.editor.IStandaloneCodeEditor;

export class DependencyManagerCore implements monaco.IDisposable {
	private importResolver: ImportResolver;
	private isResolving?: boolean;
	private isResolvingPackageJson?: boolean;
	private disposables: monaco.IDisposable[];
	private debounceTimer?: ReturnType<typeof setTimeout>;
	private verbose: boolean;

	public constructor(
		private editor: Editor,
		private options: DependencyManagerOptions,
	) {
		this.disposables = [];
		this.verbose = options.verbose ?? false;
		this.importResolver = new ImportResolver(options);

		// Eagerly load node types for globals like `__dirname`
		this.importResolver.preloadNodeTypes();

		if (!options.dontAdaptEditorOptions) {
			options.monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
				...options.monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
				moduleResolution: options.monaco.languages.typescript.ModuleResolutionKind.NodeJs,
				allowSyntheticDefaultImports: true,
				rootDir: options.fileRootPath,
			});
		}
	}

	public static async create(
		editor: Editor,
		options?: Partial<DependencyManagerOptions>,
	): Promise<DependencyManagerCore> {
		const monacoInstance = options?.monaco;

		if (!monacoInstance) {
			throw new Error('monacoInstance not found, you can specify the monaco instance via options.monaco');
		}

		// Set verbosity on singleton caches
		HttpRequestsCache.getInstance().setVerbose(!!options?.verbose);
		ZenFsCache.getInstance().setVerbose(!!options?.verbose);
		ResolutionCache.getInstance().setVerbose(!!options?.verbose);

		// --- Source Resolver Setup ---
		let sourceResolverToUse: SourceResolver;
		if (options?.sourceResolver) {
			sourceResolverToUse = options.sourceResolver;
		} else {
			// Resolvers now get cache from singleton
			sourceResolverToUse = new UnpkgResolver(options?.verbose);
		}

		return new DependencyManagerCore(editor, {
			fileRootPath: 'inmemory://model/',
			onlySpecifiedPackages: false,
			preloadPackages: false,
			shareCache: true,
			dontAdaptEditorOptions: false,
			dontRefreshModelValueAfterResolvement: false,
			verbose: false,
			sourceResolver: sourceResolverToUse,
			debounceDuration: 500,
			fileRecursionDepth: 5,
			packageRecursionDepth: 1,
			...options,
			monaco: monacoInstance,
		});
	}

	public dispose() {
		for (const disposable of this.disposables) {
			disposable.dispose();
		}

		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
			this.debounceTimer = undefined;
		}
	}

	public setVersions(versions: { [packageName: string]: string }) {
		this.importResolver.setVersions(versions);
		this.options.versions = versions;
	}

	public async clearCache() {
		// Clear both singleton caches
		HttpRequestsCache.getInstance().clear();
		ResolutionCache.getInstance().clear();
		await ZenFsCache.getInstance().clear();
	}

	public setupContentChangeListener() {
		const model = this.editor.getModel();
		if (!model) {
			if (this.verbose) {
				logger.error('DepManager: No model found on editor for content change listener.');
			}
			return;
		}

		// Set up the content change listener with debounce
		const contentChangeListener = model.onDidChangeContent(() => {
			if (this.debounceTimer) {
				clearTimeout(this.debounceTimer);
			}

			this.debounceTimer = setTimeout(() => {
				this.fetchAndApplyTypes().catch((e) => {
					if (this.verbose) {
						logger.error('DepManager: Error in debounced fetchAndApplyTypes:', e);
					}
				});
			}, this.options.debounceDuration);
		});

		// Add to disposables so it gets cleaned up
		this.disposables.push(contentChangeListener);

		// Return the disposable in case it needs to be manually disposed
		return contentChangeListener;
	}

	public async resolveImportsFromPackageJsonRoot(packageJsonContent: string, omitPackages?: string[]) {
		if (this.isResolvingPackageJson) {
			if (this.verbose) {
				logger.warn('DepManager: Already resolving types from package.json.');
			}
			return;
		}
		this.isResolvingPackageJson = true;

		invokeUpdate({ type: 'ResolveFromPackageJson' }, this.options);

		try {
			// Use a new RecursionDepth for this specific operation
			await this.importResolver.resolveImportsFromPackageJsonRoot(
				packageJsonContent,
				new RecursionDepth(this.options),
				omitPackages,
			);
		} catch (e) {
			if (this.options.onError) {
				this.options.onError((e as Error).message ?? e);
			} else if (this.verbose) {
				logger.error('DepManager: Error resolving imports from package.json content:', e);
			}
		} finally {
			this.isResolvingPackageJson = false;
		}

		// Check if new types were added and refresh model if necessary
		if (this.importResolver.wereNewImportsResolved()) {
			if (!this.options.dontRefreshModelValueAfterResolvement) {
				const model = this.editor.getModel();
				const currentPosition = this.editor.getPosition();
				if (model && this.editor.getModel() === model) {
					// Check model still exists
					model.setValue(model.getValue());
					if (currentPosition && this.editor.getModel() === model) {
						// Re-check model and set position
						this.editor.setPosition(currentPosition);
					}
				}
			}
			this.importResolver.resetNewImportsResolved();
		}
	}

	public async fetchAndApplyTypes() {
		if (this.isResolving) {
			if (this.verbose) {
				logger.warn('DepManager: Already resolving types.');
			}
			return;
		}
		this.isResolving = true;
		invokeUpdate(
			{
				type: 'ResolveNewImports',
			},
			this.options,
		);

		const model = this.editor.getModel();
		if (!model) {
			if (this.verbose) {
				logger.error('DepManager: No model found on editor.');
			}
			this.isResolving = false;
			return;
		}

		const content = model.getLinesContent();

		try {
			await this.importResolver.resolveImportsInFile(
				content.join('\n'),
				path.dirname(model.uri.toString()),
				new RecursionDepth(this.options),
			);
		} catch (e) {
			if (this.options.onError) {
				this.options.onError((e as Error).message ?? e);
			} else if (this.verbose) {
				logger.error('DepManager: Error resolving imports:', e);
			}
		} finally {
			this.isResolving = false;
		}

		if (this.importResolver.wereNewImportsResolved()) {
			if (!this.options.dontRefreshModelValueAfterResolvement) {
				const currentPosition = this.editor.getPosition();
				if (this.editor.getModel() === model) {
					model.setValue(model.getValue());
					if (currentPosition && this.editor.getModel() === model) {
						this.editor.setPosition(currentPosition);
					}
				}
			}
			this.importResolver.resetNewImportsResolved();
		}
	}
}

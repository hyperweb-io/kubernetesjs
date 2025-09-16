import * as path from 'path';
import type * as monaco from 'monaco-editor';

import { logger } from '@/lib/logger';
import { safeJSONParse } from '@/lib/utils';

import { DependencyManagerOptions, SourceCache, SourceResolver } from './dependency-manager.types';
import { DependencyParser } from './dependency-parser';
import {
	ImportResourcePath,
	ImportResourcePathPackage,
	ImportResourcePathRelativeInPackage,
	importResourcePathToString,
} from './import-resource-path';
import { invokeUpdate } from './invoke-update';
import { RecursionDepth } from './recursion-depth';
import { ResolutionCache } from './resolution-cache';
import { ZenFsCache } from './zenfs-cache';

const NODE_BUILTINS_NO_PREFIX = new Set<string>([
	'assert',
	'async_hooks',
	'buffer',
	'child_process',
	'cluster',
	'console',
	'constants',
	'crypto',
	'dgram',
	'diagnostics_channel',
	'dns',
	'domain',
	'events',
	'fs',
	'http',
	'http2',
	'https',
	'inspector',
	'module',
	'net',
	'os',
	'path',
	'perf_hooks',
	'process',
	'punycode',
	'querystring',
	'readline',
	'repl',
	'stream',
	'string_decoder',
	'sys',
	'timers',
	'tls',
	'trace_events',
	'tty',
	'url',
	'util',
	'v8',
	'vm',
	'wasi',
	'worker_threads',
	'zlib',
]);

const TYPES_NODE_PACKAGE_NAME = '@types/node';
// Let's use a recent LTS version. This can be made configurable later.
const TYPES_NODE_DEFAULT_VERSION = '20.16.0'; // Example: Use a specific known good version
const TYPES_NODE_MAIN_TYPINGS_FILE = 'index.d.ts'; // Common main file, usually at the root of @types/node
// const TYPES_NODE_SUBPATH_PREFIX = 'files/'; // Removed, assuming index.d.ts is at root & paths are relative to it

/**
 * ImportResolver
 *
 * Resolves import statements in TypeScript/JavaScript files and loads their type definitions
 * into the Monaco editor's model manager.
 *
 * Supports three types of imports:
 * 1. Node.js package imports (e.g., 'import React from "react"')
 * 2. Relative imports within packages (e.g., imports within node_modules)
 * 3. Relative imports within the project (e.g., 'import { Component } from "./component"')
 *
 * For relative imports, it uses ZenFS to access the file system and resolve files
 * with appropriate extensions (.ts, .tsx, .js, .jsx, etc.).
 */
export class ImportResolver {
	private dependencyParser: DependencyParser;
	private resolutionCache: ResolutionCache;
	private sourceCache: SourceCache;
	private sourceResolver: SourceResolver;
	private versions?: { [packageName: string]: string };
	private newImportsResolved: boolean;
	private monaco: typeof monaco;
	private typesNodeReferences: Map<string, string> = new Map(); // Stores 'path' -> 'files/path.d.ts'
	private typesNodeMainFileFetchedAndParsed = false;

	constructor(private options: DependencyManagerOptions) {
		this.dependencyParser = new DependencyParser();
		this.resolutionCache = ResolutionCache.getInstance();
		this.sourceCache = ZenFsCache.getInstance();
		if (this.options.verbose) {
			(this.sourceCache as ZenFsCache).setVerbose(this.options.verbose);
		}
		this.sourceResolver = options.sourceResolver;
		this.newImportsResolved = false;
		this.monaco = options.monaco!;

		if (options.preloadPackages && options.versions) {
			this.versions = options.versions;
			for (const [packageName, _version] of Object.entries(options.versions)) {
				this.resolveImport(
					{
						kind: 'package',
						packageName: packageName,
						importPath: '',
					},
					new RecursionDepth(this.options),
				).catch((e) => {
					if (this.options.verbose) {
						logger.error(e);
					}
				});
			}
		}
	}

	public async preloadNodeTypes() {
		const importResource: ImportResourcePathRelativeInPackage = {
			kind: 'relative-in-package',
			packageName: TYPES_NODE_PACKAGE_NAME,
			sourcePath: '',
			importPath: TYPES_NODE_MAIN_TYPINGS_FILE, // index.d.ts
		};
		try {
			await this.resolveImportInPackage(importResource, new RecursionDepth(this.options));
		} catch (e) {
			if (this.options.onError) {
				this.options.onError((e as Error).message ?? e);
			} else if (this.options.verbose) {
				logger.error('DepManager: Error preloading node types:', e);
			}
		}
	}

	public wereNewImportsResolved() {
		return this.newImportsResolved;
	}

	public resetNewImportsResolved() {
		this.newImportsResolved = false;
	}

	public async resolveImportsInFile(source: string, parent: string | ImportResourcePath, depth: RecursionDepth) {
		if (depth.shouldStop()) {
			return;
		}
		const imports = this.dependencyParser.parseDependencies(source, parent);

		for (const importCall of imports) {
			try {
				await this.resolveImport(importCall, depth);
			} catch (e) {
				if (this.options.onError) {
					this.options.onError?.((e as Error).message ?? e);
				} else {
					if (this.options.verbose) {
						logger.error(e);
					}
				}
			}
		}
	}

	public async resolveImportsFromPackageJsonRoot(
		packageJsonContent: string,
		depth: RecursionDepth,
		omitPackages?: string[],
	) {
		if (depth.shouldStop()) {
			return;
		}

		let pkg: any;
		try {
			pkg = JSON.parse(packageJsonContent);
		} catch (e) {
			const errorMsg = `Failed to parse package.json content: ${(e as Error).message}`;
			if (this.options.onError) {
				this.options.onError(errorMsg);
			} else {
				if (this.options.verbose) {
					logger.error(errorMsg);
				}
			}
			return;
		}

		const dependencies = {
			...(pkg.dependencies || {}),
			...(pkg.devDependencies || {}),
			...(pkg.peerDependencies || {}),
		};

		const packageNames = Object.keys(dependencies);

		const packagesToResolve = packageNames.filter((pkgName) => !(omitPackages && omitPackages.includes(pkgName)));

		for (const packageName of packagesToResolve) {
			const importResource: ImportResourcePathPackage = {
				kind: 'package',
				packageName: packageName,
				importPath: '',
			};

			try {
				await this.resolveImport(importResource, depth.nextPackage());
			} catch (e) {
				if (this.options.onError) {
					this.options.onError?.((e as Error).message ?? e);
				} else {
					if (this.options.verbose) {
						logger.error(`Error resolving import for package "${packageName}" from provided package.json:`, e);
					}
				}
			}
		}
	}

	private async resolveImport(importResource: ImportResourcePath, depth: RecursionDepth) {
		const hash = this.hashImportResourcePath(importResource);
		if (this.resolutionCache.has(hash)) {
			return;
		}

		this.resolutionCache.add(hash);

		switch (importResource.kind) {
			case 'package': {
				const packageRelativeImport = await this.resolveImportFromPackageRoot(importResource);
				if (packageRelativeImport) {
					return await this.resolveImportInPackage(packageRelativeImport, depth.nextPackage().nextFile());
				}
				break;
			}
			case 'relative':
				return await this.resolveRelativeImport(importResource, depth.nextFile());
			case 'relative-in-package':
				return await this.resolveImportInPackage(importResource, depth.nextFile());
		}
	}

	private async resolveImportInPackage(importResource: ImportResourcePathRelativeInPackage, depth: RecursionDepth) {
		const contents = await this.loadSourceFileContents(importResource);

		if (contents) {
			const { source, at } = contents;
			this.createModel(
				source,
				this.monaco.Uri.parse(this.options.fileRootPath + path.join(`node_modules/${importResource.packageName}`, at)),
			);
			await this.resolveImportsInFile(
				source,
				{
					kind: 'relative-in-package',
					packageName: importResource.packageName,
					sourcePath: path.dirname(at),
					importPath: '',
				},
				depth,
			);
		}
	}

	private async resolveImportFromPackageRoot(
		importResource: ImportResourcePathPackage,
	): Promise<ImportResourcePathRelativeInPackage | undefined> {
		const effectivePackageName = importResource.packageName.startsWith('node:')
			? importResource.packageName.substring(5)
			: importResource.packageName;

		if (NODE_BUILTINS_NO_PREFIX.has(effectivePackageName)) {
			const typesNodeVersion = this.versions?.[TYPES_NODE_PACKAGE_NAME] || TYPES_NODE_DEFAULT_VERSION;
			return this.handleNodeJsBuiltinImport(effectivePackageName, typesNodeVersion);
		}

		const failedProgressUpdate = {
			type: 'LookedUpPackage',
			package: importResource.packageName,
			definitelyTyped: false,
			success: false,
		} as const;

		if (this.options.onlySpecifiedPackages) {
			if (!this.versions?.[importResource.packageName] && !this.versions?.['@types/' + importResource.packageName]) {
				invokeUpdate(failedProgressUpdate, this.options);
				return;
			}
		}

		const doesPkgJsonHasSubpath = importResource.importPath?.length ?? 0 > 0;
		let pkgJsonSubpath = doesPkgJsonHasSubpath ? `/${importResource.importPath}` : '';
		let pkgJson = await this.resolvePackageJson(
			importResource.packageName,
			this.versions?.[importResource.packageName],
			doesPkgJsonHasSubpath ? importResource.importPath : undefined,
		);

		if (!pkgJson && doesPkgJsonHasSubpath) {
			pkgJson = await this.resolvePackageJson(importResource.packageName, this.versions?.[importResource.packageName]);
			pkgJsonSubpath = '';
		}

		if (pkgJson) {
			const { data: pkg } = safeJSONParse(pkgJson);
			if (pkg.typings || pkg.types) {
				const typings = pkg.typings || pkg.types;
				this.createModel(
					pkgJson,
					this.monaco.Uri.parse(
						`${this.options.fileRootPath}node_modules/${importResource.packageName}${pkgJsonSubpath}/package.json`,
					),
				);
				invokeUpdate(
					{
						type: 'LookedUpPackage',
						package: importResource.packageName,
						definitelyTyped: false,
						success: true,
					},
					this.options,
				);
				this.setVersion(importResource.packageName, pkg.version);
				return {
					kind: 'relative-in-package',
					packageName: importResource.packageName,
					sourcePath: '',
					importPath: path.join(importResource.importPath ?? '', typings.startsWith('./') ? typings.slice(2) : typings),
				};
			} else {
				const typingPackageName = `@types/${
					importResource.packageName.startsWith('@')
						? importResource.packageName.slice(1).replace(/\//, '__')
						: importResource.packageName
				}`;
				const pkgJsonTypings = await this.resolvePackageJson(typingPackageName, this.versions?.[typingPackageName]);
				if (pkgJsonTypings) {
					const { data: pkg } = safeJSONParse(pkgJsonTypings);

					if (pkg.typings || pkg.types) {
						const typings = pkg.typings || pkg.types;
						this.createModel(
							pkgJsonTypings,
							this.monaco.Uri.parse(`${this.options.fileRootPath}node_modules/${typingPackageName}/package.json`),
						);
						invokeUpdate(
							{
								type: 'LookedUpPackage',
								package: typingPackageName,
								definitelyTyped: true,
								success: true,
							},
							this.options,
						);
						this.setVersion(typingPackageName, pkg.version);
						return {
							kind: 'relative-in-package',
							packageName: typingPackageName,
							sourcePath: '',
							importPath: path.join(
								importResource.importPath ?? '',
								typings.startsWith('./') ? typings.slice(2) : typings,
							),
						};
					} else {
						invokeUpdate(failedProgressUpdate, this.options);
					}
				} else {
					invokeUpdate(failedProgressUpdate, this.options);
				}
			}
		} else {
			invokeUpdate(failedProgressUpdate, this.options);
		}
	}

	private parseReferencePathDirectives(content: string): Map<string, string> {
		const references = new Map<string, string>();
		// Example: /// <reference path="node:path" /> or /// <reference path="path.d.ts" />
		// Or /// <reference types="node" /> -> this one is different, implies all of node.
		// For now, focusing on <reference path="...">
		const referenceRegex = /\/\/\/\s*<reference\s+path=["']([^"']+)["']\s*\/>/g;
		let match;
		while ((match = referenceRegex.exec(content)) !== null) {
			const referencedPath = match[1];
			// Assuming paths are like "fs.d.ts", "path.d.ts" relative to the "files" dir in @types/node
			// Or potentially "node:fs" which we'd map to "fs.d.ts"
			const moduleName = referencedPath.replace(/^node:/, '').replace(/\.d\.ts$/, '');
			if (referencedPath.endsWith('.d.ts')) {
				// Store it like: 'fs' -> 'fs.d.ts' or 'fs/promises' -> 'fs/promises.d.ts'
				references.set(moduleName, referencedPath);
			}
		}
		return references;
	}

	private async ensureTypesNodeMainFileFetchedAndParsed(typesNodeVersion: string): Promise<boolean> {
		if (this.typesNodeMainFileFetchedAndParsed) {
			return true;
		}
		const mainTypingsFilePathInPackage = TYPES_NODE_MAIN_TYPINGS_FILE;

		const mainTypingsContent = await this.resolveSourceFile(
			TYPES_NODE_PACKAGE_NAME,
			typesNodeVersion, // Now guaranteed string
			mainTypingsFilePathInPackage,
		);

		if (mainTypingsContent) {
			this.typesNodeReferences = this.parseReferencePathDirectives(mainTypingsContent);
			this.typesNodeMainFileFetchedAndParsed = true;

			// Optional: Create a model for this main @types/node file if useful for diagnostics or full browsing
			const modelUri = this.monaco.Uri.parse(
				`${this.options.fileRootPath}node_modules/${TYPES_NODE_PACKAGE_NAME}/${mainTypingsFilePathInPackage}`,
			);
			this.createModel(mainTypingsContent, modelUri);

			return true;
		} else {
			if (this.options.verbose) {
				logger.error(
					`[ImportResolver] Failed to fetch or read @types/node/${mainTypingsFilePathInPackage}. Node.js built-in types may not be available.`,
				);
			}
			// We can still set typesNodeMainFileFetchedAndParsed to true to avoid retrying constantly,
			// or implement a retry mechanism if desired. For now, mark as attempted.
			this.typesNodeMainFileFetchedAndParsed = true; // Mark as attempted to avoid loops on permanent failure
			return false;
		}
	}

	private async handleNodeJsBuiltinImport(
		builtinName: string, // e.g., "path"
		typesNodeVersion: string, // typesNodeVersion is string
	): Promise<ImportResourcePathRelativeInPackage | undefined> {
		const mainFileReady = await this.ensureTypesNodeMainFileFetchedAndParsed(typesNodeVersion);
		if (!mainFileReady || !this.typesNodeReferences.has(builtinName)) {
			if (this.options.verbose) {
				logger.warn(
					`[ImportResolver] Reference for built-in '${builtinName}' not found in @types/node main typings or main typings failed to load.`,
				);
			}
			invokeUpdate(
				{
					type: 'LookedUpPackage',
					package: `node:${builtinName}`,
					definitelyTyped: true, // It would come from @types/node
					success: false,
				},
				this.options,
			);
			return undefined;
		}

		const importPathInTypesNode = this.typesNodeReferences.get(builtinName)!; // e.g., "path.d.ts" or "fs/promises.d.ts"

		// This will trigger loadSourceFileContents for @types/node with the specific file path
		return {
			kind: 'relative-in-package',
			packageName: TYPES_NODE_PACKAGE_NAME, // Resolve against @types/node
			sourcePath: '', // Paths from reference directives are relative to the @types/node root
			importPath: importPathInTypesNode, // e.g., "path.d.ts" or "fs/promises.d.ts"
		};
	}

	private async resolveRelativeImport(
		importResource: ImportResourcePath & { kind: 'relative' },
		depth: RecursionDepth,
	) {
		if (depth.shouldStop()) {
			return;
		}

		try {
			const { sourcePath, importPath } = importResource;

			// Normalize Monaco editor paths - remove any Monaco URL scheme
			const normalizeMonacoPath = (p: string): string => {
				return p
					.replace(/^inmemory:\/+model\/+/, '') // Remove standard Monaco prefix
					.replace(/^inmemory:\/+/, ''); // Remove any other inmemory:/ prefix
			};

			// Get the clean sourcePath - remove any Monaco URL prefix
			const cleanSourcePath = normalizeMonacoPath(sourcePath);

			// Get source directory - this is where the import is occurring from
			const sourceDir = path.dirname(cleanSourcePath);

			// For Monaco's TypeScript language service, we need to create the expected model URI
			// exactly matching what TypeScript will look for based on the import statement
			let expectedImportPath = '';

			// Handle relative imports
			if (importPath.startsWith('./') || importPath.startsWith('../')) {
				// Convert relative import to the path TypeScript will expect
				let relPath = importPath;
				// Remove leading ./ for easier path joining
				if (relPath.startsWith('./')) {
					relPath = relPath.substring(2);
				}

				// Join with source directory to get absolute path
				if (sourceDir && sourceDir !== '.') {
					expectedImportPath = path.join(sourceDir, relPath);
				} else {
					expectedImportPath = relPath;
				}
			} else {
				// For non-relative imports (e.g. absolute references within the project)
				expectedImportPath = importPath;
			}

			// Make sure we have a clean expected path without any Monaco prefixes
			expectedImportPath = normalizeMonacoPath(expectedImportPath);

			// Try different extensions if none is provided
			const extensions = ['.ts', '.tsx', '.js', '.jsx', '.d.ts', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'];

			// Build the list of paths to try with extensions - ensure they're all clean paths
			const pathsToTry: string[] = [];

			if (expectedImportPath.includes('.')) {
				// If it already has an extension, try as is
				pathsToTry.push(expectedImportPath);
			} else {
				// Add extensions to try
				for (const ext of extensions) {
					pathsToTry.push(expectedImportPath + ext);
				}
			}

			// Try to resolve the file
			let fileContent: string | undefined;
			let resolvedPath: string | undefined;
			let actualPath: string | undefined;

			// Try each path
			for (const pathToTry of pathsToTry) {
				// Make sure we're using a clean path without any scheme
				const cleanPathToTry = normalizeMonacoPath(pathToTry);

				// Try to resolve the file
				const result = await this.resolveLocalFile(cleanPathToTry);
				if (result) {
					fileContent = result.content;
					resolvedPath = cleanPathToTry;
					actualPath = normalizeMonacoPath(result.actualPath);
					break;
				}
			}

			// If we still didn't find it, try with just the basename
			if (!fileContent) {
				const basename = path.basename(expectedImportPath);
				const result = await this.resolveLocalFile(basename);
				if (result) {
					fileContent = result.content;
					resolvedPath = basename;
					actualPath = normalizeMonacoPath(result.actualPath);
				}
			}

			if (fileContent && resolvedPath) {
				// Create models for both the actual path and the expected path

				// 1. Create model at the actual path first (where the file actually exists in the project)
				if (actualPath) {
					const actualModelUri = this.monaco.Uri.parse(`${this.options.fileRootPath}${actualPath}`);
					this.createModel(fileContent, actualModelUri);
				}

				// 2. Create model at the TypeScript expected path (what the import statement will look for)
				// We need to ensure the path has the right extension
				let tsExpectedPath = expectedImportPath;
				if (!tsExpectedPath.includes('.')) {
					// Find which extension to use
					const ext = extensions.find((ext) => resolvedPath?.endsWith(ext) || actualPath?.endsWith(ext)) || '.ts';
					tsExpectedPath = tsExpectedPath + ext;
				}

				// IMPORTANT: Create a clean Monaco URI - this is the exact path TypeScript will look for
				const expectedModelUri = this.monaco.Uri.parse(`${this.options.fileRootPath}${tsExpectedPath}`);
				this.createModel(fileContent, expectedModelUri);

				// For relative imports with ./configs format, also create a model with just 'configs.ts'
				if (importPath.startsWith('./')) {
					const simpleImportName = importPath.substring(2);
					if (!simpleImportName.includes('/')) {
						// It's a simple import like './configs'
						let simpleImportPath = simpleImportName;
						if (!simpleImportName.includes('.')) {
							// Add extension if needed
							const ext = extensions.find((ext) => resolvedPath?.endsWith(ext) || actualPath?.endsWith(ext)) || '.ts';
							simpleImportPath = simpleImportName + ext;
						}

						// Create an additional model at the root path
						const simpleModelUri = this.monaco.Uri.parse(`${this.options.fileRootPath}${simpleImportPath}`);
						this.createModel(fileContent, simpleModelUri);
					}
				}

				// Continue resolving imports from this file
				await this.resolveImportsInFile(
					fileContent,
					{
						kind: 'relative',
						sourcePath: actualPath || resolvedPath,
						importPath: '',
					},
					depth,
				);

				invokeUpdate(
					{
						type: 'LookedUpTypeFile',
						path: resolvedPath,
						success: true,
					},
					this.options,
				);
			} else {
				invokeUpdate(
					{
						type: 'LookedUpTypeFile',
						path: expectedImportPath,
						success: false,
					},
					this.options,
				);
			}
		} catch (e) {
			if (this.options.onError) {
				this.options.onError((e as Error).message ?? String(e));
			} else {
				if (this.options.verbose) {
					logger.error('Error resolving relative import:', e);
				}
			}
		}
	}

	private async resolveLocalFile(filePath: string): Promise<{ content: string; actualPath: string } | undefined> {
		try {
			// Normalize the path to ensure consistency in cache keys
			const normalizePath = (p: string): string => {
				return p
					.replace(/^inmemory:\/+model\/+/, '') // Remove standard Monaco prefix
					.replace(/^inmemory:\/+/, ''); // Remove any other inmemory:/ prefix
			};

			const normalizedPath = normalizePath(filePath);

			// List of possible extensions to try if the original path doesn't have one
			const extensionsToTry = normalizedPath.includes('.') ? [''] : ['.ts', '.tsx', '.js', '.jsx', '.d.ts'];

			// Keep track of where the file was actually found (for model creation)
			let actualFilePath: string | undefined;

			// Try to resolve with each extension
			for (const ext of extensionsToTry) {
				const pathWithExt = normalizedPath + ext;
				const cacheKey = `local:${pathWithExt}`;

				// Try to get from cache first
				const content = await this.sourceCache.getFile(cacheKey);
				if (content) {
					invokeUpdate(
						{
							type: 'LoadedFromCache',
							importPath: cacheKey,
						},
						this.options,
					);
					return { content, actualPath: pathWithExt };
				}

				// Try to get file content using the file content resolver if available
				if (this.options.fileContentResolver) {
					const result = await this.options.fileContentResolver(pathWithExt);

					if (result) {
						// Store the actual path for Monaco model creation
						actualFilePath = normalizePath(result.actualPath);

						// Store in cache with the lookup path
						await this.sourceCache.storeFile(cacheKey, result.content);
						invokeUpdate(
							{
								type: 'StoredToCache',
								importPath: cacheKey,
							},
							this.options,
						);

						// Also store the content at the actual path for proper module resolution
						// This helps Monaco's TypeScript language service properly resolve the module
						if (actualFilePath && actualFilePath !== pathWithExt) {
							const actualCacheKey = `local:${actualFilePath}`;
							await this.sourceCache.storeFile(actualCacheKey, result.content);
						}

						return {
							content: result.content,
							actualPath: actualFilePath || pathWithExt, // Ensure we always return a path
						};
					}
				}
			}

			// If we haven't found the file with direct paths, try with just the filename
			const filename = normalizedPath.split('/').pop();
			if (filename && this.options.fileContentResolver) {
				// Try with just the filename and various extensions
				for (const ext of extensionsToTry) {
					const filenameWithExt = filename + ext;
					const cacheKey = `local:${filenameWithExt}`;

					// Try from cache first
					const content = await this.sourceCache.getFile(cacheKey);
					if (content) {
						return { content, actualPath: filenameWithExt };
					}

					// Try with file content resolver
					const filenameResult = await this.options.fileContentResolver(filenameWithExt);
					if (filenameResult) {
						// Normalize the actual path
						const actualPath = normalizePath(filenameResult.actualPath);

						// Store the file in cache with both keys
						await this.sourceCache.storeFile(cacheKey, filenameResult.content);

						// Store with actual path too
						const actualCacheKey = `local:${actualPath}`;
						await this.sourceCache.storeFile(actualCacheKey, filenameResult.content);

						return {
							content: filenameResult.content,
							actualPath: actualPath,
						};
					}
				}

				// Try with common project directories
				const commonDirs = ['src/', 'scripts/', 'lib/', 'components/', 'utils/'];
				for (const dir of commonDirs) {
					for (const ext of extensionsToTry) {
						const dirFilePath = dir + filename + ext;
						const cacheKey = `local:${dirFilePath}`;

						// Try from cache first
						const content = await this.sourceCache.getFile(cacheKey);
						if (content) {
							return { content, actualPath: dirFilePath };
						}

						// Try with file content resolver
						const dirResult = await this.options.fileContentResolver(dirFilePath);
						if (dirResult) {
							// Normalize the actual path
							const actualPath = normalizePath(dirResult.actualPath);

							// Store in cache with both keys
							await this.sourceCache.storeFile(cacheKey, dirResult.content);

							// Store with actual path too
							const actualCacheKey = `local:${actualPath}`;
							await this.sourceCache.storeFile(actualCacheKey, dirResult.content);

							return {
								content: dirResult.content,
								actualPath: actualPath,
							};
						}
					}
				}
			}

			// Fall back to ZenFS if content resolver didn't work or isn't available
			const fs = (window as any).fs;
			if (!fs) {
				throw new Error('ZenFS not initialized');
			}

			// Try each extension with ZenFS
			for (const ext of extensionsToTry) {
				const pathWithExt = normalizedPath + ext;
				const cacheKey = `local:${pathWithExt}`;

				// Check if file exists
				try {
					const stat = await fs.promises.stat(pathWithExt);
					if (!stat.isFile()) {
						continue;
					}

					// Read the file
					const content = await fs.promises.readFile(pathWithExt, { encoding: 'utf-8' });

					// Store in cache
					if (content) {
						await this.sourceCache.storeFile(cacheKey, content);
						invokeUpdate(
							{
								type: 'StoredToCache',
								importPath: cacheKey,
							},
							this.options,
						);
						return { content, actualPath: pathWithExt };
					}
				} catch (e) {
					// File doesn't exist with this extension, continue to next
					continue;
				}
			}

			// If we get here, the file wasn't found with any method
			return undefined;
		} catch (e) {
			if (this.options.verbose) {
				logger.error('Error reading local file:', e);
			}
			return undefined;
		}
	}

	private async loadSourceFileContents(
		importResource: ImportResourcePathRelativeInPackage,
	): Promise<{ source: string; at: string } | null> {
		const progressUpdatePath = path.join(
			importResource.packageName,
			importResource.sourcePath,
			importResource.importPath,
		);

		const failedProgressUpdate = {
			type: 'LookedUpTypeFile',
			path: progressUpdatePath,
			definitelyTyped: false,
			success: false,
		} as const;

		const pkgName = importResource.packageName;
		const version = this.getVersion(importResource.packageName);

		const appends = ['.d.ts', '/index.d.ts'];

		if (appends.map((append) => importResource.importPath.endsWith(append)).reduce((a, b) => a || b, false)) {
			const source = await this.resolveSourceFile(
				pkgName,
				version,
				path.join(importResource.sourcePath, importResource.importPath),
			);
			if (source) {
				return { source, at: path.join(importResource.sourcePath, importResource.importPath) };
			}
		} else {
			for (const append of appends) {
				const resourcePath = path.join(importResource.sourcePath, importResource.importPath);
				const fullPath =
					(append === '.d.ts' && resourcePath.endsWith('.js') ? resourcePath.slice(0, -3) : resourcePath) + append;
				const source = await this.resolveSourceFile(pkgName, version, fullPath);
				invokeUpdate(
					{
						type: 'AttemptedLookUpFile',
						path: path.join(pkgName, fullPath),
						success: !!source,
					},
					this.options,
				);
				if (source) {
					invokeUpdate(
						{
							type: 'LookedUpTypeFile',
							path: path.join(pkgName, fullPath),
							success: true,
						},
						this.options,
					);
					return { source, at: fullPath };
				}
			}
		}

		const subPathForPackageJson = path.join(importResource.sourcePath, importResource.importPath);

		// If the path looks like a specific file (e.g., ends with .d.ts), don't try to find package.json there.
		if (/\.(d\.)?ts(x)?$/.test(subPathForPackageJson) || /\.js(x)?$/.test(subPathForPackageJson)) {
			invokeUpdate(failedProgressUpdate, this.options);
			return null;
		}

		// If we are resolving a multi-segment path inside an @types package (e.g., "path/posix" inside "@types/node")
		// and direct file lookups (via appends) failed, it's unlikely to be a sub-package.
		// Avoid trying to fetch e.g. .../@types/node/path/posix/package.json
		if (importResource.packageName.startsWith('@types/') && subPathForPackageJson.includes('/')) {
			invokeUpdate(failedProgressUpdate, this.options);
			return null;
		}

		const pkgJson = await this.resolvePackageJson(
			pkgName,
			version,
			subPathForPackageJson, // Use the calculated subPath
		);

		if (pkgJson) {
			const { data: types } = safeJSONParse(pkgJson);

			if (types) {
				const fullPath = path.join(importResource.sourcePath, importResource.importPath, types);
				const source = await this.resolveSourceFile(pkgName, version, fullPath);
				if (source) {
					invokeUpdate(
						{
							type: 'LookedUpTypeFile',
							path: path.join(pkgName, fullPath),
							success: true,
						},
						this.options,
					);
					return { source, at: fullPath };
				}
			}
		}

		invokeUpdate(failedProgressUpdate, this.options);
		return null;
	}

	private getVersion(packageName: string) {
		return this.versions?.[packageName];
	}

	public setVersions(versions: { [packageName: string]: string }) {
		this.versions = versions;
		this.options.onUpdateVersions?.(versions);
		// TODO reload packages whose version has changed
	}

	private setVersion(packageName: string, version: string) {
		this.setVersions({
			...this.versions,
			[packageName]: version,
		});
	}

	private createModel(source: string, uri: monaco.Uri) {
		// When creating models, normalize the URI path to what Monaco expects
		// THIS IS CRITICAL: We must ensure the path is exactly what TypeScript will look for
		const normalizedPath = uri.path
			.replace('@types/', '')
			// IMPORTANT: Remove any 'inmemory:/' prefixes from the path
			.replace(/^inmemory:\/+model\/+inmemory:\/+model\/+/, 'inmemory:/model/')
			.replace(/^inmemory:\/+model\/+inmemory:\/+/, 'inmemory:/model/')
			// IMPORTANT: Remove any URL encoding in the path
			.replace(/%3A/g, ':')
			.replace(/%2F/g, '/')
			// Make sure paths don't have multiple slashes
			.replace(/\/+/g, '/');

		// Create a clean URI with the normalized path
		const cleanUri = uri.with({ path: normalizedPath });

		// Check if a model already exists
		const existingModel = this.monaco.editor.getModel(cleanUri);
		if (!existingModel) {
			this.monaco.editor.createModel(source, 'typescript', cleanUri);
			this.newImportsResolved = true;
		}
	}

	private hashImportResourcePath(p: ImportResourcePath) {
		return importResourcePathToString(p);
	}

	private async resolvePackageJson(
		packageName: string,
		version?: string,
		subPath?: string,
	): Promise<string | undefined> {
		const uri = path.join(packageName + (version ? `@${version}` : ''), subPath ?? '', 'package.json');

		try {
			let file = await this.sourceCache.getFile(uri);
			if (file) {
				return file;
			}

			file = await this.sourceResolver.resolvePackageJson(packageName, version, subPath);

			if (file) {
				await this.sourceCache.storeFile(uri, file);
				return file;
			} else {
				return undefined;
			}
		} catch (e) {
			if (this.options.verbose) {
				logger.error(
					`[ImportResolver] resolvePackageJson - Error resolving package.json for ${packageName} (URI: ${uri}):`,
					e,
				);
			}
			return undefined;
		}
	}

	private async resolveSourceFile(
		packageName: string,
		version: string | undefined,
		filePath: string,
	): Promise<string | undefined> {
		const uri = path.join(packageName + (version ? `@${version}` : ''), filePath);

		try {
			let file = await this.sourceCache.getFile(uri);
			if (file) {
				invokeUpdate(
					{
						type: 'LoadedFromCache',
						importPath: uri,
					},
					this.options,
				);
				return file;
			}

			file = await this.sourceResolver.resolveSourceFile(packageName, version, filePath);

			if (file) {
				invokeUpdate(
					{
						type: 'StoredToCache',
						importPath: uri,
					},
					this.options,
				);
				await this.sourceCache.storeFile(uri, file);
				return file;
			} else {
				return undefined;
			}
		} catch (e) {
			if (this.options.verbose) {
				logger.error(
					`[ImportResolver] resolveSourceFile - Error resolving source file ${filePath} for ${packageName} (URI: ${uri}):`,
					e,
				);
			}
			return undefined;
		}
	}
}

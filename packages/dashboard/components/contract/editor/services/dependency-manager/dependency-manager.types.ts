import type * as monaco from 'monaco-editor';

export interface Dependency {
	name: string;
	version: string;
}

export interface SourceResolver {
	resolvePackageJson: (packageName: string, version?: string, subPath?: string) => Promise<string | undefined>;
	resolveSourceFile: (packageName: string, version: string | undefined, path: string) => Promise<string | undefined>;
}

/**
 * Result from resolving file content
 */
export interface FileContentResult {
	content: string;
	actualPath: string;
}

/**
 * Function to resolve file content from project files by path
 * Used for local (relative) imports to get content from project files
 * instead of reading directly from the filesystem
 */
export type FileContentResolver = (filePath: string) => Promise<FileContentResult | undefined>;

export type DependencyManagerUpdate =
	| {
			type: 'CodeChanged';
	  }
	| {
			type: 'ResolveNewImports';
	  }
	| {
			type: 'ResolveFromPackageJson';
	  }
	| {
			type: 'LookedUpTypeFile';
			path: string;
			success: boolean;
	  }
	| {
			type: 'AttemptedLookUpFile';
			path: string;
			success: boolean;
	  }
	| {
			type: 'LookedUpPackage';
			package: string;
			definitelyTyped: boolean;
			success: boolean;
	  }
	| {
			type: 'LoadedFromCache';
			importPath: string;
	  }
	| {
			type: 'StoredToCache';
			importPath: string;
	  };

export interface SourceCache {
	isFileAvailable?: (uri: string) => Promise<boolean>;
	storeFile: (uri: string, content: string) => Promise<void>;
	getFile: (uri: string) => Promise<string | undefined>;
	clear: () => Promise<void>;
}

export interface DependencyManagerOptions {
	/**
	 * Share source cache between multiple editor instances by storing
	 * the cache in a static property.
	 *
	 * Defaults to true.
	 */
	shareCache: boolean;

	/**
	 * Only use packages specified in the `versions` property.
	 *
	 * Defaults to false.
	 */
	onlySpecifiedPackages: boolean;

	/**
	 * Load typings from prespecified versions when initializing. Versions
	 * need to be specified in the ``versions`` option.
	 *
	 * Defaults to false.
	 */
	preloadPackages: boolean;

	/**
	 * Updates compiler options to defaults suitable for auto-loaded
	 * declarations, specifically by setting ``moduleResolution`` to
	 * ``NodeJs`` and ``allowSyntheticDefaultImports`` to true.
	 * Other options are not changed. Set this property to true to
	 * disable this behaviour.
	 *
	 * Defaults to false.
	 */
	dontAdaptEditorOptions: boolean;

	/**
	 * After typings were resolved and injected into monaco, auto-typings
	 * updates the value of the current model to trigger a refresh in
	 * monaco's typing logic, so that it uses the injected typings.
	 */
	dontRefreshModelValueAfterResolvement: boolean;

	/**
	 * Prespecified package versions. If a package is loaded whose
	 * name is specified in this object, it will load with the exact
	 * version specified in the object.
	 *
	 * Example:
	 *
	 * ```json
	 * {
	 *   "@types/react": "17.0.0",
	 *   "csstype": "3.0.5"
	 * }
	 * ```
	 *
	 * Setting the option ``onlySpecifiedPackages`` to true makes this
	 * property act as a whitelist for packages.
	 *
	 * Setting the option ``preloadPackages`` makes the packages specified
	 * in this property load directly after initializing the auto-loader.
	 */
	versions?: { [packageName: string]: string };

	/**
	 * If a new package was loaded, its name and version is added to the
	 * version object, and this method is called with the updated object.
	 * @param versions updated versions object.
	 */
	onUpdateVersions?: (versions: { [packageName: string]: string }) => void;

	/**
	 * Supply a cache where declaration files and package.json files are
	 * cached to. Supply an instance of {@link LocalStorageCache} to cache
	 * files to localStorage.
	 */
	sourceCache?: SourceCache;

	/**
	 * Supply a custom resolver logic for declaration and package.json files.
	 * Defaults to {@link UnpkgResolver}.
	 */
	sourceResolver: SourceResolver;

	/**
	 * The root directory where your edited files are. Must end with
	 * a slash. The default is suitable unless you change the default
	 * URI of files loaded in the editor.
	 *
	 * Defaults to "inmemory://model/"
	 */
	fileRootPath: string;

	/**
	 * Debounces code reanalyzing after user has changed the editor contents
	 * by the specified amount. Set to zero to disable. Value provided in
	 * milliseconds.
	 *
	 * Defaults to 1000, i.e. 1 second.
	 */
	debounceDuration: number;

	/**
	 * Maximum recursion depth for recursing packages. Determines how many
	 * nested package declarations are loaded. For example, if ``packageRecursionDepth``
	 * has the value 2, the code in the monaco editor references packages ``A1``, ``A2``
	 * and ``A3``, package ``A1`` references package ``B1`` and ``B1`` references ``C1``,
	 * then packages ``A1``, ``A2``, ``A3`` and ``B1`` are loaded. Set to zero to
	 * disable.
	 *
	 * Defaults to 0.
	 */
	packageRecursionDepth: number;

	/**
	 * Maximum recursion depth for recursing files. Determines how many
	 * nested file declarations are loaded. The same as ``packageRecursionDepth``,
	 * but for individual files. Set to zero to disable.
	 *
	 * Defaults to 10.
	 */
	fileRecursionDepth: number;

	/**
	 * Called after progress updates like loaded declarations or events.
	 * @param update detailed event object containing update infos.
	 * @param textual a textual representation of the update for debugging.
	 */
	onUpdate?: (update: DependencyManagerUpdate, textual: string) => void;

	/**
	 * Called if errors occur.
	 * @param error a textual representation of the error.
	 */
	onError?: (error: string) => void;
	/**
	 * instance of monaco editor
	 */
	monaco: typeof monaco;

	/**
	 * Function to resolve file content from project files by path
	 * Used for local (relative) imports instead of reading from the filesystem
	 */
	fileContentResolver?: FileContentResolver;

	/**
	 * Enable verbose logging for detailed operation information
	 * When enabled, detailed logs about file resolution and imports will be shown
	 * @default false
	 */
	verbose?: boolean;
}

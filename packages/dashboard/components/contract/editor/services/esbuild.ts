import * as esbuild from 'esbuild-wasm';

// Use esbuild's own version property
// This is more reliable than importing from package.json or hardcoding
const ESBUILD_VERSION = esbuild.version;

class EsbuildInitializer {
	private static instance: EsbuildInitializer;
	private _isInitialized: boolean = false;
	private _initPromise: Promise<void> | null = null;
	private _error: string | null = null;

	private constructor() {}

	public static getInstance(): EsbuildInitializer {
		if (!EsbuildInitializer.instance) {
			EsbuildInitializer.instance = new EsbuildInitializer();
		}
		return EsbuildInitializer.instance;
	}

	public async initialize(): Promise<void> {
		if (this._isInitialized) {
			return;
		}

		if (this._initPromise) {
			return this._initPromise;
		}

		this._initPromise = (async () => {
			try {
				await esbuild.initialize({
					// Use esbuild's own version property
					wasmURL: `https://unpkg.com/esbuild-wasm@${ESBUILD_VERSION}/esbuild.wasm`,
					worker: true,
				});
				this._isInitialized = true;
				this._error = null;
			} catch (error) {
				this._error = error instanceof Error ? error.message : `Failed to initialize esbuild: ${error}`;
				this._isInitialized = false;
			}
		})();

		return this._initPromise;
	}

	public isInitialized(): boolean {
		return this._isInitialized;
	}

	public getError(): string | null {
		return this._error;
	}
}

export const esbuildInitializer = EsbuildInitializer.getInstance();

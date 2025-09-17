import initSwc, { transformSync } from '@swc/wasm-web';

export interface TranspileResult {
	success: boolean;
	code?: string;
	error?: string;
}

type InitializationStatus = 'idle' | 'pending' | 'success' | 'error';

class TSRunner {
	private static instance: TSRunner | null = null;
	private _status: InitializationStatus = 'idle';
	private _error: Error | null = null;
	private _initializationPromise: Promise<void> | null = null;

	private constructor() {}

	public static getInstance(): TSRunner {
		if (!TSRunner.instance) {
			TSRunner.instance = new TSRunner();
		}
		return TSRunner.instance;
	}

	public async initialize(): Promise<void> {
		// Skip if already initialized successfully
		if (this._status === 'success') return;

		// Return existing promise if initialization is pending
		if (this._status === 'pending' && this._initializationPromise) {
			return this._initializationPromise;
		}

		// Start new initialization
		this._status = 'pending';
		this._error = null;

		this._initializationPromise = (async () => {
			try {
				await initSwc();
				this._status = 'success';
			} catch (error: any) {
				this._status = 'error';
				this._error = error instanceof Error ? error : new Error('Failed to initialize SWC');
				throw this._error;
			}
		})();

		return this._initializationPromise;
	}

	public transpile(code: string): TranspileResult {
		if (this._status !== 'success') {
			return {
				success: false,
				error: this._error?.message || 'SWC is not initialized yet',
			};
		}

		try {
			const output = transformSync(code, {
				jsc: {
					parser: {
						syntax: 'typescript',
						tsx: false,
					},
					target: 'es2022',
				},
				module: {
					type: 'es6',
				},
				minify: false,
			});

			return {
				success: true,
				code: output.code,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	}

	public getStatus(): InitializationStatus {
		return this._status;
	}

	public getError(): Error | null {
		return this._error;
	}

	public isInitialized(): boolean {
		return this._status === 'success';
	}

	public isPending(): boolean {
		return this._status === 'pending';
	}
}

export const tsRunner = TSRunner.getInstance();

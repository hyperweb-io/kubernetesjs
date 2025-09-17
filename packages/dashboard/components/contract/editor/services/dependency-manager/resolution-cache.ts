import { logger } from '@/lib/logger';

export class ResolutionCache {
	private static instance: ResolutionCache;
	private resolvedImports: Set<string> = new Set();
	private verbose = false;

	private constructor() {
		// Private constructor for singleton
	}

	public static getInstance(): ResolutionCache {
		if (!ResolutionCache.instance) {
			ResolutionCache.instance = new ResolutionCache();
		}
		return ResolutionCache.instance;
	}

	public setVerbose(verbose: boolean) {
		this.verbose = verbose;
		if (this.verbose) {
			logger.info('[ResolutionCache] Verbose logging enabled.');
		}
	}

	public has(hash: string): boolean {
		return this.resolvedImports.has(hash);
	}

	public add(hash: string): void {
		if (this.verbose && !this.resolvedImports.has(hash)) {
			logger.info(`[ResolutionCache] Adding new import to cache: ${hash}`);
		}
		this.resolvedImports.add(hash);
	}

	public clear(): void {
		this.resolvedImports.clear();
		if (this.verbose) {
			logger.info('[ResolutionCache] Cache cleared.');
		}
	}

	public get size(): number {
		return this.resolvedImports.size;
	}
}

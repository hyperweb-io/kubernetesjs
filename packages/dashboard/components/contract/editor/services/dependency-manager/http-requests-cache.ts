import { logger } from '@/lib/logger';

export interface FetchResult {
	content?: string;
	status?: number; // HTTP status if response received
	error?: any; // Network error or other exception
	isFromCache?: boolean;
	isOk?: boolean; // Mirrors Response.ok
}

const NOT_FOUND_SENTINEL = '___NOT_FOUND___';

export class HttpRequestsCache {
	private static instance: HttpRequestsCache;

	private cache: Map<string, string> = new Map<string, string>();
	private verbose: boolean = false;
	private readonly cacheEnabled: boolean = true;

	private constructor() {
		logger.info('[HttpRequestsCache] Singleton instance created. Caching enabled.');
	}

	public static getInstance(): HttpRequestsCache {
		if (!HttpRequestsCache.instance) {
			HttpRequestsCache.instance = new HttpRequestsCache();
		}
		return HttpRequestsCache.instance;
	}

	public setVerbose(verbose: boolean) {
		this.verbose = verbose;
	}

	public async fetchText(url: string, options?: RequestInit): Promise<FetchResult> {
		const method = options?.method || 'GET';

		if (this.cacheEnabled && this.cache.has(url)) {
			const cachedContent = this.cache.get(url)!;
			const isNotFound = cachedContent === NOT_FOUND_SENTINEL;

			if (method === 'HEAD') {
				if (this.verbose) {
					logger.info(`[HttpRequestsCache] Cache HIT for HEAD: ${url}`);
				}
				return { status: isNotFound ? 404 : 200, isOk: !isNotFound, isFromCache: true };
			}

			if (method === 'GET') {
				if (isNotFound) {
					if (this.verbose) {
						logger.info(`[HttpRequestsCache] Cache HIT for 404 GET: ${url}`);
					}
					return { content: '', status: 404, isOk: false, isFromCache: true };
				}
				if (this.verbose) {
					logger.info(`[HttpRequestsCache] Cache HIT for GET: ${url}`);
				}
				return { content: cachedContent, status: 200, isOk: true, isFromCache: true };
			}
		}

		if (this.cacheEnabled && method === 'GET') {
			if (this.verbose) {
				logger.info(`[HttpRequestsCache] Cache MISS for GET: ${url}`);
			}
		}

		try {
			const response = await fetch(url, options);

			if (method === 'HEAD') {
				// Don't cache HEAD responses directly, but we can infer for subsequent GETs
				if (this.cacheEnabled && response.status === 404) {
					this.cache.set(url, NOT_FOUND_SENTINEL);
				}
				return { status: response.status, isOk: response.ok };
			}

			if (response.ok) {
				const text = await response.text();
				if (this.cacheEnabled) {
					this.cache.set(url, text);
					if (this.verbose) {
						logger.info(`[HttpRequestsCache] Cached GET response for: ${url}`);
					}
				}
				return { content: text, status: response.status, isOk: true };
			} else {
				let errorText = '';
				try {
					errorText = await response.text();
				} catch (e) {
					// Ignore if error body cannot be read
				}

				if (this.cacheEnabled && response.status === 404) {
					this.cache.set(url, NOT_FOUND_SENTINEL);
					if (this.verbose) {
						logger.info(`[HttpRequestsCache] Cached 404 response for: ${url}`);
					}
				}

				return { content: errorText, status: response.status, isOk: false };
			}
		} catch (error) {
			if (this.verbose) {
				logger.error(`[HttpRequestsCache] Network error for ${method} ${url}:`, error);
			}
			return { error: error, isOk: false };
		}
	}

	public clear(): void {
		this.cache.clear();
		if (this.verbose) {
			logger.info('[HttpRequestsCache] Cache cleared.');
		}
	}

	public remove(url: string): void {
		if (this.cache.has(url)) {
			this.cache.delete(url);
			if (this.verbose) {
				logger.info(`[HttpRequestsCache] Removed from cache: ${url}`);
			}
		}
	}
}

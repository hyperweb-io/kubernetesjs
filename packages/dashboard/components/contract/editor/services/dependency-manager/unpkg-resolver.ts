import { logger } from '@/lib/logger';

import { SourceResolver } from './dependency-manager.types';
import { HttpRequestsCache } from './http-requests-cache';

export class UnpkgResolver implements SourceResolver {
	private httpCache: HttpRequestsCache;
	private verbose: boolean;

	constructor(verbose?: boolean) {
		this.httpCache = HttpRequestsCache.getInstance();
		this.verbose = !!verbose;
	}

	public async resolvePackageJson(
		packageName: string,
		version: string | undefined,
		subPath: string | undefined,
	): Promise<string | undefined> {
		const url = `https://unpkg.com/${packageName}${version ? `@${version}` : ''}${subPath ? `/${subPath}` : ''}/package.json`;
		const headResult = await this.httpCache.fetchText(url, { method: 'HEAD' });

		if (headResult.error) {
			if (headResult.error instanceof TypeError) {
				if (this.verbose) {
					logger.warn(
						`[UnpkgResolver] HEAD request for package.json network error (likely 404 or CORS): ${url}`,
						(headResult.error as Error).message,
					);
				}
			} else {
				if (this.verbose) {
					logger.error(`[UnpkgResolver] HEAD request for package.json failed for ${url}:`, headResult.error);
				}
			}
			return undefined;
		}

		if (headResult.isOk) {
			// File likely exists, proceed with GET, which will also use the cache via resolveFile
			return await this.resolveFile(url);
		} else if (headResult.status === 404) {
			if (this.verbose) {
				logger.warn(`[UnpkgResolver] package.json not found (404 HEAD): ${url}`);
			}
			return '';
		} else {
			if (this.verbose) {
				logger.error(`[UnpkgResolver] HEAD request for package.json failed with status ${headResult.status}: ${url}`);
			}
			return undefined;
		}
	}

	public async resolveSourceFile(
		packageName: string,
		version: string | undefined,
		path: string,
	): Promise<string | undefined> {
		return await this.resolveFile(`https://unpkg.com/${packageName}${version ? `@${version}` : ''}/${path}`);
	}

	private async resolveFile(url: string): Promise<string | undefined> {
		// Always use GET for resolveFile, cache will handle it
		const result = await this.httpCache.fetchText(url, { method: 'GET' });

		if (result.error) {
			if (url.endsWith('.d.ts') && result.error instanceof TypeError) {
				if (this.verbose) {
					logger.warn(
						`[UnpkgResolver] Fetch for .d.ts file failed (likely 404 or CORS issue on 404 page): ${url}`,
						(result.error as Error).message,
					);
				}
			} else {
				if (this.verbose) {
					logger.error(`[UnpkgResolver] Failed to fetch ${url}:`, result.error);
				}
			}
			return undefined;
		}

		if (result.isOk && typeof result.content === 'string') {
			return result.content;
		} else if (result.status === 404) {
			if (this.verbose) {
				logger.warn(`[UnpkgResolver] File not found (404 GET): ${url}`);
			}
			return ''; // Return empty string for 404, as per previous logic
		} else {
			if (this.verbose) {
				logger.error(
					`[UnpkgResolver] HTTP error ${result.status} fetching file: ${url}. Body: ${result.content || ''}`,
				);
			}
			return undefined;
		}
	}
}

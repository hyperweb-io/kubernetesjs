import { logger } from '@/lib/logger';

import { createDir, dirExists, getFileSystem } from '../fs';
import { SourceCache } from './dependency-manager.types';

const CACHE_DIR = '/.cache/typings'; // Define a cache directory within ZenFS

export class ZenFsCache implements SourceCache {
	private static instance: ZenFsCache;

	private fsInstance: ReturnType<typeof getFileSystem> | null = null;
	private isInitialized = false;
	private initializationPromise: Promise<void> | null = null;
	private verbose = false;

	private constructor() {
		// Initialization is deferred to ensureInitialized
	}

	public static getInstance(): ZenFsCache {
		if (!ZenFsCache.instance) {
			ZenFsCache.instance = new ZenFsCache();
		}
		return ZenFsCache.instance;
	}

	public setVerbose(verbose: boolean) {
		this.verbose = verbose;
	}

	private async ensureInitialized(): Promise<void> {
		if (this.isInitialized) {
			return;
		}
		if (this.initializationPromise) {
			return this.initializationPromise;
		}

		this.initializationPromise = (async () => {
			try {
				this.fsInstance = getFileSystem(); // Assumes initializeFs() was called elsewhere
				if (!(await dirExists(CACHE_DIR))) {
					if (this.verbose) {
						logger.info(`ZenFsCache: Creating cache directory: ${CACHE_DIR}`);
					}
					await createDir(CACHE_DIR); // Use createDir from fs.ts
				} else {
					if (this.verbose) {
						logger.info(`ZenFsCache: Cache directory already exists: ${CACHE_DIR}`);
					}
				}
				this.isInitialized = true;
				this.initializationPromise = null;
				if (this.verbose) {
					logger.info('ZenFsCache: Initialized successfully.');
				}
			} catch (error) {
				logger.error('ZenFsCache: Failed to initialize:', error);
				this.initializationPromise = null; // Allow retry
				throw error; // Re-throw the error
			}
		})();
		return this.initializationPromise;
	}

	private getFilePath(uri: string): string {
		// Simplify the URI to be a valid filename within the cache directory
		const simplified = uri
			.replace(/^https?:\/\//, '') // Remove http(s)://
			.replace(/[:*?"<>|]/g, '_') // Replace invalid filename chars
			.replace(/\//g, '__'); // Replace slashes
		return `${CACHE_DIR}/${simplified}`;
	}

	async getFile(uri: string): Promise<string | undefined> {
		await this.ensureInitialized();
		if (!this.fsInstance) throw new Error('ZenFS not available in cache');

		const filePath = this.getFilePath(uri);
		if (this.verbose) {
			logger.info(`ZenFsCache: Attempting to get file for URI "${uri}" from path "${filePath}"`);
		}
		try {
			const content = await this.fsInstance.promises.readFile(filePath, { encoding: 'utf8' });
			if (this.verbose) {
				logger.info(`ZenFsCache: Successfully retrieved file: ${filePath}`);
			}
			return content as string; // ZenFS readFile returns Buffer | string
		} catch (error: any) {
			if (error.code === 'ENOENT') {
				if (this.verbose) {
					logger.info(`ZenFsCache: File not found in cache: ${filePath}`);
				}
				return undefined;
			}
			logger.error(`ZenFsCache: Error getting file "${filePath}"`, error);
			throw error; // Re-throw other errors
		}
	}

	async storeFile(uri: string, content: string): Promise<void> {
		await this.ensureInitialized();
		if (!this.fsInstance) throw new Error('ZenFS not available in cache');

		const filePath = this.getFilePath(uri);
		if (this.verbose) {
			logger.info(`ZenFsCache: Attempting to store file for URI "${uri}" to path "${filePath}"`);
		}
		try {
			await this.fsInstance.promises.writeFile(filePath, content, { encoding: 'utf8' });
			if (this.verbose) {
				logger.info(`ZenFsCache: Successfully stored file: ${filePath}`);
			}
		} catch (error) {
			logger.error(`ZenFsCache: Error storing file "${filePath}"`, error);
			throw error; // Re-throw the error
		}
	}

	async clear(): Promise<void> {
		await this.ensureInitialized();
		if (!this.fsInstance) throw new Error('ZenFS not available in cache');

		if (this.verbose) {
			logger.info(`ZenFsCache: Attempting to clear cache directory: ${CACHE_DIR}`);
		}
		try {
			const entries = await this.fsInstance.promises.readdir(CACHE_DIR);
			for (const entry of entries) {
				const entryPath = `${CACHE_DIR}/${entry}`;
				// Basic check: ensure we are deleting files within the cache dir
				if (entryPath.startsWith(CACHE_DIR + '/')) {
					try {
						await this.fsInstance.promises.unlink(entryPath);
						if (this.verbose) {
							logger.info(`ZenFsCache: Deleted cache file: ${entryPath}`);
						}
					} catch (unlinkError) {
						// Could be a directory, try removing it - add more robust handling if needed
						try {
							await this.fsInstance.promises.rmdir(entryPath);
							if (this.verbose) {
								logger.info(`ZenFsCache: Removed cache directory entry: ${entryPath}`);
							}
						} catch (rmdirError) {
							if (this.verbose) {
								logger.warn(`ZenFsCache: Failed to delete cache entry "${entryPath}"`, unlinkError, rmdirError);
							}
						}
					}
				} else {
					if (this.verbose) {
						logger.warn(`ZenFsCache: Skipped deleting non-cache path during clear: ${entryPath}`);
					}
				}
			}
			if (this.verbose) {
				logger.info(`ZenFsCache: Cache cleared successfully: ${CACHE_DIR}`);
			}
		} catch (error: any) {
			if (error.code === 'ENOENT') {
				if (this.verbose) {
					logger.info(`ZenFsCache: Cache directory already clear or not found: ${CACHE_DIR}`);
				}
				return; // Directory doesn't exist, nothing to clear
			}
			logger.error(`ZenFsCache: Error clearing cache directory "${CACHE_DIR}"`, error);
			throw error; // Re-throw other errors
		}
	}

	async isFileAvailable(uri: string): Promise<boolean> {
		await this.ensureInitialized();
		if (!this.fsInstance) throw new Error('ZenFS not available in cache');

		const filePath = this.getFilePath(uri);
		if (this.verbose) {
			logger.info(`ZenFsCache: Checking availability for URI "${uri}" at path "${filePath}"`);
		}
		try {
			await this.fsInstance.promises.stat(filePath);
			if (this.verbose) {
				logger.info(`ZenFsCache: File is available: ${filePath}`);
			}
			return true;
		} catch (error: any) {
			if (error.code === 'ENOENT') {
				if (this.verbose) {
					logger.info(`ZenFsCache: File is not available: ${filePath}`);
				}
				return false;
			}
			logger.error(`ZenFsCache: Error checking file availability "${filePath}"`, error);
			throw error; // Re-throw unexpected errors
		}
	}
}

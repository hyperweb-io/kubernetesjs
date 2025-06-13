import { Buffer } from 'buffer';
import zenfs from '@zenfs/core';

import { logger } from '@/lib/logger';

// Create a variable to hold the filesystem instance
let fileSystemInstance: typeof zenfs | null = null;

// Initialize ZenFS
export async function initializeFs() {
	if (typeof window !== 'undefined') {
		try {
			fileSystemInstance = zenfs;

			// Expose to window for compatibility
			window.fs = fileSystemInstance;
			window.Buffer = Buffer;
		} catch (error) {
			logger.error('Failed to initialize ZenFS:', error);
		}
	}
}

// Export a function to get the filesystem instance
export function getFileSystem() {
	if (!fileSystemInstance) {
		throw new Error('FileSystem not initialized yet');
	}
	return fileSystemInstance;
}

export async function dirExists(path: string): Promise<boolean> {
	try {
		const fs = getFileSystem();
		const stats = await fs.promises.stat(path);
		return stats.isDirectory();
	} catch (err: any) {
		if (err.code === 'ENOENT') {
			return false;
		}
		throw err;
	}
}

export async function createDir(dir: string): Promise<void> {
	try {
		const fs = getFileSystem();
		await fs.promises.mkdir(dir, { recursive: true });
	} catch (err: any) {
		if (err.code !== 'EEXIST') {
			throw err;
		}
	}
}

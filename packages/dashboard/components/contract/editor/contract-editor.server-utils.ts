import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

import { ProjectItem, ROOT_ID } from './hooks/use-contract-project';

export const FALLBACK_PROJECT_PATH = 'src/components/contract/contract-code/hyperweb-fallback';

function createProjectItem(
	entry: string,
	relativePath: string,
	parentId: string,
	isDirectory: boolean,
	content?: string,
): ProjectItem {
	const id = nanoid();
	const now = Date.now();

	if (isDirectory) {
		return {
			id,
			type: 'folder',
			name: entry,
			path: relativePath,
			parentId,
			createdAt: now,
			updatedAt: now,
		};
	} else {
		return {
			id,
			type: 'file',
			name: entry,
			path: relativePath,
			parentId,
			content: content || '',
			createdAt: now,
			updatedAt: now,
		};
	}
}

/**
 * Server-side implementation that reads files/folders from the local filesystem
 * Used during build time in getStaticProps
 */
export function getFallbackProjectItems(
	dirPath: string,
	rootPath: string,
	parentId: string = ROOT_ID,
): Record<string, ProjectItem> {
	const items: Record<string, ProjectItem> = {};

	try {
		const entries = fs.readdirSync(dirPath);

		for (const entry of entries) {
			// Skip hidden files
			if (entry.startsWith('.')) continue;

			const fullPath = path.join(dirPath, entry);
			const stats = fs.statSync(fullPath);
			// Create a relative path from the root
			const relativePath = path.relative(rootPath, fullPath).replace(/\\/g, '/');

			if (stats.isDirectory()) {
				// Create folder item
				const item = createProjectItem(entry, relativePath, parentId, true);
				items[item.id] = item;

				// Recursively process subdirectories and add their items
				const childItems = getFallbackProjectItems(fullPath, rootPath, item.id);
				Object.assign(items, childItems);
			} else {
				// Create file item
				const content = fs.readFileSync(fullPath, 'utf-8');
				const item = createProjectItem(entry, relativePath, parentId, false, content);
				items[item.id] = item;
			}
		}
	} catch (error) {
		console.error(`Error reading fallback project files: ${error}`);
	}

	return items;
}

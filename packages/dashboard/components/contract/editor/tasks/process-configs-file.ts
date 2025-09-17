import type { TaskFunction } from './tasks.types';
import { logger } from '@/lib/logger';

/**
 * Processes the configs.ts file.
 * Sets the `externalPackages` array to empty `[]` within the `configs` export.
 * @param file The configs.ts file object (FileItem).
 * @param _context The workspace context (unused).
 * @returns The modified file object or void if no changes/error.
 */
export const processConfigFile: TaskFunction = (file, _context) => {
	// Target only the specific config file
	if (file.path !== 'scripts/configs.ts') {
		return undefined;
	}

	logger.info(`[Task: processConfigFile] Processing matched file: ${file.path}`);

	try {
		const originalContent = file.content;
		// Regex to find "externalPackages: [...]" and replace the array part
		// It accounts for optional whitespace around the colon and within the brackets.
		// It uses a non-greedy match `.*?` inside the brackets.
		const regex = /(externalPackages\s*:\s*)\[.*?\]/g;
		const replacement = '$1[]'; // $1 retains the "externalPackages : " part

		const newContent = originalContent.replace(regex, replacement);

		// Check if any changes were actually made
		if (newContent !== originalContent) {
			logger.info(`[Task: processConfigFile] Modified 'externalPackages' in ${file.path}`);

			return {
				...file,
				content: newContent,
				updatedAt: Date.now(),
			};
		} else {
			logger.info(`[Task: processConfigFile] No 'externalPackages' arrays found or modified in ${file.path}`);
			return undefined; // No changes made
		}
	} catch (error) {
		logger.error(`[Task: processConfigFile] Error processing ${file.path}:`, error);
		return undefined; // Error occurred
	}
};

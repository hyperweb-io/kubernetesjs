import { logger } from '@/lib/logger';

import type { TaskFunction } from './tasks.types';

/**
 * Processes the package.json file
 * Removes the `publishConfig` field and frontend dependencies.
 * @param file The package.json file object (FileItem).
 * @param context The workspace context.
 * @returns The modified file object or void if no changes/error.
 */
export const processPackageJson: TaskFunction = (file, _context) => {
	// This task only applies to the root package.json file
	if (file.path !== 'package.json') {
		return undefined;
	}

	logger.info(`[Task: processPackageJson] Processing matched file: ${file.path}`);

	const depsToFilter = [
		'@chain-registry/types',
		'@interchain-kit/core',
		'@interchain-kit/keplr-extension',
		'@interchain-kit/leap-extension',
		'@interchain-kit/react',
		'@interchain-ui/react',
		'@interchain-ui/react-no-ssr',
		'interchain-kit',
		'next',
		'react',
		'react-dom',
		'react-icons',
		'@types/react',
		'@types/react-dom',
	];

	const resolutionsToFilter = ['react', 'react-dom', '@types/react', '@types/react-dom'];

	try {
		const packageJson = JSON.parse(file.content);
		let changesMade = false;

		// Remove publishConfig if it exists
		if ('publishConfig' in packageJson) {
			delete packageJson.publishConfig;
			changesMade = true;
		}

		// Filter out frontend dependencies
		if (packageJson.dependencies) {
			depsToFilter.forEach((dep) => {
				if (dep in packageJson.dependencies) {
					delete packageJson.dependencies[dep];
					changesMade = true;
				}
			});
		}

		if (packageJson.devDependencies) {
			depsToFilter.forEach((dep) => {
				if (dep in packageJson.devDependencies) {
					delete packageJson.devDependencies[dep];
					changesMade = true;
				}
			});
		}

		// Filter out frontend resolutions
		if (packageJson.resolutions) {
			resolutionsToFilter.forEach((resolution) => {
				if (resolution in packageJson.resolutions) {
					delete packageJson.resolutions[resolution];
					changesMade = true;
				}
			});
		}

		if (changesMade) {
			return {
				...file,
				content: JSON.stringify(packageJson, null, 2),
				updatedAt: Date.now(),
			};
		} else {
			logger.info(`[Task: processPackageJson] No changes needed in ${file.path}`);
			return undefined;
		}
	} catch (error) {
		logger.error(`[Task: processPackageJson] Error processing ${file.path}:`, error);
		return undefined;
	}
};

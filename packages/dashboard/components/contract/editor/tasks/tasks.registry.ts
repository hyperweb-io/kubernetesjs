import type { TaskRegistry } from './tasks.types';
import { processPackageJson } from './process-package-json';
import { processConfigFile } from './process-configs-file';

/**
 * Registry mapping lifecycle phases to their tasks.
 * Individual tasks are responsible for filtering the files they apply to.
 */
export const taskRegistry: TaskRegistry = {
	// Add other tasks to the appropriate phase arrays
	INIT: [processPackageJson, processConfigFile],
	PREBUILD: [processPackageJson, processConfigFile],
	POSTBUILD: [],
};

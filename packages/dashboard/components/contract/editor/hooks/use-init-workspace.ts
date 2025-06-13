import { useEffect, useState, useRef } from 'react';

import { logger } from '@/lib/logger';
import { useRuntimeConfig } from '@/contexts/runtime-config';
import { workspaceEventEmitter } from '@/components/contract/editor/services/events';
import { registerTasksRunner } from '@/components/contract/editor/tasks/tasks.runner';

import { InitializationStatus, ProjectItem, useContractProject } from './use-contract-project';

// Register task runner once at module level
registerTasksRunner();

/**
 * Hook to ensure the contract project workspace is initialized and runs INIT tasks.
 * It reads the initialization status from the Zustand store, triggers
 * initialization if needed, and runs INIT lifecycle tasks once initialization is complete.
 *
 * @param fallbackProjectItems Optional fallback items to use if initializing from scratch.
 * @returns The current initialization status from the store.
 */
export function useInitWorkspace({
	fallbackProjectItems,
}: {
	fallbackProjectItems?: Record<string, ProjectItem>;
}): InitializationStatus {
	const { config } = useRuntimeConfig();
	// Select necessary state and actions
	const store = useContractProject();
	const { initializationStatus, initializeProject } = store;
	const [initTasksRun, setInitTasksRun] = useState(false);

	// Keep track of the previous status to detect the transition
	const prevStatusRef = useRef<InitializationStatus>();

	useEffect(() => {
		if (!config) return;

		// Trigger initialization only if the status is 'idle'
		if (initializationStatus === 'idle' && prevStatusRef.current !== 'idle') {
			logger.info('[useInitWorkspace] Status is idle, triggering initialization...');
			setInitTasksRun(false); // Reset task flag on new initialization attempt
			initializeProject({ fallbackItems: fallbackProjectItems, config });
		}

		// Run INIT tasks when initialization completes successfully
		if (initializationStatus === 'initialized' && prevStatusRef.current === 'initializing' && !initTasksRun) {
			logger.info('[useInitWorkspace] Initialization complete, emitting INIT event...');
			setInitTasksRun(true); // Set flag immediately to prevent re-emission

			workspaceEventEmitter.emit('INIT', { store }).catch((error) => {
				logger.error('[useInitWorkspace] Error emitting INIT event:', error);
			});
		}

		// Update previous status ref *after* checks
		prevStatusRef.current = initializationStatus;
	}, [initializationStatus, initializeProject, fallbackProjectItems, config, initTasksRun, store]);

	// Return the current status directly from the store
	return initializationStatus;
}

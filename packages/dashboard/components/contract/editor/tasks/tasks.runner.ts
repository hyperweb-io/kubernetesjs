import { logger } from '@/lib/logger';

import type { ContractProjectActions, ContractProjectState, FileItem } from '../hooks/use-contract-project';
import { workspaceEventEmitter, WorkspaceLifecyclePayload } from '../services/events';
import { taskRegistry } from './tasks.registry';
import type { TaskFunction, WorkspaceContext } from './tasks.types';
import type { WorkspaceEvent } from '../services/events';

type FullProjectStore = ContractProjectState & ContractProjectActions;

/**
 * The core logic for running tasks for a specific phase and store state.
 * @param phase The lifecycle phase.
 * @param store The project store instance.
 */
async function executeTasksForPhase(phase: WorkspaceEvent, store: FullProjectStore): Promise<void> {
	const { items, updateFileContent } = store;
	const currentFileItems = Object.values(items).filter((item): item is FileItem => item.type === 'file');

	const tasksForPhase: TaskFunction[] = taskRegistry[phase] ?? [];

	if (tasksForPhase.length === 0) {
		return;
	}

	const context: WorkspaceContext = {};

	for (const fileItem of currentFileItems) {
		let fileModifiedInPhase = false;
		let taskFileItem: FileItem = { ...fileItem };

		for (const taskFn of tasksForPhase) {
			try {
				const result = await taskFn(taskFileItem, context);
				if (result && typeof result === 'object' && 'content' in result) {
					if (result.content !== taskFileItem.content) {
						taskFileItem = { ...result, updatedAt: Date.now() };
						fileModifiedInPhase = true;
					}
				}
			} catch (error) {
				logger.error(
					`[TaskRunner] Error executing task '${taskFn.name || 'anonymous'}' for ${taskFileItem.path} in phase ${phase}:`,
					error,
				);
			}
		}

		if (fileModifiedInPhase) {
			const updateResult = updateFileContent(taskFileItem.id, taskFileItem.content);
			if (!updateResult.success) {
				logger.error(
					`[TaskRunner] Failed to update file content in store for ${taskFileItem.path}: ${updateResult.error}`,
				);
			}
		}
	}
}

// --- Register listeners for lifecycle events --- //

function createListenerForPhase(phase: WorkspaceEvent) {
	return async (payload: WorkspaceLifecyclePayload) => {
		await executeTasksForPhase(phase, payload.store);
	};
}

export function registerTasksRunner() {
	workspaceEventEmitter.on('INIT', createListenerForPhase('INIT'));
	workspaceEventEmitter.on('PREBUILD', createListenerForPhase('PREBUILD'));
	workspaceEventEmitter.on('POSTBUILD', createListenerForPhase('POSTBUILD'));
}

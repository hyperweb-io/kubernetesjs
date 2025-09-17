import { logger } from '@/lib/logger';

import type { ContractProjectActions, ContractProjectState } from '../hooks/use-contract-project';

// Define specific event types
export type WorkspaceLifecycleEvent = 'INIT' | 'PREBUILD' | 'POSTBUILD';
export type KeyboardEventName = 'KEY_DOWN';
export type EditorActionEventName = 'FOCUS_EDITOR';

// Union of all possible event names
export type WorkspaceEvent = WorkspaceLifecycleEvent | KeyboardEventName | EditorActionEventName;

// Define payload for lifecycle events
export type FullProjectStore = ContractProjectState & ContractProjectActions;
export type WorkspaceLifecyclePayload = {
	store: FullProjectStore;
};

// Define payload for keyboard events
export type KeyDownEventPayload = {
	event: KeyboardEvent;
};

// FOCUS_EDITOR doesn't need a payload, but we need to handle it in the union
export type FocusEditorPayload = undefined;

// Union of all possible payloads
export type AllEventPayloads = WorkspaceLifecyclePayload | KeyDownEventPayload | FocusEditorPayload;

type Listener<E extends WorkspaceEvent> = (
	payload: E extends WorkspaceLifecycleEvent
		? WorkspaceLifecyclePayload
		: E extends KeyboardEventName
			? KeyDownEventPayload
			: E extends EditorActionEventName
				? FocusEditorPayload
				: never,
) => void | Promise<void>;

const listeners = new Map<WorkspaceEvent, Set<Listener<any>>>();

/**
 * Registers a listener for a specific workspace event.
 * @param eventName The event name to listen for.
 * @param listener The function to call when the event is emitted.
 */
function on<E extends WorkspaceEvent>(eventName: E, listener: Listener<E>): void {
	if (!listeners.has(eventName)) {
		listeners.set(eventName, new Set());
	}
	listeners.get(eventName)?.add(listener);
}

/**
 * Unregisters a listener for a specific workspace event.
 * @param eventName The event name.
 * @param listener The listener function to remove.
 */
function off<E extends WorkspaceEvent>(eventName: E, listener: Listener<E>): void {
	listeners.get(eventName)?.delete(listener);
}

/**
 * Emits a workspace event, calling all registered listeners.
 * @param eventName The event name to emit.
 * @param payload The payload for the event.
 */
async function emit<E extends WorkspaceEvent>(
	eventName: E,
	payload: E extends WorkspaceLifecycleEvent
		? WorkspaceLifecyclePayload
		: E extends KeyboardEventName
			? KeyDownEventPayload
			: E extends EditorActionEventName
				? FocusEditorPayload
				: never,
): Promise<void> {
	const eventListeners = listeners.get(eventName);

	if (!eventListeners || eventListeners.size === 0) {
		return;
	}

	// Execute listeners sequentially
	for (const listener of eventListeners) {
		try {
			await (listener as Listener<E>)(payload);
		} catch (error) {
			logger.error(`[EventEmitter] Error in listener for event ${eventName}:`, error);
		}
	}
}

export const workspaceEventEmitter = {
	on,
	off,
	emit,
};

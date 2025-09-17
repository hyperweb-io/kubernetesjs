import { useEffect, useCallback, useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { XIcon } from 'lucide-react';

import { workspaceEventEmitter, KeyDownEventPayload } from '../services/events';
import { useEditorTabs } from './use-editor-tabs';
import { specialKeysDisplayMap } from '@/components/ui/kbd';
import { isMacOS } from '@/lib/utils';

export interface ShortcutDefinition {
	name: string; // Internal identifier
	humanReadableLabel: string;
	label: string; // User-visible label (e.g., '⇧ + ⌘ + ⌫')
	icon?: LucideIcon; // Optional icon component
	keys: string[]; // Array of key names (e.g., ['shift', 'meta', 'backspace'])
}

function generateLabel(keys: string[]): string {
	return keys.map((key) => specialKeysDisplayMap[key.toLowerCase()] || key.toUpperCase()).join(' + '); // Use ' + ' as separator for readability
}

const closeTabKeysMac = ['shift', 'meta', 'backspace'];
const closeTabKeysOther = ['shift', 'ctrl', 'backspace'];

// Determine which key set to use using the helper function
const platformIsMac = isMacOS();
const closeTabKeys = platformIsMac ? closeTabKeysMac : closeTabKeysOther;

// List of shortcuts managed by this hook
export const editorShortcuts: ShortcutDefinition[] = [
	{
		name: 'close-active-tab',
		humanReadableLabel: 'Close active tab',
		label: generateLabel(closeTabKeys),
		icon: XIcon,
		keys: closeTabKeys, // Store the raw keys
	},
];

type ShortcutHandler = (event: KeyboardEvent) => void;

interface InternalShortcut {
	name: string; // For debugging/identification
	matches: (event: KeyboardEvent) => boolean;
	handle: ShortcutHandler;
}

/**
 * Hook to manage global editor keyboard shortcuts via event emitter.
 * Uses a structured internal approach for clarity.
 */
export function useShortcuts() {
	// Define the handler logic for closing the active tab
	const handleCloseActiveTab = useCallback((event: KeyboardEvent) => {
		// The platform check is now done within the matches function
		event.preventDefault();
		const { activeTabId, closeTab } = useEditorTabs.getState();
		if (activeTabId !== null) {
			closeTab(activeTabId);
			workspaceEventEmitter.emit('FOCUS_EDITOR', undefined);
		}
	}, []);

	const internalShortcuts: InternalShortcut[] = useMemo(
		() => [
			{
				name: 'close-active-tab',
				// Update the matches function to use the helper function
				matches: (event) => {
					// Use the helper function here as well
					const isMacPlatform = isMacOS();
					const modifier = isMacPlatform ? event.metaKey : event.ctrlKey;
					return event.shiftKey && modifier && !event.altKey && event.key === 'Backspace';
				},
				handle: handleCloseActiveTab,
			},
			// Add other internal shortcuts here, e.g.:
			// {
			//   name: 'save-file',
			//   matches: (event) => (event.metaKey || event.ctrlKey) && event.key === 's',
			//   handle: handleSaveFile, // Assuming handleSaveFile is defined
			// },
		],
		[handleCloseActiveTab],
	);

	// Main event handler that iterates through internal shortcuts
	const handleKeyDown = useCallback(
		(payload: KeyDownEventPayload) => {
			const { event } = payload;

			const matchedShortcut = internalShortcuts.find((sc) => sc.matches(event));

			if (matchedShortcut) {
				matchedShortcut.handle(event);
			}
		},
		[internalShortcuts],
	);

	useEffect(() => {
		workspaceEventEmitter.on('KEY_DOWN', handleKeyDown);
		return () => {
			workspaceEventEmitter.off('KEY_DOWN', handleKeyDown);
		};
	}, [handleKeyDown]);
}

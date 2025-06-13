import { useCallback, useMemo } from 'react';

import { toast } from '@/hooks/use-toast';

import { SourceViewerSkeleton } from '../contract-editor-skeletons';
import { getLanguageFromFileName } from '../contract-editor.utils';
import { ContractSourceViewer } from '../contract-source-viewer';
import { useContractProject } from '../hooks/use-contract-project';
import { useEditorTabs } from '../hooks/use-editor-tabs';
import { PanelProps } from './source-browser-panel';

export function SourceViewer({ isReady }: PanelProps) {
	const { activeTabId } = useEditorTabs();
	const getItemById = useContractProject((state) => state.getItemById);
	const getCurrentContent = useContractProject((state) => state.getCurrentFileContent);
	const updateUnsavedContent = useContractProject((state) => state.updateUnsavedContent);
	const saveFile = useContractProject((state) => state.saveFile);
	const hasAppliedVariables = useContractProject((state) => state.hasAppliedVariables);

	const file = activeTabId ? getItemById(activeTabId, 'file') : null;

	const currentContent = useMemo(
		() => (activeTabId ? getCurrentContent(activeTabId) || '' : ''),
		[activeTabId, getCurrentContent, hasAppliedVariables],
	);

	const handleCodeChange = useCallback(
		(newCode: string | undefined) => {
			if (!activeTabId || newCode === undefined) return;

			updateUnsavedContent(activeTabId, newCode);
		},
		[activeTabId, updateUnsavedContent],
	);

	const handleSave = useCallback(() => {
		if (!activeTabId) return;

		const result = saveFile(activeTabId);

		if (!result.success) {
			toast({
				title: 'Failed to save changes',
				description: result.error,
				variant: 'destructive',
				duration: 3000,
			});
		}
	}, [activeTabId, saveFile]);

	if (!isReady) return <SourceViewerSkeleton />;
	if (!activeTabId || !file) return null;

	return (
		<div className='h-full'>
			<ContractSourceViewer
				value={currentContent}
				language={getLanguageFromFileName(file.name)}
				onChange={handleCodeChange}
				onSaveChanges={handleSave}
				fileId={activeTabId}
			/>
		</div>
	);
}

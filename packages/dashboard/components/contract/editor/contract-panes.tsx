import { useCallback, useEffect, useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { lockPageScroll, unlockPageScroll } from '@/lib/dom';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Spinner } from '@/components/common/spinner';

import { BuildErrors } from './contract-editor-errors';
import { ContractEditorToolbar } from './contract-editor-toolbar';
import { ContractEditorProvider } from './contract-editor.provider';
import { ProjectItem } from './hooks/use-contract-project';
import { useInitWorkspace } from './hooks/use-init-workspace';
import { useShortcuts } from './hooks/use-shortcuts';
import { EditorTabsPanel } from './panels/editor-tabs-panel';
import { ErrorPanel } from './panels/error-panel';
import { SourceBrowser } from './panels/source-browser-panel';
import { SourceViewer } from './panels/source-viewer-panel';
import { workspaceEventEmitter } from './services/events';

export interface ContractPanesProps {
	toolbar?: React.ReactNode;
	editorPanel?: React.ReactNode;
	errorPanel?: React.ReactNode;
	fallbackProjectItems?: Record<string, ProjectItem>;
}

export function ContractPanes({ toolbar, fallbackProjectItems }: ContractPanesProps) {
	const [buildErrors, setBuildErrors] = useState<BuildErrors[]>([]);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Register workspace shortcuts
	useShortcuts();

	const initStatus = useInitWorkspace({ fallbackProjectItems });

	const isWorkspaceReady = initStatus === 'initialized';

	useEffect(() => {
		// hide page scrollbar when fullscreen
		if (isFullscreen) {
			lockPageScroll();
		} else {
			unlockPageScroll();
		}

		return () => {
			unlockPageScroll();
		};
	}, [isFullscreen]);

	useEffect(() => {
		const handleFocusRequest = () => {
			containerRef.current?.focus({ preventScroll: true }); // preventScroll might be useful
		};

		workspaceEventEmitter.on('FOCUS_EDITOR', handleFocusRequest);

		return () => {
			workspaceEventEmitter.off('FOCUS_EDITOR', handleFocusRequest);
		};
	}, []);

	const handleContainerKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
		workspaceEventEmitter.emit('KEY_DOWN', { event: event.nativeEvent });
	}, []);

	return (
		<ContractEditorProvider>
			<TooltipProvider>
				<div
					ref={containerRef}
					onKeyDown={handleContainerKeyDown}
					tabIndex={-1}
					className={cn(
						'scrollbar-neutral h-full w-full overflow-auto rounded-lg border bg-background focus:outline-none',
						isFullscreen && 'fixed inset-0 z-50 overflow-hidden rounded-none border-none',
					)}
				>
					<PanelGroup direction='vertical' className='h-full min-w-[800px] rounded-lg'>
						<ContractEditorToolbar
							onBuildError={setBuildErrors}
							isFullscreen={isFullscreen}
							onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
						>
							{toolbar}
						</ContractEditorToolbar>
						<Panel defaultSize={80}>
							<div className='relative h-full w-full'>
								{!isWorkspaceReady && (
									<div className='absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
										<Spinner className='size-8' />
									</div>
								)}

								<PanelGroup direction='horizontal' className='h-full'>
									<Panel
										collapsible={true}
										collapsedSize={isFullscreen ? 15 : 20}
										minSize={isFullscreen ? 10 : 15}
										defaultSize={isFullscreen ? 15 : 20}
										data-testid='source-browser'
									>
										<SourceBrowser isReady={isWorkspaceReady} />
									</Panel>
									<PanelResizeHandle className='w-[1px] bg-border transition-colors hover:bg-muted-foreground/50' />
									<Panel minSize={30} data-testid='source-viewer'>
										<div className='h-full w-full'>
											<EditorTabsPanel isReady={isWorkspaceReady} />
											<SourceViewer isReady={isWorkspaceReady} />
										</div>
									</Panel>
								</PanelGroup>
							</div>
						</Panel>
						<PanelResizeHandle className='h-[1px] bg-border transition-colors hover:bg-muted-foreground/50' />
						<Panel collapsible={true} defaultSize={20} minSize={10} data-testid='error-panel'>
							<ErrorPanel isReady={isWorkspaceReady} errors={buildErrors} />
						</Panel>
					</PanelGroup>
				</div>
			</TooltipProvider>
		</ContractEditorProvider>
	);
}

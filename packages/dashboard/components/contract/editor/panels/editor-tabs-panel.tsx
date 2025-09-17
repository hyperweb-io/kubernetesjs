'use client';

import { memo, useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { cn, truncateString } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { TabsSkeleton } from '../contract-editor-skeletons';
import { useContractEditor } from '../contract-editor.provider';
import { makeFocusTabKey } from '../contract-editor.utils';
import { useContractProject } from '../hooks/use-contract-project';
import { useEditorTabs } from '../hooks/use-editor-tabs';
import { EditorTabMenu } from '../menus/editor-tab-menu';
import { FileTab } from '../use-contract-tabs';
import { PanelProps } from './source-browser-panel';

const TabTriggerContent = memo(
  ({
    tab,
    handleTabClose,
    dirtyTabIds,
    ...restProps
  }: {
    tab: FileTab;
    handleTabClose: (id: string, e: React.MouseEvent) => void;
    dirtyTabIds: string[];
  }) => {
    const [isHovering, setIsHovering] = useState(false);
    const isTabDirty = dirtyTabIds.includes(tab.id);

    const showDot = isTabDirty && !isHovering;

    return (
      <div className="group relative inline-flex items-center" {...restProps}>
        <Tooltip delayDuration={1200}>
          <TooltipTrigger>
            <TabsTrigger asChild variant="outline" value={tab.id} className="pr-8" id={makeFocusTabKey(tab.id)}>
              <span>{truncateString(tab.name, 20)}</span>
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[300px]">
            <p className="text-xs text-muted-foreground">{tab.path}</p>
          </TooltipContent>
        </Tooltip>
        <div
          className={cn(
            'absolute inset-y-0 right-2 top-[50%] flex h-fit translate-y-[-50%] items-center',
            showDot && 'right-[14px]'
          )}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          data-is-dirty={isTabDirty}
          data-tab-id={tab.id}
        >
          {showDot ? (
            <div
              className="h-2 w-2 cursor-pointer rounded-full bg-orange-500"
              onClick={(e) => handleTabClose(tab.id, e)}
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleTabClose(tab.id, e)}
              className="h-5 w-5 text-muted-foreground hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Close tab</span>
            </Button>
          )}
        </div>
      </div>
    );
  },
  (prev, next) => {
    return prev.tab === next.tab && prev.dirtyTabIds === next.dirtyTabIds;
  }
);

TabTriggerContent.displayName = 'TabTriggerContent';

export function EditorTabsPanel({ isReady }: PanelProps) {
  const { openTabs, activeTabId, closeTab, setActiveTab, isTabDirty, dirtyTabIds } = useEditorTabs();
  const saveFile = useContractProject((state) => state.saveFile);
  const discardChanges = useContractProject((state) => state.discardUnsavedChanges);
  const { selectedNodeIds, clearSelection, selectNode } = useContractEditor();
  const [tabToClose, setTabToClose] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle browser tab close with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (dirtyTabIds.length > 0) {
        event.preventDefault();
        // Included for legacy support (older browsers)
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dirtyTabIds]);

  const handleTabClose = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (isTabDirty(tabId)) {
      setTabToClose(tabId);
      return;
    }

    if (selectedNodeIds.includes(tabId)) {
      clearSelection();
    }
    closeTab(tabId);
  };

  const handleSaveAndClose = () => {
    if (!tabToClose) return;

    const result = saveFile(tabToClose);
    if (result.success) {
      toast({
        title: 'File saved successfully',
        variant: 'success',
        duration: 2000,
      });
      closeTab(tabToClose);
      setTabToClose(null);
    } else {
      toast({
        title: 'Failed to save changes',
        description: result.error,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const handleDiscardAndClose = () => {
    if (!tabToClose) return;

    const result = discardChanges(tabToClose);

    if (result.success) {
      toast({
        title: 'Changes discarded',
        duration: 2000,
      });
      closeTab(tabToClose);
      setTabToClose(null);
    } else {
      toast({
        title: 'Failed to discard changes',
        description: result.error,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const handleTabSelect = (tabId: string) => {
    // When a tab is selected, also select its corresponding node in the tree
    selectNode(tabId);
  };

  if (!isReady) return <TabsSkeleton />;

  return (
    <>
      <Tabs
        defaultValue={openTabs[0]?.id}
        value={activeTabId ?? undefined}
        onValueChange={(value) => {
          setActiveTab(value);
          handleTabSelect(value);
        }}
        className={cn('h-[42px] w-full overflow-y-hidden pt-1')}
      >
        <TabsList variant="outline" className="w-full px-1">
          {openTabs.map((tab) => (
            <EditorTabMenu key={tab.id} id={tab.id} name={tab.name} path={tab.path}>
              <TabTriggerContent tab={tab} handleTabClose={handleTabClose} dirtyTabIds={dirtyTabIds} />
            </EditorTabMenu>
          ))}
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 rounded-none border-b border-transparent px-2 text-muted-foreground
                  hover:bg-muted/50"
                onClick={() => {
                  // TODO: We'll implement this later
                  console.log('Create new file');
                }}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">New file</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="px-2 py-1">
              <p className="text-xs text-body-text">Create new file (Ctrl+N)</p>
            </TooltipContent>
          </Tooltip> */}
        </TabsList>
      </Tabs>

      <AlertDialog open={!!tabToClose} onOpenChange={() => setTabToClose(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>Do you want to save the changes before closing?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTabToClose(null)}>Go back</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardAndClose}>Discard changes</AlertDialogAction>
            <AlertDialogAction onClick={handleSaveAndClose}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

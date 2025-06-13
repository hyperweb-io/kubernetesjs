'use client';

import { useState } from 'react';

import { FileTreeView, TreeViewEvents } from '@/components/ui/treeview';

import { SourceBrowserSkeleton } from '../contract-editor-skeletons';
import { useContractEditor } from '../contract-editor.provider';
import { buildFileTree, getFolderType } from '../contract-editor.utils';
import { useContractProject } from '../hooks/use-contract-project';
import { useEditorTabs } from '../hooks/use-editor-tabs';
import { ActionItem, FileActionDialog, FileActionType } from '../menus/file-action-dialog';
import { TreeViewNodeMenu } from '../menus/treeview-node-menu';

export interface PanelProps {
  isReady: boolean;
}

export function SourceBrowser({ isReady }: PanelProps) {
  const { selectedNodeIds, handleSelectionChange } = useContractEditor();
  const openTab = useEditorTabs((state) => state.openTab);
  const items = useContractProject((state) => state.items);
  const fileTree = buildFileTree(items);

  const [item, setItem] = useState<ActionItem | null>(null);
  const [actionType, setActionType] = useState<FileActionType | null>(null);

  if (!isReady) return <SourceBrowserSkeleton />;

  const handleSelectionChangeEvent: TreeViewEvents['onSelectionChange'] = ({ selectedValue }) => {
    handleSelectionChange(selectedValue);

    const lastSelected = selectedValue[selectedValue.length - 1];
    const item = items[lastSelected];
    const isFolder = item?.type === 'folder';
    if (!item || isFolder) return;

    openTab({
      id: item.id,
      name: item.name,
      path: item.path,
    });
  };

  const handleExpandedChange: TreeViewEvents['onExpandedChange'] = ({ expandedValue: _expandedValue }) => {
    // const lastExpanded = expandedValue[expandedValue.length - 1];
    // if (!lastExpanded) return;
    // const folderType = getFolderType(lastExpanded);
    // if (folderType) {
    // 	const wasExpanded = expandedValue.includes(lastExpanded);
    // 	console.log(`Folder ${folderType} ${wasExpanded ? 'expanded' : 'collapsed'}`);
    // }
  };

  const handleFocusChange: TreeViewEvents['onFocusChange'] = () => {
    // console.log('Focused contract:', focusedValue);
  };

  return (
    <>
      <FileTreeView
        collection={fileTree}
        onSelectionChange={handleSelectionChangeEvent}
        onExpandedChange={handleExpandedChange}
        onFocusChange={handleFocusChange}
        selectedValue={selectedNodeIds}
        className="pt-1"
        nodePostfix={(node) => (
          <TreeViewNodeMenu
            type={node.type}
            onMenuItemClick={(action) => {
              setItem({ id: node.id, name: node.name, path: node.path });
              setActionType(action);
            }}
          />
        )}
      />

      {item && <FileActionDialog item={item} actionType={actionType} onClose={() => setActionType(null)} />}
    </>
  );
}

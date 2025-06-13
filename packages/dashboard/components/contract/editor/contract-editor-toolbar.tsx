'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, FilePlus, FolderPlus, Maximize, Minimize, Play, RotateCcw, Settings } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button, ButtonProps } from '@/components/ui/button';
import { Shortcut } from '@/components/ui/kbd';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getHyperwebConfig } from '@/configs/hyperweb-config';
import { routes } from '@/routes';

import type { BuildErrors } from './contract-editor-errors';
import { exportProjectAsZip } from './contract-editor.utils';
import { useBuildContracts } from './hooks/use-build-contracts';
import { ProjectItem, ROOT_ID, useContractProject } from './hooks/use-contract-project';
import { useEditorTabs } from './hooks/use-editor-tabs';
import { FileActionDialog, FileActionType } from './menus/file-action-dialog';
import { ResetProjectDialog } from './panels/dev-features-panel';
import { EditorShortcutsDisplay } from './settings/editor-shortcuts';
import { SettingsDialog } from './settings/settings-dialog';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonProps['variant'];
  shortcut?: string[];
}

function ToolbarButton({ icon, label, onClick, disabled, variant, shortcut, ...restProps }: ToolbarButtonProps) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          onClick={onClick}
          disabled={disabled}
          className="h-8 w-8 rounded-md"
          {...restProps}
        >
          {icon}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="flex items-center gap-2 text-body-text">
        {label}
        {shortcut && <Shortcut keys={shortcut} className="ml-2 border-l pl-2" />}
      </TooltipContent>
    </Tooltip>
  );
}

interface ContractEditorToolbarProps {
  children: React.ReactNode;
  onBuildError?: (errors: BuildErrors[]) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  fallbackProjectItems?: Record<string, ProjectItem>;
}

export function ContractEditorToolbar({
  children,
  onBuildError,
  isFullscreen = false,
  onToggleFullscreen,
  fallbackProjectItems,
}: ContractEditorToolbarProps) {
  const config = getHyperwebConfig();
  const { toast } = useToast();
  const router = useRouter();
  const items = useContractProject((state) => state.items);
  const variables = useContractProject((state) => state.variables);
  const hasAppliedVariables = useContractProject((state) => state.hasAppliedVariables);
  const resetProject = useContractProject((state) => state.resetProject);
  const { build } = useBuildContracts({ onError: onBuildError });
  const { getActiveTab, activeTabId } = useEditorTabs();

  const [actionType, setActionType] = useState<FileActionType | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showExportAlert, setShowExportAlert] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const activeContractTab = useMemo(() => {
    const tab = getActiveTab();
    if (tab && tab.path.startsWith('dist/') && tab.path.endsWith('.js')) return tab;
    return null;
  }, [activeTabId]);

  const hasUnsetVariables = useMemo(() => {
    return variables.some((variable) => !variable.value);
  }, [variables]);

  const handleExport = async () => {
    if (hasUnsetVariables) {
      setShowExportAlert(true);
      return;
    }

    await exportProject();
  };

  const exportProject = async () => {
    try {
      await exportProjectAsZip(items, hasAppliedVariables ? undefined : variables);

      toast({
        title: 'Export complete',
        description: 'Your project has been downloaded successfully.',
        variant: 'success',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Failed to export project',
        variant: 'destructive',
      });
    }
  };

  const handleSetVariables = () => {
    setShowExportAlert(false);
    setIsSettingsOpen(true);
  };

  const handleIgnoreAndExport = () => {
    setShowExportAlert(false);
    exportProject();
  };

  const handleDeploy = () => {
    if (!activeContractTab) return;
    const url = `${routes.playground.deploy}?contractId=${activeContractTab.id}`;
    router.push(url);
  };

  const handleResetConfirm = () => {
    if (!config) return;
    resetProject({ fallbackItems: fallbackProjectItems, config });
  };

  return (
    <>
      <div
        className="flex h-12 w-full items-center justify-between border-b bg-card px-4"
        data-testid="contract-panes-toolbar"
      >
        <div className="flex items-center gap-2">
          {/* {defaultTemplateId ? (
            <ContractEditorFileToolbarMenu
              trigger={
                <Button
                  variant="text"
                  size="icon"
                  title="New File"
                  className="h-8 w-8 rounded-md"
                >
                  <PlusSquareIcon className="h-4 w-4" />
                </Button>
              }
            />
          ) : (
            <ToolbarButton
              variant="text"
              icon={<PlusSquareIcon className="h-4 w-4" />}
              label="New File"
              disabled
            />
          )} */}

          <ToolbarButton
            variant="text"
            icon={<FilePlus className="h-4 w-4" />}
            label="New File"
            onClick={() => setActionType('createFile')}
          />

          <ToolbarButton
            variant="text"
            icon={<FolderPlus className="h-4 w-4" />}
            label="New Folder"
            onClick={() => setActionType('createFolder')}
          />

          <div className="mx-2 h-4 w-px bg-border" />

          <ToolbarButton variant="ghost" icon={<Play className="h-4 w-4" />} label="Build contracts" onClick={build} />

          {activeContractTab && (
            <Button onClick={handleDeploy} className="ml-2 h-7 px-3" size="sm">
              Deploy {activeContractTab.name}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            variant="text"
            icon={isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            onClick={onToggleFullscreen}
          />
          <ToolbarButton
            variant="text"
            icon={<RotateCcw className="h-4 w-4" />}
            label="Reset Project"
            onClick={() => setIsResetDialogOpen(true)}
          />
          <ToolbarButton
            variant="text"
            icon={<Download className="h-4 w-4" />}
            label="Export Project"
            onClick={handleExport}
          />
          <ToolbarButton
            variant="text"
            icon={<Settings className="h-4 w-4" />}
            label="Open Settings"
            onClick={() => setIsSettingsOpen(true)}
          />

          <EditorShortcutsDisplay />
          {children}
        </div>
      </div>

      <FileActionDialog
        item={{ id: ROOT_ID, name: '', path: '' }}
        actionType={actionType}
        onClose={() => setActionType(null)}
      />

      <ResetProjectDialog
        isOpen={isResetDialogOpen}
        setIsOpen={setIsResetDialogOpen}
        onResetConfirm={handleResetConfirm}
      />

      <SettingsDialog isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />

      <AlertDialog open={showExportAlert} onOpenChange={setShowExportAlert}>
        <AlertDialogContent className="max-w-[90vw] rounded-lg sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Project Variables Not Set</AlertDialogTitle>
            <AlertDialogDescription>
              The project variables have not been set yet. Would you like to set them before exporting? If you continue
              without setting them, the variables will remain as placeholders in the exported files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setShowExportAlert(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleIgnoreAndExport}>
              Ignore and Export
            </Button>
            <Button onClick={handleSetVariables}>Set Variables</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

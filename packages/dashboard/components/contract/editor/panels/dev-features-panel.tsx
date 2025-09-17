'use client';

import { RefObject, useState } from 'react';
import { AlertTriangle, Construction } from 'lucide-react';
import { motion } from 'motion/react';
import { ImperativePanelHandle } from 'react-resizable-panels';

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getHyperwebConfig } from '@/configs/hyperweb-config';
import { ProjectItem, useContractProject } from '../hooks/use-contract-project';

export const ResetProjectDialog = ({
  isOpen,
  setIsOpen,
  onResetConfirm,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onResetConfirm: () => void;
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Project</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reset the project? All changes will be lost and cannot be recovered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onResetConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface DevFeaturesPanelProps {
  onResetProject?: () => void;
  panelRef: RefObject<ImperativePanelHandle>;
  isPanelCollapsed?: boolean;
  fallbackProjectItems?: Record<string, ProjectItem>;
}

export function DevFeaturesPanel({ onResetProject, fallbackProjectItems }: DevFeaturesPanelProps) {
  const config = getHyperwebConfig();
  const resetProject = useContractProject((state) => state.resetProject);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleResetConfirm = () => {
    if (!config) return;
    resetProject({ fallbackItems: fallbackProjectItems, config });

    // Call the optional callback if provided
    if (onResetProject) {
      onResetProject();
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-4">
      {/* Construction Banner */}
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative mb-2 cursor-pointer overflow-hidden rounded-md border border-yellow-500
                bg-yellow-100 dark:bg-yellow-950/30"
              whileHover={{
                scale: 1.02,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
              onClick={() => {
                // Could add functionality here in the future
                console.log('Construction banner clicked');
              }}
            >
              <motion.div
                className="absolute inset-0
                  bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#f59e0b_10px,#f59e0b_20px)]"
                style={{ opacity: 0.2 }}
                animate={{
                  backgroundPosition: ['0px 0px', '20px 20px'],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'linear',
                }}
              />
              <div className="relative flex items-center gap-2 p-3">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                >
                  <Construction className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                </motion.div>
                <div className="flex flex-col">
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">Developer features</p>
                </div>
              </div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p>These developer features are experimental and may change in future updates. Use with caution!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex flex-col gap-2">
        <Button size="sm" onClick={() => setIsResetDialogOpen(true)} className="flex w-full items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Reset Project</span>
        </Button>
        <p className="text-sm text-muted-foreground">
          This will reset the project to the initial state and delete all changes.
        </p>
      </div>

      <ResetProjectDialog
        isOpen={isResetDialogOpen}
        setIsOpen={setIsResetDialogOpen}
        onResetConfirm={handleResetConfirm}
      />
    </div>
  );
}

import { useEffect, useState } from 'react';

import { useToast } from '@/hooks/use-toast';
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { NodeType } from '@/components/ui/treeview';

import { validateTreeViewItemName } from '../contract-editor.utils';
import { OperationResult, ProjectItem, useContractProject } from '../hooks/use-contract-project';

export type FileActionType = 'createFile' | 'createFolder' | 'rename' | 'delete';

type BaseActionConfig = {
	title: string;
	submitLabel: string;
};

type InputActionConfig = BaseActionConfig & {
	type: 'input';
	placeholder: string;
	getInitialValue?: (itemName: string) => string;
};

type DeleteActionConfig = BaseActionConfig & {
	type: 'delete';
	description: (name: string) => string;
};

type ActionConfig = InputActionConfig | DeleteActionConfig;

const ACTION_CONFIGS: Record<FileActionType, ActionConfig> = {
	createFile: {
		type: 'input',
		title: 'Create New File',
		placeholder: 'Enter file name',
		submitLabel: 'Create',
		getInitialValue: () => '',
	},
	createFolder: {
		type: 'input',
		title: 'Create New Folder',
		placeholder: 'Enter folder name',
		submitLabel: 'Create',
		getInitialValue: () => '',
	},
	rename: {
		type: 'input',
		title: 'Rename',
		placeholder: 'Enter new name',
		submitLabel: 'Save',
		getInitialValue: (itemName) => itemName,
	},
	delete: {
		type: 'delete',
		title: 'Delete',
		description: (name: string) => `This will permanently delete ${name}. This action cannot be undone.`,
		submitLabel: 'Delete',
	},
} as const;

export type ActionItem = Pick<ProjectItem, 'id' | 'name' | 'path'>;

interface FileActionDialogProps {
	item: ActionItem;
	onClose: () => void;
	actionType: FileActionType | null;
}

export function FileActionDialog({ item, onClose, actionType }: FileActionDialogProps) {
	const { toast } = useToast();
	const items = useContractProject((state) => state.items);
	const renameItem = useContractProject((state) => state.renameItem);
	const deleteItem = useContractProject((state) => state.deleteItem);
	const createFile = useContractProject((state) => state.createFile);
	const createFolder = useContractProject((state) => state.createFolder);

	const [inputValue, setInputValue] = useState('');
	const [touched, setTouched] = useState(false);

	const shouldOpen = !!actionType;

	useEffect(() => {
		if (shouldOpen && config.type === 'input' && config.getInitialValue) {
			setInputValue(config.getInitialValue(name));
		}
		if (!shouldOpen) {
			setTouched(false);
			setInputValue('');
			onClose();
		}
	}, [shouldOpen]);

	if (!actionType) return null;

	const config = ACTION_CONFIGS[actionType];
	const { id, name, path } = item;

	const validation = (() => {
		if (!touched) return { isValid: true };

		const targetPath = actionType === 'rename' ? path : `${path}/${inputValue}`;

		return validateTreeViewItemName(items, inputValue, targetPath, actionType === 'rename' ? id : undefined);
	})();

	const showActionToast = (result: OperationResult<unknown>, action: string, successMessage: string) => {
		if (result.success) {
			toast({
				title: `${action} successful`,
				description: successMessage,
				variant: 'success',
				duration: 2000,
			});
		} else {
			toast({
				title: `Failed to ${action.toLowerCase()}`,
				description: result.error || `Unknown error during ${action.toLowerCase()}`,
				variant: 'destructive',
				duration: 2000,
			});
		}
	};

	const handleRename = () => {
		if (!inputValue || inputValue === name) {
			onClose();
			return;
		}
		const result = renameItem(id, inputValue);
		showActionToast(result, 'Rename', `Renamed to ${inputValue}`);
		if (result.success) onClose();
	};

	const handleDelete = () => {
		const result = deleteItem(id);
		showActionToast(result, 'Delete', `${name} has been removed`);
		if (result.success) onClose();
	};

	const handleCreate = (type: NodeType) => {
		if (!inputValue) return;

		const itemPath = path ? `${path}/${inputValue}` : inputValue;
		const result =
			type === 'file'
				? createFile({
						name: inputValue,
						path: itemPath,
						content: '',
					})
				: createFolder({
						name: inputValue,
						path: itemPath,
					});

		showActionToast(result, `Create ${type}`, `Created ${inputValue}`);

		if (result.success) onClose();
	};

	const handleCreateFile = () => handleCreate('file');
	const handleCreateFolder = () => handleCreate('folder');

	const handleOpenChange = (open: boolean) => {
		if (!open) onClose();
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTouched(true);
		setInputValue(e.target.value);
	};

	if (config.type === 'delete') {
		return (
			<AlertDialog open={shouldOpen} onOpenChange={handleOpenChange}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{config.title}</AlertDialogTitle>
						<AlertDialogDescription>{config.description(name || 'this item')}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} className='bg-destructive text-destructive-foreground'>
							{config.submitLabel}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const actionTypeToHandlerMap: Partial<Record<FileActionType, () => void>> = {
			rename: handleRename,
			createFile: handleCreateFile,
			createFolder: handleCreateFolder,
		};

		const handler = actionTypeToHandlerMap[actionType];
		if (handler) handler();
	};

	return (
		<Dialog open={shouldOpen} onOpenChange={handleOpenChange}>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{config.title}</DialogTitle>
					</DialogHeader>
					<div className='py-4'>
						<Input
							value={inputValue}
							onChange={handleInputChange}
							placeholder={config.placeholder}
							className='w-full'
						/>
						{touched && !validation.isValid && validation.error && (
							<p className='mt-2 text-sm text-destructive'>{validation.error}</p>
						)}
					</div>
					<DialogFooter>
						<Button type='button' variant='outline' onClick={onClose}>
							Cancel
						</Button>
						<Button type='submit' disabled={!validation.isValid || !inputValue}>
							{config.submitLabel}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

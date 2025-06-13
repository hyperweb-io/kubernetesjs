import { Copy, FileCode, GitFork, MoreVertical, Upload } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Contract, useContracts } from '@/state/contracts';

import { generateBlankFileName } from '../contract-editor.utils';

interface FileActionsMenuProps {
	trigger?: React.ReactNode;
	className?: string;
}

export function ContractEditorFileToolbarMenu({ trigger, className }: FileActionsMenuProps) {
	const { toast } = useToast();
	const createContract = useContracts((state) => state.createContract);
	const forkContract = useContracts((state) => state.forkContract);
	const getTemplateContracts = useContracts((state) => state.getTemplateContracts);
	const getUserContracts = useContracts((state) => state.getUserContracts);
	const contracts = useContracts((state) => state.contracts);

	const templates = getTemplateContracts();
	const userContracts = getUserContracts();

	const handleCreateBlank = () => {
		const existingFiles = Object.values(contracts).map((c) => c.name);
		const fileName = generateBlankFileName(existingFiles);

		const newId = createContract(fileName, '', 'user');
		if (newId) {
			toast({
				title: 'Contract created',
				description: `Created ${fileName}`,
			});
		}
	};

	const handleImportFile = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.ts';
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;

			try {
				const content = await file.text();
				const existingFiles = Object.values(contracts).map((c) => c.name);

				// Generate unique name if file already exists
				let fileName = file.name;
				if (existingFiles.includes(fileName)) {
					const nameWithoutExt = fileName.replace(/\.ts$/, '');
					let counter = 1;

					while (existingFiles.includes(`${nameWithoutExt}-${counter}.ts`)) {
						counter++;
					}
					fileName = `${nameWithoutExt}-${counter}.ts`;
				}

				const newId = createContract(fileName, content, 'user');
				if (newId) {
					toast({
						title: 'File imported',
						description: `${fileName} has been imported successfully`,
					});
				}
			} catch (error) {
				console.error(error);
				toast({
					title: 'Import failed',
					description: 'Could not import the file',
					variant: 'destructive',
				});
			}
		};
		input.click();
	};

	const handleCopyContract = (contract: Contract) => {
		const newId = createContract(`${contract.name} (Copy)`, contract.sourceCode, 'user');
		if (newId) {
			toast({
				title: 'Contract copied',
				description: `A copy of ${contract.name} has been created`,
			});
		}
	};

	const handleForkContract = (contract: Contract) => {
		const newId = forkContract(contract.id);
		if (newId) {
			toast({
				title: 'Contract forked',
				description: `A fork of ${contract.name} has been created`,
			});
		}
	};

	const defaultTrigger = (
		<Button variant='ghost' size='icon' className='h-8 w-8 text-muted-foreground hover:text-foreground'>
			<MoreVertical className='h-4 w-4' />
			<span className='sr-only'>Open file actions menu</span>
		</Button>
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{trigger || defaultTrigger}</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className={cn('w-48', className)}>
				<DropdownMenuItem onClick={handleCreateBlank}>
					<FileCode className='mr-2 h-4 w-4' />
					New blank file
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuSub>
					<DropdownMenuSubTrigger className='flex items-center'>
						<GitFork className='mr-2 h-4 w-4' />
						From template
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						{templates.map((template) => (
							<DropdownMenuItem key={template.id} onClick={() => handleForkContract(template)}>
								{template.name}
							</DropdownMenuItem>
						))}
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				{userContracts.length > 0 && (
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className='flex items-center'>
							<Copy className='mr-2 h-4 w-4' />
							Copy existing
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							{userContracts.map((userContract) => (
								<DropdownMenuItem key={userContract.id} onClick={() => handleCopyContract(userContract)}>
									{userContract.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				)}

				<DropdownMenuSeparator />

				<DropdownMenuItem onClick={handleImportFile}>
					<Upload className='mr-2 h-4 w-4' />
					Import file
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

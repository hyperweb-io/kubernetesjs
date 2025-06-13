import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';

import { FileActionDialog, FileActionType } from './file-action-dialog';

interface EditorTabMenuProps {
	id: string;
	name: string;
	path: string;
	children: React.ReactNode;
}

export function EditorTabMenu({ id, name, path, children }: EditorTabMenuProps) {
	const [actionType, setActionType] = useState<FileActionType | null>(null);

	return (
		<>
			<ContextMenu>
				<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
				<ContextMenuContent className='w-[160px]'>
					<ContextMenuItem onClick={() => setActionType('rename')}>
						<Pencil className='mr-2 h-4 w-4' />
						Rename
					</ContextMenuItem>
					<ContextMenuItem onClick={() => setActionType('delete')} className='text-destructive focus:text-destructive'>
						<Trash2 className='mr-2 h-4 w-4' />
						Delete
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			<FileActionDialog item={{ id, name, path }} actionType={actionType} onClose={() => setActionType(null)} />
		</>
	);
}

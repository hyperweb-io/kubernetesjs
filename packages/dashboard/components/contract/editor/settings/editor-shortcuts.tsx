import React from 'react';
import { KeyboardIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Shortcut } from '@/components/ui/kbd';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { editorShortcuts, ShortcutDefinition } from '../hooks/use-shortcuts';

export function EditorShortcutsDisplay() {
	return (
		<Popover>
			<Tooltip delayDuration={300}>
				<TooltipTrigger asChild>
					<PopoverTrigger asChild>
						<Button variant='text' size='icon' className='h-8 w-8 rounded-md'>
							<KeyboardIcon className='h-4 w-4' />
							<span className='sr-only'>Keyboard Shortcuts</span>
						</Button>
					</PopoverTrigger>
				</TooltipTrigger>
				<TooltipContent side='bottom' className='text-body-text'>
					Keyboard Shortcuts
				</TooltipContent>
			</Tooltip>
			<PopoverContent className='w-auto p-3'>
				<div className='grid gap-3'>
					<h4 className='font-medium leading-none'>Keyboard Shortcuts</h4>
					<ul className='grid gap-2'>
						{editorShortcuts.map((shortcut: ShortcutDefinition) => (
							<li key={shortcut.name} className='flex items-center justify-between text-sm text-muted-foreground'>
								<p className='mr-4'>{shortcut.humanReadableLabel}</p>
								<Shortcut keys={shortcut.keys} />
							</li>
						))}
					</ul>
				</div>
			</PopoverContent>
		</Popover>
	);
}

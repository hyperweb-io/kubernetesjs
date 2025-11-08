import * as React from 'react';

import { cn } from '@/lib/utils';

export const specialKeysDisplayMap: Record<string, string> = {
	meta: '⌘',
	ctrl: 'Ctrl',
	alt: '⌥',
	shift: '⇧',
	enter: '↵',
	backspace: '⌫',
	delete: '⌦',
	escape: 'Esc',
	tab: '⇥',
	capslock: '⇪',
	arrowup: '↑',
	arrowdown: '↓',
	arrowleft: '←',
	arrowright: '→',
};

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
	className?: string;
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => {
	return (
		<kbd
			ref={ref}
			className={cn(
				'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5',
				'font-mono font-medium',
				'text-xs',
				'border-border bg-muted text-muted-foreground',
				className,
			)}
			{...props}
		/>
	);
});
Kbd.displayName = 'Kbd';

function getKeyDisplay(key: string): string {
	const lowerKey = key.toLowerCase();
	return specialKeysDisplayMap[lowerKey] || key.toUpperCase();
}

interface ShortcutProps extends React.HTMLAttributes<HTMLDivElement> {
	keys: string[];
	className?: string;
}

const Shortcut = React.forwardRef<HTMLDivElement, ShortcutProps>(({ keys, className, ...props }, ref) => {
	return (
		<div ref={ref} className={cn('inline-flex items-center gap-1', className)} {...props}>
			{keys.map((key, index) => (
				<React.Fragment key={key}>
					<Kbd>{getKeyDisplay(key)}</Kbd>
					{index < keys.length - 1 && <span className='text-xs text-muted-foreground/60'>+</span>}
				</React.Fragment>
			))}
		</div>
	);
});
Shortcut.displayName = 'Shortcut';

export { Kbd, Shortcut };

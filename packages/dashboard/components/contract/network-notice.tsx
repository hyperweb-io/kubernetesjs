import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function NetworkNotice({ className }: { className?: string }) {
	const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

	const handleToggle = (open: boolean) => {
		setIsAlertOpen(open);
	};

	const ExpandedContent = () => (
		<Alert className='mx-auto w-full max-w-[560px]' variant='warning'>
			<div className='flex items-start gap-3'>
				<Info className='mt-0.5 h-4 w-4 flex-shrink-0' />
				<div className='flex-1 space-y-1'>
					<AlertTitle className='mb-0 text-sm font-medium leading-tight'>Devnet Reset Notice</AlertTitle>
					<AlertDescription className='text-sm leading-relaxed'>
						This is a development network that resets every 3 days. All deployed contracts will be lost during resets.
					</AlertDescription>
				</div>
				<ChevronUp
					className='mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer transition-colors hover:text-warning-foreground/80'
					onClick={() => handleToggle(false)}
				/>
			</div>
		</Alert>
	);

	const CollapsedContent = () => (
		<div
			className='mx-auto flex w-fit cursor-pointer items-center gap-2 rounded-full border border-warning/50 px-4 py-2 text-sm
				text-warning transition-colors hover:border-warning/70 hover:bg-warning/5'
			onClick={() => handleToggle(true)}
		>
			<Info className='h-4 w-4 flex-shrink-0' />
			<span className='font-medium'>Devnet Reset Notice</span>
			<ChevronDown className='h-4 w-4 flex-shrink-0' />
		</div>
	);

	return (
		<div className={cn('my-6 w-full', className)}>
			<AnimatePresence mode='popLayout' initial={false}>
				{isAlertOpen ? (
					<motion.div
						key='expanded'
						layout
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ ease: [0.19, 1, 0.22, 1] }}
					>
						<ExpandedContent />
					</motion.div>
				) : (
					<motion.div
						key='collapsed'
						layout
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ ease: [0.075, 0.82, 0.165, 1] }}
					>
						<CollapsedContent />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

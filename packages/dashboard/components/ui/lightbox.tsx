import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageWithFallback } from '@/components/common/image-with-fallback';

import { Button } from './button';

interface LightboxProps {
	src: string;
	alt: string;
	title?: string;
	onClose: () => void;
}

export function Lightbox({ src, alt, title, onClose }: LightboxProps) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') onClose();
		}
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [onClose]);

	return (
		<div
			className={cn(
				'fixed inset-0 z-50 flex items-center justify-center',
				'bg-background/80 backdrop-blur-sm',
				'animate-in fade-in-0',
			)}
			onClick={onClose}
		>
			<div className='relative max-h-[90vh] max-w-[90vw]'>
				<Button
					variant='outline'
					size='icon'
					className={cn('absolute -right-4 -top-4 z-50', 'h-8 w-8 rounded-full', 'border border-border bg-background')}
					onClick={onClose}
				>
					<X className='h-4 w-4' />
				</Button>
				<div className='relative' onClick={(e) => e.stopPropagation()}>
					<div
						className={cn(
							'relative aspect-[3/2] w-[80vw] max-w-4xl',
							'overflow-hidden rounded-lg',
							isLoading ? 'block' : 'hidden',
						)}
					>
						<Skeleton className='absolute inset-0 h-full w-full' />
					</div>

					{/* Image */}
					<ImageWithFallback
						src={src}
						alt={alt}
						width={1200}
						height={800}
						className={cn(
							'max-h-[90vh] w-auto rounded-lg',
							'object-contain shadow-xl transition-opacity duration-300',
							isLoading ? 'opacity-0' : 'opacity-100',
						)}
						onLoadingComplete={() => setIsLoading(false)}
					/>

					{/* Title overlay */}
					{title && (
						<div
							className={cn(
								'absolute bottom-0 left-0 right-0',
								'rounded-b-lg bg-background/80 p-4 backdrop-blur-sm',
								'text-center text-base font-medium',
								'transition-opacity duration-300',
								isLoading ? 'opacity-0' : 'opacity-100',
							)}
						>
							{title}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
	<nav role='navigation' aria-label='pagination' className={cn('flex w-fit justify-center', className)} {...props} />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
	({ className, ...props }, ref) => (
		<ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
	),
);
PaginationContent.displayName = 'PaginationContent';

type PaginationItemProps = {
	isActive?: boolean;
} & React.ComponentProps<typeof Button>;

const PaginationItem = React.forwardRef<HTMLButtonElement, PaginationItemProps>(
	({ className, isActive, ...props }, ref) => (
		<li className='list-none'>
			<Button
				ref={ref}
				size='icon'
				variant={isActive ? 'outline' : 'ghost'}
				aria-current={isActive ? 'page' : undefined}
				className={cn('text-body-text hover:bg-input/40', className)}
				{...props}
			/>
		</li>
	),
);
PaginationItem.displayName = 'PaginationItem';

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationItem>) => (
	<PaginationItem aria-label='Go to previous page' className={className} {...props}>
		<ChevronLeft className='h-4 w-4' />
	</PaginationItem>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationItem>) => (
	<PaginationItem aria-label='Go to next page' className={className} {...props}>
		<ChevronRight className='h-4 w-4' />
	</PaginationItem>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
	<span aria-hidden className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
		<MoreHorizontal className='h-4 w-4' />
		<span className='sr-only'>More pages</span>
	</span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis };

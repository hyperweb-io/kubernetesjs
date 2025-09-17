import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface TabScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
	scrollAmount?: number;
}

export function TabScroller({ children, className, scrollAmount = 200, ...props }: TabScrollerProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(false);

	const checkScroll = () => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const { scrollLeft, scrollWidth, clientWidth } = container;
		setShowLeftArrow(scrollLeft > 0);
		setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
	};

	const centerActiveTab = () => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const activeTab = container.querySelector('[data-state="active"]');
		if (!activeTab) return;

		const containerWidth = container.clientWidth;
		const tabRect = activeTab.getBoundingClientRect();
		const containerRect = container.getBoundingClientRect();
		const tabOffset = tabRect.left - containerRect.left + container.scrollLeft;
		const targetScrollPosition = tabOffset - containerWidth / 2 + tabRect.width / 2;

		container.scrollTo({
			left: Math.max(0, targetScrollPosition),
			behavior: 'instant',
		});
	};

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		// Initial scroll check and centering
		checkScroll();
		// Use RAF to ensure DOM is ready
		requestAnimationFrame(centerActiveTab);

		// Setup observers and listeners
		const resizeObserver = new ResizeObserver(() => {
			checkScroll();
			centerActiveTab();
		});

		const mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'data-state') {
					centerActiveTab();
				}
			});
		});

		container.addEventListener('scroll', checkScroll);
		resizeObserver.observe(container);
		Array.from(container.querySelectorAll('[role="tab"]')).forEach((tab) => {
			mutationObserver.observe(tab, { attributes: true });
		});

		return () => {
			container.removeEventListener('scroll', checkScroll);
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, []);

	const scroll = (direction: 'left' | 'right') => {
		const container = scrollContainerRef.current;
		if (!container) return;

		container.scrollBy({
			left: direction === 'left' ? -scrollAmount : scrollAmount,
			behavior: 'smooth',
		});
	};

	return (
		<div className={cn('relative flex w-full items-center rounded-lg overflow-hidden', className)} {...props}>
			{showLeftArrow && (
				<div
					className='absolute left-0 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-background/80 shadow-[4px_0_8px_rgba(0,0,0,0.12)] backdrop-blur-sm active:bg-background/70'
					onClick={() => scroll('left')}
				>
					<ChevronLeft className='h-4 w-4 text-muted-foreground' />
					<span className='sr-only'>Scroll left</span>
				</div>
			)}
			<div
				ref={scrollContainerRef}
				className='w-full overflow-x-scroll scrollbar-none [-webkit-overflow-scrolling:touch] [@media_not_all_and_(min-resolution:1.1dppx)]:-mb-[15px]'
			>
				{children}
			</div>
			{showRightArrow && (
				<div
					className='absolute right-0 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-background/80 shadow-[-4px_0_8px_rgba(0,0,0,0.12)] backdrop-blur-sm active:bg-background/70'
					onClick={() => scroll('right')}
				>
					<ChevronRight className='h-4 w-4 text-muted-foreground' />
					<span className='sr-only'>Scroll right</span>
				</div>
			)}
		</div>
	);
}

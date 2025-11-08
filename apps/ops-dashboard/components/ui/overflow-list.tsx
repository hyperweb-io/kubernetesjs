import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface OverflowListProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	direction?: 'horizontal' | 'vertical';
	className?: string;
	containerClassName?: string;
	navigationButtons?: boolean;
	scrollAmount?: number;
	prevButtonClassName?: string;
	nextButtonClassName?: string;
}

export function OverflowList({
	children,
	direction = 'horizontal',
	className,
	containerClassName,
	navigationButtons = false,
	scrollAmount = 200,
	prevButtonClassName,
	nextButtonClassName,
	...props
}: OverflowListProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [showStartShadow, setShowStartShadow] = useState(false);
	const [showEndShadow, setShowEndShadow] = useState(false);
	const [isOverflowed, setIsOverflowed] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [hasClassicScrollbar, setHasClassicScrollbar] = useState(false);

	// Handle initial mount
	useEffect(() => {
		setIsMounted(true);
		return () => setIsMounted(false);
	}, []);

	const checkForOverflow = React.useCallback(() => {
		const container = containerRef.current;
		if (!container || !isMounted) {
			return;
		}

		if (direction === 'horizontal') {
			const scrollWidth = container.scrollWidth;
			const clientWidth = container.clientWidth;
			const scrollLeft = container.scrollLeft;
			const scrollbarHeight = container.offsetHeight - container.clientHeight;
			const scrollEndThreshold = 2;

			const hasOverflow = scrollWidth > clientWidth;
			const isScrolledToStart = scrollLeft <= 1;
			const isScrolledToEnd = Math.abs(scrollLeft + clientWidth - scrollWidth) <= scrollEndThreshold;

			setIsOverflowed(hasOverflow);
			setShowStartShadow(hasOverflow && !isScrolledToStart);
			setShowEndShadow(hasOverflow && !isScrolledToEnd);
			setHasClassicScrollbar(hasOverflow && scrollbarHeight > 1);
		} else {
			const scrollHeight = container.scrollHeight;
			const clientHeight = container.clientHeight;
			const scrollTop = container.scrollTop;
			const scrollEndThreshold = 2;

			const hasOverflow = scrollHeight > clientHeight;
			const isScrolledToStart = scrollTop <= 1;
			const isScrolledToEnd = Math.abs(scrollTop + clientHeight - scrollHeight) <= scrollEndThreshold;

			setIsOverflowed(hasOverflow);
			setShowStartShadow(hasOverflow && !isScrolledToStart);
			setShowEndShadow(hasOverflow && !isScrolledToEnd);
		}
	}, [direction, isMounted]);

	const handleWheel = React.useCallback(
		(event: WheelEvent) => {
			const container = containerRef.current;
			if (!container || !isOverflowed || direction !== 'horizontal' || !isMounted) return;

			// Handle both touchpad and mouse wheel scrolling
			const isDeltaX = Math.abs(event.deltaX) > Math.abs(event.deltaY);
			const delta = isDeltaX ? event.deltaX : event.deltaY;

			// Don't prevent default for natural horizontal scrolling (trackpad)
			if (isDeltaX) {
				return;
			}

			// Prevent vertical scrolling and convert to horizontal
			event.preventDefault();

			// Detect if it's likely a mouse wheel (larger, discrete steps) or touchpad (smaller, continuous steps)
			const isMouseWheel = Math.abs(delta) >= 100 || event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL;

			// Adjust scroll amount based on input device and delta mode
			let scrollAmount;
			if (isMouseWheel) {
				// Faster scrolling for mouse wheel
				scrollAmount = Math.sign(delta) * Math.min(Math.abs(delta), 150);
			} else {
				// Smoother, more controlled scrolling for touchpad
				scrollAmount = delta * 1.5;
			}

			const maxScroll = container.scrollWidth - container.clientWidth;
			const newScrollLeft = Math.max(0, Math.min(container.scrollLeft + scrollAmount, maxScroll));

			// Use smooth scrolling only for touchpad
			container.scrollTo({
				left: newScrollLeft,
				behavior: isMouseWheel ? 'auto' : 'smooth',
			});
		},
		[direction, isOverflowed, isMounted],
	);

	// Setup event listeners after mount
	useEffect(() => {
		if (!isMounted) return;

		const container = containerRef.current;
		if (!container) return;

		checkForOverflow();

		// Setup observers and listeners
		const resizeObserver = new ResizeObserver(() => {
			requestAnimationFrame(checkForOverflow);
		});

		resizeObserver.observe(container);
		container.addEventListener('wheel', handleWheel, { passive: false });
		container.addEventListener('scroll', checkForOverflow);

		return () => {
			resizeObserver.disconnect();
			container.removeEventListener('wheel', handleWheel);
			container.removeEventListener('scroll', checkForOverflow);
		};
	}, [isMounted, checkForOverflow, handleWheel]);

	// Don't show shadows until mounted
	const showShadows = isMounted && (showStartShadow || showEndShadow);

	const scroll = (scrollDirection: 'left' | 'right') => {
		const container = containerRef.current;
		if (!container) return;

		container.scrollBy({
			left: scrollDirection === 'left' ? -scrollAmount : scrollAmount,
			behavior: 'smooth',
		});
	};

	return (
		<div className={cn('relative', containerClassName)} data-testid='overflow-list'>
			{showShadows && showStartShadow && (
				<div
					className={cn(
						'pointer-events-none absolute z-10',
						direction === 'horizontal'
							? 'left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent'
							: 'left-0 top-0 h-8 w-full bg-gradient-to-b from-background to-transparent',
					)}
				/>
			)}

			{navigationButtons && showStartShadow && direction === 'horizontal' && (
				<Button
					variant='outline'
					size='icon'
					className={cn(
						`absolute z-20 h-6 w-6 rounded-full bg-background/80 shadow-md backdrop-blur-sm hover:bg-background/70
						active:bg-background/60`,
						// Vertically center regardless of scrollbar
						'inset-y-0 left-1 m-auto',
						prevButtonClassName,
					)}
					onClick={() => scroll('left')}
					data-has-scrollbar={hasClassicScrollbar}
				>
					<ChevronLeft className='h-4 w-4' />
					<span className='sr-only'>Scroll left</span>
				</Button>
			)}

			<div className='relative w-full overflow-hidden'>
				<div
					ref={containerRef}
					className={cn(
						direction === 'horizontal' ? 'flex-nowrap overflow-x-auto whitespace-nowrap' : 'overflow-y-auto',
						'scrollbar-neutral-thin',
						className,
					)}
					{...props}
				>
					{children}
				</div>
			</div>

			{showShadows && showEndShadow && (
				<div
					className={cn(
						'pointer-events-none absolute bottom-0 top-0 z-10',
						direction === 'horizontal'
							? 'right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent'
							: 'bottom-0 left-0 h-8 w-full bg-gradient-to-t from-background to-transparent',
					)}
				/>
			)}

			{navigationButtons && showEndShadow && direction === 'horizontal' && (
				<Button
					variant='outline'
					size='icon'
					className={cn(
						`absolute z-20 h-6 w-6 rounded-full bg-background/80 shadow-md backdrop-blur-sm hover:bg-background/70
						active:bg-background/60`,
						// Vertically center regardless of scrollbar
						'inset-y-0 right-1 m-auto',
						nextButtonClassName,
					)}
					onClick={() => scroll('right')}
					data-has-scrollbar={hasClassicScrollbar}
				>
					<ChevronRight className='h-4 w-4' />
					<span className='sr-only'>Scroll right</span>
				</Button>
			)}
		</div>
	);
}

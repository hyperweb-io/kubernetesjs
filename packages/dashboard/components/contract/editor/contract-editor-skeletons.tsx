// ==== Skeleton components ====
export function SourceBrowserSkeleton() {
	return (
		<div className='h-full w-full border-r bg-card p-4'>
			<div className='space-y-2'>
				<div className='h-6 w-3/4 animate-pulse rounded bg-muted' />
				<div className='h-6 w-2/3 animate-pulse rounded bg-muted' />
				<div className='h-6 w-4/5 animate-pulse rounded bg-muted' />
			</div>
		</div>
	);
}

export function SourceViewerSkeleton() {
	return (
		<div className='h-full w-full bg-background p-4'>
			<div className='space-y-2'>
				<div className='h-4 w-full animate-pulse rounded bg-muted' />
				<div className='h-4 w-5/6 animate-pulse rounded bg-muted' />
				<div className='h-4 w-4/6 animate-pulse rounded bg-muted' />
				<div className='h-4 w-3/4 animate-pulse rounded bg-muted' />
			</div>
		</div>
	);
}

export function ErrorPanelSkeleton() {
	return (
		<div className='h-full w-full bg-card p-4'>
			<div className='space-y-2'>
				<div className='flex items-center space-x-2'>
					<div className='h-4 w-4 animate-pulse rounded-full bg-destructive' />
					<div className='h-4 w-32 animate-pulse rounded bg-muted' />
				</div>
				<div className='h-4 w-full animate-pulse rounded bg-muted' />
				<div className='h-4 w-3/4 animate-pulse rounded bg-muted' />
			</div>
		</div>
	);
}

export function TabsSkeleton() {
	return (
		<div className='h-full w-full bg-card'>
			<div className='relative border-b'>
				<div className='flex gap-1 overflow-hidden p-1'>
					<div className='min-w-[120px] overflow-hidden rounded-t-md border border-b-0 bg-muted/50 px-3 py-2'>
						<div className='h-4 w-20 animate-pulse rounded bg-muted' />
					</div>
					<div className='min-w-[140px] overflow-hidden rounded-t-md border border-b-0 bg-muted/50 px-3 py-2'>
						<div className='h-4 w-28 animate-pulse rounded bg-muted' />
					</div>
					<div className='min-w-[100px] overflow-hidden rounded-t-md border border-b-0 bg-muted/50 px-3 py-2'>
						<div className='h-4 w-16 animate-pulse rounded bg-muted' />
					</div>
					<div className='min-w-[160px] overflow-hidden rounded-t-md border border-b-0 bg-muted/50 px-3 py-2'>
						<div className='h-4 w-32 animate-pulse rounded bg-muted' />
					</div>
				</div>
			</div>

			<div className='p-4'>
				<div className='space-y-2'>
					<div className='h-4 w-full animate-pulse rounded bg-muted' />
					<div className='h-4 w-5/6 animate-pulse rounded bg-muted' />
					<div className='h-4 w-4/6 animate-pulse rounded bg-muted' />
				</div>
			</div>
		</div>
	);
}

import Image from 'next/image';
import { Wallet } from 'lucide-react';

import { useHyperwebChain } from '@/hooks/contract/use-hyperweb-chain';
import { cn } from '@/lib/utils';

interface WalletConnectProps {
	className?: string;
}

export const WalletConnect = ({ className }: WalletConnectProps) => {
	const { connect, wallet, address, openView } = useHyperwebChain();
	const walletLogo = wallet?.info?.logo ?? '';

	return (
		<div
			className={cn(
				'flex h-9 flex-shrink-0 items-center gap-2 rounded-lg border border-border px-3 dark:border-foreground/20',
				className,
			)}
		>
			<div className='flex items-center gap-2 text-sm font-medium text-body-text'>
				<div className='size-2 rounded-full bg-blue-500'></div>
				Hyperweb Devnet
			</div>

			{address ? (
				<Image
					src={typeof walletLogo === 'string' ? walletLogo : walletLogo.major || walletLogo.minor}
					alt={wallet?.info?.prettyName ?? 'Wallet logo'}
					width='0'
					height='0'
					onClick={openView}
					className='size-4 cursor-pointer'
				/>
			) : (
				<Wallet className='size-[18px] cursor-pointer' onClick={connect} />
			)}
		</div>
	);
};

// const WalletConnectSkeleton = ({ className }: { className?: string }) => (
// 	<div className={cn('mx-auto flex min-w-52 flex-shrink-0 items-center justify-center gap-3', className)}>
// 		<Skeleton className='size-5 rounded-full' />
// 		<Skeleton className='h-5 w-28' />
// 		<Skeleton className='size-[18px]' />
// 		<Skeleton className='size-[18px]' />
// 	</div>
// );

// export const WalletConnect = ({ className }: WalletConnectProps) => {
// 	const [copy, isCopied] = useCopyToClipboard();
// 	const { connect, wallet, address, disconnect, status } = useHyperwebChain();
// 	const walletLogo = wallet?.info?.logo ?? '';

// 	if (status === WalletState.Connecting) {
// 		return <WalletConnectSkeleton className={className} />;
// 	}

// 	if (address) {
// 		return (
// 			<div className={cn('mx-auto flex flex-shrink-0 items-center justify-center gap-3', className)}>
// 				<Image
// 					src={typeof walletLogo === 'string' ? walletLogo : walletLogo.major || walletLogo.minor}
// 					alt={wallet?.info?.prettyName ?? ''}
// 					width='0'
// 					height='0'
// 					style={{ width: '20px', height: 'auto' }}
// 				/>
// 				<p className='text-base text-secondary-foreground'>{shortenAddress(address)}</p>
// 				<div className='cursor-pointer' onClick={() => copy(address)}>
// 					{isCopied ? <Check className='size-[18px] text-green-600' /> : <Copy className='size-[18px]' />}
// 				</div>
// 				<LogOut className='size-[18px] cursor-pointer' onClick={disconnect} />
// 			</div>
// 		);
// 	}

// 	return (
// 		<Button onClick={connect} className={cn('mx-auto w-fit', className)}>
// 			Connect Wallet
// 		</Button>
// 	);
// };

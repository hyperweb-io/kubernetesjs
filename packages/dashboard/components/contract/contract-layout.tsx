import { ComponentType, useCallback, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeProvider as InterchainUIThemeProvider, ThemeVariant } from '@interchain-ui/react';
import { AlertCircle } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useHyperwebInit } from '@/hooks/contract/use-hyperweb-init';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { OverflowList } from '@/components/ui/overflow-list';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import { Head } from '@/components/common/head';
import { Spinner } from '@/components/common/spinner';
import { ChainWrapperLoader } from '@/components/contract/chain-wrapper';
import { WalletConnect } from '@/components/contract/wallet-connect';
import { CONTRACT_TABS } from '@/routes';

import { ContractLayoutErrorBoundary } from './contract-layout-error-boundary';
import { NetworkNotice } from './network-notice';

const LoadingSpinner = () => (
	<div className='flex h-full items-center justify-center'>
		<Spinner />
	</div>
);

const HyperwebAlert = ({ onRefresh }: { onRefresh: () => void }) => (
	<div className='flex h-full items-center justify-center'>
		<Alert variant='destructive' className='mx-auto max-w-fit'>
			<AlertCircle className='size-[18px]' />
			<AlertTitle>Hyperweb chain data is not available</AlertTitle>
			<AlertDescription>
				Please try again later or&nbsp;
				<span className='cursor-pointer underline' onClick={onRefresh}>
					refresh
				</span>
			</AlertDescription>
		</Alert>
	</div>
);

interface ContractLayoutProps {
	requiresHyperwebSetup?: boolean;
}

function ContractLayout({
	children,
	requiresHyperwebSetup = true,
}: {
	children: React.ReactNode;
	requiresHyperwebSetup?: boolean;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const activeTab = pathname === '/playground' ? 'home' : pathname.split('/').pop();
	const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const { isHyperwebAdded, refetchAndAddChain, isLoading } = useHyperwebInit();

	const contentToRender = useMemo(() => {
		if (!requiresHyperwebSetup) return children;
		if (isLoading) return <LoadingSpinner />;
		if (!isHyperwebAdded) return <HyperwebAlert onRefresh={refetchAndAddChain} />;
		return children;
	}, [isLoading, isHyperwebAdded, children, requiresHyperwebSetup, refetchAndAddChain]);

	const scrollTabIntoView = useCallback(
		(tabId: string | undefined, refs: React.RefObject<Record<string, HTMLButtonElement | null>>) => {
			const activeTabRef = tabId ? refs.current?.[tabId] : null;
			if (activeTabRef) {
				activeTabRef.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
			}
		},
		[],
	);

	// Sync the active tab to the actual tab in view
	useEffect(() => {
		scrollTabIntoView(activeTab, tabRefs);
	}, [activeTab, scrollTabIntoView]);

	return (
		<div className='mb-28 mt-8 w-full flex-1'>
			<div className='mb-4 flex flex-col items-center justify-center gap-4 lg:flex-row lg:justify-between'>
				<OverflowList
					direction='horizontal'
					containerClassName='w-full max-w-fit'
					navigationButtons
					prevButtonClassName='data-[has-scrollbar=true]:-translate-y-1'
					nextButtonClassName='data-[has-scrollbar=true]:-translate-y-1'
				>
					<Tabs
						value={activeTab}
						onValueChange={(value) => {
							const tab = CONTRACT_TABS.find((tab) => tab.value === value);
							if (tab) {
								router.push(tab.href);
							}
						}}
					>
						<TabsList>
							{CONTRACT_TABS.map((tab) => (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									ref={(el) => {
										tabRefs.current[tab.value] = el;
									}}
								>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</OverflowList>

				{isHyperwebAdded && <WalletConnect />}
			</div>

			<NetworkNotice className='mb-6' />

			<div className='min-h-[200px]'>{contentToRender}</div>

			<Toaster />
		</div>
	);
}

const ChainWrapper = dynamic(() => import('@/components/contract/chain-wrapper').then((mod) => mod.ChainWrapper), {
	ssr: false,
	loading: () => <ChainWrapperLoader />,
});

export function withContractLayout<P extends object>(
	WrappedComponent: ComponentType<P>,
	options: ContractLayoutProps = {},
) {
	return function WithContractLayoutComponent(props: P) {
		const pathname = usePathname();
		const { theme } = useTheme();

		return (
			<>
				<Head
					title='Hyperweb Playground'
					description='Hyperweb Playground is an integrated environment designed to streamline the entire lifecycle of TypeScript smart contract development on the Hyperweb chain. From writing your first line of code to deploying and interacting with complex applications, the Playground provides a seamless and powerful experience.'
					route={pathname as `/${string}`}
				/>

				<ContractLayoutErrorBoundary>
					<ChainWrapper>
						<ContractLayout {...options}>
							<InterchainUIThemeProvider defaultTheme={theme as ThemeVariant} className='w-full flex-1'>
								<WrappedComponent {...props} />
							</InterchainUIThemeProvider>
						</ContractLayout>
					</ChainWrapper>
				</ContractLayoutErrorBoundary>
			</>
		);
	};
}

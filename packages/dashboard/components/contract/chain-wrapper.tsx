'use client';

import { ReactNode, useMemo } from 'react';
import { keplrWallet } from '@interchain-kit/keplr-extension';
import { ChainProvider } from '@interchain-kit/react';
import { AssetList, Chain } from '@chain-registry/types';
import osmosisChain from 'chain-registry/mainnet/osmosis/chain';
import osmosisAssets from 'chain-registry/mainnet/osmosis/asset-list';

import { useHyperwebChainInfo } from '@/hooks/contract/use-hyperweb-chain-info';

interface ChainWrapperProps {
  children: ReactNode;
}

export function ChainWrapper({ children }: ChainWrapperProps) {
  const { data: hyperwebChainInfo, isLoading, error } = useHyperwebChainInfo();

  const { chains, assetLists, isReady } = useMemo(() => {
    // Base chains and assets (always include osmosis as fallback)
    const baseChains: Chain[] = [osmosisChain];
    const baseAssetLists: AssetList[] = [osmosisAssets];

    // Add hyperweb chain and assets if available
    if (hyperwebChainInfo && !error) {
      baseChains.push(hyperwebChainInfo.chain);
      baseAssetLists.push(hyperwebChainInfo.assetList);
    }

    console.log('baseChains', baseChains);
    console.log('baseAssetLists', baseAssetLists);

    // Only mark as ready when we've either:
    // 1. Successfully loaded hyperweb chain info, OR
    // 2. Failed to load but can proceed with fallback chains
    const isReady = !isLoading;

    return {
      chains: baseChains,
      assetLists: baseAssetLists,
      isReady,
    };
  }, [hyperwebChainInfo, error, isLoading]);

  // If there's an error, show warning but still proceed with base chains
  if (error && !isLoading) {
    console.warn('Failed to load Hyperweb chain info, using fallback chains only:', error);
  }

  // Show loading overlay while waiting for chain data resolution
  if (!isReady) {
    return <ChainWrapperLoader />;
  }

  // Only render ChainProvider when we have resolved chain data
  return (
    <ChainProvider chains={chains} assetLists={assetLists} wallets={[keplrWallet]}>
      {children}
    </ChainProvider>
  );
}

export function ChainWrapperLoader() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="rounded-lg bg-background/80 backdrop-blur-md border border-border/40 shadow-lg">
        <div className="flex items-center space-x-3 px-6 py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-foreground">Loading data, please wait...</p>
        </div>
      </div>
    </div>
  );
}

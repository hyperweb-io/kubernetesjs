'use client';

import { ReactNode } from 'react';
import { keplrWallet } from '@interchain-kit/keplr-extension';
import { ChainProvider } from '@interchain-kit/react';

import { initialAssets, initialChains } from '@/configs/chain';

interface ChainWrapperProps {
  children: ReactNode;
}

export function ChainWrapper({ children }: ChainWrapperProps) {
  return (
    <ChainProvider chains={initialChains} assetLists={initialAssets} wallets={[keplrWallet]}>
      {children}
    </ChainProvider>
  );
}

export function ChainWrapperLoader() {
  return (
    <div className="fixed inset-0 z-50 animate-fadeIn bg-background/80 backdrop-blur-sm">
      <div className="flex h-full items-center justify-center">
        <div className="animate-slideIn rounded-lg bg-card/50 p-6 backdrop-blur-md">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-1 border-t-transparent" />
        </div>
      </div>
    </div>
  );
}

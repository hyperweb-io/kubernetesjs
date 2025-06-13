'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Coins, // Faucet
  DatabaseZap, // Query
  FilePlus, // Create
  FileText, // Contracts
  Play, // Execute
  Rocket, // Deploy
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useHyperwebChainInfo } from '@/hooks/contract/use-hyperweb-chain-info';

const features = [
  {
    title: 'Create Contract',
    description: 'Start building contracts from scratch or templates.',
    href: '/d/playground/create',
    icon: FilePlus,
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Explore Contracts',
    description: 'Browse and interact with contracts created by the community.',
    href: '/d/playground/contracts',
    icon: FileText,
    bgColor: 'bg-purple-50 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Deploy Contract',
    description: 'Deploy your compiled contracts to the selected network.',
    href: '/d/playground/deploy',
    icon: Rocket,
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Execute Message',
    description: 'Interact with contracts by sending execute messages.',
    href: '/d/playground/interact?tab=execute',
    icon: Play,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    title: 'Query State',
    description: 'Read current data and state directly from contracts.',
    href: '/d/playground/interact?tab=query',
    icon: DatabaseZap,
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    title: 'Faucet',
    description: 'Get testnet tokens needed for deployment and execution.',
    href: '/d/playground/faucet',
    icon: Coins,
    bgColor: 'bg-pink-50 dark:bg-pink-900/30',
    iconColor: 'text-pink-600 dark:text-pink-400',
  },
];

function ContractPlaygroundIndex() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Use the proper hyperweb chain info hook
  const { data: chainInfo, isLoading, error, refetch } = useHyperwebChainInfo();

  useEffect(() => {
    const logChainData = () => {
      console.log('🔄 Chain info hook state update...');
      setDebugInfo((prev) => [...prev, '🔄 Chain info hook state update...']);

      if (isLoading) {
        console.log('⏳ Chain info is loading...');
        setDebugInfo((prev) => [...prev, '⏳ Chain info is loading...']);
        return;
      }

      if (error) {
        console.error('❌ Chain info error:', error);
        setDebugInfo((prev) => [
          ...prev,
          `❌ Chain info error: ${error instanceof Error ? error.message : String(error)}`,
        ]);
        return;
      }

      if (chainInfo) {
        console.log('✅ Chain Info loaded:', chainInfo);
        setDebugInfo((prev) => [
          ...prev,
          `✅ Chain loaded: ${chainInfo.chain.prettyName || chainInfo.chain.chainName} (${chainInfo.chain.chainId})`,
          `✅ RPC available: ${chainInfo.chain.apis?.rpc?.[0]?.address || 'Not configured'}`,
          `✅ REST available: ${chainInfo.chain.apis?.rest?.[0]?.address || 'Not configured'}`,
          `✅ Assets count: ${chainInfo.assetList.assets?.length || 0}`,
          `✅ Chain Server ID: ${chainInfo.chainServerId}`,
          `✅ Primary Asset: ${JSON.stringify(chainInfo.assetList.assets?.[0], null, 2)}`,
        ]);
      } else {
        console.log('❌ No chain info available');
        setDebugInfo((prev) => [...prev, '❌ No chain info available']);
      }
    };

    logChainData();
  }, [chainInfo, isLoading, error]);

  return (
    <div className="container mx-auto max-w-5xl px-4 pb-8 pt-4 md:pb-12 md:pt-8">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground md:mb-12 md:text-4xl">
        Explore the Playground
      </h1>

      {/* Debug Info Panel */}
      <div className="mb-8 rounded-lg border border-border/40 bg-card/50 p-4">
        <h2 className="mb-4 text-lg font-semibold">🔍 Hyperweb Chain Info Debug</h2>
        {chainInfo && (
          <div className="mb-4 rounded bg-green-50 p-3 dark:bg-green-900/20">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Connected to: {chainInfo.chain.prettyName || chainInfo.chain.chainName} ({chainInfo.chain.chainId})
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">Server ID: {chainInfo.chainServerId}</p>
          </div>
        )}
        {isLoading && (
          <div className="mb-4 rounded bg-blue-50 p-3 dark:bg-blue-900/20">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Loading chain information...</p>
          </div>
        )}
        {!!error && (
          <div className="mb-4 rounded bg-red-50 p-3 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Error loading chain info: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 rounded bg-red-100 px-2 py-1 text-xs text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}
        <div className="max-h-40 overflow-y-auto rounded bg-muted/50 p-3 text-xs">
          {debugInfo.length === 0 ? (
            <p className="text-muted-foreground">Waiting for chain data...</p>
          ) : (
            debugInfo.map((log, index) => (
              <div key={index} className="mb-1 font-mono">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="relative rounded-xl border border-border/40 bg-card/50 p-6 shadow-sm backdrop-blur-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              href={feature.href}
              key={feature.href}
              passHref
              className="block rounded-lg transition-all duration-200 ease-in-out hover:scale-[1.02] focus:scale-[1.02] focus:outline-none
                                  focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <Card
                className="flex h-full flex-col overflow-hidden border transition-colors duration-200 hover:border-primary/60
                                      dark:hover:border-primary/60"
              >
                <CardHeader className="pb-3">
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${feature.bgColor}`}
                  >
                    <feature.icon className={`h-5 w-5 ${feature.iconColor}`} aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg font-semibold leading-tight">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow pt-0">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContractPlaygroundIndex;

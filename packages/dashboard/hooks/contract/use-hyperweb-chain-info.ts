import { AssetList, Chain } from '@chain-registry/v2-types';
import { useQuery } from '@tanstack/react-query';

import { convertKeysToCamelCase } from '@/lib/chain';
import { getHyperwebConfig } from '@/hooks/contract/use-hyperweb-config';

export type HyperwebChainInfo = {
  chain: Chain;
  assetList: AssetList;
  chainServerId: string;
};

export const useHyperwebChainInfo = () => {
  const config = getHyperwebConfig();

  const rpcUrl = config?.chain.rpc;
  const registryUrl = config?.registry.rest;

  return useQuery({
    queryKey: ['hyperweb-chain', { rpcUrl, registryUrl }],
    queryFn: async (): Promise<HyperwebChainInfo | null> => {
      try {
        const rawChainsResponse = await fetcher<{ chains: any[] }>(`${registryUrl}/chains`);
        if (!rawChainsResponse) return null;

        const transformedChains = convertKeysToCamelCase(rawChainsResponse.chains) as Chain[];
        const hyperwebChain = transformedChains.find((chain) => chain.chainName === 'hyperweb');

        if (!hyperwebChain) return null;

        const rawAssetList = await fetcher<any>(`${registryUrl}/chains/${hyperwebChain.chainId}/assets`);
        if (!rawAssetList) return null;

        const transformedAssetList = convertKeysToCamelCase(rawAssetList) as AssetList;

        const chainStatus = await fetcher(`${rpcUrl}/status`);

        // @ts-expect-error - chainStatus is not typed
        const chainServerId = chainStatus?.result?.node_info?.id as string;
        if (!chainServerId) return null;

        // chainType is used to determine the wallet type
        hyperwebChain.chainType = 'cosmos';

        return {
          chain: hyperwebChain,
          assetList: transformedAssetList,
          chainServerId,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

const fetcher = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

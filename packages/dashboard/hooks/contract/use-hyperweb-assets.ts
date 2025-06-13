import { useQuery } from '@tanstack/react-query';
import { getAllBalances } from 'interchainjs/cosmos/bank/v1beta1/query.rpc.func';

import { calcDisplayAmount, calcDollarValue, calcTotalDollarValue, getLogoUrlFromAsset } from '@/lib/chain';
import { useHyperwebAssetsPrices } from './use-hyperweb-assets-prices';
import { useHyperwebChain } from './use-hyperweb-chain';
import { useRpcEndpoint } from './use-rpc-endpoint';

export interface PrettyAsset {
  logoUrl: string;
  symbol: string;
  prettyChainName: string;
  displayAmount: string;
  dollarValue: string;
  denom: string;
  amount: string;
}

export const useHyperwebAssets = () => {
  const { data: rpcEndpoint } = useRpcEndpoint();
  const { address, chain, assetList } = useHyperwebChain();
  const { data: prices } = useHyperwebAssetsPrices();

  return useQuery({
    queryKey: ['useHyperwebAssets', address],
    queryFn: async () => {
      if (!rpcEndpoint || !address) return null;

      const { balances } = await getAllBalances(rpcEndpoint, {
        address,
        resolveDenom: true,
      });

      const assets: PrettyAsset[] = balances
        .filter((b) => assetList.assets.some((a) => a.base === b.denom))
        .map(({ amount, denom }) => {
          const asset = assetList.assets.find((a) => a.base === denom)!;

          const logoUrl = getLogoUrlFromAsset(asset);
          const symbol = asset.symbol;
          const prettyChainName = chain.prettyName || chain.chainName;
          const displayAmount = calcDisplayAmount(amount, asset);
          const dollarValue = prices ? calcDollarValue(amount, asset, prices) : '0.00';

          return {
            logoUrl,
            symbol,
            prettyChainName,
            displayAmount,
            dollarValue,
            denom,
            amount,
          };
        });

      return {
        assets,
        totalDollarValue: prices ? calcTotalDollarValue(assets) : '0.00',
      };
    },
    enabled: !!rpcEndpoint && !!address,
  });
};

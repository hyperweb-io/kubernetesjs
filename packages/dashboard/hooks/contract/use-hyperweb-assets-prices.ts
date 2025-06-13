import { Asset } from '@chain-registry/v2-types';
import { useQuery } from '@tanstack/react-query';
import { useHyperwebChain } from './use-hyperweb-chain';

type CoinGeckoId = string;
type CoinGeckoUSD = { usd: number };
type CoinGeckoUSDResponse = Record<CoinGeckoId, CoinGeckoUSD>;

export const handleError = (resp: Response) => {
	if (!resp.ok) throw Error(resp.statusText);
	return resp;
};

const getAssetsWithGeckoIds = (assets: Asset[]) => {
	return assets.filter((asset) => !!asset?.coingeckoId);
};

const getGeckoIds = (assets: Asset[]) => {
	return assets.map((asset) => asset.coingeckoId) as string[];
};

const formatPrices = (prices: CoinGeckoUSDResponse, assets: Asset[]): Record<string, number> => {
	return Object.entries(prices).reduce((priceHash, cur) => {
		const denom = assets.find((asset) => asset.coingeckoId === cur[0])!.base;
		return { ...priceHash, [denom]: cur[1].usd };
	}, {});
};

const fetchPrices = async (geckoIds: string[]): Promise<CoinGeckoUSDResponse> => {
	const url = `https://api.coingecko.com/api/v3/simple/price?ids=${geckoIds.join()}&vs_currencies=usd`;

	return fetch(url)
		.then(handleError)
		.then((res) => res.json());
};

export const useHyperwebAssetsPrices = () => {
	const { assetList, chain } = useHyperwebChain();

	const assetsWithGeckoIds = getAssetsWithGeckoIds(assetList.assets);
	const geckoIds = getGeckoIds(assetsWithGeckoIds);

	return useQuery({
		queryKey: ['useHyperwebAssetsPrices', chain.chainName],
		queryFn: () => fetchPrices(geckoIds),
		select: (data) => formatPrices(data, assetsWithGeckoIds),
		staleTime: Infinity,
	});
};

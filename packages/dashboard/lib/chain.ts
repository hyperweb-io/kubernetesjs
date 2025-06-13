import { PrettyAsset } from '@/hooks/contract/use-hyperweb-assets';
import { Asset } from '@chain-registry/v2-types';
import { BigNumber } from 'bignumber.js';

function toCamelCase(key: string) {
	return (
		key
			// First, remove all leading non-alphabet characters except $
			.replace(/^[^a-zA-Z$]+/, '')
			// Convert what follows a separator into upper case
			.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
			// Ensure the first character of the result is always lowercase
			.replace(/^./, (c) => c.toLowerCase())
	);
}

export function convertKeysToCamelCase(obj: any): any {
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => convertKeysToCamelCase(item));
	}

	return Object.keys(obj).reduce(
		(result, key) => {
			const camelKey = toCamelCase(key);
			const value = convertKeysToCamelCase(obj[key]);
			result[camelKey as keyof typeof result] = value;
			return result;
		},
		{} as Record<string, any>,
	);
}

export const shortenAddress = (address: string, partLength = 6) => {
	return `${address.slice(0, partLength)}...${address.slice(-partLength)}`;
};

export const getExponentFromAsset = (asset: Asset) => {
	const unit = asset.denomUnits.find((unit) => unit.denom === asset.display);
	return unit?.exponent ?? 6;
};

export const getLogoUrlFromAsset = (asset: Asset) => {
	return Object.values(asset.logoURIs || {})[0];
};

export const calcDisplayAmount = (amount: string, asset: Asset) => {
	const exponent = getExponentFromAsset(asset);
	return new BigNumber(amount).shiftedBy(-exponent).toString();
};

const DEFAULT_PRICE = 0;

export const calcDollarValue = (amount: string, asset: Asset, prices: Record<string, number>) => {
	const displayAmount = calcDisplayAmount(amount, asset);
	return new BigNumber(displayAmount)
		.times(prices[asset.base] || DEFAULT_PRICE)
		.toFixed(2, BigNumber.ROUND_HALF_UP)
		.toString();
};

export const calcTotalDollarValue = (assets: PrettyAsset[]) => {
	return assets
		.reduce((acc, asset) => {
			return acc.plus(asset.dollarValue);
		}, new BigNumber(0))
		.toString();
};

import { AssetList } from '@chain-registry/v2-types';
import BigNumber from 'bignumber.js';
import { MsgEvalResponse, MsgInstantiateResponse } from 'hyperwebjs/hyperweb/hvm/tx';
import { DeliverTxResponse } from 'hyperwebjs/types';

import { getExponentFromAsset } from '@/lib/chain';

/**
 * Safely parses a proto message and returns both the parsed data and any error.
 * This allows the caller to decide how to handle parse errors.
 * @param protoMsg - The proto message to parse
 * @param parser - The parser function to use (e.g., MsgInstantiateResponse.fromProtoMsg)
 * @returns Object containing data (parsed result or null) and error (Error or null)
 */
export function safeParseProtoMsg<T>(protoMsg: any, parser: (msg: any) => T): { data: T | null; error: Error | null } {
	try {
		return { data: parser(protoMsg), error: null };
	} catch (e) {
		return {
			data: null,
			error: e instanceof Error ? e : new Error(String(e)),
		};
	}
}

export const bytesToKb = (bytes: number) => {
	const kb = new BigNumber(bytes).dividedBy(1000);
	return kb.gte(1) ? kb.toFixed(0) : kb.toFixed(2);
};

export const readFileContent = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			resolve(event.target?.result as string);
		};
		reader.onerror = (error) => reject(error);
		reader.readAsText(file);
	});
};

export const getInstantiateResponse = (txResult: DeliverTxResponse) => {
	return safeParseProtoMsg(txResult.msgResponses?.[0], MsgInstantiateResponse.fromProtoMsg);
};

export const getEvalResponse = (txResult: DeliverTxResponse) => {
	return safeParseProtoMsg(txResult.msgResponses?.[0], MsgEvalResponse.fromProtoMsg);
};

export const getPrettyTxFee = (txResult: DeliverTxResponse, assetList: AssetList) => {
	const txFee = txResult.events.find((e) => e.type === 'tx')?.attributes[0].value ?? '';

	const match = txFee.match(/^(\d+)(.+)$/);
	if (!match) return '--';

	const [, rawAmount, denom] = match;
	const asset = assetList.assets.find((asset) => asset.base === denom);
	if (!asset) return '--';

	const exponent = getExponentFromAsset(asset);
	const amount = new BigNumber(rawAmount).shiftedBy(-exponent).toString();

	return `${amount} ${asset.symbol}`;
};

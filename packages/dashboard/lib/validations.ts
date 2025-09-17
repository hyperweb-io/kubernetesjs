import { z } from 'zod';
import { fromBech32 } from '@cosmjs/encoding';

export const createBech32AddressSchema = (bech32Prefix: string) =>
	z
		.string()
		.refine((address) => address.startsWith(bech32Prefix), {
			message: `Invalid prefix (expected "${bech32Prefix}")`,
		})
		.refine(
			(address) => {
				try {
					fromBech32(address);
					return true;
				} catch (error) {
					console.error(error);
					return false;
				}
			},
			{ message: 'Invalid address' },
		);

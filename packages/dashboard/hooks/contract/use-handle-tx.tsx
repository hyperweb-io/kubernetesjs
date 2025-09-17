import { useCallback } from 'react';

import { useToast } from '@/hooks/use-toast';

interface HandleTxParams<T> {
	executeTx: () => Promise<T>;
	successMessage?: string;
	onTxSucceed?: (result: T) => void;
	onTxFailed?: () => void;
}

export const useHandleTx = () => {
	const { toast } = useToast();

	return useCallback(
		async <T,>({
			executeTx,
			successMessage = 'Transaction Successful',
			onTxSucceed = () => {},
			onTxFailed = () => {},
		}: HandleTxParams<T>) => {
			toast({
				title: 'Sending Transaction...',
			});

			try {
				const result = await executeTx();
				onTxSucceed(result);

				toast({
					title: successMessage,
					variant: 'success',
					duration: 3000,
				});
			} catch (e: any) {
				console.error(e);
				onTxFailed();
				toast({
					title: 'Transaction Failed',
					variant: 'destructive',
					description: e.message,
					duration: 10000,
				});
			}
		},
		[],
	);
};

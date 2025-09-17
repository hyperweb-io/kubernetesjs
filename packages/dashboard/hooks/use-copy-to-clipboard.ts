import { useCallback, useState } from 'react';

/**
 * Function to copy text to the clipboard.
 * @param text The text to copy to the clipboard.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the text was copied successfully, or `false` otherwise.
 */
type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(): [CopyFn, boolean] {
	const [isCopied, setIsCopied] = useState<boolean>(false);

	const copy: CopyFn = useCallback(async (text) => {
		if (!navigator?.clipboard) {
			console.warn('Clipboard not supported');
			return false;
		}

		try {
			await navigator.clipboard.writeText(text);
			setIsCopied(true);
			setTimeout(() => {
				setIsCopied(false);
			}, 800);
			return true;
		} catch (error) {
			console.warn('Copy failed', error);
			setIsCopied(false);
			return false;
		}
	}, []);

	return [copy, isCopied];
}

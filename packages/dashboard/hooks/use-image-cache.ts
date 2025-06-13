import { useEffect, useState } from 'react';

// We use a global cache outside of React's lifecycle to store image cache
const imageCache = new Map<string, boolean>();

export function useImageCache(src: string) {
	const [isLoaded, setIsLoaded] = useState(() => imageCache.get(src) || false);
	const [hasError, setHasError] = useState(false);
	const [imgSrc, setImgSrc] = useState(src);

	useEffect(() => {
		if (!src) return;

		// If image is already cached, don't reload
		if (imageCache.get(src)) {
			setIsLoaded(true);
			return;
		}

		const img = new Image();
		img.src = src;

		img.onload = () => {
			imageCache.set(src, true);
			setIsLoaded(true);
		};

		img.onerror = () => {
			setHasError(true);
			imageCache.delete(src);
		};

		return () => {
			img.onload = null;
			img.onerror = null;
		};
	}, [src]);

	return {
		isLoaded,
		hasError,
		imgSrc,
		setImgSrc,
	};
}

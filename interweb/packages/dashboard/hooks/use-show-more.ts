import { useState } from 'react';

interface UseShowMoreReturn<T> {
	isShowMore: boolean;
	visibleItems: T[];
	toggleShowMore: () => void;
	btnText: string;
}

export const useShowMore = <T>({
	items,
	defaultVisibleCount,
}: {
	items: T[];
	defaultVisibleCount: number;
}): UseShowMoreReturn<T> => {
	const [isShowMore, setIsShowMore] = useState(false);

	const visibleItems = isShowMore ? items : items.slice(0, defaultVisibleCount);

	const toggleShowMore = () => setIsShowMore((prev) => !prev);

	const btnText = isShowMore ? 'Show Less' : 'Show More';

	return { visibleItems, toggleShowMore, isShowMore, btnText };
};

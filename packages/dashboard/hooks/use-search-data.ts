import { matchSorter } from 'match-sorter';
import { useQueryState } from 'nuqs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from './use-debounce';

export function useSearchData<TData>({
	data,
	fields,
	matcherFn,
}: {
	data: TData[];
	fields: (keyof TData)[];
	matcherFn?: (item: TData, query: string) => boolean;
}) {
	const [searchQuery, setSearchQuery] = useQueryState('searchQuery');
	const [query, setQuery] = useState<string>(searchQuery ?? '');

	const debouncedQuery = useDebounce(query, 300);

	// Sync the query state with the search query in the URL, if it exists
	useEffect(() => {
		if (searchQuery && searchQuery !== query) {
			setQuery(searchQuery);
		}
	}, [query, searchQuery]);

	const debouncedSetSearchQuery = useCallback(
		(value: string | null) => {
			setQuery(value ?? '');
			setSearchQuery(value);
		},
		[setSearchQuery, setQuery],
	);

	const filteredData = useMemo(() => {
		if (typeof matcherFn === 'function') {
			return data.filter((item) => matcherFn(item, debouncedQuery));
		}

		return searchQuery
			? matchSorter(data, searchQuery, {
					keys: fields as string[],
					threshold: matchSorter.rankings.CONTAINS,
				})
			: data;
	}, [matcherFn, searchQuery, data, fields, debouncedQuery]);

	return {
		filteredData,
		searchQuery: debouncedQuery,
		setSearchQuery: debouncedSetSearchQuery,
	};
}

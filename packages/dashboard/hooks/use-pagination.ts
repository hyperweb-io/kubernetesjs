import { useMemo } from 'react';

interface UsePaginationProps {
	totalItems?: number | bigint;
	itemsPerPage: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

interface UsePaginationReturn {
	pageNumbers: number[];
	totalPages: number;
	goToPage: (page: number) => void;
	goToPreviousPage: () => void;
	goToNextPage: () => void;
	paginationSummary: string;
}

export const usePagination = ({
	totalItems = 0,
	itemsPerPage,
	currentPage,
	onPageChange,
}: UsePaginationProps): UsePaginationReturn => {
	// Calculate total pages
	const totalPages = useMemo(() => {
		return Math.max(1, Math.ceil(Number(totalItems) / itemsPerPage));
	}, [totalItems, itemsPerPage]);

	// Get array of page numbers to display
	const pageNumbers = useMemo(() => {
		if (totalPages <= 1) return [1];

		const pages: number[] = [];

		// Calculate which pages should be visible
		let visiblePages: number[] = [];

		// Always include first, last, and current page
		visiblePages.push(1);
		if (currentPage > 1 && currentPage < totalPages) {
			visiblePages.push(currentPage);
		}
		if (totalPages > 1) {
			visiblePages.push(totalPages);
		}

		// Include pages adjacent to current page
		if (currentPage > 2) visiblePages.push(currentPage - 1);
		if (currentPage < totalPages - 1) visiblePages.push(currentPage + 1);

		// Add page 2 if current page is 1 or 3
		if (currentPage === 1 || currentPage === 3) {
			visiblePages.push(2);
		}

		// Add second-to-last page if current page is last or third-to-last
		if (currentPage === totalPages || currentPage === totalPages - 2) {
			visiblePages.push(totalPages - 1);
		}

		// Sort and deduplicate
		visiblePages = [...new Set(visiblePages)].sort((a, b) => a - b);

		// Build the final array with ellipses where needed
		for (let i = 0; i < visiblePages.length; i++) {
			const current = visiblePages[i];
			const prev = i > 0 ? visiblePages[i - 1] : 0;

			// If there's a gap between this page and the previous one, add ellipsis
			if (current - prev > 1) {
				pages.push(-1); // Ellipsis
			}

			pages.push(current);
		}

		return pages;
	}, [currentPage, totalPages]);

	// Create a pagination summary string (e.g., "1 - 10 of 17,028 items")
	const paginationSummary = useMemo(() => {
		const totalItemsNum = Number(totalItems);

		if (totalItemsNum === 0) {
			return '0 items';
		}

		const start = (currentPage - 1) * itemsPerPage + 1;
		const end = Math.min(currentPage * itemsPerPage, totalItemsNum);

		return `${start.toLocaleString()} - ${end.toLocaleString()} of ${totalItemsNum.toLocaleString()} items`;
	}, [currentPage, itemsPerPage, totalItems]);

	// Navigation functions
	const goToPage = (page: number) => {
		if (page < 1 || page > totalPages) return;
		onPageChange(page);
	};

	const goToPreviousPage = () => goToPage(currentPage - 1);
	const goToNextPage = () => goToPage(currentPage + 1);

	return {
		pageNumbers,
		totalPages,
		goToPage,
		goToPreviousPage,
		goToNextPage,
		paginationSummary,
	};
};

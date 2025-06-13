'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useContracts } from '@/hooks/contract/use-contracts';
import { usePagination } from '@/hooks/use-pagination';
import { shortenAddress } from '@/lib/chain';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Spinner } from '@/components/common/spinner';
import { routes } from '@/routes';

const ITEMS_PER_PAGE = 10;
const INITIAL_PAGE = 1;

function Contracts() {
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

  const { data, isLoading } = useContracts(currentPage, ITEMS_PER_PAGE);
  const contracts = data?.contracts || [];
  const pagination = data?.pagination;
  const totalItems = pagination?.total || 0;

  const { pageNumbers, totalPages, goToPage, goToPreviousPage, goToNextPage, paginationSummary } = usePagination({
    totalItems,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange: setCurrentPage,
  });

  return (
    <div className="flex flex-col items-center gap-8 px-1">
      <h1 className="text-center text-fluid-2xl font-medium">Contracts</h1>
      <div className="scrollbar-neutral w-full">
        {isLoading ? (
          <Spinner className="mx-auto mt-[100px] size-9" />
        ) : contracts.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-base font-medium text-muted-foreground">
            No contracts deployed yet
          </div>
        ) : (
          <Table className="min-w-[750px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">Contract Index</TableHead>
                <TableHead className="w-[30%]">Contract Address</TableHead>
                <TableHead className="w-[30%]">Creator</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map(({ index, creator, contractAddress }) => (
                <TableRow key={index.toString()} className="h-[60px]">
                  <TableCell className="font-medium" copyValue={index.toString()}>
                    {index.toString()}
                  </TableCell>
                  <TableCell className="font-medium" copyValue={contractAddress}>
                    {shortenAddress(contractAddress, 8)}
                  </TableCell>
                  <TableCell className="font-medium" copyValue={creator}>
                    {shortenAddress(creator)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`${routes.playground.interact}?tab=query&address=${contractAddress}`}>
                        <Button size="sm" variant="outline">
                          Query
                        </Button>
                      </Link>
                      <Link href={`${routes.playground.interact}?tab=execute&address=${contractAddress}`}>
                        <Button size="sm" variant="outline">
                          Execute
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {!isLoading && contracts.length > 0 && (
        <div className="flex w-full flex-col gap-4 sm:grid sm:grid-cols-3 sm:items-center">
          <p className="self-start text-sm text-muted-foreground sm:col-start-1 sm:self-auto">{paginationSummary}</p>
          <div className="flex w-full justify-center sm:col-start-2">
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationPrevious onClick={goToPreviousPage} disabled={currentPage === 1} />
                  {pageNumbers.map((pageNumber, index) =>
                    pageNumber < 0 ? (
                      <PaginationEllipsis key={`ellipsis-${index}`} />
                    ) : (
                      <PaginationItem
                        key={pageNumber}
                        isActive={pageNumber === currentPage}
                        onClick={() => goToPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationItem>
                    )
                  )}
                  <PaginationNext onClick={goToNextPage} disabled={currentPage === totalPages} />
                </PaginationContent>
              </Pagination>
            )}
          </div>
          <div className="sm:col-start-3" />
        </div>
      )}
    </div>
  );
}

export default Contracts;

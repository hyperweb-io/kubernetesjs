'use client';

import { useHyperwebAssets } from '@/hooks/contract/use-hyperweb-assets';
import { useHyperwebChain } from '@/hooks/contract/use-hyperweb-chain';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Spinner } from '@/components/common/spinner';

export function AssetsRoute() {
  const { chain, address } = useHyperwebChain();
  const { data, isLoading, error } = useHyperwebAssets();

  const prettyChainName = chain.prettyName || chain.chainName;

  return (
    <div className="scrollbar-neutral mx-auto flex max-w-[720px] flex-col items-center gap-9 font-inter">
      <h1 className="text-center text-fluid-2xl font-medium">Your Assets</h1>

      {!address ? (
        <p className="text-center text-base font-normal text-muted-foreground">
          Connect your wallet to see your assets
        </p>
      ) : isLoading || !data ? (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex w-full items-center justify-between rounded-lg bg-card border border-border/40 p-6">
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Total on {prettyChainName}</h3>
              <p className="text-2xl font-medium text-foreground">
                <span className="text-sm">$</span>
                {data.totalDollarValue}
              </p>
            </div>
          </div>

          <section className="w-full">
            <h2 className="mb-5 self-start text-xl font-medium text-muted-foreground">On {prettyChainName}</h2>

            {data.assets.length > 0 ? (
              <Table className="min-w-[400px]">
                <TableHeader>
                  <TableRow className="border-none">
                    <TableHead className="w-[5%]" />
                    <TableHead className="w-[20%]">Asset</TableHead>
                    <TableHead className="w-[30%]">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.assets.map(({ displayAmount, denom, logoUrl, symbol, prettyChainName, dollarValue }) => (
                    <TableRow key={denom} className="h-[64px] border-none">
                      <TableCell className="min-w-[40px] pl-0 sm:min-w-fit">
                        <Avatar>
                          <AvatarImage src={logoUrl} alt={symbol} />
                          <AvatarFallback>{symbol.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground">{symbol}</p>
                        <p className="text-sm font-light text-muted-foreground">{prettyChainName}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground">{displayAmount}</p>
                        <p className="text-sm font-light text-muted-foreground">${dollarValue}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="my-12 text-center text-base font-normal text-muted-foreground">No assets found</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

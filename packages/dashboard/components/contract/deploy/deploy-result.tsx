import Link from 'next/link';
import type { DeliverTxResponse } from 'hyperwebjs/types';
import { ArrowLeft, Check, Copy } from 'lucide-react';

import { useHyperwebChain } from '@/hooks/contract/use-hyperweb-chain';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { shortenAddress } from '@/lib/chain';
import { getInstantiateResponse, getPrettyTxFee } from '@/lib/contract/deploy';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { useSavedContracts } from '@/contexts/saved-contracts';

export const DeployResult = ({ txResult, onBack }: { txResult: DeliverTxResponse; onBack: () => void }) => {
  const { assetList, address } = useHyperwebChain();
  const { getContract } = useSavedContracts();

  const { data: instantiateResponse, error } = getInstantiateResponse(txResult);

  if (error) {
    logger.error('Failed to parse instantiate response:', error);
  }

  const { index, address: contractAddress } = instantiateResponse || { index: 0, address: '' };

  const contractIndex = index.toString();
  const savedContract = getContract(address, contractIndex);
  const txHash = txResult.transactionHash;

  const infoItems: InfoItemProps[] = [
    {
      label: 'Contract Index',
      value: contractIndex,
      copyValue: contractIndex,
    },
    {
      label: 'Contract Address',
      value: shortenAddress(contractAddress),
      copyValue: contractAddress,
    },
    {
      label: 'Tx Hash',
      value: shortenAddress(txHash),
      copyValue: txHash,
    },
    {
      label: 'Tx Fee',
      value: getPrettyTxFee(txResult, assetList),
    },
  ];

  return (
    <div className="mx-auto mt-10 flex max-w-[560px] flex-col items-center gap-12">
      <div className="flex w-full justify-between">
        <ArrowLeft className="mt-3 size-6 cursor-pointer" onClick={onBack} />
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-center text-fluid-2xl font-medium">Deploy Success</h1>
          <p className="text-center text-sm text-muted-foreground">
            {`${
              savedContract?.label ? `Contract "${savedContract.label}"` : 'Your contract'
            } has been deployed successfully.`}
          </p>
        </div>
        <div className="size-6" />
      </div>
      <div className="flex w-full flex-col gap-4 sm:w-[400px]">
        {infoItems.map((item) => (
          <InfoItem key={item.label} {...item} />
        ))}
      </div>
      <div className="grid w-full grid-cols-2 gap-3 sm:w-[400px]">
        <Button asChild className="w-full">
          <Link href={`/d/playground/interact?tab=query&address=${contractAddress}`}>Query</Link>
        </Button>
        <Button asChild className="w-full">
          <Link href={`/d/playground/interact?tab=execute&address=${contractAddress}`}>Execute</Link>
        </Button>
      </div>
    </div>
  );
};

type InfoItemProps = {
  label: string;
  value: string;
  copyValue?: string;
};

const InfoItem = ({ label, value, copyValue }: InfoItemProps) => {
  const [copy, isCopied] = useCopyToClipboard();

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <p className="text-base font-medium text-muted-foreground">{label}</p>
      <div className="flex items-center gap-3">
        <p className="text-base font-medium">{value}</p>
        {copyValue && (
          <div className="cursor-pointer" onClick={() => copy(copyValue)}>
            {isCopied ? <Check className="size-[18px] text-green-600" /> : <Copy className="size-[18px]" />}
          </div>
        )}
      </div>
    </div>
  );
};

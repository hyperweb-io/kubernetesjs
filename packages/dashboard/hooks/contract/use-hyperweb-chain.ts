import { useChain } from '@interchain-kit/react';

import { DEFAULT_CHAIN_NAME } from '@/configs/chain';

export const useHyperwebChain = () => {
  const chainContext = useChain(DEFAULT_CHAIN_NAME);

  return chainContext;
};

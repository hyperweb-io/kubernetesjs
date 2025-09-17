'use client';

import { ContractLayoutProvider } from '@/components/contract/contract-layout';

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return <ContractLayoutProvider requiresHyperwebSetup={false}>{children}</ContractLayoutProvider>;
}

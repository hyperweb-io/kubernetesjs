import { join } from 'path';

import {
  FALLBACK_PROJECT_PATH,
  getFallbackProjectItems,
} from '@/components/contract/editor/contract-editor.server-utils';
import { ContractPanes } from '@/components/contract/editor/contract-panes';
import { type ProjectItem } from '@/components/contract/editor/hooks/use-contract-project';

interface CreateContractProps {
  fallbackProjectItems: Record<string, ProjectItem>;
}

// Server component to handle the data fetching
async function getFallbackData(): Promise<Record<string, ProjectItem>> {
  // Read fallback project files
  const fallbackPath = join(process.cwd(), FALLBACK_PROJECT_PATH);
  const fallbackProjectItems = getFallbackProjectItems(fallbackPath, fallbackPath);
  return fallbackProjectItems;
}

function CreateContractPage({ fallbackProjectItems }: CreateContractProps) {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <ContractPanes fallbackProjectItems={fallbackProjectItems} />
    </div>
  );
}

export default async function CreatePage() {
  const fallbackProjectItems = await getFallbackData();

  return <CreateContractPage fallbackProjectItems={fallbackProjectItems} />;
}

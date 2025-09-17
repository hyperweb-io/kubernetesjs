import { TreeView as ArkTreeView, createTreeCollection } from '@ark-ui/react/tree-view';
import { ChevronRightIcon, FileIcon, FolderIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type NodeType = 'file' | 'folder';

export interface Node {
	id: string;
	name: string;
	path: string;
	type: NodeType;
	description?: string;
	children?: Node[];
}

export interface TreeViewEvents {
	onSelectionChange?: (details: ArkTreeView.SelectionChangeDetails) => void;
	onExpandedChange?: (details: ArkTreeView.ExpandedChangeDetails) => void;
	onFocusChange?: (details: ArkTreeView.FocusChangeDetails) => void;
}

export const createTree = createTreeCollection;

const NodeLabel = ({ name, description }: { name: string; description?: string }) => {
	if (!description) {
		return <span className='truncate'>{name}</span>;
	}

	return (
		<Tooltip delayDuration={1500}>
			<TooltipTrigger asChild>
				<span className='truncate'>{name}</span>
			</TooltipTrigger>
			<TooltipContent className='bg-card'>
				<p className='text-card-foreground'>{description}</p>
			</TooltipContent>
		</Tooltip>
	);
};

const TreeNode = ({
	node,
	indexPath,
	nodePrefix,
	nodePostfix,
}: ArkTreeView.NodeProviderProps<Node> & {
	nodePrefix?: (node: Node) => React.ReactNode;
	nodePostfix?: (node: Node) => React.ReactNode;
}) => {
	const isFolder = node.type === 'folder';

	return (
		<ArkTreeView.NodeProvider key={node.id} node={node} indexPath={indexPath}>
			{isFolder ? (
				<ArkTreeView.Branch>
					<ArkTreeView.BranchControl
						className={cn(
							'group flex w-full items-center gap-2 rounded-sm px-2 py-1',
							'cursor-pointer hover:bg-muted/50',
							'data-[active]:bg-brand-2/20 data-[selected]:bg-brand-2/20',
						)}
					>
						<ArkTreeView.BranchIndicator>
							<ChevronRightIcon className='h-3 w-3 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90' />
						</ArkTreeView.BranchIndicator>
						<ArkTreeView.BranchText className='flex w-full items-center gap-2 text-sm'>
							<FolderIcon className='h-4 w-4 shrink-0 text-body-text-secondary' />
							<NodeLabel name={node.name} description={node.description} />
							{nodePostfix?.(node)}
						</ArkTreeView.BranchText>
					</ArkTreeView.BranchControl>
					<ArkTreeView.BranchContent className='relative ml-1 pl-1'>
						<ArkTreeView.BranchIndentGuide className='absolute left-0 top-0 h-full w-px bg-border' />
						{node.children?.map((child: Node, index: number) => (
							<TreeNode
								key={child.id}
								node={child}
								indexPath={[...indexPath, index]}
								nodePrefix={nodePrefix}
								nodePostfix={nodePostfix}
							/>
						))}
					</ArkTreeView.BranchContent>
				</ArkTreeView.Branch>
			) : (
				<ArkTreeView.Item
					className={cn(
						'group flex w-full items-center gap-2 rounded-sm px-2 py-1',
						'cursor-pointer transition-colors hover:bg-muted/50',
						'data-[active]:bg-brand-2/20 data-[selected]:bg-brand-2/30',
					)}
				>
					<ArkTreeView.ItemText className='flex w-full items-center gap-2 pl-5 text-sm'>
						{nodePrefix?.(node) ?? <FileIcon className='h-4 w-4 shrink-0 text-body-text-secondary' />}
						<NodeLabel name={node.name} description={node.description} />
						{nodePostfix?.(node)}
					</ArkTreeView.ItemText>
				</ArkTreeView.Item>
			)}
		</ArkTreeView.NodeProvider>
	);
};

interface TreeViewProps extends TreeViewEvents {
	collection: ReturnType<typeof createTreeCollection<Node>>;
	defaultExpandedValue?: string[];
	selectedValue?: string[];
	className?: string;
	nodePrefix?: (node: Node) => React.ReactNode;
	nodePostfix?: (node: Node) => React.ReactNode;
}

export function FileTreeView({
	collection,
	defaultExpandedValue,
	selectedValue,
	className,
	onSelectionChange,
	onExpandedChange,
	onFocusChange,
	nodePrefix,
	nodePostfix,
}: TreeViewProps) {
	return (
		<TooltipProvider>
			<ArkTreeView.Root
				className={cn('w-full select-none overflow-auto', className)}
				collection={collection}
				selectionMode='single'
				selectedValue={selectedValue}
				onExpandedChange={onExpandedChange}
				onSelectionChange={onSelectionChange}
				onFocusChange={onFocusChange}
				defaultExpandedValue={defaultExpandedValue}
			>
				<ArkTreeView.Tree className='px-2 py-1'>
					{collection.rootNode.children?.map((node: Node, index: number) => (
						<TreeNode key={node.id} node={node} indexPath={[index]} nodePrefix={nodePrefix} nodePostfix={nodePostfix} />
					))}
				</ArkTreeView.Tree>
			</ArkTreeView.Root>
		</TooltipProvider>
	);
}

import { useToast } from '@/hooks/use-toast';

import { BuildErrors } from '../contract-editor-errors';
import { buildContracts, parseConfigFile } from '../contract-editor.utils';
import { workspaceEventEmitter } from '../services/events';
import { useContractProject, ContractProjectState, ContractProjectActions } from './use-contract-project';

const CONFIG_FILE_PATH = 'scripts/configs.ts';

interface ErrorResult {
	name: string;
	message: string;
}

export function useBuildContracts({ onError }: { onError?: (errors: BuildErrors[]) => void }) {
	const { toast } = useToast();
	const store = useContractProject();
	const { items, getItemByPath, createFiles, deleteItems, getChildrenByPath } = store;

	const handleError = (result: ErrorResult) => {
		toast({
			title: 'Build failed',
			description: result.message,
			variant: 'destructive',
		});
		onError?.([
			{
				name: result.name,
				errors: [
					{
						message: result.message,
						severity: 'error',
					},
				],
			},
		]);
	};

	const build = async () => {
		const fullStore = store as ContractProjectState & ContractProjectActions;
		try {
			await workspaceEventEmitter.emit('PREBUILD', { store: fullStore });

			const configFile = getItemByPath(CONFIG_FILE_PATH, 'file');
			if (!configFile) {
				handleError({
					message: `Config file not found at ${CONFIG_FILE_PATH}`,
					name: 'Config file not found',
				});
				return;
			}

			const parseResult = await parseConfigFile(configFile.content);
			if (!parseResult.success) {
				handleError({
					message: parseResult.error || 'Failed to parse config file',
					name: 'Config file parse error',
				});
				return;
			}

			const buildResult = await buildContracts(items, parseResult.configs ?? []);
			if (!buildResult.success) {
				handleError({
					message: buildResult.error || 'Build failed with unknown error',
					name: 'Build error',
				});
				return;
			}

			const distFolder = getItemByPath('dist', 'folder');
			if (distFolder) {
				const children = getChildrenByPath(distFolder.path);
				if (children.length > 0) {
					const res = deleteItems(children.map((child) => child.id));
					if (!res.success) {
						handleError({
							message: res.error || `Failed to clean dist folder`,
							name: 'Clean dist folder error',
						});
						return;
					}
				}
			}

			const filesToCreate = (buildResult.outputFiles ?? []).map((file) => ({
				path: file.path,
				name: file.path.split('/').pop()!,
				content: file.text,
			}));

			const createResult = createFiles(filesToCreate);
			if (!createResult.success) {
				handleError({
					message: createResult.error || `Failed to create output files`,
					name: 'Create output files error',
				});
				return;
			}

			onError?.([]);
			toast({
				title: 'Build successful',
				description: 'Contracts built successfully',
				variant: 'success',
			});
		} catch (error) {
			console.error('Failed to build contracts:', error);
			handleError({
				message: error instanceof Error ? error.message : String(error) || 'An unexpected error occurred',
				name: 'Build error',
			});
		} finally {
			await workspaceEventEmitter.emit('POSTBUILD', { store: fullStore });
		}
	};

	return { build };
}

import { BuildErrors, ContractEditorErrors } from '../contract-editor-errors';
import { ErrorPanelSkeleton } from '../contract-editor-skeletons';

export function ErrorPanel({ isReady, errors = [] }: { isReady: boolean; errors: BuildErrors[] }) {
	if (!isReady) return <ErrorPanelSkeleton />;
	return <ContractEditorErrors errors={errors} />;
}

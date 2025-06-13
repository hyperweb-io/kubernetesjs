import { DependencyManagerOptions, DependencyManagerUpdate } from './dependency-manager.types';

export const invokeUpdate = (progress: DependencyManagerUpdate, options: DependencyManagerOptions) => {
	let textual = `${progress.type}: `;

	switch (progress.type) {
		case 'CodeChanged': {
			textual += ``;
			break;
		}
		case 'ResolveNewImports': {
			textual += ``;
			break;
		}
		case 'ResolveFromPackageJson': {
			textual += `Resolved package.json`;
			break;
		}
		case 'LookedUpTypeFile': {
			textual += `"${progress.path}" was ${progress.success ? 'sucessfully' : 'not sucessfully'} looked up`;
			break;
		}
		case 'AttemptedLookUpFile': {
			textual += `"${progress.path}" was ${
				progress.success ? 'sucessfully' : 'not sucessfully'
			} attempted to looked up`;
			break;
		}
		case 'LookedUpPackage': {
			textual += `package.json for package "${progress.package}" was ${
				progress.success ? 'sucessfully' : 'not sucessfully'
			} looked up${progress.definitelyTyped ? ' (found in definitely typed repo)' : ''}`;
			break;
		}
		case 'LoadedFromCache': {
			textual += `"${progress.importPath}" was loaded from cache`;
			break;
		}
		case 'StoredToCache': {
			textual += `"${progress.importPath}" was stored to cache`;
			break;
		}
	}

	if (textual.endsWith(': ')) {
		textual = textual.slice(undefined, -2);
	}

	options.onUpdate?.(progress, textual);
};

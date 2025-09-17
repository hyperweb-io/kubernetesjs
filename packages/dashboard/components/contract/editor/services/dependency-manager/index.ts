import { DependencyManagerCore } from './dependency-manager-core';

// Export core types and interfaces
export type {
	DependencyManagerOptions,
	DependencyManagerUpdate,
	SourceCache,
	SourceResolver,
} from './dependency-manager.types';

// Export cache and resolver implementations
export { ZenFsCache } from './zenfs-cache';
export { JsDelivrResolver } from './jsdelivr-resolver';
export { UnpkgResolver } from './unpkg-resolver';

// Alias
export { DependencyManagerCore as DependencyManager };

// Packages to omit from dependency resolution
// These packages are not necessary for contract development
export const OMIT_PACKAGES = [
	'@interchain-kit/core',
	'@interchain-kit/keplr-extension',
	'@interchain-kit/leap-extension',
	'@interchain-kit/react',
	'@interchain-ui/react',
	'@interchain-ui/react-no-ssr',
	'interchain-kit',
	'next',
	'react',
	'react-dom',
	'react-icons',
	'@types/react',
	'@types/react-dom',
	'@types/jest',
	'@typescript-eslint/eslint-plugin',
	'@typescript-eslint/parser',
	'eslint',
	'eslint-config-next',
	'eslint-plugin-simple-import-sort',
	'eslint-plugin-unused-imports',
	'generate-lockfile',
	'jest',
	'prettier',
	'rimraf',
	'ts-jest',
	'ts-node',
];

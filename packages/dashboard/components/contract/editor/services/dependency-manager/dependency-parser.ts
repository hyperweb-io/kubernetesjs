import * as path from 'path';

import { logger } from '@/lib/logger';

import { ImportResourcePath } from './import-resource-path';

export class DependencyParser {
	// Group 1: import/export ... from "(path)"
	// Group 2: require("(path)") or import("(path)")
	// Group 3: /// <reference path="(path)" />
	private REGEX_DETECT_DEPENDENCY =
		/(?:(?:import|export)[^'"\n]*from\s+|import(?:\s*\([^'"\n]*\))?\s*)\s*['"]([^'"\n]+)['"]|require\((?:\s*)?['"]([^'"\n]+)['"]\)|(?:\/\/\/\s*<reference\s+path=['"]([^'"\n]+)['"]\s*\/>)/g;

	private REGEX_NODE_MODULE = /^node:([\w\W/]+)$/;

	public parseDependencies(source: string, parent: ImportResourcePath | string): ImportResourcePath[] {
		return (
			[...source.matchAll(this.REGEX_DETECT_DEPENDENCY)]
				// Extract path from Group 1, 2, or 3
				.map((match) => match[1] ?? match[2] ?? match[3])
				.filter((imp): imp is string => !!imp) // Ensure we only have strings and type guard
				.map((imp) => this.resolvePath(imp, parent))
		);
	}

	private resolvePath(importPath: string, parent: ImportResourcePath | string): ImportResourcePath {
		const nodeImport = importPath.match(this.REGEX_NODE_MODULE);
		if (nodeImport) {
			// Handle node: imports specifically (maps to @types/node)
			return {
				kind: 'relative-in-package',
				packageName: '@types/node',
				importPath: `${nodeImport[1]}.d.ts`,
				sourcePath: '', // Relative to the root of @types/node
			};
		}

		// Determine if the path looks like a relative path (starts with '.' or is potentially a reference path)
		// Reference paths are always relative to the current file.
		const isRelative = importPath.startsWith('.');
		const isPackage = !isRelative && !path.isAbsolute(importPath); // Assume non-relative, non-absolute is a package

		if (typeof parent === 'string') {
			// Parent is a simple path string (e.g., the initial file URI)
			if (isRelative) {
				return {
					kind: 'relative',
					importPath,
					sourcePath: parent, // The parent URI itself
				};
			} else if (isPackage) {
				const segments = importPath.split('/');
				const packageName = importPath.startsWith('@') ? `${segments[0]}/${segments[1]}` : segments[0];
				const remainingPath = importPath.startsWith('@') ? segments.slice(2).join('/') : segments.slice(1).join('/');
				return {
					kind: 'package',
					packageName,
					importPath: remainingPath,
				};
			} else {
				// Handle absolute paths or other cases if necessary - currently treating like relative
				logger.warn(`DependencyParser: Unhandled path type from root: ${importPath}`);
				return {
					kind: 'relative',
					importPath,
					sourcePath: parent,
				};
			}
		} else {
			// Parent is already a structured ImportResourcePath
			if (parent.kind === 'package') {
				// This case shouldn't ideally happen
				logger.error(`DependencyParser: Unexpected parent type 'package'`);
				return { kind: 'package', packageName: parent.packageName, importPath };
			} else if (parent.kind === 'relative') {
				// This case shouldn't ideally happen either
				logger.error(`DependencyParser: Unexpected parent type 'relative'`);
				return {
					kind: 'relative',
					importPath,
					sourcePath: path.join(path.dirname(parent.sourcePath), parent.importPath),
				};
			} else if (parent.kind === 'relative-in-package') {
				// ANY import path encountered while inside a package (that isn't a 'node:' import)
				// should be treated as relative *within that package*.
				// This correctly handles both './sibling' and 'referenced-file.d.ts'
				if (!isPackage && !isRelative) {
					// This case might correspond to absolute paths, log a warning
					logger.warn(
						`DependencyParser: Potentially unhandled absolute path within package ${parent.packageName}: ${importPath}`,
					);
				}

				// Treat as relative-in-package regardless of starting with '.' or being identified as a potential package name
				return {
					kind: 'relative-in-package',
					packageName: parent.packageName,
					// Resolve relative to the directory of the parent file within the package
					sourcePath: path.dirname(path.join(parent.sourcePath, parent.importPath)),
					importPath: importPath,
				};
			} else {
				// Should not happen if parent.kind is exhaustive, but satisfy TS
				logger.error(`DependencyParser: Unknown parent kind: ${(parent as any).kind}`);
				// Fallback to treating as a new package import?
				const segments = importPath.split('/');
				const packageName = importPath.startsWith('@') ? `${segments[0]}/${segments[1]}` : segments[0];
				const remainingPath = importPath.startsWith('@') ? segments.slice(2).join('/') : segments.slice(1).join('/');
				return { kind: 'package', packageName, importPath: remainingPath };
			}
		}
	}
}

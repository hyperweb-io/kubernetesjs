import type { FileItem } from '../hooks/use-contract-project';
import type { WorkspaceEvent } from '../services/events';

export type WorkspaceContext = object;

export type TaskFunction = (file: FileItem, context: WorkspaceContext) => Promise<FileItem | void> | FileItem | void;

export type TaskRegistry = Partial<Record<WorkspaceEvent, TaskFunction[]>>;

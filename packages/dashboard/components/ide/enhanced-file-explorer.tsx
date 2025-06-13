'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  File,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  Edit,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Cloud,
  HardDrive,
  GitCompare,
  Check,
  AlertCircle,
} from 'lucide-react';
import { configure, fs } from '@zenfs/core';
import { IndexedDB } from '@zenfs/dom';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  expanded?: boolean;
  source?: 'local' | 'zenfs' | 'both';
  modified?: boolean;
  syncStatus?: 'synced' | 'modified' | 'conflict';
}

interface EnhancedFileExplorerProps {
  onFileSelect: (path: string, content: string, source: 'local' | 'zenfs') => void;
  onSyncRequest?: () => void;
}

export function EnhancedFileExplorer({ onFileSelect, onSyncRequest }: EnhancedFileExplorerProps) {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'complete'>('idle');

  // Initialize ZenFS
  useEffect(() => {
    const initFS = async () => {
      try {
        // Configure ZenFS with IndexedDB backend
        await configure({
          mounts: {
            '/': { backend: IndexedDB, store: 'ide-filesystem' },
          },
        });

        setIsInitialized(true);
        await loadFileTree();
      } catch (error) {
        console.error('Failed to initialize file system:', error);
      }
    };

    initFS();
  }, []);

  // Load file tree from both local FS and ZenFS
  const loadFileTree = async () => {
    setLoading(true);
    try {
      // Load local files
      const localFiles = await fetchLocalFiles('.');

      // Load ZenFS files
      const zenfsFiles = await loadZenFSFiles('/project');

      // Merge trees
      const mergedTree = mergeTrees(localFiles, zenfsFiles);
      setFileTree(mergedTree);
    } catch (error) {
      console.error('Failed to load file tree:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch files from local file system API
  const fetchLocalFiles = async (dirPath: string): Promise<FileNode[]> => {
    try {
      const response = await fetch('/api/ide/fs/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dirPath }),
      });

      if (!response.ok) throw new Error('Failed to fetch files');

      const { files } = await response.json();

      return files.map((file: any) => ({
        name: file.name,
        path: file.path,
        type: file.type,
        source: 'local' as const,
        children: file.type === 'directory' ? [] : undefined,
        expanded: false,
      }));
    } catch (error) {
      console.error('Error fetching local files:', error);
      return [];
    }
  };

  // Load files from ZenFS
  const loadZenFSFiles = async (dirPath: string): Promise<FileNode[]> => {
    try {
      const exists = await fs.promises.exists(dirPath);
      if (!exists) return [];

      const entries = await fs.promises.readdir(dirPath);
      const nodes: FileNode[] = [];

      for (const entry of entries) {
        const fullPath = `${dirPath}/${entry}`;
        const stats = await fs.promises.stat(fullPath);

        nodes.push({
          name: entry,
          path: fullPath.replace('/project/', ''),
          type: stats.isDirectory() ? 'directory' : 'file',
          source: 'zenfs',
          children: stats.isDirectory() ? [] : undefined,
          expanded: false,
        });
      }

      return nodes;
    } catch (error) {
      console.error('Error loading ZenFS files:', error);
      return [];
    }
  };

  // Merge local and ZenFS file trees
  const mergeTrees = (localFiles: FileNode[], zenfsFiles: FileNode[]): FileNode[] => {
    const merged = new Map<string, FileNode>();

    // Add local files
    localFiles.forEach((file) => {
      merged.set(file.path, { ...file });
    });

    // Merge or add ZenFS files
    zenfsFiles.forEach((file) => {
      const existing = merged.get(file.path);
      if (existing) {
        existing.source = 'both';
        // TODO: Compare content to determine sync status
      } else {
        merged.set(file.path, file);
      }
    });

    return Array.from(merged.values()).sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  };

  // Handle file selection
  const handleFileSelect = async (node: FileNode) => {
    if (node.type === 'file') {
      setSelectedFile(node.path);

      try {
        let content = '';

        // Try to read from ZenFS first (for edited files)
        if (node.source === 'zenfs' || node.source === 'both') {
          try {
            content = await fs.promises.readFile(`/project/${node.path}`, 'utf8');
            onFileSelect(node.path, content, 'zenfs');
            return;
          } catch {
            // Fall through to local read
          }
        }

        // Read from local file system
        if (node.source === 'local' || node.source === 'both') {
          const response = await fetch('/api/ide/fs/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filePath: node.path }),
          });

          if (response.ok) {
            const { content: fileContent, binary } = await response.json();
            if (!binary) {
              content = fileContent;
              onFileSelect(node.path, content, 'local');
            }
          }
        }
      } catch (error) {
        console.error('Failed to read file:', error);
      }
    }
  };

  // Toggle directory expansion
  const toggleDirectory = async (node: FileNode) => {
    if (node.type === 'directory') {
      const newExpanded = !node.expanded;

      if (newExpanded && (!node.children || node.children.length === 0)) {
        // Load children
        const localChildren = await fetchLocalFiles(node.path);
        const zenfsChildren = await loadZenFSFiles(`/project/${node.path}`);
        node.children = mergeTrees(localChildren, zenfsChildren);
      }

      node.expanded = newExpanded;
      setFileTree([...fileTree]);
    }
  };

  // Get source icon
  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'local':
        return <HardDrive className="w-3 h-3 text-blue-500" />;
      case 'zenfs':
        return <Cloud className="w-3 h-3 text-green-500" />;
      case 'both':
        return <GitCompare className="w-3 h-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  // Get sync status icon
  const getSyncStatusIcon = (status?: string) => {
    switch (status) {
      case 'synced':
        return <Check className="w-3 h-3 text-green-500" />;
      case 'modified':
        return <AlertCircle className="w-3 h-3 text-yellow-500" />;
      case 'conflict':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  // Render file tree recursively
  const renderTree = (nodes: FileNode[], level: number = 0) => {
    return nodes.map((node) => (
      <div key={node.path}>
        <button
          onClick={() => {
            if (node.type === 'directory') {
              toggleDirectory(node);
            } else {
              handleFileSelect(node);
            }
          }}
          className={`w-full text-left px-2 py-1 text-sm hover:bg-accent rounded flex items-center justify-between group ${
            selectedFile === node.path ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
        >
          <div className="flex items-center flex-1">
            {node.type === 'directory' ? (
              <>
                {node.expanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
                {node.expanded ? <FolderOpen className="w-4 h-4 mr-2" /> : <Folder className="w-4 h-4 mr-2" />}
              </>
            ) : (
              <File className="w-4 h-4 mr-2 ml-5" />
            )}
            <span className="flex-1">{node.name}</span>
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
            {getSourceIcon(node.source)}
            {getSyncStatusIcon(node.syncStatus)}
          </div>
        </button>
        {node.type === 'directory' && node.expanded && node.children && (
          <div>{renderTree(node.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  if (!isInitialized) {
    return <div className="p-4 text-sm text-muted-foreground">Initializing file system...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold flex items-center">
            <FolderOpen className="w-4 h-4 mr-2" />
            Explorer
          </h2>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={loadFileTree} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Folder className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="mt-2 flex items-center text-xs text-muted-foreground">
          <div className="flex items-center mr-3">
            <HardDrive className="w-3 h-3 mr-1 text-blue-500" />
            <span>Local</span>
          </div>
          <div className="flex items-center mr-3">
            <Cloud className="w-3 h-3 mr-1 text-green-500" />
            <span>ZenFS</span>
          </div>
          <div className="flex items-center">
            <GitCompare className="w-3 h-3 mr-1 text-yellow-500" />
            <span>Both</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? <div className="text-sm text-muted-foreground p-2">Loading files...</div> : renderTree(fileTree)}
      </div>
    </div>
  );
}

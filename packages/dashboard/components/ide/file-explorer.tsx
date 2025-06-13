'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { File, Folder, FolderOpen, Plus, Trash2, Edit, ChevronRight, ChevronDown } from 'lucide-react';
import { configure, fs } from '@zenfs/core';
import { IndexedDB } from '@zenfs/dom';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  expanded?: boolean;
}

interface FileExplorerProps {
  onFileSelect: (path: string, content: string) => void;
}

export function FileExplorer({ onFileSelect }: FileExplorerProps) {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

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

        // Create initial project structure
        const initialFiles = [
          { path: '/project', type: 'dir' },
          {
            path: '/project/index.html',
            type: 'file',
            content:
              '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Web App</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello World!</h1>\n  <script src="script.js"></script>\n</body>\n</html>',
          },
          {
            path: '/project/style.css',
            type: 'file',
            content:
              'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background-color: #f0f0f0;\n}\n\nh1 {\n  color: #333;\n}',
          },
          {
            path: '/project/script.js',
            type: 'file',
            content: 'console.log("Hello from script.js!");\n\n// Your JavaScript code here',
          },
          {
            path: '/project/README.md',
            type: 'file',
            content: '# My Web App\n\nThis is a sample web application created in the IDE.',
          },
        ];

        // Create initial files if they don't exist
        for (const item of initialFiles) {
          try {
            if (item.type === 'dir') {
              await fs.promises.mkdir(item.path);
            } else {
              const exists = await fs.promises.exists(item.path);
              if (!exists && item.content) {
                await fs.promises.writeFile(item.path, item.content);
              }
            }
          } catch (err) {
            // File/dir might already exist, ignore
          }
        }

        setIsInitialized(true);
        await loadFileTree();
      } catch (error) {
        console.error('Failed to initialize file system:', error);
      }
    };

    initFS();
  }, []);

  // Load file tree from ZenFS
  const loadFileTree = async () => {
    try {
      const tree = await buildFileTree('/project');
      setFileTree(tree);
    } catch (error) {
      console.error('Failed to load file tree:', error);
    }
  };

  // Recursively build file tree
  const buildFileTree = async (dirPath: string): Promise<FileNode[]> => {
    const entries = await fs.promises.readdir(dirPath);
    const nodes: FileNode[] = [];

    for (const entry of entries) {
      const fullPath = `${dirPath}/${entry}`;
      const stats = await fs.promises.stat(fullPath);

      const node: FileNode = {
        name: entry,
        path: fullPath,
        type: stats.isDirectory() ? 'directory' : 'file',
      };

      if (stats.isDirectory()) {
        node.children = [];
        node.expanded = false;
      }

      nodes.push(node);
    }

    return nodes.sort((a, b) => {
      // Directories first, then files
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
        const content = await fs.promises.readFile(node.path, 'utf8');
        onFileSelect(node.path, content);
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
        // Load children if not loaded
        node.children = await buildFileTree(node.path);
      }

      node.expanded = newExpanded;
      setFileTree([...fileTree]);
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
          className={`w-full text-left px-2 py-1 text-sm hover:bg-accent rounded flex items-center ${
            selectedFile === node.path ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
        >
          {node.type === 'directory' ? (
            <>
              {node.expanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
              {node.expanded ? <FolderOpen className="w-4 h-4 mr-2" /> : <Folder className="w-4 h-4 mr-2" />}
            </>
          ) : (
            <File className="w-4 h-4 mr-2 ml-5" />
          )}
          {node.name}
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
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Folder className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">{renderTree(fileTree)}</div>
    </div>
  );
}

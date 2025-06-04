import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface FileInfo {
  name: string
  path: string
  type: 'file' | 'directory'
  size?: number
  modified?: string
}

// Get the project root directory (where the Next.js app is running)
const PROJECT_ROOT = process.cwd()

// Ensure path is within project bounds
function isPathSafe(requestedPath: string): boolean {
  const resolvedPath = path.resolve(PROJECT_ROOT, requestedPath)
  return resolvedPath.startsWith(PROJECT_ROOT)
}

export async function POST(request: NextRequest) {
  try {
    const { dirPath = '.' } = await request.json()
    
    // Validate path
    if (!isPathSafe(dirPath)) {
      return NextResponse.json(
        { error: 'Invalid path: Access denied' },
        { status: 403 }
      )
    }

    const fullPath = path.join(PROJECT_ROOT, dirPath)
    
    // Check if directory exists
    const stats = await fs.stat(fullPath)
    if (!stats.isDirectory()) {
      return NextResponse.json(
        { error: 'Path is not a directory' },
        { status: 400 }
      )
    }

    // Read directory contents
    const entries = await fs.readdir(fullPath)
    const files: FileInfo[] = []

    // Get stats for each entry
    for (const entry of entries) {
      // Skip hidden files and common ignore patterns
      if (entry.startsWith('.') || entry === 'node_modules') {
        continue
      }

      try {
        const entryPath = path.join(fullPath, entry)
        const entryStats = await fs.stat(entryPath)
        
        files.push({
          name: entry,
          path: path.relative(PROJECT_ROOT, entryPath),
          type: entryStats.isDirectory() ? 'directory' : 'file',
          size: entryStats.size,
          modified: entryStats.mtime.toISOString()
        })
      } catch (error) {
        // Skip files we can't access
        console.error(`Error accessing ${entry}:`, error)
      }
    }

    // Sort: directories first, then alphabetically
    files.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json({ files, basePath: dirPath })
  } catch (error) {
    console.error('Error listing directory:', error)
    return NextResponse.json(
      { error: 'Failed to list directory' },
      { status: 500 }
    )
  }
}
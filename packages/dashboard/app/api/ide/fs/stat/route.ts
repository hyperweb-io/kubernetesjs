import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const PROJECT_ROOT = process.cwd()

// Ensure path is within project bounds
function isPathSafe(requestedPath: string): boolean {
  const resolvedPath = path.resolve(PROJECT_ROOT, requestedPath)
  return resolvedPath.startsWith(PROJECT_ROOT)
}

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json()
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }

    // Validate path
    if (!isPathSafe(filePath)) {
      return NextResponse.json(
        { error: 'Invalid path: Access denied' },
        { status: 403 }
      )
    }

    const fullPath = path.join(PROJECT_ROOT, filePath)
    
    // Get file stats
    const stats = await fs.stat(fullPath)
    
    return NextResponse.json({
      exists: true,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      size: stats.size,
      created: stats.birthtime.toISOString(),
      modified: stats.mtime.toISOString(),
      accessed: stats.atime.toISOString()
    })
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ exists: false })
    }
    
    console.error('Error getting file stats:', error)
    return NextResponse.json(
      { error: 'Failed to get file stats' },
      { status: 500 }
    )
  }
}
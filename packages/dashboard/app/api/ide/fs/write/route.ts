import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const PROJECT_ROOT = process.cwd()

// Ensure path is within project bounds
function isPathSafe(requestedPath: string): boolean {
  const resolvedPath = path.resolve(PROJECT_ROOT, requestedPath)
  return resolvedPath.startsWith(PROJECT_ROOT)
}

// Check if file should be writable
function isWritable(filePath: string): boolean {
  // Prevent writing to critical files
  const restricted = [
    'package.json',
    'package-lock.json',
    'yarn.lock',
    'next.config.js',
    'tsconfig.json',
    '.env',
    '.env.local'
  ]
  
  const fileName = path.basename(filePath)
  return !restricted.includes(fileName)
}

export async function POST(request: NextRequest) {
  try {
    const { filePath, content } = await request.json()
    
    if (!filePath || content === undefined) {
      return NextResponse.json(
        { error: 'File path and content are required' },
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

    // Check if file is writable
    if (!isWritable(filePath)) {
      return NextResponse.json(
        { error: 'File is protected and cannot be modified' },
        { status: 403 }
      )
    }

    const fullPath = path.join(PROJECT_ROOT, filePath)
    
    // Ensure directory exists
    const dir = path.dirname(fullPath)
    await fs.mkdir(dir, { recursive: true })
    
    // Write file
    await fs.writeFile(fullPath, content, 'utf-8')
    
    // Get updated stats
    const stats = await fs.stat(fullPath)
    
    return NextResponse.json({
      success: true,
      size: stats.size,
      modified: stats.mtime.toISOString()
    })
  } catch (error) {
    console.error('Error writing file:', error)
    return NextResponse.json(
      { error: 'Failed to write file' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const PROJECT_ROOT = process.cwd()

// Ensure path is within project bounds
function isPathSafe(requestedPath: string): boolean {
  const resolvedPath = path.resolve(PROJECT_ROOT, requestedPath)
  return resolvedPath.startsWith(PROJECT_ROOT)
}

// Determine if file is likely binary
function isBinaryFile(filePath: string): boolean {
  const binaryExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg',
    '.pdf', '.zip', '.tar', '.gz', '.rar',
    '.exe', '.dll', '.so', '.dylib',
    '.mp3', '.mp4', '.avi', '.mov',
    '.woff', '.woff2', '.ttf', '.eot'
  ]
  
  const ext = path.extname(filePath).toLowerCase()
  return binaryExtensions.includes(ext)
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
    
    // Check if file exists
    const stats = await fs.stat(fullPath)
    if (!stats.isFile()) {
      return NextResponse.json(
        { error: 'Path is not a file' },
        { status: 400 }
      )
    }

    // Check if file is binary
    if (isBinaryFile(fullPath)) {
      return NextResponse.json({
        content: '',
        binary: true,
        message: 'Binary file - cannot display content'
      })
    }

    // Read file content
    const content = await fs.readFile(fullPath, 'utf-8')
    
    return NextResponse.json({
      content,
      binary: false,
      size: stats.size,
      modified: stats.mtime.toISOString()
    })
  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    )
  }
}
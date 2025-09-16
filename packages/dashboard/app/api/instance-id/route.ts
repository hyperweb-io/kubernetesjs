import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

// In a real implementation, this would be stored in a database or retrieved from a service
let instanceId: string | null = null

export async function GET() {
  try {
    // Generate instance ID if not exists
    if (!instanceId) {
      instanceId = randomUUID()
    }

    return NextResponse.json({ instanceId })
  } catch (error) {
    console.error('Failed to get instance ID:', error)
    return NextResponse.json(
      { error: 'Failed to get instance ID' },
      { status: 500 }
    )
  }
}
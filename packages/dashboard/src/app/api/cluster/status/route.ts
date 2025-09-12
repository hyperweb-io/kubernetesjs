import { NextResponse } from 'next/server';
import { dashboardClient } from '@/lib/interweb-client';

export async function GET() {
  try {
    const status = await dashboardClient.getClusterStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Failed to fetch cluster status:', error);
    
    // Return a graceful error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch cluster status',
        message: error instanceof Error ? error.message : 'Unknown error',
        healthy: false,
        nodeCount: 0,
        podCount: 0,
        serviceCount: 0,
        operatorCount: 0,
        version: 'unknown',
        nodes: [],
      }, 
      { status: 500 }
    );
  }
}

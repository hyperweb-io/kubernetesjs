import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createSetupClient } from '@/lib/k8s';

export async function GET() {
  try {
    const setup = createSetupClient();
    const status = await setup.getClusterOverview();
    return NextResponse.json(status, { headers: { 'Cache-Control': 'no-store' } });
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

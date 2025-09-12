import { NextResponse } from 'next/server';
import { dashboardClient } from '@/lib/interweb-client';

export async function GET() {
  try {
    const operators = await dashboardClient.getOperators();
    return NextResponse.json(operators);
  } catch (error) {
    console.error('Failed to fetch operators:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch operators',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

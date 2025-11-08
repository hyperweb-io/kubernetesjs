import { NextResponse } from 'next/server';
import { createSetupClient } from '@/k8s/client';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ operator: string }> }) {
  try {
    const setup = createSetupClient();
    const { operator } = await params;
    const info = await setup.getOperatorDebug(operator);
    return NextResponse.json(info);
  } catch (error) {
    console.error('Failed to fetch operator debug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch operator debug', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


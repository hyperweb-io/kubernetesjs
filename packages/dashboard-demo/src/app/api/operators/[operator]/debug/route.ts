import { NextResponse } from 'next/server';
import { createSetupClient } from '@/lib/k8s';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { operator: string } }) {
  try {
    const setup = createSetupClient();
    const info = await setup.getOperatorDebug(params.operator);
    return NextResponse.json(info);
  } catch (error) {
    console.error('Failed to fetch operator debug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch operator debug', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


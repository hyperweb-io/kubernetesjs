import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createSetupClient } from '@/lib/k8s';

export async function GET(_req: Request, { params }: { params: { operator: string } }) {
  try {
    const setup = createSetupClient();
    const state = await setup.getOperatorInstallState(params.operator);
    return NextResponse.json(state);
  } catch (error) {
    console.error('Failed to fetch operator status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch operator status', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

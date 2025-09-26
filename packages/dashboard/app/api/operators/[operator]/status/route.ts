import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createSetupClient } from '@/k8s/client';

export async function GET(_req: Request, { params }: { params: Promise<{ operator: string }> }) {
  try {
    const setup = createSetupClient();
    const { operator } = await params;
    const state = await setup.getOperatorInstallations(operator);
    return NextResponse.json(state);
  } catch (error) {
    console.error('Failed to fetch operator status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch operator status', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

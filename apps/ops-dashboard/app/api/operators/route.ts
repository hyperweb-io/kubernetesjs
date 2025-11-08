import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { createSetupClient } from '@/k8s/client';

export async function GET() {
  try {
    // Debug: confirm module resolution and available methods at runtime
    try {
      const req = createRequire(import.meta.url);
      const clientResolved = req.resolve('@kubernetesjs/client');
      const manifestsPkgPath = req.resolve('@kubernetesjs/manifests/package.json');
      const operatorsDir = path.join(path.dirname(manifestsPkgPath), 'operators');
      console.debug('[operators.GET] resolve', {
        clientResolved,
        manifestsPkgPath,
        operatorsDirExists: fs.existsSync(operatorsDir),
      });
    } catch (e) {
      console.warn('[operators.GET] resolution debug failed', e);
    }
    const setup = createSetupClient();
    console.debug('[operators.GET] setup proto:', Object.getOwnPropertyNames(Object.getPrototypeOf(setup)).sort());
    const operators = await setup.listOperatorsInfo();
    return NextResponse.json(operators, { headers: { 'Cache-Control': 'no-store' } });
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

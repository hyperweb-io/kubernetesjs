import fs from 'fs';
import { createRequire } from 'module';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { createSetupClient } from '@/k8s/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ operator: string }> }
) {
  try {
    try {
      const req = createRequire(import.meta.url);
      const clientResolved = req.resolve('@kubernetesjs/client');
      const manifestsPkgPath = req.resolve('@kubernetesjs/manifests/package.json');
      const operatorsDir = path.join(path.dirname(manifestsPkgPath), 'operators');
      console.debug('[operators.install] resolve', {
        clientResolved,
        manifestsPkgPath,
        operatorsDirExists: fs.existsSync(operatorsDir),
        INTERWEB_MANIFESTS_DIR: process.env.INTERWEB_MANIFES_DIR || process.env.INTERWEB_MANIFESTS_DIR,
      });
    } catch (e) {
      console.warn('[operators.install] resolution debug failed', e);
    }
    const config = await request.json().catch(() => ({}));
    const setup = createSetupClient();
    console.debug('[operators.install] setup proto:', Object.getOwnPropertyNames(Object.getPrototypeOf(setup)).sort());
    const { operator } = await params;
    await setup.installOperatorByName(operator, config?.version);
    // Optional wait for readiness via ?wait=true or body { wait: true, timeoutMs?: number }
    const url = new URL(request.url);
    const waitParam = url.searchParams.get('wait');
    const shouldWait = (config?.wait === true) || (waitParam === 'true');
    const timeoutMs = Number(url.searchParams.get('timeoutMs') || config?.timeoutMs || 180_000);
    if (shouldWait) {
      await setup.waitForOperator(operator, timeoutMs);
    }
    
    return NextResponse.json({ 
      success: true,
      message: (shouldWait ? `Operator ${operator} installed` : `Operator ${operator} installation initiated`)
    });
  } catch (error) {
    console.error('Failed to install operator:', error);
    return NextResponse.json(
      { 
        error: 'Failed to install operator',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ operator: string }> }
) {
  try {
    try {
      const req = createRequire(import.meta.url);
      const manifestsPkgPath = req.resolve('@kubernetesjs/manifests/package.json');
      const operatorsDir = path.join(path.dirname(manifestsPkgPath), 'operators');
      console.debug('[operators.uninstall] operatorsDirExists', fs.existsSync(operatorsDir));
    } catch {}
    const setup = createSetupClient();
    const { operator } = await params;
    await setup.uninstallOperatorByName(operator);
    const url = new URL(request.url);
    const waitParam = url.searchParams.get('wait');
    const shouldWait = waitParam === 'true';
    const timeoutMs = Number(url.searchParams.get('timeoutMs') || 180_000);
    if (shouldWait) {
      await setup.waitForOperatorDeletion(operator, timeoutMs);
    }
    
    return NextResponse.json({ 
      success: true,
      message: (shouldWait ? `Operator ${operator} uninstalled` : `Operator ${operator} uninstallation initiated`)
    });
  } catch (error) {
    console.error('Failed to uninstall operator:', error);
    return NextResponse.json(
      { 
        error: 'Failed to uninstall operator',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

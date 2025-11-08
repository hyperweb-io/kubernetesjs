import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@interweb/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: Promise<{ namespace: string; name: string }> }) {
  try {
    const body = await req.json().catch(() => ({}));
    const { namespace, name } = await params;

    // Validate required fields (the UI should send all)
    const required = ['instances', 'storage', 'appUsername', 'appPassword', 'superuserPassword'];
    for (const k of required) {
      const v = body[k];
      if (v === undefined || v === null || String(v).trim() === '') {
        return NextResponse.json({ error: `Missing required field: ${k}` }, { status: 400 });
      }
    }

    // Use kubectl proxy from env or localhost
    const restEndpoint = process.env.KUBERNETES_PROXY_URL || 'http://127.0.0.1:8001';

    const client = new Client({ restEndpoint, namespace, verbose: true });

    const res = await client.deployPostgres({
      name,
      namespace,
      instances: Number(body.instances),
      storage: String(body.storage),
      storageClass: body.storageClass ? String(body.storageClass) : undefined,
      enablePooler: body.enablePooler !== undefined ? Boolean(body.enablePooler) : true,
      poolerName: body.poolerName ? String(body.poolerName) : undefined,
      poolerInstances: body.poolerInstances !== undefined ? Number(body.poolerInstances) : undefined,
      appUsername: String(body.appUsername),
      appPassword: String(body.appPassword),
      superuserPassword: String(body.superuserPassword),
      operatorNamespace: body.operatorNamespace ? String(body.operatorNamespace) : 'cnpg-system',
    });

    return NextResponse.json({ ok: true, result: res });
  } catch (error: any) {
    console.error('[deploy-db] error:', error);
    return NextResponse.json({ error: String(error?.message || error) }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { Client, SetupClient } from '@interweb/client'
import { InterwebClient as InterwebKubernetesClient } from '@interweb/interwebjs'

// Initialize client with dashboard context
function createClient() {
  const restEndpoint = process.env.KUBERNETES_PROXY_URL || 'http://127.0.0.1:8001'
  return new Client({
    restEndpoint,
  })
}

// GET - Check template status
export async function GET(request: NextRequest, { params }: { params: Promise<{ template: string }> }) {
  try {
    const { template } = await params
    const url = new URL(request.url)
    const namespace = url.searchParams.get('namespace') || 'default'
    const name = url.searchParams.get('name') || template

    const client = createClient()
    
    const isDeployed = await client.isTemplateDeployed(template, name, namespace)
    const status = await client.getTemplateStatus(template, name, namespace)
    
    return NextResponse.json({
      templateId: template,
      name,
      namespace,
      isDeployed,
      status,
    })
  } catch (error) {
    console.error('Failed to get template status:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get template status', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}

// POST - Deploy template
export async function POST(request: NextRequest, { params }: { params: Promise<{ template: string }> }) {
  try {
    const { template } = await params
    const body = await request.json()
    
    const {
      name = template,
      namespace = 'default',
      config = {},
    } = body

    // Ensure CloudNativePG operator is installed and ready before deploying Postgres
    if (template === 'postgres') {
      const restEndpoint = process.env.KUBERNETES_PROXY_URL || 'http://127.0.0.1:8001'
      const kube = new InterwebKubernetesClient({ restEndpoint } as any)
      const setupClient = new SetupClient(kube, namespace)

      const connected = await setupClient.checkConnection()
      if (!connected) {
        return NextResponse.json(
          { error: 'Failed to deploy template', message: 'Unable to connect to Kubernetes cluster' },
          { status: 500 }
        )
      }

      try {
        const installs = await setupClient.getOperatorInstallations('cloudnative-pg')
        const cnpgInstalled = installs.some(i => i.status === 'installed')
        if (!cnpgInstalled) {
          await setupClient.installOperatorByName('cloudnative-pg')
          await setupClient.waitForOperator('cloudnative-pg', 180_000, 5_000)
        }
      } catch (opErr) {
        console.error('Failed to ensure CNPG operator:', opErr)
        return NextResponse.json(
          { error: 'Failed to deploy template', message: opErr instanceof Error ? opErr.message : 'Unable to install CloudNativePG operator' },
          { status: 500 }
        )
      }
    }

    const client = createClient()

    const result = await client.deployTemplate(template, {
      name,
      namespace,
      config,
    })
    
    if (result.status === 'deployed') {
      return NextResponse.json({
        success: true,
        message: `Template ${template} deployed successfully`,
        result,
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Template deployment failed', 
          message: result.message || 'Unknown error',
          result,
        }, 
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Failed to deploy template:', error)
    return NextResponse.json(
      { 
        error: 'Failed to deploy template', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}

// DELETE - Uninstall template
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ template: string }> }) {
  try {
    const { template } = await params
    const url = new URL(request.url)

    // Prefer values from JSON body if provided; fallback to query params
    let body: any = undefined
    try {
      body = await request.json()
    } catch {}

    const namespace = (body?.namespace as string) || url.searchParams.get('namespace') || 'default'
    const name = (body?.name as string) || url.searchParams.get('name') || template
    const force = Boolean(body?.force) || url.searchParams.get('force') === 'true'

    const client = createClient()
    
    const result = await client.uninstallTemplate(template, {
      name,
      namespace,
      force,
    })
    
    if (result.status === 'uninstalled') {
      return NextResponse.json({
        success: true,
        message: `Template ${template} uninstalled successfully`,
        result,
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Template uninstall failed', 
          message: result.message || 'Unknown error',
          result,
        }, 
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Failed to uninstall template:', error)
    return NextResponse.json(
      { 
        error: 'Failed to uninstall template', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server';

// Detect if running in Docker by checking for Docker-specific environment
const isDocker = process.env.KUBERNETES_SERVICE_HOST || 
                 process.env.HOSTNAME?.includes('docker') || 
                 process.env.container === 'docker';

// Use appropriate proxy URL based on environment
const KUBECTL_PROXY_URL = process.env.KUBERNETES_PROXY_URL || 
                         (isDocker ? 'http://host.docker.internal:8001' : 'http://127.0.0.1:8001');

console.log('Using kubectl proxy URL:', KUBECTL_PROXY_URL);

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const queryString = url.search;
    
    const proxyUrl = `${KUBECTL_PROXY_URL}/${path}${queryString}`;
    
    console.log('Proxying GET request to:', proxyUrl);
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const queryString = url.search;
    const body = await request.json();
    
    const proxyUrl = `${KUBECTL_PROXY_URL}/${path}${queryString}`;
    
    console.log('Proxying POST request to:', proxyUrl);
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const queryString = url.search;
    
    const proxyUrl = `${KUBECTL_PROXY_URL}/${path}${queryString}`;
    
    console.log('Proxying DELETE request to:', proxyUrl);
    
    const response = await fetch(proxyUrl, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const queryString = url.search;
    const body = await request.json();
    
    const proxyUrl = `${KUBECTL_PROXY_URL}/${path}${queryString}`;
    
    console.log('Proxying PUT request to:', proxyUrl);
    
    const response = await fetch(proxyUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const queryString = url.search;
    const body = await request.json();
    
    const proxyUrl = `${KUBECTL_PROXY_URL}/${path}${queryString}`;
    
    console.log('Proxying PATCH request to:', proxyUrl);
    
    const response = await fetch(proxyUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/strategic-merge-patch+json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
// Mock Next.js server components for testing
export const NextRequest = class MockNextRequest {
  constructor(url: string, init?: RequestInit) {
    this.url = url;
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers);
    this.body = init?.body;
  }

  url: string;
  method: string;
  headers: Headers;
  body: any;

  async json() {
    if (typeof this.body === 'string') {
      try {
        return JSON.parse(this.body);
      } catch {
        return {};
      }
    }
    return this.body || {};
  }
};

export const NextResponse = {
  json: (data: any, init?: ResponseInit) => {
    return new Response(JSON.stringify(data), {
      status: init?.status || 200,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  },
};

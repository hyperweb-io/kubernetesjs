import { http, HttpResponse, RequestHandler } from 'msw';

// Base URL for API
const API_BASE = 'http://127.0.0.1:8001';

// 基础 handlers - 总是包含的
export const baseHandlers: RequestHandler[] = [
  // Simple test endpoint
  http.get(`${API_BASE}/api/test`, () => {
    return HttpResponse.json({ message: 'Hello from MSW!' });
  }),

  // Health check endpoint
  http.get(`${API_BASE}/health`, () => {
    return HttpResponse.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    });
  }),

  // Error simulation endpoint
  http.get(`${API_BASE}/api/error`, () => {
    return HttpResponse.json(
      { error: 'Test error' },
      { status: 500 }
    );
  }),

  // POST test endpoint
  http.post(`${API_BASE}/api/test`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ 
      message: 'POST request received', 
      receivedData: body 
    });
  }),
];




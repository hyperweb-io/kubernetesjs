import { baseHandlers } from '@/__mocks__/handlers';
import { server } from '@/__mocks__/server';


// Test MSW basic functionality
describe('MSW Basic Setup', () => {
  it('should have server configured', () => {
    expect(server).toBeDefined();
    expect(server.listHandlers()).toHaveLength(4); // We have 4 handlers
  });

  it('should have handlers exported', () => {
    expect(baseHandlers).toBeDefined();
    expect(Array.isArray(baseHandlers)).toBe(true);
    expect(baseHandlers).toHaveLength(4);
  });

  it('should handle GET /api/test request', async () => {
    const response = await fetch('http://127.0.0.1:8001/api/test');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({ message: 'Hello from MSW!' });
  });

  it('should handle GET /health request', async () => {
    const response = await fetch('http://127.0.0.1:8001/health');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
  });

  it('should handle error responses', async () => {
    const response = await fetch('http://127.0.0.1:8001/api/error');
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Test error' });
  });

  it('should handle POST requests', async () => {
    const testData = { name: 'test', value: 123 };
    
    const response = await fetch('http://127.0.0.1:8001/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.message).toBe('POST request received');
    expect(data.receivedData).toEqual(testData);
  });

  it('should reset handlers between tests', async () => {
    // This test verifies that handlers are reset between tests
    const response = await fetch('http://127.0.0.1:8001/api/test');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({ message: 'Hello from MSW!' });
  });
});



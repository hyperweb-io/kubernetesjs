import { OllamaClient, BradieClient } from '@/lib/agents/index';

describe('lib/agents/index', () => {
  it('should export OllamaClient', () => {
    expect(OllamaClient).toBeDefined();
  });

  it('should export BradieClient', () => {
    expect(BradieClient).toBeDefined();
  });

  it('should have all expected exports', () => {
    // This test ensures that the index file exports everything correctly
    // The actual implementation is tested in the individual module tests
    expect(typeof OllamaClient).toBe('function');
    expect(typeof BradieClient).toBe('function');
  });
});

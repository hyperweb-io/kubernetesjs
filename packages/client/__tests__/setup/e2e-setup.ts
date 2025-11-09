// Global setup for e2e tests
import { TestCleanupRegistry } from '../utils/test-utils';

// Global cleanup registry
export const globalCleanup = new TestCleanupRegistry();

// Global teardown after each test
afterEach(async () => {
  await globalCleanup.cleanup();
});

// Increase timeout for all e2e tests
jest.setTimeout(10 * 60 * 1000); // 10 minutes

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.warn('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
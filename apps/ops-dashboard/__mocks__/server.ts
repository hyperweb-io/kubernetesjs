import { setupServer } from 'msw/node'
import { baseHandlers } from './handlers'

// Export handlers for individual use
// Create a test server for Node.js environment with all handlers
export const server = setupServer(...baseHandlers)



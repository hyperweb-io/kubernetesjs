import { setupWorker } from 'msw/browser'
import { baseHandlers } from './handlers'

// Create a test worker for browser environment
export const worker = setupWorker(...baseHandlers)

// Export handlers for individual use
export { baseHandlers as handlers }



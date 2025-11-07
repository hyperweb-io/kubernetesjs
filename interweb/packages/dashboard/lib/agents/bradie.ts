// Bradie agent client implementation
import fetch from 'cross-fetch'
import { v4 as uuidv4 } from 'uuid'

export interface BradieSession {
  id: string
  name: string
  path: string
  createdAt: Date
}

export interface BradieActRequest {
  session_id: string
  user_input: string
}

export interface BradieActResponse {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  response?: string
  error?: string
}

export class BradieClient {
  private baseUrl: string
  
  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
  }

  // Check if Bradie backend is reachable
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      return response.ok
    } catch (error) {
      console.error('Bradie health check failed:', error)
      return false
    }
  }

  // Create a new session
  async createSession(name: string, path: string): Promise<BradieSession> {
    const session: BradieSession = {
      id: uuidv4(),
      name,
      path,
      createdAt: new Date()
    }
    return session
  }

  // Send a message to Bradie and get initial response
  async sendMessage(sessionId: string, message: string): Promise<BradieActResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/act`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_input: message
        } as BradieActRequest)
      })

      if (!response.ok) {
        throw new Error(`Bradie request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error sending message to Bradie:', error)
      throw error
    }
  }

  // Poll for response status
  async pollResponse(responseId: string): Promise<BradieActResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/act/${responseId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Failed to poll response: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error polling Bradie response:', error)
      throw error
    }
  }

  // Send message and poll until complete
  async sendMessageAndWait(sessionId: string, message: string, onUpdate?: (response: BradieActResponse) => void): Promise<string> {
    // Send initial message
    const initialResponse = await this.sendMessage(sessionId, message)
    
    if (onUpdate) {
      onUpdate(initialResponse)
    }

    // Poll until complete
    let currentResponse = initialResponse
    while (currentResponse.status === 'pending' || currentResponse.status === 'running') {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second between polls
      currentResponse = await this.pollResponse(currentResponse.id)
      
      if (onUpdate) {
        onUpdate(currentResponse)
      }
    }

    if (currentResponse.status === 'failed') {
      throw new Error(currentResponse.error || 'Bradie request failed')
    }

    return currentResponse.response || ''
  }

  // Generate streaming response (simulated via polling)
  async generateStreamingResponse(
    sessionId: string,
    message: string,
    onChunk: (chunk: string) => void,
    onStatusUpdate?: (status: string) => void
  ): Promise<void> {
    let lastResponse = ''
    
    await this.sendMessageAndWait(sessionId, message, (response) => {
      if (onStatusUpdate) {
        onStatusUpdate(response.status)
      }
      
      if (response.response && response.response !== lastResponse) {
        // Send only the new part
        const newContent = response.response.substring(lastResponse.length)
        if (newContent) {
          onChunk(newContent)
          lastResponse = response.response
        }
      }
    })
  }
}

export default BradieClient

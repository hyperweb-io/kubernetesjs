// Agent utilities for localStorage management and agent switching

export type AgentType = 'bradie' | 'ollama'

const AGENT_KEY = 'ai-chat-selected-agent'
const BRADIE_DOMAIN_KEY = 'ai-chat-bradie-domain'
const AGENT_CONFIG_KEY = 'ai-chat-agent-config'

export function getCurrentAgent(): AgentType {
  if (typeof window === 'undefined') return 'ollama'
  return (localStorage.getItem(AGENT_KEY) as AgentType) || 'ollama'
}

export function setAgent(agent: AgentType): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(AGENT_KEY, agent)
}

export function getBradieDomain(): string {
  if (typeof window === 'undefined') return 'http://localhost:3001'
  return localStorage.getItem(BRADIE_DOMAIN_KEY) || 'http://localhost:3001'
}

export function setBradieDomain(domain: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(BRADIE_DOMAIN_KEY, domain)
}

export function getAgentConfig(): any {
  if (typeof window === 'undefined') return null
  const config = localStorage.getItem(AGENT_CONFIG_KEY)
  if (!config) return null
  
  try {
    const parsed = JSON.parse(config)
    // Reconstruct dates
    if (parsed.session?.createdAt) {
      parsed.session.createdAt = new Date(parsed.session.createdAt)
    }
    return parsed
  } catch {
    return null
  }
}

export function setAgentConfig(config: any): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(AGENT_CONFIG_KEY, JSON.stringify(config))
}

export function clearAgentConfig(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AGENT_CONFIG_KEY)
  localStorage.removeItem(AGENT_KEY)
  localStorage.removeItem(BRADIE_DOMAIN_KEY)
}
'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AgentManager, AgentConfig } from './agent-manager'
import OllamaClient from '@/lib/agent/ollama'
import {
  MoreVertical,
  Send,
  User,
  Bot,
  Copy,
  Check,
  ChevronRight,
  MessageSquare,
  Trash2,
  Plus,
  Pin,
  PinOff,
  Loader2,
  AlertCircle,
  Settings2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface AIChatProps {
  isOpen: boolean
  onToggle: () => void
  width: number
  onWidthChange: (width: number) => void
  layoutMode: 'floating' | 'snapped'
  onLayoutModeChange: (mode: 'floating' | 'snapped') => void
}

export function AIChat({ isOpen, onToggle, width, onWidthChange, layoutMode, onLayoutModeChange }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [showTimestamps, setShowTimestamps] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [showAgentManager, setShowAgentManager] = useState(false)
  const [agentConfig, setAgentConfig] = useState<AgentConfig>(() => {
    // Load saved agent config from localStorage
    if (typeof window !== 'undefined') {
      const savedConfig = localStorage.getItem('ai-chat-agent-config')
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig)
          // Reconstruct session dates
          if (parsed.session) {
            parsed.session.createdAt = new Date(parsed.session.createdAt)
          }
          return parsed
        } catch (err) {
          console.error('Failed to parse saved agent config:', err)
        }
      }
    }
    return {
      endpoint: 'http://localhost:11434',
      model: 'llama2',
      session: null
    }
  })

  const resizeRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const ollamaClientRef = useRef<OllamaClient>()

  // Initialize Ollama client when config changes
  useEffect(() => {
    ollamaClientRef.current = new OllamaClient(agentConfig.endpoint)
  }, [agentConfig.endpoint])

  // Auto scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = window.innerWidth - e.clientX
      if (newWidth >= 300 && newWidth <= 800) {
        onWidthChange(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, onWidthChange])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setError(null)
    setIsLoading(true)

    try {
      if (!ollamaClientRef.current) {
        throw new Error('Ollama client not initialized')
      }

      if (!agentConfig.model) {
        throw new Error('No model selected. Please configure an agent model.')
      }

      // Generate response using Ollama
      const response = await ollamaClientRef.current.generate({
        model: agentConfig.model,
        prompt: userMessage.content
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Failed to generate response:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate response')
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `Error: ${err instanceof Error ? err.message : 'Failed to generate response'}\n\nPlease check that Ollama is running and the model '${agentConfig.model}' is installed.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  const newChat = () => {
    setMessages([])
    setError(null)
  }

  return (
    <div 
      className={`${layoutMode === 'floating' ? 'fixed' : 'relative'} top-0 right-0 h-full bg-card border-l transition-all duration-300 flex ${isOpen ? '' : 'translate-x-full'}`}
      style={{ width: isOpen ? width : 0 }}
    >
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className="absolute left-0 top-0 bottom-0 w-1 hover:bg-primary cursor-col-resize transition-colors"
        onMouseDown={() => setIsResizing(true)}
      />

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -left-8 top-1/2 -translate-y-1/2 bg-card border border-r-0 rounded-l p-1 hover:bg-accent transition-colors"
      >
        <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Chat Container */}
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <h2 className="font-semibold">AI Assistant</h2>
            {agentConfig.model && (
              <span className="text-xs text-muted-foreground">({agentConfig.model})</span>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowAgentManager(true)}>
                <Settings2 className="w-4 h-4 mr-2" />
                Manage Agent
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => onLayoutModeChange(layoutMode === 'floating' ? 'snapped' : 'floating')}
              >
                {layoutMode === 'floating' ? (
                  <>
                    <Pin className="w-4 h-4 mr-2" />
                    Snap to Layout
                  </>
                ) : (
                  <>
                    <PinOff className="w-4 h-4 mr-2" />
                    Float Above
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={clearChat}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Chat
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setShowTimestamps(!showTimestamps)}>
                {showTimestamps ? 'Hide' : 'Show'} Timestamps
              </DropdownMenuItem>

              <DropdownMenuItem onClick={newChat}>
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {agentConfig.model ? (
                <>
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start a conversation with {agentConfig.model}</p>
                  <p className="text-sm mt-2">Type a message below to begin</p>
                </>
              ) : (
                <>
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No model configured</p>
                  <p className="text-sm mt-2">Click "Manage Agent" to set up a model</p>
                </>
              )}
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 
                    message.role === 'system' ? 'bg-yellow-500 text-white' : 'bg-muted'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : 
                     message.role === 'system' ? <AlertCircle className="w-4 h-4" /> : 
                     <Bot className="w-4 h-4" />}
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <div className={`rounded-lg px-3 py-2 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : message.role === 'system'
                      ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                      : 'bg-muted'
                  }`}>
                    {message.role === 'assistant' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            const code = String(children).replace(/\n$/, '')
                            
                            return !inline && match ? (
                              <div className="relative">
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{
                                    margin: 0,
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {code}
                                </SyntaxHighlighter>
                                <button
                                  onClick={() => copyToClipboard(code)}
                                  className="absolute top-2 right-2 p-1 rounded hover:bg-gray-700 transition-colors"
                                >
                                  {copiedCode === code ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            )
                          },
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  {showTimestamps && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generating response...</span>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          {error && (
            <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <div className="flex space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={agentConfig.model ? "Type your message... (Enter to send, Shift+Enter for new line)" : "Please configure a model first"}
              className="flex-1 min-h-[60px] max-h-[120px] resize-none"
              disabled={isLoading || !agentConfig.model}
            />
            <Button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading || !agentConfig.model}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Agent Manager Dialog */}
      <AgentManager
        isOpen={showAgentManager}
        onClose={() => setShowAgentManager(false)}
        currentConfig={agentConfig}
        onConfigChange={(config) => {
          setAgentConfig(config)
          localStorage.setItem('ai-chat-agent-config', JSON.stringify(config))
        }}
      />
    </div>
  )
}
'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AgentManagerAgentic } from './agent-manager-agentic'
import {
  AgentKit,
  OllamaAdapter,
  BradieAdapter,
  createMultiProviderKit
} from 'agentic-kit'

export type AgentProvider = 'ollama' | 'bradie'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  provider?: AgentProvider
}
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
  Settings2,
  Brain,
  Sparkles
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface AIChatAgenticProps {
  isOpen: boolean
  onToggle: () => void
  width: number
  onWidthChange: (width: number) => void
  layoutMode: 'floating' | 'snapped'
  onLayoutModeChange: (mode: 'floating' | 'snapped') => void
}

export function AIChatAgentic({ 
  isOpen, 
  onToggle, 
  width, 
  onWidthChange, 
  layoutMode, 
  onLayoutModeChange 
}: AIChatAgenticProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [showTimestamps, setShowTimestamps] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAgentManager, setShowAgentManager] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  
  // Agent state
  const [currentProvider, setCurrentProvider] = useState<AgentProvider>('ollama')
  const [agentKit] = useState(() => {
    const kit = createMultiProviderKit()
    kit.addProvider(new OllamaAdapter('http://localhost:11434'))
    kit.addProvider(new BradieAdapter({
      domain: 'http://localhost:3001',
      onSystemMessage: () => {},
      onAssistantReply: () => {}
    }))
    kit.setProvider('ollama')
    return kit
  })

  const resizeRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingMessage])

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('agentic-chat-messages')
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed.map((m: any) => ({ 
          ...m, 
          timestamp: new Date(m.timestamp) 
        })))
      } catch (err) {
        console.error('Failed to load chat history:', err)
      }
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('agentic-chat-messages', JSON.stringify(messages))
    }
  }, [messages])

  // Handle provider change
  const handleProviderChange = (provider: AgentProvider) => {
    setCurrentProvider(provider)
    agentKit.setProvider(provider)
  }

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      provider: currentProvider
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)
    setStreamingMessage('')

    try {
      // Reset streaming state
      setStreamingMessage('')
      
      // Handle streaming
      const onChunk = (chunk: string) => {
        setStreamingMessage(prev => prev + chunk)
      }

      const onComplete = () => {
        console.log('onComplete called') // Debug log
        // Use the current streamingMessage state to create the final message
        setStreamingMessage(currentStreaming => {
          console.log('Final streaming content:', currentStreaming) // Debug log
          if (currentStreaming.trim()) {
            const assistantMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: currentStreaming,
              timestamp: new Date(),
              provider: currentProvider
            }
            setMessages(prev => [...prev, assistantMessage])
          }
          return '' // Clear streaming message
        })
      }

      const onError = (err: Error) => {
        console.error('Error generating response:', err)
        setError(err.message)
        setStreamingMessage('')
      }

      // Generate response
      await agentKit.generate(
        {
          model: 'mistral',
          prompt: userMessage.content,
          stream: true
        },
        { 
          onChunk, 
          onComplete, 
          onError
        }
      )

    } catch (err) {
      console.error('Error generating response:', err)
      setError('An error occurred. Please try again.')
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(text)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const clearHistory = () => {
    setMessages([])
    localStorage.removeItem('agentic-chat-messages')
  }

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = window.innerWidth - e.clientX
      onWidthChange(Math.max(300, Math.min(800, newWidth)))
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

  if (!isOpen) return null

  const containerStyle = layoutMode === 'floating' 
    ? 'fixed right-4 top-4 bottom-4 shadow-2xl rounded-lg border' 
    : 'fixed right-0 top-0 bottom-0 border-l'

  return (
    <>
      <div 
        className={`${containerStyle} bg-background z-50 flex flex-col`}
        style={{ width: `${width}px` }}
      >
        {/* Resize handle */}
        <div
          ref={resizeRef}
          className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/20 transition-colors"
          onMouseDown={() => setIsResizing(true)}
        />
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              {currentProvider === 'ollama' ? (
                <Brain className="w-4 h-4 text-blue-500" />
              ) : (
                <Sparkles className="w-4 h-4 text-purple-500" />
              )}
              <span className="text-sm font-medium capitalize">{currentProvider}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAgentManager(true)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleProviderChange(currentProvider === 'ollama' ? 'bradie' : 'ollama')}>
                  Switch to {currentProvider === 'ollama' ? 'Bradie' : 'Ollama'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowTimestamps(!showTimestamps)}>
                  {showTimestamps ? 'Hide' : 'Show'} Timestamps
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLayoutModeChange(layoutMode === 'floating' ? 'snapped' : 'floating')}>
                  {layoutMode === 'floating' ? <Pin className="w-4 h-4 mr-2" /> : <PinOff className="w-4 h-4 mr-2" />}
                  {layoutMode === 'floating' ? 'Snap to Side' : 'Float'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearHistory} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !streamingMessage && (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation with {currentProvider === 'ollama' ? 'Ollama' : 'Bradie'}</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                <div className={`rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {message.role === 'assistant' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <div className="relative my-2">
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8"
                                onClick={() => copyToClipboard(String(children))}
                              >
                                {copiedCode === String(children) ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        }
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
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 order-2">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {/* Streaming message */}
          {streamingMessage && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {streamingMessage}
                </ReactMarkdown>
              </div>
            </div>
          )}
          
          {isLoading && !streamingMessage && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-lg p-3">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${currentProvider}...`}
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Agent Manager Modal */}
      {showAgentManager && (
        <AgentManagerAgentic
          isOpen={showAgentManager}
          onClose={() => setShowAgentManager(false)}
          agentKit={agentKit}
          currentProvider={currentProvider}
          onProviderChange={handleProviderChange}
        />
      )}
    </>
  )
}
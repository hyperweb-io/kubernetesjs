'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
  PinOff
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Message {
  id: string
  role: 'user' | 'assistant'
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI coding assistant. I can help you with:\n\n- Code explanations\n- Debugging assistance\n- Best practices\n- Code generation\n\nFeel free to ask me anything about your code!",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [showTimestamps, setShowTimestamps] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

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

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages([...messages, newMessage])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm a UI mock-up and don't have AI capabilities yet. However, I can render **markdown** content!\n\n```javascript\n// Example code block\nfunction hello() {\n  console.log('Hello, World!');\n}\n```\n\nI support:\n- **Bold** and *italic* text\n- Lists\n- Code blocks with syntax highlighting\n- And more!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
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
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Chat cleared. How can I help you?",
      timestamp: new Date()
    }])
  }

  const newChat = () => {
    clearChat()
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
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
              <DropdownMenuItem onClick={() => setShowTimestamps(!showTimestamps)}>
                {showTimestamps ? 'Hide' : 'Show'} Timestamps
              </DropdownMenuItem>
              <DropdownMenuItem onClick={newChat}>
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={clearChat}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <div className={`rounded-lg px-3 py-2 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
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
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              className="flex-1 min-h-[60px] max-h-[120px] resize-none"
            />
            <Button 
              onClick={handleSend}
              disabled={!input.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
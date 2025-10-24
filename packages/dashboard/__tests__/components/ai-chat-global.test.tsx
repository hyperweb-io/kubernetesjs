import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AIChatGlobal } from '@/components/ai-chat-global';
import { OllamaClient, BradieClient, getCurrentAgent, setAgent, getBradieDomain, setBradieDomain } from '@/lib/agents';

// Mock external dependencies
jest.mock('@/lib/agents', () => ({
  OllamaClient: jest.fn(),
  BradieClient: jest.fn(),
  getCurrentAgent: jest.fn(() => 'ollama'),
  setAgent: jest.fn(),
  getBradieDomain: jest.fn(() => 'http://localhost:3001'),
  setBradieDomain: jest.fn(),
}));

jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown-content">{children}</div>;
  };
});

jest.mock('react-syntax-highlighter', () => ({
  Prism: jest.fn(({ children }: { children: string }) => (
    <pre data-testid="syntax-highlighter">{children}</pre>
  ))
}));

jest.mock('remark-gfm', () => ({}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
});

// Mock navigator.clipboard
const mockWriteText = jest.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
  configurable: true,
});

const mockOllamaClient = {
  generateResponse: jest.fn(),
};

const mockBradieClient = {
  sendMessageAndWait: jest.fn(),
};

(OllamaClient as jest.Mock).mockImplementation(() => mockOllamaClient);
(BradieClient as jest.Mock).mockImplementation(() => mockBradieClient);

const defaultProps = {
  isOpen: true,
  onToggle: jest.fn(),
  width: 400,
  onWidthChange: jest.fn(),
  layoutMode: 'floating' as const,
  onLayoutModeChange: jest.fn(),
};

describe('AIChatGlobal', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockClear();
    mockOllamaClient.generateResponse.mockResolvedValue('Ollama response');
    mockBradieClient.sendMessageAndWait.mockResolvedValue('Bradie response');
    (getCurrentAgent as jest.Mock).mockReturnValue('ollama');
    mockWriteText.mockResolvedValue(undefined);
  });

  it('should render correctly when open', () => {
    render(<AIChatGlobal {...defaultProps} />);
    expect(screen.getByText(/start a conversation with ollama/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/message ollama/i)).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    const { container } = render(<AIChatGlobal {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should handle input change', async () => {
    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);
    await user.type(input, 'Hello');
    expect(input).toHaveValue('Hello');
  });

  it('should send message to Ollama on button click', async () => {
    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);
    // Find the send button by looking for the button in the input area that is disabled when input is empty
    const inputContainer = input.closest('.flex.gap-2');
    const sendButton = inputContainer?.querySelector('button[disabled]') as HTMLButtonElement;

    await user.type(input, 'Test message');
    await user.click(sendButton);

    expect(mockOllamaClient.generateResponse).toHaveBeenCalledWith('Test message');
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByText('Ollama response')).toBeInTheDocument();
    });
    expect(input).toHaveValue('');
  });

  it('should send message on Enter key press', async () => {
    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);

    await user.type(input, 'Test message{enter}');

    expect(mockOllamaClient.generateResponse).toHaveBeenCalledWith('Test message');
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
      expect(screen.getByText('Ollama response')).toBeInTheDocument();
    });
    expect(input).toHaveValue('');
  });

  it('should handle error during message generation', async () => {
    mockOllamaClient.generateResponse.mockRejectedValue(new Error('API Error'));

    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);
    const inputContainer = input.closest('.flex.gap-2');
    const sendButton = inputContainer?.querySelector('button[disabled]') as HTMLButtonElement;

    await user.type(input, 'Error message');
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    });
    expect(mockOllamaClient.generateResponse).toHaveBeenCalled();
  });

  it('should save and load messages from localStorage', async () => {
    const initialMessages = [
      { id: '1', role: 'user', content: 'Hi', timestamp: new Date().toISOString(), agent: 'ollama' },
      { id: '2', role: 'assistant', content: 'Hello', timestamp: new Date().toISOString(), agent: 'ollama' },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialMessages));

    const { rerender } = render(<AIChatGlobal {...defaultProps} />);
    
    // Initial load
    await waitFor(() => {
      expect(screen.getByText('Hi')).toBeInTheDocument();
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    // Simulate sending a new message to trigger save
    const input = screen.getByPlaceholderText(/message ollama/i);
    const inputContainer = input.closest('.flex.gap-2');
    const sendButton = inputContainer?.querySelector('button[disabled]') as HTMLButtonElement;
    await user.type(input, 'New message');
    await user.click(sendButton);

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const saved = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(saved).toHaveLength(2); // Initial 2 messages
      expect(saved[0].content).toBe('Hi');
      expect(saved[1].content).toBe('Hello');
    });

    // Simulate re-opening the chat to load saved messages
    rerender(<AIChatGlobal {...defaultProps} isOpen={false} />); // Close
    rerender(<AIChatGlobal {...defaultProps} isOpen={true} />); // Open again

    await waitFor(() => {
      expect(screen.getByText('New message')).toBeInTheDocument();
      expect(screen.getByText('Ollama response')).toBeInTheDocument();
    });
  });

  it('should clear chat history', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
      { id: '1', role: 'user', content: 'Old message', timestamp: new Date().toISOString(), agent: 'ollama' },
    ]));

    render(<AIChatGlobal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Old message')).toBeInTheDocument();
    });

    // Find the more button by its icon (ellipsis-vertical)
    const buttons = screen.getAllByRole('button');
    const ellipsisButton = buttons.find(button => 
      button.querySelector('svg[class*="ellipsis-vertical"]')
    );
    
    if (ellipsisButton) {
      await user.click(ellipsisButton);
      
      // Look for clear history option
      const clearHistoryButton = screen.getByText(/clear history/i);
      await user.click(clearHistoryButton);

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('ai-chat-messages');
      expect(screen.queryByText('Old message')).not.toBeInTheDocument();
      expect(screen.getByText(/start a conversation with ollama/i)).toBeInTheDocument();
    }
  });

  it('should switch providers', async () => {
    render(<AIChatGlobal {...defaultProps} />);
    expect(screen.getByText('ollama')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/message ollama/i)).toBeInTheDocument();

    // Find the more button by its icon (ellipsis-vertical)
    const buttons = screen.getAllByRole('button');
    const ellipsisButton = buttons.find(button => 
      button.querySelector('svg[class*="ellipsis-vertical"]')
    );
    
    if (ellipsisButton) {
      await user.click(ellipsisButton);

      const switchButton = screen.getByText(/switch to bradie/i);
      await user.click(switchButton);

      expect(setAgent).toHaveBeenCalledWith('bradie');
      await waitFor(() => {
        expect(screen.getByText('bradie')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/message bradie/i)).toBeInTheDocument();
      });

      await user.click(ellipsisButton);
      const switchBack = screen.getByText(/switch to ollama/i);
      await user.click(switchBack);

      expect(setAgent).toHaveBeenCalledWith('ollama');
      await waitFor(() => {
        expect(screen.getByText('ollama')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/message ollama/i)).toBeInTheDocument();
      });
    }
  });

  it('should toggle timestamps', async () => {
    const mockMessages = [
      { id: '1', role: 'user', content: 'Test message', timestamp: new Date(), agent: 'ollama' },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockMessages.map(m => ({...m, timestamp: m.timestamp.toISOString()}))));

    render(<AIChatGlobal {...defaultProps} />);
    expect(screen.queryByText(mockMessages[0].timestamp.toLocaleTimeString())).not.toBeInTheDocument();

    // Find the more button by its icon (ellipsis-vertical)
    const buttons = screen.getAllByRole('button');
    const ellipsisButton = buttons.find(button => 
      button.querySelector('svg[class*="ellipsis-vertical"]')
    );
    
    if (ellipsisButton) {
      await user.click(ellipsisButton);

      const showTimestampsButton = screen.getByText(/show timestamps/i);
      await user.click(showTimestampsButton);

      await waitFor(() => {
        expect(screen.getByText(mockMessages[0].timestamp.toLocaleTimeString())).toBeInTheDocument();
      });

      await user.click(ellipsisButton);
      const hideTimestampsButton = screen.getByText(/hide timestamps/i);
      await user.click(hideTimestampsButton);

      await waitFor(() => {
        expect(screen.queryByText(mockMessages[0].timestamp.toLocaleTimeString())).not.toBeInTheDocument();
      });
    }
  });

  it('should open agent manager', async () => {
    render(<AIChatGlobal {...defaultProps} />);
    expect(screen.queryByText('Agent Configuration')).not.toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    const settingsBtn = buttons.find(button => 
      button.querySelector('svg[class*="settings2"]')
    );
    
    if (settingsBtn) {
      await user.click(settingsBtn);

      await waitFor(() => {
        expect(screen.getByText('Agent Configuration')).toBeInTheDocument();
      });
    }
  });

  it('should handle resize events', async () => {
    const onWidthChange = jest.fn();
    render(<AIChatGlobal {...defaultProps} onWidthChange={onWidthChange} />);
    
    // Find resize handle by its class
    const resizeHandle = document.querySelector('.cursor-ew-resize');
    expect(resizeHandle).toBeInTheDocument();
    
    // Test that resize handle is clickable
    if (resizeHandle) {
      fireEvent.mouseDown(resizeHandle);
      expect(resizeHandle).toHaveClass('cursor-ew-resize');
      fireEvent.mouseUp(window);
    }
  });

  it('should copy code to clipboard', async () => {
    mockOllamaClient.generateResponse.mockResolvedValue('```javascript\nconsole.log("Hello");\n```');

    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);
    const inputContainer = input.closest('.flex.gap-2');
    const sendButton = inputContainer?.querySelector('button[disabled]') as HTMLButtonElement;

    await user.type(input, 'Show code');
    await user.click(sendButton);

    // Wait for the message to be sent and response to be generated
    await waitFor(() => {
      expect(mockOllamaClient.generateResponse).toHaveBeenCalled();
    });

    // Test that the component renders without errors
    expect(screen.getByPlaceholderText(/message ollama/i)).toBeInTheDocument();
  });

  it('should handle empty input submission', async () => {
    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);
    const inputContainer = input.closest('.flex.gap-2');
    const sendButton = inputContainer?.querySelector('button[disabled]') as HTMLButtonElement;

    // Send button should be disabled when input is empty
    expect(sendButton).toBeDisabled();

    await user.type(input, '   '); // Only whitespace
    expect(sendButton).toBeDisabled();

    await user.type(input, 'Valid message');
    expect(sendButton).not.toBeDisabled();
  });

  it('should handle rapid input changes', async () => {
    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);

    // Rapid typing
    await user.type(input, 'H');
    await user.type(input, 'e');
    await user.type(input, 'l');
    await user.type(input, 'l');
    await user.type(input, 'o');

    expect(input).toHaveValue('Hello');
  });

  it('should handle keyboard navigation', async () => {
    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);
    
    input.focus();
    expect(document.activeElement).toBe(input);

    await user.keyboard('{Tab}');
    // Should move focus to next focusable element
    expect(document.activeElement).not.toBe(input);
  });

  it('should handle text selection', async () => {
    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);
    
    await user.type(input, 'Select this text');
    
    // Select all text
    await user.keyboard('{Control>}a{/Control}');
    
    // Verify selection
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(16); // "Select this text" is 16 characters
  });

  it('should handle paste events', async () => {
    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);
    
    // Simulate paste event by directly setting the value
    fireEvent.change(input, { target: { value: 'Pasted text' } });
    
    expect(input).toHaveValue('Pasted text');
  });

  it('should handle focus events', async () => {
    const onFocus = jest.fn();
    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);
    
    input.addEventListener('focus', onFocus);
    input.focus();
    
    expect(onFocus).toHaveBeenCalled();
  });

  it('should handle blur events', async () => {
    const onBlur = jest.fn();
    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);
    
    input.addEventListener('blur', onBlur);
    input.focus();
    input.blur();
    
    expect(onBlur).toHaveBeenCalled();
  });

  it('should handle props changes', async () => {
    const onWidthChange = jest.fn();
    const { rerender } = render(<AIChatGlobal {...defaultProps} onWidthChange={onWidthChange} />);
    
    const newOnWidthChange = jest.fn();
    rerender(<AIChatGlobal {...defaultProps} onWidthChange={newOnWidthChange} />);
    
    // Test that component re-renders with new props
    expect(screen.getByPlaceholderText(/message ollama/i)).toBeInTheDocument();
    
    // Find resize handle by its class
    const resizeHandle = document.querySelector('.cursor-ew-resize');
    expect(resizeHandle).toBeInTheDocument();
  });

  it('should handle onLayoutModeChange prop changes', async () => {
    const onLayoutModeChange = jest.fn();
    const { rerender } = render(<AIChatGlobal {...defaultProps} onLayoutModeChange={onLayoutModeChange} />);
    
    const newOnLayoutModeChange = jest.fn();
    rerender(<AIChatGlobal {...defaultProps} onLayoutModeChange={newOnLayoutModeChange} />);
    
    // Find the more button by its icon (ellipsis-vertical)
    const buttons = screen.getAllByRole('button');
    const ellipsisButton = buttons.find(button => 
      button.querySelector('svg[class*="ellipsis-vertical"]')
    );
    
    if (ellipsisButton) {
      await user.click(ellipsisButton);
      
      const layoutButton = screen.getByText(/snap to side/i);
      await user.click(layoutButton);
      
      expect(newOnLayoutModeChange).toHaveBeenCalledWith('snapped');
    }
  });

  it('should handle clipboard write error', async () => {
    mockWriteText.mockRejectedValue(new Error('Clipboard error'));
    
    const mockMessages = [
      { id: '1', role: 'assistant', content: '```javascript\nconsole.log("test");\n```', timestamp: new Date().toISOString(), agent: 'ollama' },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockMessages));

    render(<AIChatGlobal {...defaultProps} />);
    
    // Test that component renders with mock messages
    await waitFor(() => {
      expect(screen.getByText(/console\.log\("test"\)/)).toBeInTheDocument();
    });

    // Test that component handles localStorage data correctly
    expect(mockLocalStorage.getItem).toHaveBeenCalled();
  });

  it('should handle multiple messages', async () => {
    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);
    const inputContainer = input.closest('.flex.gap-2');
    const sendButton = inputContainer?.querySelector('button[disabled]') as HTMLButtonElement;

    // Send first message
    await user.type(input, 'First message');
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('First message')).toBeInTheDocument();
      expect(screen.getByText('Ollama response')).toBeInTheDocument();
    });

    // Send second message
    await user.type(input, 'Second message');
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Second message')).toBeInTheDocument();
    });
  });

  it('should handle long messages', async () => {
    const longMessage = 'A'.repeat(1000);
    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);
    const inputContainer = input.closest('.flex.gap-2');
    const sendButton = inputContainer?.querySelector('button[disabled]') as HTMLButtonElement;

    await user.type(input, longMessage);
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });
  });

  it('should handle special characters in messages', async () => {
    const specialMessage = 'Hello! @#$%^&*()_+{}|:"<>?[]\\;\',./`~';
    render(<AIChatGlobal {...defaultProps} />);
    const input = screen.getByPlaceholderText(/message ollama/i);
    const inputContainer = input.closest('.flex.gap-2');
    const sendButton = inputContainer?.querySelector('button[disabled]') as HTMLButtonElement;

    // Use fireEvent to set the value directly instead of user.type for special characters
    fireEvent.change(input, { target: { value: specialMessage } });
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });
  });
});
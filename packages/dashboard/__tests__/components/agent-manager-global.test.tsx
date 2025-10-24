import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentManagerGlobal } from '@/components/agent-manager-global';
import { OllamaClient, BradieClient } from '@/lib/agents';

// Mock the external dependencies
jest.mock('@/lib/agents', () => ({
  OllamaClient: jest.fn(),
  BradieClient: jest.fn(),
}));

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
});

const mockOllamaClient = {
  listModels: jest.fn(),
};

const mockBradieClient = {
  checkHealth: jest.fn(),
  createSession: jest.fn(),
};

(OllamaClient as jest.Mock).mockImplementation(() => mockOllamaClient);
(BradieClient as jest.Mock).mockImplementation(() => mockBradieClient);

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  currentConfig: {
    agent: 'ollama' as const,
    endpoint: 'http://localhost:11434',
    model: 'llama2',
    bradieDomain: 'http://localhost:3001',
    session: null,
  },
  onConfigChange: jest.fn(),
};

describe('AgentManagerGlobal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should render dialog when open', () => {
    render(<AgentManagerGlobal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Agent Configuration')).toBeInTheDocument();
  });

  it('should not render dialog when closed', () => {
    render(<AgentManagerGlobal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render tabs for different agents', () => {
    render(<AgentManagerGlobal {...defaultProps} />);
    expect(screen.getByRole('tab', { name: /ollama/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /bradie/i })).toBeInTheDocument();
  });

  it('should render Ollama tab content by default', () => {
    render(<AgentManagerGlobal {...defaultProps} />);
    expect(screen.getByLabelText(/ollama endpoint/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /test/i })).toBeInTheDocument();
  });

  it('should test Ollama connection successfully', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockResolvedValue(['llama2', 'mistral']);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(mockOllamaClient.listModels).toHaveBeenCalled();
      expect(screen.getByText(/successfully connected to ollama/i)).toBeInTheDocument();
    });
  });

  it('should handle Ollama connection failure', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockRejectedValue(new Error('Connection failed'));
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to connect to ollama/i)).toBeInTheDocument();
    });
  });

  it('should load sessions from localStorage on mount', () => {
    const mockSessions = [
      { id: '1', name: 'Project 1', path: '/path1', createdAt: '2024-01-01T00:00:00Z' },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSessions));
    
    render(<AgentManagerGlobal {...defaultProps} />);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('ai-chat-bradie-sessions');
  });

  it('should handle invalid localStorage data gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json');
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Should not crash
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should handle model selection', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockResolvedValue(['llama2', 'mistral', 'mixtral']);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Test connection to load models
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    });
    
    // Select a model
    const modelSelect = screen.getByRole('combobox');
    await user.click(modelSelect);
    
    const mistralOption = screen.getByText('mistral');
    await user.click(mistralOption);
    
    expect(defaultProps.onConfigChange).toHaveBeenCalledWith({
      ...defaultProps.currentConfig,
      model: 'mistral',
    });
  });

  it('should apply configuration and close dialog', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    const applyButton = screen.getByRole('button', { name: /apply/i });
    await user.click(applyButton);
    
    expect(defaultProps.onConfigChange).toHaveBeenCalledWith({
      agent: 'ollama',
      endpoint: 'http://localhost:11434',
      model: 'llama2',
      bradieDomain: 'http://localhost:3001',
      session: null,
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should cancel and close dialog', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should handle endpoint changes', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    const ollamaEndpointInput = screen.getByLabelText(/ollama endpoint/i);
    await user.clear(ollamaEndpointInput);
    await user.type(ollamaEndpointInput, 'http://new-ollama:11434');
    
    expect(ollamaEndpointInput).toHaveValue('http://new-ollama:11434');
  });

  it('should show loading state during connection test', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    expect(screen.getByRole('button', { name: /test/i })).toBeDisabled();
  });

  it('should display error messages', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockRejectedValue(new Error('Connection failed'));
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to connect to ollama/i)).toBeInTheDocument();
    });
  });

  it('should display success messages', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockResolvedValue(['llama2']);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText(/successfully connected to ollama/i)).toBeInTheDocument();
    });
  });

  it('should handle agent tab switching', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    expect(defaultProps.onConfigChange).toHaveBeenCalledWith({
      ...defaultProps.currentConfig,
      agent: 'bradie',
    });
  });

  it('should test Bradie connection successfully', async () => {
    const user = userEvent.setup();
    mockBradieClient.checkHealth.mockResolvedValue(true);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load by checking for the input field
    await waitFor(() => {
      const input = screen.getByPlaceholderText('http://localhost:3001');
      expect(input).toBeInTheDocument();
    });
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(mockBradieClient.checkHealth).toHaveBeenCalled();
    });
  });

  it('should handle Bradie connection failure', async () => {
    const user = userEvent.setup();
    mockBradieClient.checkHealth.mockResolvedValue(false);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/bradie backend domain/i)).toBeInTheDocument();
    });
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText(/bradie backend is not responding/i)).toBeInTheDocument();
    });
  });

  it('should handle Bradie connection error', async () => {
    const user = userEvent.setup();
    mockBradieClient.checkHealth.mockRejectedValue(new Error('Network error'));
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/bradie backend domain/i)).toBeInTheDocument();
    });
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to connect to bradie backend/i)).toBeInTheDocument();
    });
  });

  it('should handle Bradie domain changes', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/bradie backend domain/i)).toBeInTheDocument();
    });
    
    const bradieDomainInput = screen.getByLabelText(/bradie backend domain/i);
    await user.clear(bradieDomainInput);
    await user.type(bradieDomainInput, 'http://new-bradie:3001');
    
    expect(bradieDomainInput).toHaveValue('http://new-bradie:3001');
  });

  it('should show create session form when new session button is clicked', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    expect(screen.getByText(/create new session/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project path/i)).toBeInTheDocument();
  });

  it('should create a new session successfully', async () => {
    const user = userEvent.setup();
    const mockSession = {
      id: 'new-session-id',
      name: 'Test Project',
      path: '/test/path',
      createdAt: new Date(),
    };
    mockBradieClient.createSession.mockResolvedValue(mockSession);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // Fill form
    const projectNameInput = screen.getByLabelText(/project name/i);
    const projectPathInput = screen.getByLabelText(/project path/i);
    
    await user.type(projectNameInput, 'Test Project');
    await user.type(projectPathInput, '/test/path');
    
    // Submit form
    const createButton = screen.getByRole('button', { name: /create/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(mockBradieClient.createSession).toHaveBeenCalledWith('Test Project', '/test/path');
      expect(screen.getByText(/session created successfully/i)).toBeInTheDocument();
    });
  });

  it('should handle session creation error', async () => {
    const user = userEvent.setup();
    mockBradieClient.createSession.mockRejectedValue(new Error('Creation failed'));
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // Fill form
    const projectNameInput = screen.getByLabelText(/project name/i);
    const projectPathInput = screen.getByLabelText(/project path/i);
    
    await user.type(projectNameInput, 'Test Project');
    await user.type(projectPathInput, '/test/path');
    
    // Submit form
    const createButton = screen.getByRole('button', { name: /create/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to create session/i)).toBeInTheDocument();
    });
  });

  it('should validate session creation form', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // Try to submit empty form
    const createButton = screen.getByRole('button', { name: /create/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please provide both project name and path/i)).toBeInTheDocument();
    });
  });

  it('should cancel session creation', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // Fill form
    const projectNameInput = screen.getByLabelText(/project name/i);
    await user.type(projectNameInput, 'Test Project');
    
    // Cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(screen.queryByText(/create new session/i)).not.toBeInTheDocument();
  });

  it('should display existing sessions', () => {
    const mockSessions = [
      { id: '1', name: 'Project 1', path: '/path1', createdAt: new Date() },
      { id: '2', name: 'Project 2', path: '/path2', createdAt: new Date() },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSessions));
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    fireEvent.click(bradieTab);
    
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
  });

  it('should delete a session', async () => {
    const user = userEvent.setup();
    const mockSessions = [
      { id: '1', name: 'Project 1', path: '/path1', createdAt: new Date() },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSessions));
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });
    
    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(btn => 
      btn.querySelector('svg[class*="lucide-trash"]')
    );
    
    if (deleteButton) {
      await user.click(deleteButton);
    }
    
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should select a session when clicked', async () => {
    const user = userEvent.setup();
    const mockSessions = [
      { id: '1', name: 'Project 1', path: '/path1', createdAt: new Date() },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSessions));
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });
    
    // Click on session
    const sessionCard = screen.getByText('Project 1').closest('div');
    if (sessionCard) {
      await user.click(sessionCard);
    }
    
    expect(defaultProps.onConfigChange).toHaveBeenCalledWith({
      ...defaultProps.currentConfig,
      session: mockSessions[0],
    });
  });

  it('should clear active session when deleted', async () => {
    const user = userEvent.setup();
    const mockSessions = [
      { id: '1', name: 'Project 1', path: '/path1', createdAt: new Date() },
    ];
    const configWithSession = {
      ...defaultProps.currentConfig,
      session: mockSessions[0],
    };
    
    render(<AgentManagerGlobal {...defaultProps} currentConfig={configWithSession} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });
    
    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(btn => 
      btn.querySelector('svg[class*="lucide-trash"]')
    );
    
    if (deleteButton) {
      await user.click(deleteButton);
    }
    
    expect(defaultProps.onConfigChange).toHaveBeenCalledWith({
      ...configWithSession,
      session: null,
    });
  });

  it('should show no sessions message when no sessions exist', () => {
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    fireEvent.click(bradieTab);
    
    expect(screen.getByText(/no sessions yet/i)).toBeInTheDocument();
  });

  it('should handle session creation with empty project name', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // Fill only project path
    const projectPathInput = screen.getByLabelText(/project path/i);
    await user.type(projectPathInput, '/test/path');
    
    // Submit form
    const createButton = screen.getByRole('button', { name: /create/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please provide both project name and path/i)).toBeInTheDocument();
    });
  });

  it('should handle session creation with empty project path', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // Fill only project name
    const projectNameInput = screen.getByLabelText(/project name/i);
    await user.type(projectNameInput, 'Test Project');
    
    // Submit form
    const createButton = screen.getByRole('button', { name: /create/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please provide both project name and path/i)).toBeInTheDocument();
    });
  });

  it('should reset form fields after successful session creation', async () => {
    const user = userEvent.setup();
    const mockSession = {
      id: 'new-session-id',
      name: 'Test Project',
      path: '/test/path',
      createdAt: new Date(),
    };
    mockBradieClient.createSession.mockResolvedValue(mockSession);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // Fill form
    const projectNameInput = screen.getByLabelText(/project name/i);
    const projectPathInput = screen.getByLabelText(/project path/i);
    
    await user.type(projectNameInput, 'Test Project');
    await user.type(projectPathInput, '/test/path');
    
    // Submit form
    const createButton = screen.getByRole('button', { name: /create/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText(/session created successfully/i)).toBeInTheDocument();
    });
    
    // Form should be hidden after successful creation
    expect(screen.queryByText(/create new session/i)).not.toBeInTheDocument();
  });

  it('should handle localStorage setItem error gracefully', () => {
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    const mockSessions = [
      { id: '1', name: 'Project 1', path: '/path1', createdAt: new Date() },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSessions));
    
    // Should not crash
    expect(() => {
      render(<AgentManagerGlobal {...defaultProps} />);
    }).not.toThrow();
  });

  it('should handle saveSessions function', () => {
    const mockSessions = [
      { id: '1', name: 'Project 1', path: '/path1', createdAt: new Date() },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSessions));
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // This should trigger saveSessions internally
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should handle connection status updates', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockResolvedValue(['llama2']);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getAllByText(/connected/i)[0]).toBeInTheDocument();
    });
  });

  it('should handle connection status updates for failure', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockRejectedValue(new Error('Connection failed'));
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText(/not connected/i)).toBeInTheDocument();
    });
  });

  it('should handle Bradie connection with different domain', async () => {
    const user = userEvent.setup();
    mockBradieClient.checkHealth.mockResolvedValue(true);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/bradie backend domain/i)).toBeInTheDocument();
    });
    
    // Change domain
    const bradieDomainInput = screen.getByLabelText(/bradie backend domain/i);
    await user.clear(bradieDomainInput);
    await user.type(bradieDomainInput, 'http://custom-bradie:3001');
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(mockBradieClient.checkHealth).toHaveBeenCalledWith('http://custom-bradie:3001');
    });
  });

  it('should handle session creation with special characters', async () => {
    const user = userEvent.setup();
    const mockSession = {
      id: 'new-session-id',
      name: 'Test Project with Special Chars !@#$%',
      path: '/test/path with spaces',
      createdAt: new Date(),
    };
    mockBradieClient.createSession.mockResolvedValue(mockSession);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // Fill form with special characters
    const projectNameInput = screen.getByLabelText(/project name/i);
    const projectPathInput = screen.getByLabelText(/project path/i);
    
    await user.type(projectNameInput, 'Test Project with Special Chars !@#$%');
    await user.type(projectPathInput, '/test/path with spaces');
    
    // Submit form
    const createButton = screen.getByRole('button', { name: /create/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(mockBradieClient.createSession).toHaveBeenCalledWith(
        'Test Project with Special Chars !@#$%',
        '/test/path with spaces'
      );
    });
  });

  it('should handle rapid clicking on test button', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    const testButton = screen.getByRole('button', { name: /test/i });
    
    // Rapid clicking
    await user.click(testButton);
    await user.click(testButton);
    await user.click(testButton);
    
    // Button should be disabled during loading
    expect(testButton).toBeDisabled();
  });

  it('should handle empty model list from Ollama', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockResolvedValue([]);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText(/successfully connected to ollama/i)).toBeInTheDocument();
    });
    
    // Model select should not be visible when no models
    expect(screen.queryByLabelText(/model/i)).not.toBeInTheDocument();
  });

  it('should handle session deletion with confirmation', async () => {
    const user = userEvent.setup();
    const mockSessions = [
      { id: '1', name: 'Project 1', path: '/path1', createdAt: new Date() },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSessions));
    
    // Mock window.confirm
    const mockConfirm = jest.fn().mockReturnValue(true);
    Object.defineProperty(window, 'confirm', { value: mockConfirm, writable: true });
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });
    
    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(btn => 
      btn.querySelector('svg[class*="lucide-trash"]')
    );
    
    if (deleteButton) {
      await user.click(deleteButton);
    }
    
    expect(mockConfirm).toHaveBeenCalled();
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('should handle session deletion cancellation', async () => {
    const user = userEvent.setup();
    const mockSessions = [
      { id: '1', name: 'Project 1', path: '/path1', createdAt: new Date() },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockSessions));
    
    // Mock window.confirm to return false
    const mockConfirm = jest.fn().mockReturnValue(false);
    Object.defineProperty(window, 'confirm', { value: mockConfirm, writable: true });
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });
    
    // Find and click delete button
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(btn => 
      btn.querySelector('svg[class*="lucide-trash"]')
    );
    
    if (deleteButton) {
      await user.click(deleteButton);
    }
    
    expect(mockConfirm).toHaveBeenCalled();
    // Should not call setItem when cancelled
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });

  it('should handle form validation with whitespace only', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // Fill form with whitespace only
    const projectNameInput = screen.getByLabelText(/project name/i);
    const projectPathInput = screen.getByLabelText(/project path/i);
    
    await user.type(projectNameInput, '   ');
    await user.type(projectPathInput, '   ');
    
    // Submit form
    const createButton = screen.getByRole('button', { name: /create/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please provide both project name and path/i)).toBeInTheDocument();
    });
  });

  it('should handle very long session names', async () => {
    const user = userEvent.setup();
    const longName = 'A'.repeat(1000);
    const mockSession = {
      id: 'new-session-id',
      name: longName,
      path: '/test/path',
      createdAt: new Date(),
    };
    mockBradieClient.createSession.mockResolvedValue(mockSession);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // Fill form with long name
    const projectNameInput = screen.getByLabelText(/project name/i);
    const projectPathInput = screen.getByLabelText(/project path/i);
    
    await user.type(projectNameInput, longName);
    await user.type(projectPathInput, '/test/path');
    
    // Submit form
    const createButton = screen.getByRole('button', { name: /create/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(mockBradieClient.createSession).toHaveBeenCalledWith(longName, '/test/path');
    });
  });

  it('should handle connection status updates for Bradie', async () => {
    const user = userEvent.setup();
    mockBradieClient.checkHealth.mockResolvedValue(true);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/bradie backend domain/i)).toBeInTheDocument();
    });
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText(/connected/i)).toBeInTheDocument();
    });
  });

  it('should handle connection status updates for Bradie failure', async () => {
    const user = userEvent.setup();
    mockBradieClient.checkHealth.mockResolvedValue(false);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/bradie backend domain/i)).toBeInTheDocument();
    });
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText(/not connected/i)).toBeInTheDocument();
    });
  });

  it('should handle Bradie connection with error', async () => {
    const user = userEvent.setup();
    mockBradieClient.checkHealth.mockRejectedValue(new Error('Network error'));
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/bradie backend domain/i)).toBeInTheDocument();
    });
    
    const testButton = screen.getByRole('button', { name: /test/i });
    await user.click(testButton);
    
    await waitFor(() => {
      expect(screen.getByText(/not connected/i)).toBeInTheDocument();
    });
  });

  it('should handle session creation with empty strings', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // Fill form with empty strings
    const projectNameInput = screen.getByLabelText(/project name/i);
    const projectPathInput = screen.getByLabelText(/project path/i);
    
    await user.type(projectNameInput, '');
    await user.type(projectPathInput, '');
    
    // Submit form
    const createButton = screen.getByRole('button', { name: /create/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please provide both project name and path/i)).toBeInTheDocument();
    });
  });

  it('should handle session creation with only spaces', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // Fill form with only spaces
    const projectNameInput = screen.getByLabelText(/project name/i);
    const projectPathInput = screen.getByLabelText(/project path/i);
    
    await user.type(projectNameInput, ' ');
    await user.type(projectPathInput, ' ');
    
    // Submit form
    const createButton = screen.getByRole('button', { name: /create/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please provide both project name and path/i)).toBeInTheDocument();
    });
  });

  it('should handle session creation with mixed whitespace', async () => {
    const user = userEvent.setup();
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // Fill form with mixed whitespace
    const projectNameInput = screen.getByLabelText(/project name/i);
    const projectPathInput = screen.getByLabelText(/project path/i);
    
    await user.type(projectNameInput, ' \t\n ');
    await user.type(projectPathInput, ' \t\n ');
    
    // Submit form
    const createButton = screen.getByRole('button', { name: /create/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please provide both project name and path/i)).toBeInTheDocument();
    });
  });

  it('should handle session creation with valid input after invalid input', async () => {
    const user = userEvent.setup();
    const mockSession = {
      id: 'new-session-id',
      name: 'Valid Project',
      path: '/valid/path',
      createdAt: new Date(),
    };
    mockBradieClient.createSession.mockResolvedValue(mockSession);
    
    render(<AgentManagerGlobal {...defaultProps} />);
    
    // Switch to Bradie tab
    const bradieTab = screen.getByRole('tab', { name: /bradie/i });
    await user.click(bradieTab);
    
    // Wait for tab content to load
    await waitFor(() => {
      expect(screen.getByText(/sessions/i)).toBeInTheDocument();
    });
    
    // Open create session form
    const newSessionButton = screen.getByRole('button', { name: /new session/i });
    await user.click(newSessionButton);
    
    // First try with invalid input
    const projectNameInput = screen.getByLabelText(/project name/i);
    const projectPathInput = screen.getByLabelText(/project path/i);
    
    await user.type(projectNameInput, '');
    await user.type(projectPathInput, '');
    
    // Submit form
    const createButton = screen.getByRole('button', { name: /create/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please provide both project name and path/i)).toBeInTheDocument();
    });
    
    // Now try with valid input
    await user.clear(projectNameInput);
    await user.clear(projectPathInput);
    await user.type(projectNameInput, 'Valid Project');
    await user.type(projectPathInput, '/valid/path');
    
    await user.click(createButton);
    
    await waitFor(() => {
      expect(mockBradieClient.createSession).toHaveBeenCalledWith('Valid Project', '/valid/path');
    });
  });
});
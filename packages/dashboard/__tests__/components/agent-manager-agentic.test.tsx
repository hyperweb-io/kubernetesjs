import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AgentManagerAgentic } from '@/components/agent-manager-agentic';
import { AgentKit } from 'agentic-kit';
import OllamaClient from '@agentic-kit/ollama';

// Mock the external dependencies
jest.mock('agentic-kit');
jest.mock('@agentic-kit/ollama');

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock window.confirm
const mockConfirm = jest.fn();
window.confirm = mockConfirm;

// Mock window.location
delete (window as any).location;
(window as any).location = {
  pathname: '/test/path'
};

const mockAgentKit = {
  // Add any methods that AgentKit might have
} as unknown as AgentKit;

const mockOllamaClient = {
  listModels: jest.fn(),
  pullModel: jest.fn(),
  deleteModel: jest.fn(),
};

(OllamaClient as jest.Mock).mockImplementation(() => mockOllamaClient);

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  agentKit: mockAgentKit,
  currentProvider: 'ollama' as const,
  onProviderChange: jest.fn(),
};

describe('AgentManagerAgentic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    mockConfirm.mockReturnValue(true);
  });

  it('should render dialog when open', () => {
    render(<AgentManagerAgentic {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Agent Configuration')).toBeInTheDocument();
  });

  it('should not render dialog when closed', () => {
    render(<AgentManagerAgentic {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render tabs for different sections', () => {
    render(<AgentManagerAgentic {...defaultProps} />);
    
    expect(screen.getByRole('tab', { name: /providers/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /models/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /projects/i })).toBeInTheDocument();
  });

  it('should render providers tab content by default', () => {
    render(<AgentManagerAgentic {...defaultProps} />);
    
    expect(screen.getByText('Current Provider')).toBeInTheDocument();
    expect(screen.getByText('Ollama Endpoint')).toBeInTheDocument();
    expect(screen.getByText('Bradie Endpoint')).toBeInTheDocument();
  });

  it('should switch to models tab when clicked', async () => {
    const user = userEvent.setup();
    render(<AgentManagerAgentic {...defaultProps} />);
    
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await user.click(modelsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Ollama Models')).toBeInTheDocument();
    });
  });

  it('should switch to projects tab when clicked', async () => {
    const user = userEvent.setup();
    render(<AgentManagerAgentic {...defaultProps} />);
    
    const projectsTab = screen.getByRole('tab', { name: /projects/i });
    await user.click(projectsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Current Bradie Session')).toBeInTheDocument();
    });
  });

  it('should render connection status indicators', () => {
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Should show checking status initially (there are multiple checking statuses)
    expect(screen.getAllByText('checking')).toHaveLength(2); // Ollama and Bradie status
  });

  it('should render model management section in models tab', async () => {
    const user = userEvent.setup();
    render(<AgentManagerAgentic {...defaultProps} />);
    
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await user.click(modelsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Ollama Models')).toBeInTheDocument();
      expect(screen.getByText('Pull New Model')).toBeInTheDocument();
    });
  });

  it('should handle model pulling', async () => {
    const user = userEvent.setup();
    mockOllamaClient.pullModel.mockResolvedValue(undefined);
    mockOllamaClient.listModels.mockResolvedValue(['llama2']);
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await user.click(modelsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Ollama Models')).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/e.g., llama2, codellama, mixtral/i);
    const pullButton = screen.getByRole('button', { name: /pull/i });
    
    await user.type(input, 'llama2');
    await user.click(pullButton);
    
    await waitFor(() => {
      expect(mockOllamaClient.pullModel).toHaveBeenCalledWith('llama2');
    });
  });

  it('should handle connection testing', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockResolvedValue(['llama2']);
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Test Ollama connection - find the server icon button
    const ollamaTestButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg') && btn.querySelector('svg[class*="lucide-server"]')
    );
    expect(ollamaTestButton).toBeInTheDocument();
    
    if (ollamaTestButton) {
      await user.click(ollamaTestButton);
    }
    
    await waitFor(() => {
      expect(mockOllamaClient.listModels).toHaveBeenCalled();
    });
  });

  it('should handle endpoint changes', async () => {
    const user = userEvent.setup();
    render(<AgentManagerAgentic {...defaultProps} />);
    
    const ollamaInput = screen.getByDisplayValue('http://localhost:11434');
    const bradieInput = screen.getByDisplayValue('http://localhost:3001');
    
    await user.clear(ollamaInput);
    await user.type(ollamaInput, 'http://localhost:11435');
    
    await user.clear(bradieInput);
    await user.type(bradieInput, 'http://localhost:3002');
    
    expect(ollamaInput).toHaveValue('http://localhost:11435');
    expect(bradieInput).toHaveValue('http://localhost:3002');
  });

    it('should handle project creation in projects tab', async () => {
      const user = userEvent.setup();
      
      render(<AgentManagerAgentic {...defaultProps} />);
      
      // Switch to projects tab
      const projectsTab = screen.getByRole('tab', { name: /projects/i });
      await user.click(projectsTab);
      
      await waitFor(() => {
        expect(screen.getByText('Create New Bradie Project')).toBeInTheDocument();
      });
      
      const projectNameInput = screen.getByPlaceholderText('My Awesome Project');
      const projectPathInput = screen.getByPlaceholderText('/path/to/project');
      
      await user.type(projectNameInput, 'test-project');
      await user.type(projectPathInput, '/path/to/project');
      
      // The button should be disabled because bradieStatus is 'offline'
      const createButton = screen.getByRole('button', { name: /create project/i });
      expect(createButton).toBeDisabled();
      
      // Test that the form fields are populated correctly
      expect(projectNameInput).toHaveValue('test-project');
      expect(projectPathInput).toHaveValue('/path/to/project');
    });

  it('should handle errors gracefully', async () => {
    mockOllamaClient.listModels.mockRejectedValue(new Error('Connection failed'));
    
    await act(async () => {
      render(<AgentManagerAgentic {...defaultProps} />);
    });
    
    await waitFor(() => {
      expect(screen.getAllByText('offline')).toHaveLength(2); // Both Ollama and Bradie show offline
    });
  });

  it('should close dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<AgentManagerAgentic {...defaultProps} onClose={onClose} />);
    
    // Use getAllByRole to get all close buttons and click the first one (dialog footer)
    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    await user.click(closeButtons[0]);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('should handle model deletion', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockResolvedValue(['llama2']);
    mockOllamaClient.deleteModel.mockResolvedValue(undefined);
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await user.click(modelsTab);
    
    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('llama2')).toBeInTheDocument();
    });
    
    // Find the delete button by looking for the trash icon button
    const deleteButton = screen.getByRole('button', { name: '' }); // Empty name for icon button
    await user.click(deleteButton);
    
    await waitFor(() => {
      expect(mockOllamaClient.deleteModel).toHaveBeenCalledWith('llama2');
    });
  });

  it('should show loading states', async () => {
    mockOllamaClient.listModels.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    await act(async () => {
      render(<AgentManagerAgentic {...defaultProps} />);
    });
    
    // Should show checking status initially (there are multiple checking statuses)
    expect(screen.getAllByText('checking')).toHaveLength(2); // Ollama and Bradie status
  });

  it('should handle Bradie connection test success', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: true });
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Test Bradie connection
    const bradieTestButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg[class*="lucide-server"]') && 
      btn.closest('div')?.querySelector('input[value*="3001"]')
    );
    expect(bradieTestButton).toBeInTheDocument();
    
    if (bradieTestButton) {
      await user.click(bradieTestButton);
    }
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/health');
    });
  });

  it('should handle Bradie connection test failure', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({ ok: false });
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Test Bradie connection
    const bradieTestButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg[class*="lucide-server"]') && 
      btn.closest('div')?.querySelector('input[value*="3001"]')
    );
    expect(bradieTestButton).toBeInTheDocument();
    
    if (bradieTestButton) {
      await user.click(bradieTestButton);
    }
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/health');
    });
  });

  it('should handle Bradie connection test error', async () => {
    const user = userEvent.setup();
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Test Bradie connection
    const bradieTestButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg[class*="lucide-server"]') && 
      btn.closest('div')?.querySelector('input[value*="3001"]')
    );
    expect(bradieTestButton).toBeInTheDocument();
    
    if (bradieTestButton) {
      await user.click(bradieTestButton);
    }
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/health');
    });
  });

  it('should handle model pull success', async () => {
    const user = userEvent.setup();
    mockOllamaClient.pullModel.mockResolvedValue(undefined);
    mockOllamaClient.listModels.mockResolvedValue(['llama2', 'new-model']);
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await user.click(modelsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Ollama Models')).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/e.g., llama2, codellama, mixtral/i);
    const pullButton = screen.getByRole('button', { name: /pull/i });
    
    await user.type(input, 'new-model');
    await user.click(pullButton);
    
    await waitFor(() => {
      expect(mockOllamaClient.pullModel).toHaveBeenCalledWith('new-model');
      expect(screen.getByText(/successfully pulled model: new-model/i)).toBeInTheDocument();
    });
  });

  it('should handle model pull error', async () => {
    const user = userEvent.setup();
    mockOllamaClient.pullModel.mockRejectedValue(new Error('Pull failed'));
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await user.click(modelsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Ollama Models')).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/e.g., llama2, codellama, mixtral/i);
    const pullButton = screen.getByRole('button', { name: /pull/i });
    
    await user.type(input, 'failing-model');
    await user.click(pullButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to pull model: error: pull failed/i)).toBeInTheDocument();
    });
  });

  it('should handle model pull with Enter key', async () => {
    const user = userEvent.setup();
    mockOllamaClient.pullModel.mockResolvedValue(undefined);
    mockOllamaClient.listModels.mockResolvedValue(['llama2']);
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await user.click(modelsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Ollama Models')).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/e.g., llama2, codellama, mixtral/i);
    
    await user.type(input, 'enter-model');
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(mockOllamaClient.pullModel).toHaveBeenCalledWith('enter-model');
    });
  });

  it('should not pull model when input is empty', async () => {
    const user = userEvent.setup();
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await user.click(modelsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Ollama Models')).toBeInTheDocument();
    });
    
    const pullButton = screen.getByRole('button', { name: /pull/i });
    expect(pullButton).toBeDisabled();
    
    await user.click(pullButton);
    expect(mockOllamaClient.pullModel).not.toHaveBeenCalled();
  });

  it('should handle model deletion success', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockResolvedValue(['llama2', 'model-to-delete']);
    mockOllamaClient.deleteModel.mockResolvedValue(undefined);
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await user.click(modelsTab);
    
    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('model-to-delete')).toBeInTheDocument();
    });
    
    // Find the delete button for the specific model
    const modelCard = screen.getByText('model-to-delete').closest('div');
    const deleteButton = modelCard?.querySelector('button[title="Delete model"]') || 
                        modelCard?.querySelector('button:has(svg[class*="lucide-trash"])');
    
    if (deleteButton) {
      await user.click(deleteButton);
    }
    
    await waitFor(() => {
      expect(mockOllamaClient.deleteModel).toHaveBeenCalledWith('model-to-delete');
      expect(screen.getByText(/successfully deleted model: model-to-delete/i)).toBeInTheDocument();
    });
  });

  it('should handle model deletion error', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockResolvedValue(['llama2', 'model-to-delete']);
    mockOllamaClient.deleteModel.mockRejectedValue(new Error('Delete failed'));
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await user.click(modelsTab);
    
    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('model-to-delete')).toBeInTheDocument();
    });
    
    // Find the delete button for the specific model
    const modelCard = screen.getByText('model-to-delete').closest('div');
    const deleteButton = modelCard?.querySelector('button[title="Delete model"]') || 
                        modelCard?.querySelector('button:has(svg[class*="lucide-trash"])');
    
    if (deleteButton) {
      await user.click(deleteButton);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/failed to delete model: error: delete failed/i)).toBeInTheDocument();
    });
  });

  it('should not delete model when user cancels confirmation', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(false);
    mockOllamaClient.listModels.mockResolvedValue(['llama2', 'model-to-delete']);
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await user.click(modelsTab);
    
    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('model-to-delete')).toBeInTheDocument();
    });
    
    // Find the delete button for the specific model
    const modelCard = screen.getByText('model-to-delete').closest('div');
    const deleteButton = modelCard?.querySelector('button[title="Delete model"]') || 
                        modelCard?.querySelector('button:has(svg[class*="lucide-trash"])');
    
    if (deleteButton) {
      await user.click(deleteButton);
    }
    
    expect(mockOllamaClient.deleteModel).not.toHaveBeenCalled();
  });

  it('should handle model selection', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockResolvedValue(['llama2', 'gemma']);
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await user.click(modelsTab);
    
    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('llama2')).toBeInTheDocument();
      expect(screen.getByText('gemma')).toBeInTheDocument();
    });
    
    // Click select button for gemma
    const selectButton = screen.getByRole('button', { name: /select/i });
    await user.click(selectButton);
    
    // Should show "Currently selected" for the selected model
    await waitFor(() => {
      expect(screen.getByText('Currently selected')).toBeInTheDocument();
    });
  });

  it('should handle provider change', async () => {
    const user = userEvent.setup();
    render(<AgentManagerAgentic {...defaultProps} />);
    
    const providerSelect = screen.getByRole('combobox');
    await user.click(providerSelect);
    
    const bradieOption = screen.getByText('Bradie');
    await user.click(bradieOption);
    
    expect(defaultProps.onProviderChange).toHaveBeenCalledWith('bradie');
  });

  it('should handle project creation with empty fields', async () => {
    const user = userEvent.setup();
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to projects tab
    const projectsTab = screen.getByRole('tab', { name: /projects/i });
    await user.click(projectsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Bradie Project')).toBeInTheDocument();
    });
    
    const createButton = screen.getByRole('button', { name: /create project/i });
    expect(createButton).toBeDisabled();
    
    await user.click(createButton);
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });
  });

  it('should handle project creation success', async () => {
    const user = userEvent.setup();
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to projects tab
    const projectsTab = screen.getByRole('tab', { name: /projects/i });
    await user.click(projectsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Bradie Project')).toBeInTheDocument();
    });
    
    const projectNameInput = screen.getByPlaceholderText('My Awesome Project');
    const projectPathInput = screen.getByPlaceholderText('/path/to/project');
    
    await user.type(projectNameInput, 'test-project');
    await user.type(projectPathInput, '/path/to/project');
    
    const createButton = screen.getByRole('button', { name: /create project/i });
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText(/project creation not yet implemented/i)).toBeInTheDocument();
      expect(projectNameInput).toHaveValue('');
      expect(projectPathInput).toHaveValue('');
    });
  });

  it('should handle use current path button', async () => {
    const user = userEvent.setup();
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to projects tab
    const projectsTab = screen.getByRole('tab', { name: /projects/i });
    await user.click(projectsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Bradie Project')).toBeInTheDocument();
    });
    
    const useCurrentPathButton = screen.getByRole('button', { name: /use current path/i });
    await user.click(useCurrentPathButton);
    
    const projectPathInput = screen.getByPlaceholderText('/path/to/project');
    expect(projectPathInput).toHaveValue('/test/path');
  });

  it('should handle refresh models button', async () => {
    const user = userEvent.setup();
    mockOllamaClient.listModels.mockResolvedValue(['llama2', 'gemma']);
    
    render(<AgentManagerAgentic {...defaultProps} />);
    
    // Switch to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await user.click(modelsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Ollama Models')).toBeInTheDocument();
    });
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);
    
    await waitFor(() => {
      expect(mockOllamaClient.listModels).toHaveBeenCalledTimes(2); // Once on mount, once on refresh
    });
  });

  it('should show offline message when Ollama is offline', async () => {
    mockOllamaClient.listModels.mockRejectedValue(new Error('Connection failed'));
    
    await act(async () => {
      render(<AgentManagerAgentic {...defaultProps} />);
    });
    
    // Switch to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await userEvent.click(modelsTab);
    
    await waitFor(() => {
      expect(screen.getByText(/cannot connect to ollama/i)).toBeInTheDocument();
    });
  });

  it('should show no models message when no models are installed', async () => {
    mockOllamaClient.listModels.mockResolvedValue([]);
    
    await act(async () => {
      render(<AgentManagerAgentic {...defaultProps} />);
    });
    
    // Switch to models tab
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await userEvent.click(modelsTab);
    
    await waitFor(() => {
      expect(screen.getByText(/no models installed/i)).toBeInTheDocument();
    });
  });

  it('should handle loadOllamaModels when offline', async () => {
    mockOllamaClient.listModels.mockRejectedValue(new Error('Connection failed'));
    
    await act(async () => {
      render(<AgentManagerAgentic {...defaultProps} />);
    });
    
    // Wait for the component to set offline status
    await waitFor(() => {
      expect(screen.getAllByText('offline')).toHaveLength(2);
    });
    
    // The loadOllamaModels function should return early when offline
    // This is tested by checking that the models list is empty
    const modelsTab = screen.getByRole('tab', { name: /models/i });
    await userEvent.click(modelsTab);
    
    await waitFor(() => {
      expect(screen.getByText(/cannot connect to ollama/i)).toBeInTheDocument();
    });
  });
});

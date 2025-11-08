import { NextRequest } from 'next/server';
import { POST, DELETE } from '@/app/api/operators/[operator]/install/route';

// Mock the dependencies
jest.mock('@/k8s/client', () => ({
  createSetupClient: jest.fn(),
}));

// Mock createRequire and fs
jest.mock('module', () => ({
  createRequire: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
  dirname: jest.fn(),
}));

describe('/api/operators/[operator]/install', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should install operator successfully without wait', async () => {
      const mockSetupClient = {
        installOperatorByName: jest.fn().mockResolvedValue(undefined)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/install', {
        method: 'POST',
        body: JSON.stringify({ version: '1.0.0' }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Operator postgres-operator installation initiated');
      expect(mockSetupClient.installOperatorByName).toHaveBeenCalledWith('postgres-operator', '1.0.0');
    });

    it('should install operator successfully with wait', async () => {
      const mockSetupClient = {
        installOperatorByName: jest.fn().mockResolvedValue(undefined),
        waitForOperator: jest.fn().mockResolvedValue(undefined)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/install?wait=true&timeoutMs=300000', {
        method: 'POST',
        body: JSON.stringify({ wait: true, timeoutMs: 300000 }),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Operator postgres-operator installed');
      expect(mockSetupClient.installOperatorByName).toHaveBeenCalledWith('postgres-operator', undefined);
      expect(mockSetupClient.waitForOperator).toHaveBeenCalledWith('postgres-operator', 300000);
    });

    it('should install operator with wait from query params', async () => {
      const mockSetupClient = {
        installOperatorByName: jest.fn().mockResolvedValue(undefined),
        waitForOperator: jest.fn().mockResolvedValue(undefined)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/install?wait=true', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Operator postgres-operator installed');
      expect(mockSetupClient.waitForOperator).toHaveBeenCalledWith('postgres-operator', 180000);
    });

    it('should handle installation errors', async () => {
      const mockSetupClient = {
        installOperatorByName: jest.fn().mockRejectedValue(new Error('Installation failed'))
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/install', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to install operator');
      expect(data.message).toBe('Installation failed');
    });

    it('should handle wait timeout errors', async () => {
      const mockSetupClient = {
        installOperatorByName: jest.fn().mockResolvedValue(undefined),
        waitForOperator: jest.fn().mockRejectedValue(new Error('Wait timeout'))
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/install?wait=true', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to install operator');
      expect(data.message).toBe('Wait timeout');
    });

    it('should handle JSON parsing errors', async () => {
      const mockSetupClient = {
        installOperatorByName: jest.fn().mockResolvedValue(undefined)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/install', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockSetupClient.installOperatorByName).toHaveBeenCalledWith('postgres-operator', undefined);
    });

    it('should perform debug resolution when available', async () => {
      const mockSetupClient = {
        installOperatorByName: jest.fn().mockResolvedValue(undefined)
      };

      const mockCreateRequire = jest.fn().mockReturnValue({
        resolve: jest.fn()
          .mockReturnValueOnce('/path/to/client')
          .mockReturnValueOnce('/path/to/manifests/package.json')
      });

      const mockPath = {
        join: jest.fn().mockReturnValue('/path/to/manifests/operators'),
        dirname: jest.fn().mockReturnValue('/path/to/manifests')
      };

      const mockFs = {
        existsSync: jest.fn().mockReturnValue(true)
      };

      const { createSetupClient } = require('@/k8s/client');
      const { createRequire } = require('module');
      const fs = require('fs');
      const path = require('path');

      createSetupClient.mockReturnValue(mockSetupClient);
      createRequire.mockReturnValue(mockCreateRequire());
      fs.existsSync = mockFs.existsSync;
      path.join = mockPath.join;
      path.dirname = mockPath.dirname;

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/install', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await POST(request, { params });

      expect(response.status).toBe(200);
      expect(mockCreateRequire).toHaveBeenCalled();
    });
  });

  describe('DELETE', () => {
    it('should uninstall operator successfully without wait', async () => {
      const mockSetupClient = {
        uninstallOperatorByName: jest.fn().mockResolvedValue(undefined)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/install', {
        method: 'DELETE'
      });
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Operator postgres-operator uninstallation initiated');
      expect(mockSetupClient.uninstallOperatorByName).toHaveBeenCalledWith('postgres-operator');
    });

    it('should uninstall operator successfully with wait', async () => {
      const mockSetupClient = {
        uninstallOperatorByName: jest.fn().mockResolvedValue(undefined),
        waitForOperatorDeletion: jest.fn().mockResolvedValue(undefined)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/install?wait=true&timeoutMs=300000', {
        method: 'DELETE'
      });
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Operator postgres-operator uninstalled');
      expect(mockSetupClient.uninstallOperatorByName).toHaveBeenCalledWith('postgres-operator');
      expect(mockSetupClient.waitForOperatorDeletion).toHaveBeenCalledWith('postgres-operator', 300000);
    });

    it('should uninstall operator with wait from query params', async () => {
      const mockSetupClient = {
        uninstallOperatorByName: jest.fn().mockResolvedValue(undefined),
        waitForOperatorDeletion: jest.fn().mockResolvedValue(undefined)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/install?wait=true', {
        method: 'DELETE'
      });
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Operator postgres-operator uninstalled');
      expect(mockSetupClient.waitForOperatorDeletion).toHaveBeenCalledWith('postgres-operator', 180000);
    });

    it('should handle uninstallation errors', async () => {
      const mockSetupClient = {
        uninstallOperatorByName: jest.fn().mockRejectedValue(new Error('Uninstallation failed'))
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/install', {
        method: 'DELETE'
      });
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to uninstall operator');
      expect(data.message).toBe('Uninstallation failed');
    });

    it('should handle wait timeout errors during uninstallation', async () => {
      const mockSetupClient = {
        uninstallOperatorByName: jest.fn().mockResolvedValue(undefined),
        waitForOperatorDeletion: jest.fn().mockRejectedValue(new Error('Wait timeout'))
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/install?wait=true', {
        method: 'DELETE'
      });
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to uninstall operator');
      expect(data.message).toBe('Wait timeout');
    });

    it('should perform debug resolution when available', async () => {
      const mockSetupClient = {
        uninstallOperatorByName: jest.fn().mockResolvedValue(undefined)
      };

      const mockCreateRequire = jest.fn().mockReturnValue({
        resolve: jest.fn().mockReturnValueOnce('/path/to/manifests/package.json')
      });

      const mockPath = {
        join: jest.fn().mockReturnValue('/path/to/manifests/operators'),
        dirname: jest.fn().mockReturnValue('/path/to/manifests')
      };

      const mockFs = {
        existsSync: jest.fn().mockReturnValue(true)
      };

      const { createSetupClient } = require('@/k8s/client');
      const { createRequire } = require('module');
      const fs = require('fs');
      const path = require('path');

      createSetupClient.mockReturnValue(mockSetupClient);
      createRequire.mockReturnValue(mockCreateRequire());
      fs.existsSync = mockFs.existsSync;
      path.join = mockPath.join;
      path.dirname = mockPath.dirname;

      const request = new NextRequest('http://localhost:3000/api/operators/postgres-operator/install', {
        method: 'DELETE'
      });
      const params = Promise.resolve({ operator: 'postgres-operator' });

      const response = await DELETE(request, { params });

      expect(response.status).toBe(200);
      expect(mockCreateRequire).toHaveBeenCalled();
    });
  });
});

import { NextRequest } from 'next/server';

import { GET } from '@/app/api/operators/route';

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

describe('/api/operators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return operators list successfully', async () => {
      const mockOperators = [
        { name: 'postgres-operator', version: '1.0.0', installed: true },
        { name: 'redis-operator', version: '2.0.0', installed: false }
      ];

      const mockSetupClient = {
        listOperatorsInfo: jest.fn().mockResolvedValue(mockOperators)
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockOperators);
      expect(createSetupClient).toHaveBeenCalled();
      expect(mockSetupClient.listOperatorsInfo).toHaveBeenCalled();
    });

    it('should handle setup client errors', async () => {
      const mockSetupClient = {
        listOperatorsInfo: jest.fn().mockRejectedValue(new Error('Setup client error'))
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch operators');
      expect(data.message).toBe('Setup client error');
    });

    it('should handle non-Error exceptions', async () => {
      const mockSetupClient = {
        listOperatorsInfo: jest.fn().mockRejectedValue('String error')
      };

      const { createSetupClient } = require('@/k8s/client');
      createSetupClient.mockReturnValue(mockSetupClient);

      const request = new NextRequest('http://localhost:3000/api/operators');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch operators');
      expect(data.message).toBe('Unknown error');
    });

    it('should perform debug resolution when available', async () => {
      const mockOperators = [{ name: 'test-operator', version: '1.0.0' }];
      const mockSetupClient = {
        listOperatorsInfo: jest.fn().mockResolvedValue(mockOperators)
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

      const request = new NextRequest('http://localhost:3000/api/operators');
      const response = await GET();

      expect(response.status).toBe(200);
      expect(mockCreateRequire).toHaveBeenCalled();
      expect(mockPath.join).toHaveBeenCalledWith('/path/to/manifests', 'operators');
      expect(mockFs.existsSync).toHaveBeenCalledWith('/path/to/manifests/operators');
    });

    it('should handle debug resolution errors gracefully', async () => {
      const mockOperators = [{ name: 'test-operator', version: '1.0.0' }];
      const mockSetupClient = {
        listOperatorsInfo: jest.fn().mockResolvedValue(mockOperators)
      };

      const mockCreateRequire = jest.fn().mockImplementation(() => {
        throw new Error('Resolution error');
      });

      const { createSetupClient } = require('@/k8s/client');
      const { createRequire } = require('module');

      createSetupClient.mockReturnValue(mockSetupClient);
      createRequire.mockImplementation(mockCreateRequire);

      const request = new NextRequest('http://localhost:3000/api/operators');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockOperators);
    });

    it('should log debug information when available', async () => {
      const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const mockOperators = [{ name: 'test-operator', version: '1.0.0' }];
      const mockSetupClient = {
        listOperatorsInfo: jest.fn().mockResolvedValue(mockOperators)
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

      const request = new NextRequest('http://localhost:3000/api/operators');
      const response = await GET();

      expect(response.status).toBe(200);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[operators.GET] resolve',
        expect.objectContaining({
          clientResolved: '/path/to/client',
          manifestsPkgPath: '/path/to/manifests/package.json',
          operatorsDirExists: true
        })
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[operators.GET] setup proto:',
        expect.any(Array)
      );

      consoleSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });
});

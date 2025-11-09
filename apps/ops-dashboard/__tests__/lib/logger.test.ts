import { logger } from '@/lib/logger';

// Mock console methods
const mockConsole = {
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock process.env
const originalEnv = process.env;

describe('lib/logger', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock console methods
    Object.defineProperty(global, 'console', {
      value: mockConsole,
      writable: true,
    });
    
    // Reset process.env
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original process.env
    process.env = originalEnv;
  });

  describe('in development environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should log messages normally', () => {
      logger.log('Test log message');
      expect(mockConsole.log).toHaveBeenCalledWith('Test log message');
    });

    it('should log info messages normally', () => {
      logger.info('Test info message');
      expect(mockConsole.info).toHaveBeenCalledWith('Test info message');
    });

    it('should log warning messages normally', () => {
      logger.warn('Test warning message');
      expect(mockConsole.warn).toHaveBeenCalledWith('Test warning message');
    });

    it('should log error messages normally', () => {
      logger.error('Test error message');
      expect(mockConsole.error).toHaveBeenCalledWith('Test error message');
    });

    it('should log multiple parameters', () => {
      logger.log('Message', { data: 'test' }, 123);
      expect(mockConsole.log).toHaveBeenCalledWith('Message', { data: 'test' }, 123);
    });

    it('should handle options parameter correctly', () => {
      logger.log('Message', { data: 'test' }, { force: true });
      expect(mockConsole.log).toHaveBeenCalledWith('Message', { data: 'test' });
    });

    it('should handle force option in development', () => {
      logger.log('Forced message', { force: true });
      expect(mockConsole.log).toHaveBeenCalledWith('Forced message');
    });
  });

  describe('in production environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should not log messages normally', () => {
      logger.log('Test log message');
      expect(mockConsole.log).not.toHaveBeenCalled();
    });

    it('should not log info messages normally', () => {
      logger.info('Test info message');
      expect(mockConsole.info).not.toHaveBeenCalled();
    });

    it('should not log warning messages normally', () => {
      logger.warn('Test warning message');
      expect(mockConsole.warn).not.toHaveBeenCalled();
    });

    it('should not log error messages normally', () => {
      logger.error('Test error message');
      expect(mockConsole.error).not.toHaveBeenCalled();
    });

    it('should log when force option is true', () => {
      logger.log('Forced message', { force: true });
      expect(mockConsole.log).toHaveBeenCalledWith('Forced message');
    });

    it('should log info when force option is true', () => {
      logger.info('Forced info', { force: true });
      expect(mockConsole.info).toHaveBeenCalledWith('Forced info');
    });

    it('should log warning when force option is true', () => {
      logger.warn('Forced warning', { force: true });
      expect(mockConsole.warn).toHaveBeenCalledWith('Forced warning');
    });

    it('should log error when force option is true', () => {
      logger.error('Forced error', { force: true });
      expect(mockConsole.error).toHaveBeenCalledWith('Forced error');
    });

    it('should handle multiple parameters with force option', () => {
      logger.log('Forced message', { data: 'test' }, 123, { force: true });
      expect(mockConsole.log).toHaveBeenCalledWith('Forced message', { data: 'test' }, 123);
    });
  });

  describe('options parameter handling', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should not log when options object does not have force property', () => {
      logger.log('Message', { other: 'property' });
      expect(mockConsole.log).not.toHaveBeenCalled();
    });

    it('should not log when force is false', () => {
      logger.log('Message', { force: false });
      expect(mockConsole.log).not.toHaveBeenCalled();
    });

    it('should log when force is true', () => {
      logger.log('Message', { force: true });
      expect(mockConsole.log).toHaveBeenCalledWith('Message');
    });

    it('should handle options as last parameter with other parameters', () => {
      logger.log('Message', 'param1', 'param2', { force: true });
      expect(mockConsole.log).toHaveBeenCalledWith('Message', 'param1', 'param2');
    });

    it('should handle options as last parameter with object parameters', () => {
      logger.log('Message', { data: 'test' }, { force: true });
      expect(mockConsole.log).toHaveBeenCalledWith('Message', { data: 'test' });
    });

    it('should not treat regular objects as options', () => {
      logger.log('Message', { data: 'test' }, { other: 'value' });
      expect(mockConsole.log).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should handle undefined message', () => {
      logger.log();
      expect(mockConsole.log).toHaveBeenCalledWith(undefined);
    });

    it('should handle null message', () => {
      logger.log(null);
      expect(mockConsole.log).toHaveBeenCalledWith(null);
    });

    it('should handle empty string message', () => {
      logger.log('');
      expect(mockConsole.log).toHaveBeenCalledWith('');
    });

    it('should handle no parameters', () => {
      logger.log();
      expect(mockConsole.log).toHaveBeenCalledWith(undefined);
    });

    it('should handle only options parameter', () => {
      logger.log({ force: true });
      expect(mockConsole.log).toHaveBeenCalledWith({ force: true });
    });
  });

  describe('all log levels with force option', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should force log level', () => {
      logger.log('Forced log', { force: true });
      expect(mockConsole.log).toHaveBeenCalledWith('Forced log');
    });

    it('should force info level', () => {
      logger.info('Forced info', { force: true });
      expect(mockConsole.info).toHaveBeenCalledWith('Forced info');
    });

    it('should force warn level', () => {
      logger.warn('Forced warn', { force: true });
      expect(mockConsole.warn).toHaveBeenCalledWith('Forced warn');
    });

    it('should force error level', () => {
      logger.error('Forced error', { force: true });
      expect(mockConsole.error).toHaveBeenCalledWith('Forced error');
    });
  });
});

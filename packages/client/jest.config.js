/** @type {import('ts-jest').JestConfigWithTsJest} */
const includeE2E = process.env.E2E_TESTS === 'true';

module.exports = {
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/__tests__/unit/**/*.test.[tj]s?(x)', '<rootDir>/__tests__/unit/**/*.spec.[tj]s?(x)'],
      testPathIgnorePatterns: ['/dist/'],
      modulePathIgnorePatterns: ['<rootDir>/dist/'],
      watchPathIgnorePatterns: ['/dist/'],
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/__tests__/integration/**/*.test.[tj]s?(x)', '<rootDir>/__tests__/integration/**/*.spec.[tj]s?(x)'],
      testPathIgnorePatterns: ['/dist/'],
      modulePathIgnorePatterns: ['<rootDir>/dist/'],
      watchPathIgnorePatterns: ['/dist/'],
    },
    ...(
      includeE2E
        ? [
            {
              displayName: 'e2e',
              preset: 'ts-jest',
              testEnvironment: 'node',
              testMatch: ['<rootDir>/__tests__/e2e/**/*.test.[tj]s?(x)', '<rootDir>/__tests__/e2e/**/*.spec.[tj]s?(x)'],
              testPathIgnorePatterns: ['/dist/'],
              modulePathIgnorePatterns: ['<rootDir>/dist/'],
              watchPathIgnorePatterns: ['/dist/'],
              // E2E specific configurations
              testTimeout: 600000, // 10 minutes default timeout
              maxWorkers: 1, // Run e2e tests sequentially to avoid conflicts
              forceExit: true, // Force exit to prevent hanging
              detectOpenHandles: true, // Help identify resource leaks
              setupFilesAfterEnv: ['<rootDir>/__tests__/setup/e2e-setup.ts'],
            },
          ]
        : []
    ),
  ],
};

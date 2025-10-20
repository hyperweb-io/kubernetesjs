/** @type {import('ts-jest').JestConfigWithTsJest} */
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
    {
      displayName: 'e2e',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/__tests__/e2e/**/*.test.[tj]s?(x)', '<rootDir>/__tests__/e2e/**/*.spec.[tj]s?(x)'],
      testPathIgnorePatterns: ['/dist/'],
      modulePathIgnorePatterns: ['<rootDir>/dist/'],
      watchPathIgnorePatterns: ['/dist/'],
    },
  ],
};

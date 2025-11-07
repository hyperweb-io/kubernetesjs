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
  ],
};

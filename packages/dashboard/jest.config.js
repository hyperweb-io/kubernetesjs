const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

// 扩展 esModules，包含 MSW 相关（until-async 是其子依赖）
const esModules = ['until-async', 'msw', '@mswjs', 'remark-gfm', 'mdast-util-gfm', 'micromark-extension-gfm', 'micromark-extension-gfm-strikethrough', 'micromark-extension-gfm-table', 'micromark-extension-gfm-task-list-item', 'micromark-extension-gfm-autolink-literal', 'micromark-extension-gfm-footnote', 'micromark-extension-gfm-tagfilter', 'micromark-extension-gfm-autolink-literal', 'micromark-extension-gfm-footnote', 'micromark-extension-gfm-tagfilter', 'react-syntax-highlighter', 'ccount', 'mdast-util-gfm-autolink-literal', 'mdast-util-gfm-footnote', 'mdast-util-gfm-strikethrough', 'mdast-util-gfm-table', 'mdast-util-gfm-task-list-item', 'mdast-util-gfm-tagfilter', 'micromark-extension-gfm-autolink-literal', 'micromark-extension-gfm-footnote', 'micromark-extension-gfm-strikethrough', 'micromark-extension-gfm-table', 'micromark-extension-gfm-task-list-item', 'micromark-extension-gfm-tagfilter', '.*\\.mjs$'].join('|');

const tsconfig = require('./tsconfig.json');

const customJestConfig = {
  rootDir: './',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.polyfills.js', '<rootDir>/__tests__/lib/setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['<rootDir>/node_modules','<rootDir>/../'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'contexts/**/*.{js,jsx,ts,tsx}',
    '!k8s/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!app/api/**/*.{js,jsx,ts,tsx}',
    '!components/ui/**/*.{js,jsx,ts,tsx}',
    '!components/agent-manager-agentic.tsx',
    '!components/agent-manager-global.tsx'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // 简化：用 babel.config.js 的 presets
  },

  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/contexts/(.*)$': '<rootDir>/contexts/$1',
    '^@/k8s$': '<rootDir>/k8s/index.ts',
    '^@/k8s/(.*)$': '<rootDir>/k8s/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^next/server$': '<rootDir>/__mocks__/next/server.ts',
  },

  // 优化正则：针对 pnpm + MSW，排除 .pnpm 和特定模块
  transformIgnorePatterns: [
    `node_modules/(?!(\\.pnpm|${esModules}))`,  // 加括号确保分组；不忽略 .pnpm/until-async 等和 @interweb 包
  ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/dist/','<rootDir>/__tests__/utils', '<rootDir>/__tests__/lib/setup.ts'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'default'],  // 增强 ESM 加载
  }
};

// 用 async 强制覆盖 next/jest 的默认 patterns（常见修复）
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();
  // 强制设置 transformIgnorePatterns，避免 next/jest 合并问题
  config.transformIgnorePatterns = [
    `node_modules/(?!(\\.pnpm|${esModules}))`,
  ];
  return config;
};
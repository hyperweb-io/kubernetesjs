// Mock cross-fetch for agent tests
const mockFetch = jest.fn();
jest.mock('cross-fetch', () => ({
  __esModule: true,
  default: mockFetch,
}));

// Make mockFetch available globally
(global as any).mockFetch = mockFetch;

// Mock uuid for bradie tests
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-123'),
}));

// Mock fs for markdown tests
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
}));

// Mock path for markdown tests
jest.mock('path', () => ({
  join: jest.fn((...args) => {
    // Filter out empty strings and join with '/', avoiding double slashes
    const filtered = args.filter(arg => arg !== '' && arg !== undefined);
    const joined = filtered.join('/');
    // Replace multiple consecutive slashes with single slash
    return joined.replace(/\/+/g, '/');
  }),
}));

// Mock remark for markdown tests
jest.mock('remark', () => ({
  remark: jest.fn(() => ({
    parse: jest.fn(() => ({
      type: 'root',
      children: []
    }))
  }))
}));

// Mock unist-util-visit for markdown tests
jest.mock('unist-util-visit', () => ({
  visit: jest.fn()
}));

// Mock gray-matter for markdown tests
jest.mock('gray-matter', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: {},
    content: ''
  }))
}));

// Mock dayjs for format tests
jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs');
  const mockDayjs = (date?: any) => {
    if (date) {
      return originalDayjs(date);
    }
    return originalDayjs('2024-01-15T12:00:00Z'); // Mock current date
  };
  mockDayjs.year = () => 2024;
  return mockDayjs;
});

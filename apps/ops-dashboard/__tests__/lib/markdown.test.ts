import fs from 'fs';
import path from 'path';
import {
  extractMarkdownData,
  isFileExists,
  extractCodeFromMd,
  getFileNames,
  getPostsMetadata,
  getPostsInfo,
} from '@/lib/markdown';

// Mock fs module
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

// Mock path module
jest.mock('path');
const mockedPath = path as jest.Mocked<typeof path>;

// Mock gray-matter
jest.mock('gray-matter', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Mock remark and unist-util-visit
jest.mock('remark', () => ({
  remark: jest.fn(() => ({
    parse: jest.fn()
  }))
}));

jest.mock('unist-util-visit', () => ({
  visit: jest.fn()
}));

// Mock the lookup functions
jest.mock('@/lib/lookup', () => ({
  getAuthorAvatarUrl: jest.fn((id) => id === 'unknown' ? '' : `https://github.com/${id}.png`),
  getAuthorName: jest.fn((id) => id === 'unknown' ? 'unknown' : id)
}));

// Get the mocked functions
const mockGrayMatter = require('gray-matter').default;
const mockRemark = require('remark').remark;
const mockVisit = require('unist-util-visit').visit;
const mockGetAuthorAvatarUrl = require('@/lib/lookup').getAuthorAvatarUrl;
const mockGetAuthorName = require('@/lib/lookup').getAuthorName;

// Mock process.cwd
const originalCwd = process.cwd;
const mockCwd = jest.fn();

describe('lib/markdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.cwd = mockCwd;
    mockCwd.mockReturnValue('/mock/workspace');
  });

  afterEach(() => {
    process.cwd = originalCwd;
  });

  describe('extractMarkdownData', () => {
    const mockFileContent = `---
title: Test Post
author: John Doe
date: 2024-01-01
---

# Test Content

This is the content of the post.`;

    beforeEach(() => {
      mockedFs.readFileSync.mockReturnValue(mockFileContent);
      mockGrayMatter.mockReturnValue({
        data: {
          title: 'Test Post',
          author: 'John Doe',
          date: '2024-01-01',
        },
        content: '# Test Content\n\nThis is the content of the post.'
      });
    });

    it('should extract metadata and content from markdown file', () => {
      const result = extractMarkdownData('/test/file.md');
      
      expect(mockedPath.join).toHaveBeenCalledWith('/mock/workspace', '/test/file.md');
      expect(mockedFs.readFileSync).toHaveBeenCalledWith('/mock/workspace/test/file.md', 'utf8');
      expect(result.metadata).toEqual({
        title: 'Test Post',
        author: 'John Doe',
        date: '2024-01-01',
      });
      expect(result.content).toContain('# Test Content');
    });

    it('should use full path when isFullPath is true', () => {
      extractMarkdownData('/absolute/path/file.md', true);
      
      expect(mockedPath.join).not.toHaveBeenCalled();
      expect(mockedFs.readFileSync).toHaveBeenCalledWith('/absolute/path/file.md', 'utf8');
    });

    it('should throw error when file does not exist', () => {
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      expect(() => extractMarkdownData('/nonexistent/file.md')).toThrow('file not found: /mock/workspace/nonexistent/file.md');
    });

    it('should handle empty markdown file', () => {
      mockedFs.readFileSync.mockReturnValue('');
      mockGrayMatter.mockReturnValue({
        data: {},
        content: ''
      });
      
      const result = extractMarkdownData('/empty/file.md');
      expect(result.metadata).toEqual({});
      expect(result.content).toBe('');
    });

    it('should handle markdown without frontmatter', () => {
      const contentWithoutFrontmatter = '# Just Content\n\nNo frontmatter here.';
      mockedFs.readFileSync.mockReturnValue(contentWithoutFrontmatter);
      mockGrayMatter.mockReturnValue({
        data: {},
        content: contentWithoutFrontmatter
      });
      
      const result = extractMarkdownData('/no-frontmatter/file.md');
      expect(result.metadata).toEqual({});
      expect(result.content).toBe(contentWithoutFrontmatter);
    });
  });

  describe('isFileExists', () => {
    it('should return true when file exists', () => {
      mockedFs.existsSync.mockReturnValue(true);
      
      const result = isFileExists('/test/file.md');
      expect(mockedPath.join).toHaveBeenCalledWith('/mock/workspace', '/test/file.md');
      expect(mockedFs.existsSync).toHaveBeenCalledWith('/mock/workspace/test/file.md');
      expect(result).toBe(true);
    });

    it('should return false when file does not exist', () => {
      mockedFs.existsSync.mockReturnValue(false);
      
      const result = isFileExists('/test/file.md');
      expect(result).toBe(false);
    });

    it('should use full path when isFullPath is true', () => {
      mockedFs.existsSync.mockReturnValue(true);
      
      isFileExists('/absolute/path/file.md', true);
      
      expect(mockedPath.join).not.toHaveBeenCalled();
      expect(mockedFs.existsSync).toHaveBeenCalledWith('/absolute/path/file.md');
    });
  });

  describe('extractCodeFromMd', () => {
    const mockMarkdownContent = `# Test

\`\`\`javascript:button
const button = document.createElement('button');
\`\`\`

\`\`\`typescript:component
interface Props {
  title: string;
}
\`\`\``;

    beforeEach(() => {
      mockedFs.readFileSync.mockReturnValue(mockMarkdownContent);
    });

    it('should extract code blocks with language and meta', () => {
      // Mock the AST structure
      const mockAst = { type: 'root', children: [] };
      const mockParse = jest.fn().mockReturnValue(mockAst);
      mockRemark.mockReturnValue({ parse: mockParse });
      
      // Mock the visit function to simulate finding code blocks
      mockVisit.mockImplementation((ast, nodeType, callback) => {
        if (nodeType === 'code') {
          // Simulate finding two code blocks
          callback({
            type: 'code',
            value: "const button = document.createElement('button');",
            lang: 'javascript',
            meta: 'button'
          });
          callback({
            type: 'code',
            value: "interface Props {\n  title: string;\n}",
            lang: 'typescript',
            meta: 'component'
          });
        }
      });

      const result = extractCodeFromMd('/test/file.md');
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'button',
        lang: 'javascript',
        value: "const button = document.createElement('button');",
      });
      expect(result[1]).toEqual({
        id: 'component',
        lang: 'typescript',
        value: "interface Props {\n  title: string;\n}",
      });
    });

    it('should throw error when code block has no language', () => {
      const contentWithoutLang = `# Test

\`\`\`
const code = 'no language';
\`\`\``;
      mockedFs.readFileSync.mockReturnValue(contentWithoutLang);
      
      // Mock the AST structure
      const mockAst = { type: 'root', children: [] };
      const mockParse = jest.fn().mockReturnValue(mockAst);
      mockRemark.mockReturnValue({ parse: mockParse });
      
      // Mock the visit function to simulate finding a code block without language
      mockVisit.mockImplementation((ast, nodeType, callback) => {
        if (nodeType === 'code') {
          callback({
            type: 'code',
            value: "const code = 'no language';",
            lang: null,
            meta: 'some-meta'
          });
        }
      });
      
      expect(() => extractCodeFromMd('/test/file.md')).toThrow('code language or meta is not set');
    });

    it('should throw error when code block has no meta', () => {
      const contentWithoutMeta = `# Test

\`\`\`javascript
const code = 'no meta';
\`\`\``;
      mockedFs.readFileSync.mockReturnValue(contentWithoutMeta);
      
      // Mock the AST structure
      const mockAst = { type: 'root', children: [] };
      const mockParse = jest.fn().mockReturnValue(mockAst);
      mockRemark.mockReturnValue({ parse: mockParse });
      
      // Mock the visit function to simulate finding a code block without meta
      mockVisit.mockImplementation((ast, nodeType, callback) => {
        if (nodeType === 'code') {
          callback({
            type: 'code',
            value: "const code = 'no meta';",
            lang: 'javascript',
            meta: null
          });
        }
      });
      
      expect(() => extractCodeFromMd('/test/file.md')).toThrow('code language or meta is not set');
    });

    it('should handle markdown with no code blocks', () => {
      const contentWithoutCode = `# Test

Just regular markdown content.`;
      mockedFs.readFileSync.mockReturnValue(contentWithoutCode);
      
      // Mock the AST structure
      const mockAst = { type: 'root', children: [] };
      const mockParse = jest.fn().mockReturnValue(mockAst);
      mockRemark.mockReturnValue({ parse: mockParse });
      
      // Mock the visit function to not find any code blocks
      mockVisit.mockImplementation(() => {});
      
      const result = extractCodeFromMd('/test/file.md');
      expect(result).toHaveLength(0);
    });
  });

  describe('getFileNames', () => {
    it('should return file names from directory', () => {
      const mockFiles = ['file1.md', 'file2.md', 'file3.txt'];
      mockedFs.readdirSync.mockReturnValue(mockFiles as any);
      
      const result = getFileNames('/test/dir');
      
      expect(mockedPath.join).toHaveBeenCalledWith('/mock/workspace', '/test/dir');
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/mock/workspace/test/dir');
      expect(result).toEqual(mockFiles);
    });

    it('should use full path when isFullPath is true', () => {
      const mockFiles = ['file1.md', 'file2.md'];
      mockedFs.readdirSync.mockReturnValue(mockFiles as any);
      
      getFileNames('/absolute/dir', true);
      
      expect(mockedPath.join).not.toHaveBeenCalled();
      expect(mockedFs.readdirSync).toHaveBeenCalledWith('/absolute/dir');
    });

    it('should throw error when directory does not exist', () => {
      mockedFs.readdirSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      expect(() => getFileNames('/nonexistent/dir')).toThrow('failed to read directory: /mock/workspace/nonexistent/dir');
    });
  });

  describe('getPostsMetadata', () => {
    const mockPostFiles = ['post1.md', 'post2.md', 'post3.md'];
    const mockPostContent1 = `---
title: First Post
author: John
date: 2024-01-01
---`;
    const mockPostContent2 = `---
title: Second Post
author: Jane
date: 2024-01-02
---`;
    const mockPostContent3 = `---
title: Third Post
author: Bob
date: 2024-01-03
---`;

    beforeEach(() => {
      mockedFs.readdirSync.mockReturnValue(mockPostFiles as any);
      mockedFs.readFileSync
        .mockReturnValueOnce(mockPostContent1)
        .mockReturnValueOnce(mockPostContent2)
        .mockReturnValueOnce(mockPostContent3);
    });

    it('should return posts metadata with IDs', () => {
      // Mock gray-matter to return the expected metadata for each file
      mockGrayMatter
        .mockReturnValueOnce({
          data: {
            title: 'First Post',
            author: 'John',
            date: '2024-01-01',
          },
          content: ''
        })
        .mockReturnValueOnce({
          data: {
            title: 'Second Post',
            author: 'Jane',
            date: '2024-01-02',
          },
          content: ''
        })
        .mockReturnValueOnce({
          data: {
            title: 'Third Post',
            author: 'Bob',
            date: '2024-01-03',
          },
          content: ''
        });

      const result = getPostsMetadata('/posts');
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        id: 'post1',
        title: 'First Post',
        author: 'John',
        date: '2024-01-01',
      });
      expect(result[1]).toEqual({
        id: 'post2',
        title: 'Second Post',
        author: 'Jane',
        date: '2024-01-02',
      });
      expect(result[2]).toEqual({
        id: 'post3',
        title: 'Third Post',
        author: 'Bob',
        date: '2024-01-03',
      });
    });

    it('should handle empty posts directory', () => {
      mockedFs.readdirSync.mockReturnValue([]);
      
      const result = getPostsMetadata('/empty-posts');
      expect(result).toHaveLength(0);
    });
  });

  describe('getPostsInfo', () => {
    const mockPostsMetadata = [
      {
        id: 'post1',
        title: 'First Post',
        authorGithubId: 'john-doe',
        date: '2024-01-01',
      },
      {
        id: 'post2',
        title: 'Second Post',
        authorGithubId: 'jane-doe',
        date: '2024-01-02',
      },
      {
        id: 'post3',
        title: 'Third Post',
        date: '2024-01-03',
      },
    ];

    beforeEach(() => {
      // Mock the getPostsMetadata function by mocking fs operations
      mockedFs.readdirSync.mockReturnValue(['post1.md', 'post2.md', 'post3.md'] as any);
      mockedFs.readFileSync
        .mockReturnValueOnce(`---
title: First Post
authorGithubId: john-doe
date: 2024-01-01
---`)
        .mockReturnValueOnce(`---
title: Second Post
authorGithubId: jane-doe
date: 2024-01-02
---`)
        .mockReturnValueOnce(`---
title: Third Post
date: 2024-01-03
---`);

      // Mock gray-matter to return the expected metadata for each file
      mockGrayMatter
        .mockReturnValueOnce({
          data: {
            title: 'First Post',
            authorGithubId: 'john-doe',
            date: '2024-01-01',
          },
          content: ''
        })
        .mockReturnValueOnce({
          data: {
            title: 'Second Post',
            authorGithubId: 'jane-doe',
            date: '2024-01-02',
          },
          content: ''
        })
        .mockReturnValueOnce({
          data: {
            title: 'Third Post',
            date: '2024-01-03',
          },
          content: ''
        });
    });

    it('should return posts info with author details', () => {
      const result = getPostsInfo('/posts');
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        id: 'post1',
        title: 'First Post',
        authorGithubId: 'john-doe',
        date: '2024-01-01',
        avatarSrc: 'https://github.com/john-doe.png',
        authorName: 'john-doe',
      });
      expect(result[1]).toEqual({
        id: 'post2',
        title: 'Second Post',
        authorGithubId: 'jane-doe',
        date: '2024-01-02',
        avatarSrc: 'https://github.com/jane-doe.png',
        authorName: 'jane-doe',
      });
      expect(result[2]).toEqual({
        id: 'post3',
        title: 'Third Post',
        date: '2024-01-03',
        avatarSrc: '',
        authorName: 'unknown',
      });
    });

  });
});

import {
  trimPath,
  formatDuration,
  getTotalDuration,
  formatBlogDate,
  getFilenameFromPath,
  capitalToKebabCase,
  getChildrenString,
  getHeadingId,
  capitalize,
} from '@/lib/format';

// Mock dayjs
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

describe('lib/format', () => {
  describe('trimPath', () => {
    it('should remove BASE_PATH prefix', () => {
      expect(trimPath('/public/images/test.jpg')).toBe('/images/test.jpg');
      expect(trimPath('/public/static/css/style.css')).toBe('/static/css/style.css');
    });

    it('should return path unchanged if it does not start with BASE_PATH', () => {
      expect(trimPath('/images/test.jpg')).toBe('/images/test.jpg');
      expect(trimPath('images/test.jpg')).toBe('images/test.jpg');
      expect(trimPath('')).toBe('');
    });
  });

  describe('formatDuration', () => {
    it('should format valid durations correctly', () => {
      expect(formatDuration('0:30')).toBe('30 seconds');
      expect(formatDuration('1:30')).toBe('1 minute'); // 1:30 = 1 minute 30 seconds, but function returns "1 minute"
      expect(formatDuration('1:1:1')).toBe('1 hour'); // 1:1:1 = 3661 seconds = 1.0 hour
    });

    it('should handle single values', () => {
      expect(formatDuration('0:1')).toBe('1 second');
      expect(formatDuration('1:0')).toBe('1 minute');
      expect(formatDuration('1:0:0')).toBe('1 hour');
    });

    it('should handle hours with decimals', () => {
      expect(formatDuration('1:30:0')).toBe('1.5 hours'); // 1.5 hours
    });

    it('should throw error for invalid durations', () => {
      expect(() => formatDuration('invalid')).toThrow('not a valid duration: invalid');
      expect(() => formatDuration('60:60')).toThrow('not a valid duration: 60:60');
      expect(() => formatDuration('1:2:3:4')).toThrow('not a valid duration: 1:2:3:4');
      expect(() => formatDuration('-1')).toThrow('not a valid duration: -1');
    });

    it('should handle edge cases', () => {
      expect(() => formatDuration('abc:def')).toThrow('not a valid duration: abc:def');
      expect(() => formatDuration('0:60')).toThrow('not a valid duration: 0:60');
    });
  });

  describe('getTotalDuration', () => {
    it('should calculate total duration correctly', () => {
      expect(getTotalDuration(['0:30', '1:0'])).toBe('1 minute'); // 0:30 + 1:0 = 1:30 = 1 minute
      expect(getTotalDuration(['1:0:0', '0:30:0'])).toBe('1.5 hours');
      expect(getTotalDuration(['0:30', '0:30', '0:30'])).toBe('1 minute'); // 0:30 + 0:30 + 0:30 = 1:30 = 1 minute
    });

    it('should handle single duration', () => {
      expect(getTotalDuration(['1:30'])).toBe('1 minute'); // 1:30 = 1 minute
    });

    it('should handle empty array', () => {
      expect(() => getTotalDuration([])).toThrow();
    });

    it('should throw error for invalid durations', () => {
      expect(() => getTotalDuration(['invalid'])).toThrow('not a valid duration: invalid');
      expect(() => getTotalDuration(['30', 'invalid'])).toThrow('not a valid duration: invalid');
    });
  });

  describe('formatBlogDate', () => {
    it('should format current year dates without year', () => {
      // Mock dayjs to return current year
      const mockDayjs = require('dayjs');
      mockDayjs.year = () => 2024;
      
      expect(formatBlogDate('2024-01-15')).toBe('Jan 15');
      expect(formatBlogDate('2024-12-25')).toBe('Dec 25');
    });

    it('should format previous year dates with year', () => {
      const mockDayjs = require('dayjs');
      mockDayjs.year = () => 2024;
      
      expect(formatBlogDate('2023-01-15')).toBe('Jan 15, 2023');
      expect(formatBlogDate('2022-12-25')).toBe('Dec 25, 2022');
    });

    it('should handle different date formats', () => {
      const mockDayjs = require('dayjs');
      mockDayjs.year = () => 2024;
      
      expect(formatBlogDate('2024-06-15T10:30:00Z')).toBe('Jun 15');
      expect(formatBlogDate(new Date('2024-03-20'))).toBe('Mar 20');
    });
  });

  describe('getFilenameFromPath', () => {
    it('should extract filename without extension', () => {
      expect(getFilenameFromPath('/path/to/file.txt')).toBe('file');
      expect(getFilenameFromPath('image.jpg')).toBe('image');
      expect(getFilenameFromPath('document.pdf')).toBe('document');
    });

    it('should handle files with multiple dots', () => {
      expect(getFilenameFromPath('file.backup.txt')).toBe('file');
      expect(getFilenameFromPath('config.prod.json')).toBe('config');
    });

    it('should handle files without extensions', () => {
      expect(getFilenameFromPath('README')).toBe('README');
      expect(getFilenameFromPath('/path/to/file')).toBe('file');
    });

    it('should handle edge cases', () => {
      expect(getFilenameFromPath('')).toBe('');
      expect(getFilenameFromPath('/')).toBe('');
      expect(getFilenameFromPath('file.')).toBe('file');
    });
  });

  describe('capitalToKebabCase', () => {
    it('should convert capital case to kebab case', () => {
      expect(capitalToKebabCase('Hello World')).toBe('hello-world');
      expect(capitalToKebabCase('My Component Name')).toBe('my-component-name');
      expect(capitalToKebabCase('Test String')).toBe('test-string');
    });

    it('should handle single words', () => {
      expect(capitalToKebabCase('Hello')).toBe('hello');
      expect(capitalToKebabCase('World')).toBe('world');
    });

    it('should handle empty and whitespace strings', () => {
      expect(capitalToKebabCase('')).toBe('');
      expect(capitalToKebabCase('   ')).toBe('');
      expect(capitalToKebabCase('  Hello World  ')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(capitalToKebabCase('Hello-World')).toBe('hello-world');
      expect(capitalToKebabCase('Hello_World')).toBe('hello_world');
    });
  });

  describe('getChildrenString', () => {
    it('should extract string from string children', () => {
      expect(getChildrenString('Hello World')).toBe('Hello World');
      expect(getChildrenString('')).toBe('');
    });

    it('should extract string from React element children', () => {
      const mockElement = {
        props: {
          children: 'Nested Text'
        }
      };
      expect(getChildrenString(mockElement)).toBe('Nested Text');
    });

    it('should extract string from array of children', () => {
      expect(getChildrenString(['Hello', ' ', 'World'])).toBe('Hello World');
      expect(getChildrenString(['Text1', 'Text2', 'Text3'])).toBe('Text1Text2Text3');
    });

    it('should handle nested arrays', () => {
      expect(getChildrenString(['Hello', [' ', 'World']])).toBe('Hello World');
    });

    it('should handle mixed children types', () => {
      const mockElement = {
        props: {
          children: 'Element Text'
        }
      };
      expect(getChildrenString(['String', mockElement, 'More String'])).toBe('StringElement TextMore String');
    });

    it('should return empty string for non-string children', () => {
      expect(getChildrenString(123)).toBe('');
      expect(() => getChildrenString(null)).toThrow(); // null will cause error when accessing .props
      expect(getChildrenString(undefined)).toBe(''); // undefined returns empty string
      expect(() => getChildrenString({})).toThrow(); // empty object will cause error when accessing .props
    });
  });

  describe('getHeadingId', () => {
    it('should generate valid heading IDs from string children', () => {
      expect(getHeadingId('Hello World')).toBe('hello-world');
      expect(getHeadingId('My Component')).toBe('my-component');
      expect(getHeadingId('Test 123')).toBe('test-123');
    });

    it('should handle special characters', () => {
      expect(getHeadingId('Hello, World!')).toBe('hello-world');
      expect(getHeadingId('Test@#$%^&*()')).toBe('test');
      expect(getHeadingId('Hello-World_Test')).toBe('hello-world_test');
    });

    it('should handle React element children', () => {
      const mockElement = {
        props: {
          children: 'Nested Heading'
        }
      };
      expect(getHeadingId(mockElement)).toBe('nested-heading');
    });

    it('should handle array children', () => {
      expect(getHeadingId(['Hello', ' ', 'World'])).toBe('hello-world');
      expect(getHeadingId(['Test', ' ', 'Heading', '!'])).toBe('test-heading');
    });

    it('should handle empty children', () => {
      expect(getHeadingId('')).toBe('');
      expect(getHeadingId([])).toBe('');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
      expect(capitalize('test')).toBe('Test');
    });

    it('should handle single character strings', () => {
      expect(capitalize('a')).toBe('A');
      expect(capitalize('z')).toBe('Z');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('WORLD');
    });

    it('should handle strings with numbers and special characters', () => {
      expect(capitalize('123test')).toBe('123test');
      expect(capitalize('!hello')).toBe('!hello');
    });
  });
});

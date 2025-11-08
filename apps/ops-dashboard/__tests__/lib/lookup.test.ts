import {
  getAuthorAvatarUrl,
  getAuthorName,
  getCourseByLessonId,
  getLessonById,
  getProductById,
} from '@/lib/lookup';

describe('lib/lookup', () => {
  describe('getAuthorAvatarUrl', () => {
    it('should return empty string for any input', () => {
      expect(getAuthorAvatarUrl('test-github-id')).toBe('');
      expect(getAuthorAvatarUrl('')).toBe('');
      expect(getAuthorAvatarUrl('user123')).toBe('');
    });

    it('should handle different github ID formats', () => {
      expect(getAuthorAvatarUrl('user-name')).toBe('');
      expect(getAuthorAvatarUrl('user_name')).toBe('');
      expect(getAuthorAvatarUrl('user123')).toBe('');
      expect(getAuthorAvatarUrl('user-name-123')).toBe('');
    });
  });

  describe('getAuthorName', () => {
    it('should return the github ID as the author name', () => {
      expect(getAuthorName('test-github-id')).toBe('test-github-id');
      expect(getAuthorName('user123')).toBe('user123');
      expect(getAuthorName('john-doe')).toBe('john-doe');
    });

    it('should handle empty string', () => {
      expect(getAuthorName('')).toBe('');
    });

    it('should handle special characters in github ID', () => {
      expect(getAuthorName('user-name_123')).toBe('user-name_123');
      expect(getAuthorName('user.name')).toBe('user.name');
    });
  });

  describe('getCourseByLessonId', () => {
    it('should return course object with lesson ID as id and title', () => {
      const result = getCourseByLessonId('lesson-123');
      expect(result).toEqual({
        id: 'lesson-123',
        title: 'lesson-123',
        lessons: [],
      });
    });

    it('should handle different lesson ID formats', () => {
      expect(getCourseByLessonId('intro-to-react')).toEqual({
        id: 'intro-to-react',
        title: 'intro-to-react',
        lessons: [],
      });

      expect(getCourseByLessonId('lesson_1')).toEqual({
        id: 'lesson_1',
        title: 'lesson_1',
        lessons: [],
      });
    });

    it('should handle empty string', () => {
      expect(getCourseByLessonId('')).toEqual({
        id: '',
        title: '',
        lessons: [],
      });
    });

    it('should return empty lessons array', () => {
      const result = getCourseByLessonId('any-lesson');
      expect(Array.isArray(result.lessons)).toBe(true);
      expect(result.lessons).toHaveLength(0);
    });
  });

  describe('getLessonById', () => {
    it('should return lesson object with lesson ID as id and title', () => {
      const result = getLessonById('lesson-123');
      expect(result).toEqual({
        id: 'lesson-123',
        title: 'lesson-123',
        content: '',
      });
    });

    it('should handle different lesson ID formats', () => {
      expect(getLessonById('advanced-react')).toEqual({
        id: 'advanced-react',
        title: 'advanced-react',
        content: '',
      });

      expect(getLessonById('lesson_2')).toEqual({
        id: 'lesson_2',
        title: 'lesson_2',
        content: '',
      });
    });

    it('should handle empty string', () => {
      expect(getLessonById('')).toEqual({
        id: '',
        title: '',
        content: '',
      });
    });

    it('should return empty content string', () => {
      const result = getLessonById('any-lesson');
      expect(result.content).toBe('');
    });
  });

  describe('getProductById', () => {
    it('should return product object with product ID as id and name', () => {
      const result = getProductById('product-123');
      expect(result).toEqual({
        id: 'product-123',
        name: 'product-123',
        description: '',
      });
    });

    it('should handle different product ID formats', () => {
      expect(getProductById('premium-plan')).toEqual({
        id: 'premium-plan',
        name: 'premium-plan',
        description: '',
      });

      expect(getProductById('product_1')).toEqual({
        id: 'product_1',
        name: 'product_1',
        description: '',
      });
    });

    it('should handle empty string', () => {
      expect(getProductById('')).toEqual({
        id: '',
        name: '',
        description: '',
      });
    });

    it('should return empty description string', () => {
      const result = getProductById('any-product');
      expect(result.description).toBe('');
    });
  });

  describe('integration tests', () => {
    it('should work together for a complete flow', () => {
      const lessonId = 'intro-lesson';
      const githubId = 'john-doe';
      
      const course = getCourseByLessonId(lessonId);
      const lesson = getLessonById(lessonId);
      const authorName = getAuthorName(githubId);
      const authorAvatar = getAuthorAvatarUrl(githubId);
      
      expect(course.id).toBe(lessonId);
      expect(lesson.id).toBe(lessonId);
      expect(authorName).toBe(githubId);
      expect(authorAvatar).toBe('');
    });

    it('should handle special characters consistently', () => {
      const specialId = 'test-id_with.special@chars';
      
      const course = getCourseByLessonId(specialId);
      const lesson = getLessonById(specialId);
      const product = getProductById(specialId);
      
      expect(course.id).toBe(specialId);
      expect(lesson.id).toBe(specialId);
      expect(product.id).toBe(specialId);
    });
  });
});

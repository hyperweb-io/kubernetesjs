import { ANALYTICS } from '@/lib/constants';

describe('lib/constants', () => {
  describe('ANALYTICS', () => {
    it('should have correct cookie name', () => {
      expect(ANALYTICS.COOKIE_NAME).toBe('cookie-consent');
    });

    it('should have correct GA ID', () => {
      expect(ANALYTICS.GA_ID).toBe('G-4YV7P4P1NG');
    });

    it('should have consistent values', () => {
      // Test that values don't change unexpectedly
      expect(ANALYTICS.COOKIE_NAME).toBe('cookie-consent');
      expect(ANALYTICS.GA_ID).toBe('G-4YV7P4P1NG');
    });

    it('should have all required properties', () => {
      expect(ANALYTICS).toHaveProperty('COOKIE_NAME');
      expect(ANALYTICS).toHaveProperty('GA_ID');
    });

    it('should have string values', () => {
      expect(typeof ANALYTICS.COOKIE_NAME).toBe('string');
      expect(typeof ANALYTICS.GA_ID).toBe('string');
    });

    it('should not be empty strings', () => {
      expect(ANALYTICS.COOKIE_NAME).not.toBe('');
      expect(ANALYTICS.GA_ID).not.toBe('');
    });
  });
});

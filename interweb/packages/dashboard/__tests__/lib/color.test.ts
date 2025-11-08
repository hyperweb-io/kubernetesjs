import { isLightColor, extractColorsFromString } from '@/lib/color';

describe('lib/color', () => {
  describe('isLightColor', () => {
    it('should return true for light colors', () => {
      expect(isLightColor('#FFFFFF')).toBe(true);
      expect(isLightColor('#FFFF00')).toBe(true); // Yellow
      expect(isLightColor('#00FF00')).toBe(true); // Green
      expect(isLightColor('#FF00FF')).toBe(false); // Magenta (brightness ~152)
      expect(isLightColor('#C0C0C0')).toBe(true); // Silver
      expect(isLightColor('#808080')).toBe(false); // Gray (exactly 128, but < 128)
    });

    it('should return false for dark colors', () => {
      expect(isLightColor('#000000')).toBe(false);
      expect(isLightColor('#0000FF')).toBe(false); // Blue
      expect(isLightColor('#FF0000')).toBe(false); // Red
      expect(isLightColor('#800000')).toBe(false); // Maroon
      expect(isLightColor('#008000')).toBe(false); // Dark green
      expect(isLightColor('#808080')).toBe(false); // Gray (exactly 128, but < 128)
    });

    it('should handle colors without hash prefix', () => {
      expect(isLightColor('FFFFFF')).toBe(true);
      expect(isLightColor('000000')).toBe(false);
      expect(isLightColor('FFFF00')).toBe(true);
    });

    it('should handle mixed case hex colors', () => {
      expect(isLightColor('#ffffff')).toBe(true);
      expect(isLightColor('#FfFfFf')).toBe(true);
      expect(isLightColor('#000000')).toBe(false);
      expect(isLightColor('#000000')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isLightColor('#808080')).toBe(false); // Exactly 128 brightness, but < 128
      expect(isLightColor('#7F7F7F')).toBe(false); // Just below 128
      expect(isLightColor('#808080')).toBe(false); // Exactly 128
    });

    it('should handle invalid hex colors gracefully', () => {
      // These should not throw errors, but behavior is undefined
      expect(() => isLightColor('#GGGGGG')).not.toThrow();
      expect(() => isLightColor('#12345')).not.toThrow();
      expect(() => isLightColor('')).not.toThrow();
    });
  });

  describe('extractColorsFromString', () => {
    it('should extract single hex color', () => {
      expect(extractColorsFromString('The color is #FF0000')).toBe('#FF0000');
      expect(extractColorsFromString('Background: #00FF00')).toBe('#00FF00');
      expect(extractColorsFromString('#0000FF is blue')).toBe('#0000FF');
    });

    it('should extract multiple hex colors', () => {
      expect(extractColorsFromString('Colors: #FF0000, #00FF00, #0000FF')).toBe('#FF0000, #00FF00, #0000FF');
      expect(extractColorsFromString('#FF0000 and #00FF00 and #0000FF')).toBe('#FF0000, #00FF00, #0000FF');
    });

    it('should handle mixed case hex colors', () => {
      expect(extractColorsFromString('Colors: #ff0000, #00FF00, #0000ff')).toBe('#ff0000, #00FF00, #0000ff');
    });

    it('should handle colors with different lengths', () => {
      expect(extractColorsFromString('Short: #ABC and long: #ABCDEF')).toBe('#ABCDEF');
    });

    it('should return empty string when no colors found', () => {
      expect(extractColorsFromString('No colors here')).toBe('');
      expect(extractColorsFromString('')).toBe('');
      expect(extractColorsFromString('123456')).toBe('');
    });

    it('should handle strings with partial hex patterns', () => {
      expect(extractColorsFromString('Almost #12345 but not quite')).toBe('');
      expect(extractColorsFromString('Too long #1234567')).toBe('#123456'); // 6 chars is valid
    });

    it('should handle special characters and spaces', () => {
      expect(extractColorsFromString('Color: #FF0000!')).toBe('#FF0000');
      expect(extractColorsFromString('Color: #FF0000; background: #00FF00')).toBe('#FF0000, #00FF00');
    });

    it('should handle newlines and tabs', () => {
      expect(extractColorsFromString('Color:\n#FF0000\tand #00FF00')).toBe('#FF0000, #00FF00');
    });

    it('should handle duplicate colors', () => {
      expect(extractColorsFromString('#FF0000 and #FF0000 again')).toBe('#FF0000, #FF0000');
    });

    it('should handle edge cases', () => {
      expect(extractColorsFromString('#')).toBe('');
      expect(extractColorsFromString('##FF0000')).toBe('#FF0000'); // Second # is valid
      expect(extractColorsFromString('#FF0000#00FF00')).toBe('#FF0000, #00FF00');
    });
  });
});

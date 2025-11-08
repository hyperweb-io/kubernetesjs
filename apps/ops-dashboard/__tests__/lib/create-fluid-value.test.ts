import { createFluidValue } from '@/lib/create-fluid-value';

describe('lib/create-fluid-value', () => {
  describe('createFluidValue', () => {
    it('should create basic fluid value with default screen sizes', () => {
      const result = createFluidValue(16, 24);
      expect(result).toContain('clamp(');
      expect(result).toContain('rem');
      expect(result).toContain('vw');
    });

    it('should create fluid value with custom screen sizes', () => {
      const result = createFluidValue(14, 20, 320, 1200);
      expect(result).toContain('clamp(');
      expect(result).toContain('rem');
      expect(result).toContain('vw');
    });

    it('should handle equal min and max sizes', () => {
      const result = createFluidValue(18, 18);
      expect(result).toContain('clamp(');
      expect(result).toContain('1.13rem'); // 18px / 16px ≈ 1.13rem (rounded)
    });

    it('should handle zero min size', () => {
      const result = createFluidValue(0, 20);
      expect(result).toContain('clamp(');
      expect(result).toContain('0rem');
    });

    it('should handle large size differences', () => {
      const result = createFluidValue(12, 48);
      expect(result).toContain('clamp(');
      expect(result).toContain('0.75rem'); // 12px / 16px
      expect(result).toContain('3rem'); // 48px / 16px
    });

    it('should handle decimal sizes', () => {
      const result = createFluidValue(14.5, 22.5);
      expect(result).toContain('clamp(');
      expect(result).toContain('0.91rem'); // 14.5px / 16px ≈ 0.91rem
      expect(result).toContain('1.41rem'); // 22.5px / 16px ≈ 1.41rem
    });

    it('should use correct default screen sizes', () => {
      const result = createFluidValue(16, 24);
      // The result should contain the calculated values for 360px to 1040px range
      expect(result).toMatch(/clamp\(1rem, .*vw \+ .*rem, 1\.5rem\)/);
    });

    it('should handle custom screen size ranges', () => {
      const result = createFluidValue(16, 24, 400, 800);
      expect(result).toContain('clamp(');
      expect(result).toContain('1rem'); // 16px / 16px
      expect(result).toContain('1.5rem'); // 24px / 16px
    });

    it('should handle reverse screen sizes (max < min)', () => {
      const result = createFluidValue(24, 16, 800, 400);
      expect(result).toContain('clamp(');
      expect(result).toContain('1.5rem'); // 24px / 16px
      expect(result).toContain('1rem'); // 16px / 16px
    });

    it('should handle very small screen sizes', () => {
      const result = createFluidValue(12, 16, 200, 400);
      expect(result).toContain('clamp(');
      expect(result).toContain('0.75rem'); // 12px / 16px
      expect(result).toContain('1rem'); // 16px / 16px
    });

    it('should handle very large screen sizes', () => {
      const result = createFluidValue(20, 40, 1200, 2400);
      expect(result).toContain('clamp(');
      expect(result).toContain('1.25rem'); // 20px / 16px
      expect(result).toContain('2.5rem'); // 40px / 16px
    });

    it('should produce valid CSS clamp syntax', () => {
      const result = createFluidValue(16, 24);
      // Should match pattern: clamp(min, preferred, max)
      expect(result).toMatch(/^clamp\([^,]+,\s*[^,]+,\s*[^)]+\)$/);
    });

    it('should include vw unit in preferred value', () => {
      const result = createFluidValue(16, 24);
      expect(result).toContain('vw');
    });

    it('should include rem units in min and max values', () => {
      const result = createFluidValue(16, 24);
      expect(result).toContain('rem');
    });

    it('should handle edge case where minScreenSize equals maxScreenSize', () => {
      const result = createFluidValue(16, 24, 600, 600);
      expect(result).toContain('clamp(');
      // When screen sizes are equal, the calculation might produce special values
    });

    it('should handle negative sizes', () => {
      const result = createFluidValue(-10, 20);
      expect(result).toContain('clamp(');
      expect(result).toContain('-0.62rem'); // -10px / 16px (rounded)
      expect(result).toContain('1.25rem'); // 20px / 16px
    });

    it('should handle very large sizes', () => {
      const result = createFluidValue(100, 200);
      expect(result).toContain('clamp(');
      expect(result).toContain('6.25rem'); // 100px / 16px
      expect(result).toContain('12.5rem'); // 200px / 16px
    });
  });

  describe('integration tests', () => {
    it('should work with typical typography scale', () => {
      const h1 = createFluidValue(32, 48);
      const h2 = createFluidValue(24, 36);
      const body = createFluidValue(16, 18);
      
      expect(h1).toContain('clamp(');
      expect(h2).toContain('clamp(');
      expect(body).toContain('clamp(');
      
      // All should have different values
      expect(h1).not.toBe(h2);
      expect(h2).not.toBe(body);
      expect(h1).not.toBe(body);
    });

    it('should work with spacing scale', () => {
      const small = createFluidValue(8, 12);
      const medium = createFluidValue(16, 24);
      const large = createFluidValue(32, 48);
      
      expect(small).toContain('clamp(');
      expect(medium).toContain('clamp(');
      expect(large).toContain('clamp(');
    });

    it('should produce consistent results for same inputs', () => {
      const result1 = createFluidValue(16, 24);
      const result2 = createFluidValue(16, 24);
      expect(result1).toBe(result2);
    });
  });
});

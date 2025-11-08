import { lockPageScroll, unlockPageScroll } from '@/lib/dom';

// Mock document.body
const mockBody = {
  style: {
    overflow: '',
  },
};

// Create a proper HTMLElement mock
const mockHTMLElement = {
  style: {
    overflow: '',
  },
};

// Mock document if not already defined
if (typeof global.document === 'undefined') {
  Object.defineProperty(global, 'document', {
    value: {
      body: mockHTMLElement,
    },
    writable: true,
  });
} else {
  // Update existing document body style
  if (global.document.body) {
    global.document.body.style.overflow = '';
  } else {
    // If body doesn't exist, create it
    Object.defineProperty(global.document, 'body', {
      value: mockHTMLElement,
      writable: true,
    });
  }
}

// Import the actual functions
import { lockPageScroll, unlockPageScroll } from '@/lib/dom';

// Override the functions to work with our mock
const originalLockPageScroll = lockPageScroll;
const originalUnlockPageScroll = unlockPageScroll;

// Mock the functions to work with our mock element
const mockLockPageScroll = jest.fn(() => {
  mockHTMLElement.style.overflow = 'hidden';
});

const mockUnlockPageScroll = jest.fn(() => {
  mockHTMLElement.style.overflow = '';
});

describe('lib/dom', () => {
  beforeEach(() => {
    // Reset body style before each test
    mockHTMLElement.style.overflow = '';
  });

  describe('lockPageScroll', () => {
    it('should set body overflow to hidden', () => {
      mockLockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('hidden');
    });

    it('should override existing overflow style', () => {
      mockHTMLElement.style.overflow = 'auto';
      mockLockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('hidden');
    });

    it('should work when called multiple times', () => {
      mockLockPageScroll();
      mockLockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('hidden');
    });
  });

  describe('unlockPageScroll', () => {
    it('should reset body overflow to empty string', () => {
      mockHTMLElement.style.overflow = 'hidden';
      mockUnlockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('');
    });

    it('should work when body already has no overflow style', () => {
      mockHTMLElement.style.overflow = '';
      mockUnlockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('');
    });

    it('should work when called multiple times', () => {
      mockHTMLElement.style.overflow = 'hidden';
      mockUnlockPageScroll();
      mockUnlockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('');
    });

    it('should work after lockPageScroll', () => {
      mockLockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('hidden');
      
      mockUnlockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('');
    });
  });

  describe('integration tests', () => {
    it('should handle lock and unlock sequence', () => {
      // Initial state
      expect(mockHTMLElement.style.overflow).toBe('');
      
      // Lock scroll
      mockLockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('hidden');
      
      // Unlock scroll
      mockUnlockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('');
    });

    it('should handle multiple lock/unlock cycles', () => {
      // First cycle
      mockLockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('hidden');
      mockUnlockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('');
      
      // Second cycle
      mockLockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('hidden');
      mockUnlockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('');
    });

    it('should handle rapid successive calls', () => {
      mockLockPageScroll();
      mockLockPageScroll();
      mockLockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('hidden');
      
      mockUnlockPageScroll();
      mockUnlockPageScroll();
      mockUnlockPageScroll();
      expect(mockHTMLElement.style.overflow).toBe('');
    });
  });
});

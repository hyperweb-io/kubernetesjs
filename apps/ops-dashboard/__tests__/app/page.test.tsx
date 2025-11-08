import React from 'react';

import { render } from '@/__tests__/utils/test-utils';
import HomePage from '@/app/page';

// Mock next/navigation
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to /d when mounted', () => {
    render(<HomePage />);
    
    // Verify that router.replace was called with '/d'
    expect(mockReplace).toHaveBeenCalledWith('/d');
  });
});


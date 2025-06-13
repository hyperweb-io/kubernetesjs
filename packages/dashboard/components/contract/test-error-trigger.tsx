'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface TestErrorTriggerProps {
  onlyInDev?: boolean;
}

// This is a test component to trigger an error in the error boundary for testing purposes
export function TestErrorTrigger({ onlyInDev = true }: TestErrorTriggerProps) {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  // Only show in development unless explicitly disabled
  if (onlyInDev && process.env.NODE_ENV !== 'development') {
    return null;
  }

  // This will trigger the error boundary
  if (shouldThrowError) {
    throw new Error('Test error triggered for error boundary testing');
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="destructive" size="sm" onClick={() => setShouldThrowError(true)} className="shadow-lg">
        🧪 Test Error Boundary
      </Button>
    </div>
  );
}

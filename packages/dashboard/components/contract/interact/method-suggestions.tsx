'use client';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface MethodSuggestionsProps {
  methods: string[];
  isLoading: boolean;
  error?: string | null;
  onMethodClick: (methodName: string) => void;
  selectedMethod?: string;
  className?: string;
}

export function MethodSuggestions({
  methods,
  isLoading,
  error,
  onMethodClick,
  selectedMethod,
  className,
}: MethodSuggestionsProps) {
  if (isLoading) {
    return (
      <div className={cn('mb-2', className)}>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !methods.length) {
    return null;
  }

  return (
    <div className={cn('mb-2 flex flex-wrap gap-1.5', className)}>
      {methods.map((method) => {
        const isSelected = selectedMethod === method;
        return (
          <button
            key={method}
            type="button"
            className={cn(
              `inline-flex h-6 items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-body-text
							transition-colors hover:border-brand-1/80 dark:border-foreground/30 dark:hover:border-brand-1/80`,
              isSelected && 'border-brand-1/80 text-brand-1 dark:border-brand-1/80 dark:text-brand-2'
            )}
            onClick={() => onMethodClick(method)}
          >
            {method}
          </button>
        );
      })}
    </div>
  );
}

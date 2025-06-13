'use client';

import { AlertCircle, ChevronRight, Terminal, XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface BuildError {
  message: string;
  line?: number;
  column?: number;
  severity: 'error' | 'warning';
}

export interface BuildErrors {
  name: string;
  errors: BuildError[];
}

interface ErrorsPanelProps {
  errors: BuildErrors[];
  className?: string;
}

function ErrorsSummary({ errors }: { errors: BuildErrors[] }) {
  const totalErrors = errors.reduce(
    (acc, file) => {
      file.errors.forEach((error) => {
        acc[error.severity]++;
        acc.total++;
      });
      return acc;
    },
    { error: 0, warning: 0, total: 0 }
  );

  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-4 py-2
        backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium">Problems</h2>
        <div className="flex items-center gap-3 text-xs">
          {totalErrors.error > 0 && (
            <div className="flex items-center gap-1.5">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="font-medium">{totalErrors.error}</span>
            </div>
          )}
          {totalErrors.warning > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-warning" />
              <span className="font-medium">{totalErrors.warning}</span>
            </div>
          )}
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        {totalErrors.total} {totalErrors.total === 1 ? 'problem' : 'problems'} found
      </div>
    </div>
  );
}

export function ContractEditorErrors({ errors = [], className }: ErrorsPanelProps) {
  if (!errors.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Terminal className="h-8 w-8" />
          <p className="text-sm">No problems found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('h-full', className)}>
      <ErrorsSummary errors={errors} />
      <ScrollArea className="h-[calc(100%-41px)]">
        <div className="space-y-1 p-2">
          <Accordion type="multiple" className="space-y-2">
            {errors.map((error) => (
              <AccordionItem key={error.name} value={error.name} className="rounded-md border bg-muted/40 px-2">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    <span className="text-sm font-medium">{error.name}</span>
                    <span
                      className="ml-2 rounded-full bg-destructive/95 px-2 py-0.5 text-xs font-medium
                        text-destructive-foreground"
                    >
                      {error.errors.length} {error.errors.length === 1 ? 'issue' : 'issues'}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pb-2 pl-6">
                    {error.errors.map((error, index) => (
                      <div key={index} className="flex items-start gap-2 rounded-sm bg-muted/60 p-2 text-sm">
                        {error.severity === 'error' ? (
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        ) : (
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                        )}
                        <div className="space-y-1">
                          <p className="font-medium leading-none">{error.message}</p>
                          {(error.line || error.column) && (
                            <p className="text-xs text-muted-foreground">
                              {error.line && `Line ${error.line}`}
                              {error.line && error.column && ', '}
                              {error.column && `Column ${error.column}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}

// export const exampleErrors: FileErrors[] = [
//   {
//     fileName: 'contract.ts',
//     errors: [
//       {
//         message: 'Cannot find name "ethereum"',
//         line: 12,
//         column: 5,
//         severity: 'error',
//       },
//       {
//         message: 'Type "string" is not assignable to type "number"',
//         line: 15,
//         column: 10,
//         severity: 'error',
//       },
//     ],
//   },
//   {
//     fileName: 'utils.ts',
//     errors: [
//       {
//         message: 'Property "balance" does not exist on type "Account"',
//         line: 23,
//         column: 15,
//         severity: 'warning',
//       },
//     ],
//   },
// ];

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { OverflowList } from '@/components/ui/overflow-list';

// TODO: Extract the outline variant into a separate component
const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva('inline-flex h-9 items-center rounded-lg text-muted-foreground', {
  variants: {
    variant: {
      default: 'bg-muted p-1',
      outline:
        'relative h-auto w-full bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border',
      underline: 'relative h-auto w-full bg-transparent p-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const tabsTriggerVariants = cva(
  `inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm
   font-medium ring-offset-background transition-all focus-visible:outline-none
   focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
   disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        default: 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
        outline: cn(
          'data-[state=active]:bg-background bg-muted/70 overflow-hidden rounded-b-none border-x border-t border-border py-2 min-w-[100px]',
          'data-[state=active]:z-10',
          'transition-shadow duration-200',
          'data-[state=active]:shadow-[inset_0_1px_0_0_hsl(var(--accent))]'
        ),
        underline: cn(
          'relative rounded-none border-b-2 border-transparent bg-transparent py-2',
          'data-[state=active]:border-primary data-[state=active]:text-foreground',
          'hover:text-foreground transition-colors duration-200'
        ),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant, ...props }, ref) => {
    const list = (
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          'inline-flex flex-none gap-1',
          (variant === 'outline' || variant === 'underline') && 'min-w-full',
          tabsListVariants({ variant, className })
        )}
        {...props}
      />
    );

    if (variant === 'outline' || variant === 'underline') {
      return (
        <OverflowList
          direction="horizontal"
          className={cn(
            'scroll-smooth',
            'scrollbar-track-transparent scrollbar-thumb-border/40 hover:scrollbar-thumb-border/60 scrollbar-neutral-thin'
          )}
          data-testid="tabs-scroller"
        >
          {list}
        </OverflowList>
      );
    }

    return list;
  }
);
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, variant, ...props }, ref) => (
    <TabsPrimitive.Trigger ref={ref} className={cn(tabsTriggerVariants({ variant, className }))} {...props} />
  )
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      `mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
			focus-visible:ring-offset-2`,
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

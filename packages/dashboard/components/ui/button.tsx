import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const Spinner = () => (
  <svg className="-ml-1 mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap shadow-sm rounded-md text-body-text text-fluid-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-brand-1 hover:bg-brand-5 active:bg-brand-6 text-primary-foreground focus-visible:ring-brand-3 shadow',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/80',
        warning:
          'bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 active:bg-warning/80 focus-visible:ring-warning/30',
        outline:
          'border border-input text-body-text bg-background shadow-sm hover:bg-input/40 active:bg-input/80 hover:text-accent-foreground focus:ring-brand-3',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost:
          'hover:bg-accent/30 active:bg-accent/40 text-accent hover:text-accent-foreground active:text-accent-foreground/80 shadow-none',
        link: 'text-primary underline-offset-4 hover:underline',
        text: 'text-body-text hover:bg-background font-inter shadow-none',
      },
      size: {
        default: 'h-9 rounded-md px-4 py-2 text-base',
        sm: 'h-8 rounded-md px-3.5 text-sm',
        lg: 'h-11 rounded-md px-4 text-base',
        icon: 'h-9 w-9',
        minimal: 'h-min w-min rounded-none px-0 py-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  showContentWhileLoading?: boolean;
  spinner?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      isLoading = false,
      showContentWhileLoading = false,
      spinner,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        data-variant={variant}
        data-size={size}
        disabled={isLoading || props.disabled}
        {...props}
      >
        <>
          {isLoading && (spinner || <Spinner />)}
          {(!isLoading || showContentWhileLoading) && children}
        </>
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

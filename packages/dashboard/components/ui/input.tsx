import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
	`flex w-full rounded-md border border-input focus:border-brand-1 focus-visible:border-brand-1 bg-transparent 
   shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm
   file:font-medium file:text-foreground placeholder:text-muted-foreground
   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
   disabled:cursor-not-allowed disabled:opacity-50`,
	{
		variants: {
			// NOTE: I'm using inputSize for the size prop instead of size
			// because size is an actual HTML attribute for the input element
			inputSize: {
				sm: 'h-9 px-2.5 py-1 text-base md:text-sm font-normal',
				md: 'h-10 px-2.5 py-2 text-base md:text-sm font-normal',
			},
		},
		defaultVariants: {
			inputSize: 'md',
		},
	},
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, inputSize = 'md', ...props }, ref) => {
	return <input type={type} className={cn(inputVariants({ inputSize, className }))} ref={ref} {...props} />;
});
Input.displayName = 'Input';

export { Input };

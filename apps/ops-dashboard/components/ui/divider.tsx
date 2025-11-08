import { cn } from '@/lib/utils';

export const Divider = ({ className }: { className?: string }) => {
  return <div className={cn('h-[1px] w-full bg-foreground/15', className)} />;
};
